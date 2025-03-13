"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { Abi } from "starknet";
import { abi } from "@/abis/abi";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { TagInput } from "@/components/TagInput";

interface Asset {
  title: string;
  description: string;
  assetType: string;
  mediaUrl: string;
  tags: string[];
  license: string;
  isLimited: boolean;
  totalSupply: number;
  collection: string;
  ipVersion: string;
}

const assetTypes = [
  { id: "1", name: "Digital Art" },
  { id: "2", name: "Music" },
  { id: "3", name: "Video" },
  { id: "4", name: "Document" },
  { id: "5", name: "3D Model" },
];

const licenses = [
  { id: "1", name: "All Rights Reserved" },
  { id: "2", name: "Creative Commons" },
  { id: "3", name: "MIT License" },
  { id: "4", name: "GNU General Public License" },
];

const collections = [
  { id: "1", name: "Digital Art Collection" },
  { id: "2", name: "Music NFTs" },
  { id: "3", name: "Video Content" },
];

export default function ArtRegistrationPage() {
  const [asset, setAsset] = useState<Asset>({
    title: "",
    description: "",
    assetType: "",
    mediaUrl: "",
    tags: [],
    license: "",
    isLimited: false,
    totalSupply: 1,
    collection: "",
    ipVersion: "",
  });
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCollection, setNewCollection] = useState("");
  const [isNewCollection, setIsNewCollection] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address } = useAccount();
  const { contract } = useContract({
    abi: abi as Abi,
    address:
      "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0",
  });

  const { send, error: transactionError } = useSendTransaction({
    calls:
      contract && address
        ? [contract.populate("mint_item", [address, ipfsHash])]
        : undefined,
  });

  const handleMintNFT = async () => {
    if (!ipfsHash) {
      toast({ title: "Error", description: "Upload image before minting." });
      return;
    }
    try {
      send();
      toast({
        title: "Success",
        description: "NFT Minting Transaction Sent.",
      });
    } catch (error) {
      console.log("mint error", transactionError);
      toast({ title: "Error", description: "Minting failed." });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);

    const submitData = new FormData();
    submitData.append("title", asset.title);
    submitData.append("description", asset.description);
    submitData.append("assetType", asset.assetType);
    submitData.append("mediaUrl", asset.mediaUrl);
    submitData.append("tags", asset.tags.join(","));
    submitData.append("license", asset.license);
    submitData.append("isLimited", asset.isLimited ? "1" : "0");
    submitData.append("totalSupply", asset.totalSupply.toString());
    submitData.append("collection", isNewCollection ? newCollection : asset.collection);
    submitData.append("ipVersion", asset.ipVersion);

    if (file) {
      submitData.append("uploadFile", file);
    }

    try {
      const response = await fetch("/api/forms-asset", {
        method: "POST",
        body: submitData,
      });
      if (!response.ok) {
        throw new Error("Failed to submit IP");
      }

      console.log("IP submitted successfully");

      const data = await response.json();
      const ipfs = data.uploadData.IpfsHash as string;
      setIpfsHash(ipfs);
      console.log("IPFS Hash:", ipfs);

      toast({
        title: "IP Protected",
        description:
          "Finalize your intellectual property registration by approving the asset creation on the Starknet blockchain. Visit Portfolio to manage your digital assets.",
        action: <ToastAction altText="OK">OK</ToastAction>,
      });
    } catch (err) {
      console.error("Submission Error:", err);
      setError("Failed submitting or minting IP. Please try again.");
      toast({
        title: "Error",
        description:
          "Registration failed. Please contact our support team at mediolanoapp@gmail.com",
        action: <ToastAction altText="OK">OK</ToastAction>,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "newCollection") {
      setNewCollection(value);
    } else {
      setAsset((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "collection" && value === "new") {
      setIsNewCollection(true);
      setAsset((prev) => ({ ...prev, collection: "" }));
    } else {
      setIsNewCollection(false);
      setAsset((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (ipfsHash) {
      handleMintNFT();
    }
  }, [ipfsHash]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Asset</h1>
      <Card>
        <CardHeader>
          <CardTitle>Asset Details</CardTitle>
          <CardDescription>
            Enter the details of your new Programmable IP NFT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={asset.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={asset.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assetType">Asset Type</Label>
              <Select
                value={asset.assetType}
                onValueChange={(value) => handleSelectChange("assetType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mediaUrl">Media URL</Label>
              <Input
                id="mediaUrl"
                name="mediaUrl"
                value={asset.mediaUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/asset.jpg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <TagInput
                tags={asset.tags}
                setTags={(newTags) =>
                  setAsset((prev) => ({ ...prev, tags: newTags }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">License</Label>
              <Select
                value={asset.license}
                onValueChange={(value) => handleSelectChange("license", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select license" />
                </SelectTrigger>
                <SelectContent>
                  {licenses.map((license) => (
                    <SelectItem key={license.id} value={license.id}>
                      {license.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection">Collection</Label>
              <Select
                value={asset.collection}
                onValueChange={(value) => handleSelectChange("collection", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select or create a collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">Create New Collection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isNewCollection && (
              <div className="space-y-2">
                <Label htmlFor="newCollection">New Collection Name</Label>
                <Input
                  id="newCollection"
                  name="newCollection"
                  value={newCollection}
                  onChange={handleInputChange}
                  placeholder="Enter new collection name"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="ipVersion">IP Version</Label>
              <Input
                id="ipVersion"
                name="ipVersion"
                value={asset.ipVersion}
                onChange={handleInputChange}
                placeholder="e.g., 1.0"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isLimited"
                checked={asset.isLimited}
                onCheckedChange={(checked) =>
                  setAsset((prev) => ({ ...prev, isLimited: checked }))
                }
              />
              <Label htmlFor="isLimited">Limited Edition</Label>
            </div>
            {asset.isLimited && (
              <div className="space-y-2">
                <Label htmlFor="totalSupply">Total Supply</Label>
                <Input
                  id="totalSupply"
                  name="totalSupply"
                  type="number"
                  min="1"
                  value={asset.totalSupply}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            <Button type="submit" disabled={isSubmitting || !address}>
              {isSubmitting ? "Creating Asset..." : "Create Asset"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Sign Transaction</DrawerTitle>
            <DrawerDescription>Please sign the transaction to register your new Programmable IP.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <p>Asset Details:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Title: {asset.title}</li>
              <li>Type: {assetTypes.find((t) => t.id === asset.assetType)?.name}</li>
              <li>License: {licenses.find((l) => l.id === asset.license)?.name}</li>
              <li>
                Collection: {isNewCollection ? newCollection : collections.find((c) => c.id === asset.collection)?.name}
              </li>
              <li>IP Version: {asset.ipVersion}</li>
              {asset.isLimited && <li>Total Supply: {asset.totalSupply}</li>}
            </ul>
            {txHash && <p>Transaction Hash: {txHash.slice(0, 6)}...{txHash.slice(-4)}</p>}
          </div>
          <DrawerFooter>
            <Button onClick={handleTransactionSign} disabled={!txHash}>
              Sign Transaction
            </Button>
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}