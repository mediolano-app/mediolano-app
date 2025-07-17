"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, FolderPlus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Collection } from "@/types/asset"
import { useCollection, CollectionFormData } from "@/hooks/use-collection"
import { useToast } from "@/hooks/use-toast"
import { useAccount } from "@starknet-react/core"

export default function CreateCollectionPage() {
  const { createCollection, isCreating, error } = useCollection()
  const { toast } = useToast()
  const { address: walletAddress } = useAccount()
  const [coverImage, setCoverImage] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<CollectionFormData>({
    name: '',
    symbol: 'MIP',
    description: '',
    type: 'art',
    visibility: 'public',
    coverImage: undefined,
    enableVersioning: true,
    allowComments: false,
    requireApproval: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Only proceed if wallet is connected
    if (!walletAddress) {
      return
    }
    
    try {
      const submitData: CollectionFormData = {
        ...formData,
        coverImage: coverImage || undefined,
      }
      
      await createCollection(submitData)
      
      toast({
        title: "Collection Created!",
        description: "Your collection has been successfully created and uploaded to IPFS.",
      })
      
      // Reset form
      setFormData({
        name: '',
        symbol: 'MIP',
        description: '',
        type: 'art',
        visibility: 'public',
        coverImage: undefined,
        enableVersioning: true,
        allowComments: false,
        requireApproval: false,
      })
      setCoverImage(null)
      
    } catch (error) {
      console.error('Error creating collection:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create collection",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: keyof CollectionFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCoverImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen">      
      <main className="container mx-auto px-4 py-8">
        <Link href="/create">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to create dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Collection</h1>
          <p className="text-muted-foreground">Mint a new collection to organize your intellectual property assets onchain</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Collection Details</CardTitle>
                  <CardDescription>Enter the basic information about your collection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Collection Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter collection name" 
                      required 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe your collection" 
                      className="min-h-[100px]"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Collection Type</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value) => handleInputChange('type', value)}
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
                        onValueChange={(value) => handleInputChange('visibility', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover-image">Cover Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      {coverImage ? (
                        <div className="relative">
                          <img
                            src={coverImage || "/placeholder.svg"}
                            alt="Cover preview"
                            className="mx-auto max-h-[200px] rounded-lg object-cover"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setCoverImage(null)}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop an image, or click to browse
                          </p>
                          <Input
                            id="cover-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("cover-image")?.click()}
                          >
                            Select Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  
                  <Button 
                    type="submit"
                    disabled={isCreating || !walletAddress}
                  >
                    {isCreating ? (
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
                  <CardDescription>Configure additional settings for your collection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Versioning</p>
                      <p className="text-sm text-muted-foreground">Track changes to assets in this collection</p>
                    </div>
                    <Switch 
                      checked={formData.enableVersioning}
                      onCheckedChange={(checked) => handleInputChange('enableVersioning', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Open Edition</p>
                      <p className="text-sm text-muted-foreground">Enable collaborative minting</p>
                    </div>
                    <Switch 
                      checked={formData.allowComments}
                      onCheckedChange={(checked) => handleInputChange('allowComments', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Require Approval</p>
                      <p className="text-sm text-muted-foreground">Require approval for new assets</p>
                    </div>
                    <Switch 
                      checked={formData.requireApproval}
                      onCheckedChange={(checked) => handleInputChange('requireApproval', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collection Guide</CardTitle>
                  <CardDescription>Apply templates to standardize asset creation</CardDescription>
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
                          <p className="font-medium">What is a IP collection?</p>
                          <p className="mt-4 text-sm text-muted-foreground">A Programmable IP Collection (Non-Fungible Token collection) is essentially a series of blockchain-based assets, each with unique identifying programmable code and metadata.</p>
                          <p className="mt-4 text-sm text-muted-foreground mt-1">Collections allow you to group related assets together, making it easier to manage and interact with them.</p>

                        </div>
                       
                      </div>
   
                    </TabsContent>
                    <TabsContent value="custom" className="mt-2">
                      <div className="p-2 border rounded-md flex items-center justify-between">
                        <div>
                          <p className="font-medium mb-1">Collections Checklist</p>
                          <p className="text-xs text-muted-foreground mb-2">
                            Making the most of your collection page helps others better understand your project.
                          </p>
                          <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                            <li>Choose a collection name</li>
                            <li>Fill in your collection details</li>
                            <li>Add image / media</li>
                            <li>Link out to your links</li>
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
    </div>
  )
}
