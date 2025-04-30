"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { FileText, Tag, X, Upload, ImageIcon, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface AssetBasicDetailsFormProps {
  formState: any
  updateFormField: (section: string, field: string, value: any) => void
  handleFileChange: (file: File | null) => void
}

export function AssetBasicDetailsForm({ formState, updateFormField, handleFileChange }: AssetBasicDetailsFormProps) {
  const [tagInput, setTagInput] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const addTag = () => {
    if (tagInput.trim() && !formState.tags.includes(tagInput.trim())) {
      const newTags = [...formState.tags, tagInput.trim()]
      updateFormField("basic", "tags", newTags)
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    const newTags = formState.tags.filter((t: string) => t !== tag)
    updateFormField("basic", "tags", newTags)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        setFormErrors({
          ...formErrors,
          mediaFile: "Please upload a valid image file (JPEG, PNG, GIF, WEBP)",
        })
        return
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors({
          ...formErrors,
          mediaFile: "File size exceeds 10MB limit",
        })
        return
      }

      // Clear errors and set file
      setFormErrors({ ...formErrors, mediaFile: "" })
      handleFileChange(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Basic Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={formState.title}
            onChange={(e) => updateFormField("basic", "title", e.target.value)}
            placeholder="Give your asset a name"
          />
          <p className="text-sm text-muted-foreground">
            Choose a clear, descriptive title for your intellectual property
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            value={formState.description}
            onChange={(e) => updateFormField("basic", "description", e.target.value)}
            placeholder="Describe your asset"
            rows={4}
          />
          <p className="text-sm text-muted-foreground">Provide a detailed description of your asset and its purpose</p>
        </div>

        <div className="space-y-2">
          <Label>Media</Label>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div
                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="font-medium">Upload Media File</p>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Drag & drop or click to browse
                  <br />
                  JPG, PNG, GIF, WEBP up to 10MB
                </p>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                />

                {formErrors.mediaFile && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{formErrors.mediaFile}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="bg-muted/20 rounded-lg flex items-center justify-center overflow-hidden relative">
              {formState.mediaPreviewUrl ? (
                <div className="relative w-full h-full min-h-[200px]">
                  <Image
                    src={formState.mediaPreviewUrl || "/placeholder.svg"}
                    alt="Asset preview"
                    fill
                    className="object-contain"
                  />
                  <div className="absolute bottom-2 right-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => {
                        updateFormField("basic", "mediaFile", null)
                        updateFormField("basic", "mediaPreviewUrl", "/placeholder.svg?height=600&width=600")
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No media uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="collection">Collection</Label>
            <Input
              id="collection"
              value={formState.collection}
              onChange={(e) => updateFormField("basic", "collection", e.target.value)}
              placeholder="Add to a collection (optional)"
            />
            <p className="text-sm text-muted-foreground">
              Group your asset with similar IP by adding it to a collection
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-input">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tag-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add relevant tags"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <Button type="button" onClick={addTag} size="sm" className="min-w-[80px]">
                <Tag className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Add tags to help categorize and make your asset discoverable
            </p>

            {formState.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formState.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1 py-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="explicit-content" className="cursor-pointer">
                Explicit Content
              </Label>
              <Switch
                id="explicit-content"
                checked={formState.isExplicit}
                onCheckedChange={(checked) => updateFormField("basic", "isExplicit", checked)}
              />
            </div>
            <p className="text-sm text-muted-foreground">Flag this asset if it contains mature or explicit content</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
