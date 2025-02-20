"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { TagInput } from "@/components/TagInput"

// Mockup data
const assetTypes = [
  { id: "1", name: "Digital Art" },
  { id: "2", name: "Music" },
  { id: "3", name: "Video" },
  { id: "4", name: "Document" },
  { id: "5", name: "3D Model" },
]

const licenses = [
  { id: "1", name: "All Rights Reserved" },
  { id: "2", name: "Creative Commons" },
  { id: "3", name: "MIT License" },
  { id: "4", name: "GNU General Public License" },
]

// Add mockup data for collections
const collections = [
  { id: "1", name: "Digital Art Collection" },
  { id: "2", name: "Music NFTs" },
  { id: "3", name: "Video Content" },
]

interface Asset {
  title: string
  description: string
  assetType: string
  mediaUrl: string
  tags: string[]
  license: string
  isLimited: boolean
  totalSupply: number
  collection: string
  ipVersion: string
}

export default function NewAssetPage() {
  // Add state for new collection input
  const [newCollection, setNewCollection] = useState("")
  const [isNewCollection, setIsNewCollection] = useState(false)

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
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { toast } = useToast()

  // Update the handleInputChange function to include newCollection
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "newCollection") {
      setNewCollection(value)
    } else {
      setAsset((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Update the handleSelectChange function to handle collection selection
  const handleSelectChange = (name: string, value: string) => {
    if (name === "collection" && value === "new") {
      setIsNewCollection(true)
      setAsset((prev) => ({ ...prev, collection: "" }))
    } else {
      setIsNewCollection(false)
      setAsset((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Update the handleSubmit function to include the new fields
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulating an API call to a smart contract
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // If it's a new collection, use the newCollection value
      const finalCollection = isNewCollection ? newCollection : asset.collection

      // Log the final asset data (replace with actual submission logic)
      console.log({
        ...asset,
        collection: finalCollection,
      })

      setIsDrawerOpen(true)
    } catch (error) {
      console.error("Submission error:", error)
      toast({
        title: "Error",
        description: "Failed to create asset. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTransactionSign = async () => {
    try {
      // Simulating a blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Asset Created",
        description: "Your new asset has been successfully minted as an NFT.",
      })
      setIsDrawerOpen(false)
    } catch (error) {
      console.error("Transaction error:", error)
      toast({
        title: "Transaction Failed",
        description: "Failed to sign the transaction. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Asset</h1>
      <Card>
        <CardHeader>
          <CardTitle>Asset Details</CardTitle>
          <CardDescription>Enter the details of your new Programmable IP NFT</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={asset.title} onChange={handleInputChange} required />
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
              <Select value={asset.assetType} onValueChange={(value) => handleSelectChange("assetType", value)}>
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
              <TagInput tags={asset.tags} setTags={(newTags) => setAsset((prev) => ({ ...prev, tags: newTags }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">License</Label>
              <Select value={asset.license} onValueChange={(value) => handleSelectChange("license", value)}>
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
              <Select value={asset.collection} onValueChange={(value) => handleSelectChange("collection", value)}>
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
                onCheckedChange={(checked) => setAsset((prev) => ({ ...prev, isLimited: checked }))}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Asset..." : "Create Asset"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Sign Transaction</DrawerTitle>
            <DrawerDescription>Please sign the transaction to mint your new Programmable IP NFT.</DrawerDescription>
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
          </div>
          <DrawerFooter>
            <Button onClick={handleTransactionSign}>Sign Transaction</Button>
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

