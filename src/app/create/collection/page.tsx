"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CreateCollectionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect would happen here in a real app
      window.alert("Collection created successfully!")
    }, 1500)
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
            Back to Create Options
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Collection</h1>
          <p className="text-muted-foreground">Create a new collection to organize your intellectual property assets</p>
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
                  <div className="space-y-2">
                    <Label htmlFor="name">Collection Name</Label>
                    <Input id="name" placeholder="Enter collection name" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe your collection" className="min-h-[100px]" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Collection Type</Label>
                      <Select defaultValue="art">
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
                      <Select defaultValue="private">
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
                  <Button variant="outline" type="button">
                    Save as Draft
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Creating Collection...</>
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
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Allow Comments</p>
                      <p className="text-sm text-muted-foreground">Enable commenting on collection assets</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Require Approval</p>
                      <p className="text-sm text-muted-foreground">Require approval for new assets</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collection Templates</CardTitle>
                  <CardDescription>Apply templates to standardize asset creation</CardDescription>
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
                          <p className="text-xs text-muted-foreground">For visual artwork</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Apply
                        </Button>
                      </div>
                      <div className="p-2 border rounded-md flex items-center justify-between">
                        <div>
                          <p className="font-medium">NFT Template</p>
                          <p className="text-xs text-muted-foreground">For digital collectibles</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Apply
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="custom" className="mt-2">
                      <p className="text-sm text-muted-foreground">You haven't created any custom templates yet.</p>
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
  )
}
