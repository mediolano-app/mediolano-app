"use client";

import type React from "react";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FolderPlus, AlertCircle } from "lucide-react";
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
} from "@/components/mediaUploader";
import { useIpfsUpload } from "@/hooks/useIpfs";
import { MIP_CONTRACT } from "@/services/constants";

export default function CreateCollectionPage() {
  const { uploadToIpfs, loading: upload_loading } = useIpfsUpload();
  const { createCollection, isCreating, error } = useCollection();
  const { toast } = useToast();
  const { address: walletAddress } = useAccount();
  const uploaderRef = useRef<CoverImageUploaderRef>(null);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    type: "art",
    visibility: "private",
    coverImage: undefined,
    enableVersioning: true,
    allowComments: false,
    requireApproval: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only proceed if wallet is connected
    if (!walletAddress) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        creator: walletAddress,
        createdAt: new Date().toISOString(),
        contractAddress: MIP_CONTRACT,
      };

      const file = uploaderRef.current?.getFile();

      if (!file) {
        toast({
          title: "Select a Valid file and try again",
          variant: "destructive",
        });
        return;
      }

      const result = await uploadToIpfs(file, submitData, "coverImage");
      console.log("Uploaded:", result);
      await createCollection({
        base_uri: result?.metadataUrl,
        name: formData?.name,
        symbol: formData?.name,
      });

      toast({
        title: "Collection Created!",
        description:
          "Your collection has been successfully created and uploaded to IPFS.",
      });

      // Reset form
      setFormData({
        name: "",
        symbol: "",
        description: "",
        type: "art",
        visibility: "private",
        coverImage: undefined,
        enableVersioning: true,
        allowComments: false,
        requireApproval: false,
      });
      uploaderRef.current?.clear();
    } catch (error) {
      console.error("Error creating collection:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create collection",
        variant: "destructive",
      });
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
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Link href="/create">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Create Options
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Collection</h1>
          <p className="text-muted-foreground">
            Create a new collection to organize your intellectual property
            assets
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
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
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
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="software">Software</SelectItem>
                          <SelectItem value="nft">NFT</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
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
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="shared">Shared</SelectItem>
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
                  <Button variant="outline" type="button">
                    Save as Draft
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating || !walletAddress || upload_loading}
                  >
                    {upload_loading || isCreating ? (
                      <>Creating Collection...</>
                    ) : !walletAddress ? (
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
                      <p className="font-medium">Allow Comments</p>
                      <p className="text-sm text-muted-foreground">
                        Enable commenting on collection assets
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
                  <CardTitle>Collection Templates</CardTitle>
                  <CardDescription>
                    Apply templates to standardize asset creation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="recommended">
                    <TabsList className="w-full">
                      <TabsTrigger value="recommended" className="flex-1">
                        Recommended
                      </TabsTrigger>
                      <TabsTrigger value="custom" className="flex-1">
                        Custom
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="recommended" className="space-y-2 mt-2">
                      <div className="p-2 border rounded-md flex items-center justify-between">
                        <div>
                          <p className="font-medium">Art Template</p>
                          <p className="text-xs text-muted-foreground">
                            For visual artwork
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Apply
                        </Button>
                      </div>
                      <div className="p-2 border rounded-md flex items-center justify-between">
                        <div>
                          <p className="font-medium">NFT Template</p>
                          <p className="text-xs text-muted-foreground">
                            For digital collectibles
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Apply
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="custom" className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        You haven&apos;t created any custom templates yet.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Create Template
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
