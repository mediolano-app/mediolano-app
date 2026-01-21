"use client";

import type React from "react";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, FolderPlus, Loader2, CheckCircle2, ExternalLink, Library } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
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
import { COLLECTION_CONTRACT_ADDRESS, EXPLORER_URL } from "@/services/constants";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { shortenAddress } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function CreateCollectionView({
  isModalMode,
}: {
  isModalMode?: boolean;
}) {
  const { uploadToIpfs, loading: upload_loading, uploadImageFromUrl } = useIpfsUpload();
  const uploaderRef = useRef<CoverImageUploaderRef>(null);
  const { createCollection, isCreating, error: hookError } = useCollection();
  const { toast } = useToast();
  const { address: walletAddress } = useAccount();

  // Form State
  const [formData, setFormData] = useState<CollectionFormData>({
    name: "",
    symbol: "MIP",
    description: "",
    type: "art",
    visibility: "public",
    coverImage: undefined,
    enableVersioning: true,
    allowComments: false,
    requireApproval: false,
  });

  // Drawer & Progress State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [creationStep, setCreationStep] = useState<"uploading" | "processing" | "success">("uploading");
  const [progress, setProgress] = useState(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

    // Reset states
    setError(null);
    setTxHash(null);
    setProgress(0);
    setCreationStep("uploading");
    setPreviewImage(null);

    // Start process
    setIsDrawerOpen(true);

    try {
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

      // Set preview image
      if (file) {
        setPreviewImage(URL.createObjectURL(file));
      } else if (imageUrl) {
        setPreviewImage(imageUrl);
      } else {
        setPreviewImage("/placeholder.svg");
      }

      // Step 1: Upload to IPFS
      setProgress(10);
      let result;

      if (file) {
        // Upload file to IPFS
        result = await uploadToIpfs(file, submitData, "coverImage");
      } else {
        // Use image URL (external URL or default placeholder)
        const currentImageUrl = uploaderRef.current?.getImageUrl() || "/placeholder.svg";
        console.log("Uploading image from URL to IPFS:", currentImageUrl);
        result = await uploadImageFromUrl(currentImageUrl, submitData, "coverImage");
      }

      setProgress(40);

      console.log("Upload result:", result);
      console.log("Metadata URL:", result?.metadataUrl);

      // Validate that we have a valid metadata URL
      if (!result || !result.metadataUrl) {
        throw new Error("Failed to upload metadata to IPFS. Please try again.");
      }

      // Step 2: Create collection on-chain
      setCreationStep("processing");
      setProgress(60);

      const hash = await createCollection({
        base_uri: result.metadataUrl,
        name: formData.name,
        symbol: formData.name,
      });

      setProgress(90);

      if (hash) {
        setTxHash(hash);
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
        enableVersioning: true,
        allowComments: false,
        requireApproval: false,
      });
      uploaderRef.current?.clear();

    } catch (err) {
      console.error("Error creating collection:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create collection";
      setError(errorMessage);

      // If we failed early/not in drawer flow effectively, showing toast too
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      // Keep drawer open if error occurred during process to show detailed error? 
      // Or close it? For now, let's keep it open with error state if we were already inside
      // But currently our drawer doesn't have an explicit error view, so let's close it 
      // or maybe add error handling in the UI if needed. 
      // For simplicity/standard UX, if it fails, we usually stay on the screen.
      setIsDrawerOpen(false);
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

  const handleClose = () => {
    // Only allow closing if not processing (or if completed/error)
    if (creationStep !== "processing") {
      setIsDrawerOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background/70 text-foreground pb-20">
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
              <Card>
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
                    onChange={(url, file) => console.log(url, file)}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  {/* Button disabled state is handled by the drawer flow basically, 
                      but we can disable it here too if drawer is open or creating */}
                  <Button
                    type="submit"
                    disabled={isDrawerOpen || isCreating || upload_loading || !walletAddress}
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

          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Collection Settings</CardTitle>
                  <CardDescription>
                    Configure additional settings for your collection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Versioning</p>
                      <p className="text-sm text-muted-foreground">
                        Track changes to assets in this collection
                      </p>
                    </div>
                    <Switch
                      checked={formData.enableVersioning}
                      onCheckedChange={(checked) =>
                        handleInputChange("enableVersioning", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Open Edition</p>
                      <p className="text-sm text-muted-foreground">
                        Enable collaborative minting
                      </p>
                    </div>
                    <Switch
                      checked={formData.allowComments}
                      onCheckedChange={(checked) =>
                        handleInputChange("allowComments", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Require Approval</p>
                      <p className="text-sm text-muted-foreground">
                        Require approval for new assets
                      </p>
                    </div>
                    <Switch
                      checked={formData.requireApproval}
                      onCheckedChange={(checked) =>
                        handleInputChange("requireApproval", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collection Guide</CardTitle>
                  <CardDescription>
                    Apply templates to standardize asset creation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="recommended">
                    <TabsList className="w-full">
                      <TabsTrigger value="recommended" className="flex-1">
                        Collections?
                      </TabsTrigger>
                      <TabsTrigger value="custom" className="flex-1">
                        Checklist
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="recommended" className="space-y-2 mt-2">
                      <div className="p-2 border rounded-md flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            What is a IP collection?
                          </p>
                          <p className="mt-4 text-sm text-muted-foreground">
                            A Programmable IP Collection (Non-Fungible Token
                            collection) is essentially a series of
                            blockchain-based assets, each with unique
                            identifying programmable code and metadata.
                          </p>
                          <p className="mt-4 text-sm text-muted-foreground mt-1">
                            Collections allow you to group related assets
                            together, making it easier to manage and interact
                            with them.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="custom" className="mt-2">
                      <div className="p-2 border rounded-md flex items-center justify-between">
                        <div>
                          <p className="font-medium mb-1">
                            Collections Checklist
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            Making the most of your collection page helps others
                            better understand your project.
                          </p>
                          <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                            <li>Choose a collection name</li>
                            <li>Fill in your collection details</li>
                            <li>Add image (upload file or provide URL)</li>
                            <li>Configure collection settings</li>
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Progress & Success Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={(open) => {
        // Only allow closing via onOpenChange if we are not in a critical processing state
        if (!open && (creationStep === "uploading" || creationStep === "success" || error)) {
          setIsDrawerOpen(open);
        }
      }}>
        <DrawerContent className="w-full max-w-lg mx-auto rounded-t-xl mobile-padding">
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-xl">
              {creationStep === "uploading" && "Uploading Assets"}
              {creationStep === "processing" && "Creating Collection"}
              {creationStep === "success" && "Collection Created"}
            </DrawerTitle>
            <DrawerDescription className="text-sm mt-1">
              {creationStep === "uploading" && "We are uploading your collection metadata to IPFS."}
              {creationStep === "processing" && "Please confirm the transaction in your wallet."}
              {creationStep === "success" && "Your collection has been successfully created onchain."}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 sm:p-6">
            {/* Uploading / Processing State */}
            {(creationStep === "uploading" || creationStep === "processing") && (
              <div className="flex flex-col items-center justify-center space-y-8 py-4">
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-4 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                  <div>
                    <p className="text-lg font-semibold">
                      {creationStep === "uploading" ? "Uploading to IPFS..." : "Waiting for Confirmation..."}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                      {creationStep === "uploading"
                        ? "Ensuring your metadata is decentralized and permanent."
                        : "Please sign the transaction in your wallet to finalize the creation."}
                    </p>
                  </div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <p>Please do not close this window</p>
                </div>
              </div>
            )}

            {/* Success State */}
            {creationStep === "success" && (
              <div className="flex flex-col items-center justify-center space-y-6 py-2">

                {/* Collection Preview */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative h-32 w-32 rounded-xl overflow-hidden border-2 border-background shadow-xl">
                    <Image
                      src={previewImage || "/placeholder.svg"}
                      alt="Collection Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-background">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-bold">{formData.name || "New Collection"}</h3>
                  <p className="text-sm text-muted-foreground">
                    Successfully deployed on Starknet
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    ERC721
                  </Badge>
                </div>

                <div className="w-full rounded-lg bg-muted/50 border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sm">Transaction Details</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">Confirmed</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tx Hash:</span>
                      <span className="font-mono bg-background px-2 py-0.5 rounded border">
                        {txHash ? shortenAddress(txHash) : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Network:</span>
                      <span>Starknet Mainnet</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DrawerFooter className="flex-col sm:flex-row gap-3 px-4 sm:px-6 pb-6">
            {creationStep === "success" ? (
              <>
                <Link href="/portfolio" className="w-full sm:w-1/2">
                  <Button className="w-full" onClick={() => setIsDrawerOpen(false)}>
                    <Library className="mr-2 h-4 w-4" />
                    View in Portfolio
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full sm:w-1/2"
                  onClick={() => {
                    if (txHash) {
                      window.open(`${EXPLORER_URL}/tx/${txHash}`, "_blank");
                    }
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Explorer
                </Button>
              </>
            ) : (
              // Option to cancel if stuck? Or just show nothing/disabled button
              <Button variant="ghost" className="w-full" onClick={handleClose} disabled={creationStep === "processing"}>
                Cancel
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
