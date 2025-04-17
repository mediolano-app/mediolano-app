'use client'

import { useState } from 'react'
import { useAccount } from '@starknet-react/core'
import { mintToken } from '@/utils/starknet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

export default function NewCollectionPage() {
  const { account } = useAccount()

  const [collection, setCollection] = useState({
    name: '',
    description: '',
    visibility: 'public',
    collaborative: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCollection({ ...collection, [e.target.name]: e.target.value })
  }

  const handleVisibilityChange = (value: string) => {
    setCollection({ ...collection, visibility: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!account) {
      setSubmissionResult({ success: false, message: 'Please connect your wallet.' })
      setIsSubmitting(false)
      setIsDrawerOpen(true)
      return
    }

    try {
      // First, upload metadata to IPFS via our API route
      const response = await fetch("/api/uploadmeta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: collection.name, description: collection.description }),
      })
      if (!response.ok) throw new Error("Metadata upload failed")
      const { ipfsUri } = await response.json()

      // Then, call the contract to mint a token using the user's account
      const txHash = await mintToken(account)
      setSubmissionResult({
        success: true,
        message: `Collection minted successfully. Transaction hash: ${txHash}. Metadata URI: ${ipfsUri}`,
      })
    } catch (error: any) {
      setSubmissionResult({
        success: false,
        message: error.message || 'Failed to create collection. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
      setIsDrawerOpen(true)
    }
  }

  return (
    <div className="container mx-auto p-4 mt-10 mb-20">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Create New Collection</h1>
        <Card>
          <CardHeader>
            <CardTitle>Collection Details</CardTitle>
            <CardDescription>Enter the details of your new collection</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={collection.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={collection.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={collection.visibility} onValueChange={handleVisibilityChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Collection'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{submissionResult?.success ? 'Success!' : 'Error'}</DrawerTitle>
              <DrawerDescription>{submissionResult?.message}</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}
