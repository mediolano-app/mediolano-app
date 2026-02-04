"use client";

import type React from "react";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, FolderPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCollection, CollectionFormData } from "@/hooks/use-collection";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "@starknet-react/core";
import {
  CoverImageUploader,
  CoverImageUploaderRef,
} from "@/components/media-uploader";
import { useIpfsUpload } from "@/hooks/useIpfs";
import { COLLECTION_CONTRACT_ADDRESS } from "@/lib/constants";
import { MintSuccessDrawer, MintDrawerStep } from "@/components/mint-success-drawer";
import { useProvider } from "@starknet-react/core";
import { num, hash, Contract } from "starknet";
import { ipCollectionAbi } from "../../abis/ip_collection";
import { useNetwork } from "@/components/starknet-provider";

// Debugging ABI import


export default function CreateCollectionView({
  isModalMode,
}: {
  isModalMode?: boolean;
}) {
  const { uploadToIpfs, loading: upload_loading, uploadImageFromUrl } = useIpfsUpload();
  const uploaderRef = useRef<CoverImageUploaderRef>(null);
  const { createCollection, isCreating, error: hookError } = useCollection();
  const { toast } = useToast();
  const { address: walletAddress, chainId } = useAccount();
  const { provider } = useProvider();
  const { networkConfig } = useNetwork();

  // Form State
  const [formData, setFormData] = useState<CollectionFormData>({
    name: "",
    symbol: "MIP",
    description: "",
    type: "art",
    visibility: "public",
    coverImage: undefined,
  });

  // Drawer & Progress State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [creationStep, setCreationStep] = useState<MintDrawerStep>("idle");
  const [progress, setProgress] = useState(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [mintResult, setMintResult] = useState<any>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only proceed if wallet is connected
    if (!walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a collection.",
        variant: "destructive",
      });
      return;
    }

    // Check Network
    if (chainId && BigInt(chainId).toString() !== networkConfig.chainId) {
      toast({
        title: "Wrong Network",
        description: `Please switch to ${networkConfig.name} to create a collection.`,
        variant: "destructive",
      });
      return;
    }

    // Reset states
    setError(null);
    setTxHash(null);
    setProgress(0);
    setCreationStep("idle");
    setPreviewImage(null);

    const file = uploaderRef.current?.getFile();
    const imageUrl = uploaderRef.current?.getImageUrl();

    // Set preview image for the review step
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else if (imageUrl) {
      setPreviewImage(imageUrl);
    } else {
      setPreviewImage("/placeholder.svg");
    }

    // Start process - Open drawer in Review Mode
    setIsDrawerOpen(true);
  };

  const handleConfirmMint = async () => {
    try {
      setCreationStep("uploading");
      setProgress(0);

      const submitData = {
        ...formData,
        creator: walletAddress,
        createdAt: new Date().toISOString(),
        contractAddress: COLLECTION_CONTRACT_ADDRESS,
      };

      const file = uploaderRef.current?.getFile();
      const imageUrl = uploaderRef.current?.getImageUrl();

      // Ensure we have either a file or a valid image URL
      if (!file && !imageUrl) {
        throw new Error("Please provide an image for your collection");
      }

      // Step 1: Upload to IPFS
      setProgress(10);
      let result;

      if (file) {
        // Upload file to IPFS
        result = await uploadToIpfs(file, submitData, null);
      } else {
        // Use image URL (external URL or default placeholder)
        const currentImageUrl = uploaderRef.current?.getImageUrl() || "/placeholder.svg";

        result = await uploadImageFromUrl(currentImageUrl, submitData, "coverImage");
      }

      setProgress(40);

      // Validate that we have a valid metadata URL
      if (!result || !result.metadataUrl) {
        throw new Error("Failed to upload metadata to IPFS. Please try again.");
      }

      // Step 2: Create collection on-chain
      setCreationStep("processing");
      setProgress(60);

      const txHash = await createCollection({
        base_uri: result.metadataUrl,
        name: formData.name,
        symbol: formData.name, // Using name as symbol for simplicity or derive it
      });

      if (txHash) {
        setTxHash(txHash);

        // Wait for transaction to be accepted to get the event
        const receipt = await provider.waitForTransaction(txHash);

        // Default to listing page fallback
        let collectionId = "collections";

        // Attempt to parse events to find CollectionCreated
        // We look for events emitted from our contract
        // The event selector for CollectionCreated is:
        const collectionCreatedSelector = hash.getSelectorFromName("CollectionCreated");

        if (receipt.isSuccess() && 'events' in receipt) {
          const events = receipt.events;

          // Find the event emitted by our contract
          // We look for an event that has enough data to be CollectionCreated
          // Structure: [collection_id (2), owner (1), name (3+), symbol (3+), base_uri (3+)]
          // So expected data length is at least 10+ usually.
          // But safely, let's just find the event from our contract that looks like it.

          let creationEvent = events.find(
            (e: any) =>
              e.from_address?.toLowerCase() === COLLECTION_CONTRACT_ADDRESS.toLowerCase() &&
              e.keys[0] === collectionCreatedSelector
          );

          // Fallback: If selector mismatch (e.g. component event), grab the first event from our contract
          // that is NOT a Transfer event (Transfer has 2 keys usually or particular selector)
          if (!creationEvent) {
            creationEvent = events.find((e: any) =>
              e.from_address?.toLowerCase() === COLLECTION_CONTRACT_ADDRESS.toLowerCase() &&
              e.data.length >= 2 // At least enough for an ID
            );
          }

          if (creationEvent) {
            if (creationEvent.data && creationEvent.data.length > 0) {
              const low = creationEvent.data[0];
              collectionId = num.toBigInt(low).toString();
            }
          }
        }

        // Fallback: If event parsing failed (collectionId is still "collections"), fetch robustly from chain
        if (collectionId === "collections" && walletAddress) {
          try {
            // Use static imports
            if (!ipCollectionAbi) {
              throw new Error("Internal error: Contract ABI not loaded");
            }
            const contract = new Contract({ abi: ipCollectionAbi, address: COLLECTION_CONTRACT_ADDRESS });
            contract.connect(provider);

            // call list_user_collections
            const userCollections = await contract.list_user_collections(walletAddress);

            if (userCollections && userCollections.length > 0) {
              // It returns valid array of u256 (as objects or bigints depending on provider/version)
              // Starknet.js usually returns objects {low, high} or BigInts
              // We take the last one
              const lastId = userCollections[userCollections.length - 1];

              // Handle potential types
              if (typeof lastId === 'object' && 'low' in lastId) {
                collectionId = num.toBigInt(lastId.low).toString();
              } else {
                collectionId = num.toBigInt(lastId).toString();
              }
            }
          } catch (err) {
            // Fallback fetch failed
          }
        }

        // If we have a valid numeric ID, fetch the actual collection address to display
        let collectionAddressForLink = collectionId;

        if (collectionId !== "collections") {
          try {
            if (!ipCollectionAbi) {
              throw new Error("Contract ABI missing");
            }
            const contract = new Contract({ abi: ipCollectionAbi, address: COLLECTION_CONTRACT_ADDRESS });
            contract.connect(provider);

            // get_collection returns [Collection] struct
            const collectionData = await contract.get_collection(collectionId);

            // Extract ip_nft address
            if (collectionData && collectionData.ip_nft) {
              // ip_nft is a ContractAddress (felt)
              const addressBigInt = num.toBigInt(collectionData.ip_nft);
              collectionAddressForLink = "0x" + addressBigInt.toString(16);
            }
          } catch (err) {
            // Failed to fetch collection address
          }
        }

        // Construct result for drawer
        setMintResult({
          transactionHash: txHash,
          tokenId: collectionAddressForLink, // Display Address
          assetSlug: collectionAddressForLink, // Link to Address
        });
      }

      setProgress(100);
      setCreationStep("success");


      toast({
        title: "Collection Created!",
        description: "Your collection has been submitted to the blockchain.",
      });

      // Reset form (keep previewImage for display)
      setFormData({
        name: "",
        symbol: "MIP",
        description: "",
        type: "art",
        visibility: "public",
        coverImage: undefined,
      });
      uploaderRef.current?.clear();

    } catch (err) {
      console.error("Error creating collection:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create collection";
      setError(errorMessage);
      // Keep error step handling consistent
    }
  };

  const handleInputChange = (
    field: keyof CollectionFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen text-foreground pb-20">
      <main className="container mx-auto px-4 py-8">
        {!isModalMode && (
          <Link href="/create">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to create dashboard
            </Button>
          </Link>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Collection</h1>
          <p className="text-muted-foreground">
            Mint a new collection to organize your intellectual property assets onchain
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* HIDDEN INPUT for implicit submission if needed, but Button type=submit handles it */}

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Collection Details</CardTitle>
                  <CardDescription>
                    Enter the basic information about your collection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Show hook error if any, though we handle mostly in catch block */}
                  {(error || hookError) && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error || hookError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Collection Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter collection name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your collection"
                      className="min-h-[100px]"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Collection Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          handleInputChange("type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="art">Art</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                          <SelectItem value="photo">Photo</SelectItem>
                          <SelectItem value="nft">NFT</SelectItem>
                          <SelectItem value="software">Software</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="visibility">Visibility</Label>
                      <Select
                        value={formData.visibility}
                        onValueChange={(value) =>
                          handleInputChange("visibility", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <CoverImageUploader
                    ref={uploaderRef}
                    onChange={(url, file) => {
                      setCoverPreview(url || null);
                    }}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="submit"
                    disabled={isDrawerOpen || upload_loading || !walletAddress}
                  >
                    {!walletAddress ? (
                      <>
                        <FolderPlus className="mr-2 h-4 w-4" />
                        Connect Wallet to Create
                      </>
                    ) : (
                      <>
                        <FolderPlus className="mr-2 h-4 w-4" />
                        Create Collection
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>

          {/* Live Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-8">
              {/* Live Preview Card */}
              <Card className="glass-card overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Live Preview</CardTitle>
                  <CardDescription>
                    See how your collection will appear
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Preview Image */}
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="Collection preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <FolderPlus className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No cover image</p>
                        </div>
                      </div>
                    )}
                    {/* Type Badge */}
                    {formData.type && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full border border-border/50 capitalize">
                          {formData.type}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Preview Details */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg truncate">
                        {formData.name || "Untitled Collection"}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {formData.description || "No description provided"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 bg-muted rounded-full">
                        {formData.visibility === "public" ? "Public" : "Private"}
                      </span>
                      <span>•</span>
                      <span>0 assets</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Collection Guide */}
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Name your collection</p>
                      <p className="text-xs text-muted-foreground">Choose a memorable name</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Add a description</p>
                      <p className="text-xs text-muted-foreground">Tell others about your collection</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Upload cover image</p>
                      <p className="text-xs text-muted-foreground">Make your collection stand out</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Progress & Success Drawer */}
      <MintSuccessDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        step={creationStep}
        progress={progress}
        mintResult={mintResult} // Collection doesn't have exact same result shape but we adapt or partial
        assetTitle={formData.name || "New Collection"}
        assetDescription={formData.description}
        assetType="Collection"
        error={error}
        onConfirm={handleConfirmMint}
        cost="0.001 STRK" /* Estimate */
        previewImage={previewImage}
        basePath="/collections/"
        data={{
          Symbol: formData.symbol || "MIP",
          Type: formData.type,
          Visibility: formData.visibility,
        }}
      />
    </div>
  );
}
