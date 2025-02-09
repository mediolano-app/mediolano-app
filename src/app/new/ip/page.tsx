"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { authors, categories, collections } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"
import { TagInput } from "@/components/TagInput"
import { CheckboxMultiSelect } from "@/components/CheckboxMultiSelect"

const fallbackAuthors = authors || []
const fallbackCategories = categories || []
const fallbackCollections = collections || []

interface Publication {
  title: string
  author: string
  urlSlug: string
  categories: string[]
  tags: string[]
  content: string
  excerpt: string
  collection: string
  featuredMediaUrl: string
}

export default function NewPublicationPage() {
  const [publication, setPublication] = useState<Publication>({
    title: "",
    author: "",
    urlSlug: "",
    categories: [],
    tags: [],
    content: "",
    excerpt: "",
    collection: "",
    featuredMediaUrl: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPublication((prev) => ({ ...prev, [name]: value }))
    if (name === "title") {
      setPublication((prev) => ({ ...prev, urlSlug: value.toLowerCase().replace(/\s+/g, "-") }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setPublication((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulating a successful submission
      setSubmissionResult({
        success: true,
        message: "Your new publication has been successfully created.",
      })
      toast({
        title: "Publication Created",
        description: "Your new publication has been successfully submitted.",
      })
    } catch (error) {
      console.error("Submission error:", error)
      setSubmissionResult({
        success: false,
        message: "Failed to create publication. Please try again.",
      })
      toast({
        title: "Error",
        description: "Failed to create publication. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsDrawerOpen(true)
    }
  }

  return (
    <> 
    <div className="container mx-auto p-4 mt-10 mb-20">
      
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Publication</h1>
      <Card>
        <CardHeader>
          <CardTitle>Publication Details</CardTitle>
          <CardDescription>Enter the details of your new publication</CardDescription>
        </CardHeader>
        <CardContent>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={publication.title} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Select value={publication.author} onValueChange={(value) => handleSelectChange("author", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an author" />
                </SelectTrigger>
                <SelectContent>
                  {fallbackAuthors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="urlSlug">URL Slug</Label>
              <Input id="urlSlug" name="urlSlug" value={publication.urlSlug} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categories">Categories</Label>
              <Card className="p-4">
                <CheckboxMultiSelect
                  options={fallbackCategories}
                  selected={publication.categories}
                  onChange={(selected) => setPublication((prev) => ({ ...prev, categories: selected }))}
                />
              </Card>
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <TagInput
                tags={publication.tags}
                setTags={(newTags) => setPublication((prev) => ({ ...prev, tags: newTags }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={publication.content}
                onChange={handleInputChange}
                rows={10}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={publication.excerpt}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection">Collection</Label>
              <Select value={publication.collection} onValueChange={(value) => handleSelectChange("collection", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  {fallbackCollections.map((collection) => (
                    <SelectItem key={collection} value={collection}>
                      {collection}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="featuredMediaUrl">Featured Media URL</Label>
              <Input
                id="featuredMediaUrl"
                name="featuredMediaUrl"
                value={publication.featuredMediaUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Publication"}
            </Button>
          </form>
          
        </CardContent>
      </Card>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{submissionResult?.success ? "Success!" : "Error"}</DrawerTitle>
            <DrawerDescription>{submissionResult?.message}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>

</div>
</>

  )
}

