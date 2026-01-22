"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { FileText, Tag, X, Upload, Info, ImageIcon } from "lucide-react"
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
  const [dragActive, setDragActive] = useState(false)

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

  const handleImageUpload = (file: File) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, GIF, WEBP)")
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit")
      return
    }

    handleFileChange(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <h2 className="text-lg mb-2">Asset Information</h2>
        <p className="text-muted-foreground">
          Provide essential details about your intellectual property to ensure proper identification and protection.
        </p>
      </div>

      {/* Media Upload - Mobile First */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImageIcon className="h-5 w-5" />
            Asset Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${dragActive
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {formState.mediaPreviewUrl && formState.mediaPreviewUrl !== "/placeholder.svg?height=600&width=600" ? (
              <div className="relative">
                <div className="aspect-video md:aspect-square relative overflow-hidden rounded-lg">
                  <Image
                    src={formState.mediaPreviewUrl || "/placeholder.svg"}
                    alt="Asset preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 shadow-lg"
                  onClick={() => {
                    updateFormField("basic", "mediaFile", null)
                    updateFormField("basic", "mediaPreviewUrl", "/placeholder.svg?height=600&width=600")
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center cursor-pointer py-8"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <div className="p-4 rounded-full bg-primary/10 mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Upload Your Asset</h3>
                <p className="text-muted-foreground text-center mb-4">Drag & drop your file here, or click to browse</p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">JPG</Badge>
                  <Badge variant="outline">PNG</Badge>
                  <Badge variant="outline">GIF</Badge>
                  <Badge variant="outline">WEBP</Badge>
                  <Badge variant="outline">Max 10MB</Badge>
                </div>
              </div>
            )}
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
              accept=".jpg,.jpeg,.png,.gif,.webp"
            />
          </div>
        </CardContent>
      </Card>

      {/* Basic Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Basic Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              Asset Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formState.title}
              onChange={(e) => updateFormField("basic", "title", e.target.value)}
              placeholder="Enter a descriptive title for your asset"
              className="h-12 text-base"
            />
            <p className="text-sm text-muted-foreground">
              Choose a clear, descriptive title that accurately represents your intellectual property
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={formState.description}
              onChange={(e) => updateFormField("basic", "description", e.target.value)}
              placeholder="Provide a detailed description of your asset and its purpose"
              rows={4}
              className="resize-none text-base"
            />
            <p className="text-sm text-muted-foreground">
              Describe your asset in detail, including its purpose, unique features, and any relevant context
            </p>
          </div>

          <Separator />

          {/* Collection */}
          <div className="space-y-2">
            <Label htmlFor="collection" className="text-base font-medium">
              Collection (Optional)
            </Label>
            <Input
              id="collection"
              value={formState.collection}
              onChange={(e) => updateFormField("basic", "collection", e.target.value)}
              placeholder="Group this asset with similar IP"
              className="h-12 text-base"
            />
            <p className="text-sm text-muted-foreground">Organize your assets by adding them to collections</p>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label htmlFor="tag-input" className="text-base font-medium">
              Tags
            </Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  id="tag-input"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add relevant tags"
                  className="h-12 text-base"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" onClick={addTag} size="lg" className="px-6" disabled={!tagInput.trim()}>
                  <Tag className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {formState.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formState.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1 py-1.5 px-3 text-sm">
                      {tag}
                      <X
                        className="h-3.5 w-3.5 cursor-pointer hover:text-destructive transition-colors"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Add tags to help categorize and make your asset discoverable
            </p>
          </div>

          <Separator />

          {/* Explicit Content Warning */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="explicit-content" className="cursor-pointer font-medium text-base">
                Explicit Content Warning
              </Label>
              <p className="text-sm text-muted-foreground">Mark this asset if it contains mature or explicit content</p>
            </div>
            <Switch
              id="explicit-content"
              checked={formState.isExplicit}
              onCheckedChange={(checked) => updateFormField("basic", "isExplicit", checked)}
              className="shrink-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Tip:</strong> Provide as much detail as possible in the title and description. This information helps
          establish the uniqueness and value of your intellectual property, which is crucial for protection and
          discoverability.
        </AlertDescription>
      </Alert>
    </div>
  )
}
