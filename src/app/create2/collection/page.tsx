"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Upload,
  FolderPlus,
  LinkIcon,
  ImageIcon,
  X,
  Check,
  AlertCircle,
  Info,
  Sparkles,
  Shield,
  Globe,
  Users,
  BookOpen,
  HelpCircle,
  ExternalLink,
  Copy,
  Share2,
  Eye,
  Calendar,
  Hash,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface FormData {
  name: string
  description: string
  type: string
  category: string
  licenseType: string
  territory: string
  permissions: {
    commercial: boolean
    modifications: boolean
    distribution: boolean
    attribution: boolean
  }
}

interface CreatedCollection {
  id: string
  name: string
  description: string
  type: string
  category: string
  coverImage: string | null
  licenseType: string
  territory: string
  permissions: {
    commercial: boolean
    modifications: boolean
    distribution: boolean
    attribution: boolean
  }
  createdAt: string
  blockchain: {
    network: string
    contractAddress: string
    tokenId: string
    transactionHash: string
  }
}

export default function CreateCollectionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"upload" | "url">("upload")
  const [mediaUrl, setMediaUrl] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [isOpenEdition, setIsOpenEdition] = useState(false)
  const [isCollaborative, setIsCollaborative] = useState(false)
  const [isStoryCollection, setIsStoryCollection] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccessDrawer, setShowSuccessDrawer] = useState(false)
  const [createdCollection, setCreatedCollection] = useState<CreatedCollection | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    type: "mixed",
    category: "",
    licenseType: "cc",
    territory: "worldwide",
    permissions: {
      commercial: false,
      modifications: false,
      distribution: false,
      attribution: true,
    },
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Collection name is required"
    if (formData.name.length < 3) newErrors.name = "Name must be at least 3 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const mockCollection: CreatedCollection = {
        id: `col_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        category: formData.category || "Uncategorized",
        coverImage,
        licenseType: formData.licenseType,
        territory: formData.territory,
        permissions: formData.permissions,
        createdAt: new Date().toISOString(),
        blockchain: {
          network: "Starknet",
          contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
          tokenId: Math.floor(Math.random() * 10000).toString(),
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        },
      }

      setCreatedCollection(mockCollection)
      setIsSubmitting(false)
      setShowSuccessDrawer(true)
    }, 2000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, image: "File size must be less than 10MB" })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setCoverImage(event.target?.result as string)
        setErrors({ ...errors, image: "" })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMediaUrlSubmit = () => {
    if (mediaUrl) {
      // Basic URL validation
      try {
        new URL(mediaUrl)
        setCoverImage(mediaUrl)
        setErrors({ ...errors, mediaUrl: "" })
      } catch {
        setErrors({ ...errors, mediaUrl: "Please enter a valid URL" })
      }
    }
  }

  const removeCoverImage = () => {
    setCoverImage(null)
    setMediaUrl("")
    setErrors({ ...errors, image: "", mediaUrl: "" })
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getCollectionTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      art: <ImageIcon className="h-4 w-4" />,
      audio: <Sparkles className="h-4 w-4" />,
      video: <Sparkles className="h-4 w-4" />,
      document: <BookOpen className="h-4 w-4" />,
      software: <Shield className="h-4 w-4" />,
      mixed: <Globe className="h-4 w-4" />,
    }
    return icons[type] || <Globe className="h-4 w-4" />
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
    

      <main className="container mx-auto px-4 py-6 md:py-8">
        <Link href="/create">
          <Button variant="ghost" size="sm" className="mb-6 hover:bg-muted/50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Create Options
          </Button>
        </Link>

        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <FolderPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Create New Collection</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Organize and showcase your intellectual property assets
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-950">
                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg md:text-xl">Collection Information</CardTitle>
                      <CardDescription className="text-sm">
                        Enter the basic details about your collection
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                      Collection Name
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter a unique name for your collection"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      className={`text-base transition-colors ${errors.name ? "border-red-500 focus:border-red-500" : "focus:border-primary"}`}
                    />
                    {errors.name && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your collection, its purpose, and what makes it unique..."
                      value={formData.description}
                      onChange={(e) => updateFormData("description", e.target.value)}
                      className="min-h-[100px] md:min-h-[120px] text-base resize-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm font-medium">
                        Primary Asset Type
                      </Label>
                      <Select value={formData.type} onValueChange={(value) => updateFormData("type", value)}>
                        <SelectTrigger className="focus:border-primary">
                          <SelectValue placeholder="Select primary type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="art">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" />
                              Digital Art
                            </div>
                          </SelectItem>
                          <SelectItem value="audio">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              Audio & Music
                            </div>
                          </SelectItem>
                          <SelectItem value="video">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              Video Content
                            </div>
                          </SelectItem>
                          <SelectItem value="document">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              Documents
                            </div>
                          </SelectItem>
                          <SelectItem value="software">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Software & Code
                            </div>
                          </SelectItem>
                          <SelectItem value="mixed">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Mixed Assets
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category
                        <span className="text-muted-foreground ml-1">(Optional)</span>
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                        <SelectTrigger className="focus:border-primary">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="creative">Creative Works</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="business">Business Assets</SelectItem>
                          <SelectItem value="research">Research & Development</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="education">Educational Content</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Media Upload */}
              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-950">
                      <ImageIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg md:text-xl">Collection Cover</CardTitle>
                      <CardDescription className="text-sm">
                        Add a cover image to represent your collection
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs value={mediaType} onValueChange={(value) => setMediaType(value as "upload" | "url")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload" className="flex items-center gap-2 text-sm">
                        <Upload className="h-4 w-4" />
                        Upload File
                      </TabsTrigger>
                      <TabsTrigger value="url" className="flex items-center gap-2 text-sm">
                        <LinkIcon className="h-4 w-4" />
                        Media URL
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="mt-4">
                      <div
                        className={`border-2 border-dashed rounded-lg p-4 md:p-6 text-center transition-colors ${
                          coverImage
                            ? "border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-950/20"
                            : "border-muted-foreground/25 hover:border-primary/50"
                        }`}
                      >
                        {coverImage && mediaType === "upload" ? (
                          <div className="relative">
                            <img
                              src={coverImage || "/placeholder.svg"}
                              alt="Cover preview"
                              className="mx-auto max-h-[150px] md:max-h-[200px] rounded-lg object-cover shadow-md"
                            />
                            <div className="mt-3 md:mt-4 flex items-center justify-center gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 text-xs"
                              >
                                <Check className="mr-1 h-3 w-3" />
                                Image uploaded
                              </Badge>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={removeCoverImage}
                                className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 bg-transparent text-xs"
                              >
                                <X className="mr-1 h-3 w-3" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="p-3 md:p-4 rounded-full bg-muted mb-3 md:mb-4">
                              <ImageIcon className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Drag and drop an image, or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground mb-3 md:mb-4">
                              Supports JPG, PNG, GIF up to 10MB
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
                              className="hover:bg-primary hover:text-primary-foreground text-sm"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Select Image
                            </Button>
                          </div>
                        )}
                      </div>
                      {errors.image && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">{errors.image}</AlertDescription>
                        </Alert>
                      )}
                    </TabsContent>

                    <TabsContent value="url" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://example.com/image.jpg"
                            value={mediaUrl}
                            onChange={(e) => setMediaUrl(e.target.value)}
                            className={`flex-1 text-sm ${errors.mediaUrl ? "border-red-500" : "focus:border-primary"}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleMediaUrlSubmit}
                            disabled={!mediaUrl}
                            className="hover:bg-primary hover:text-primary-foreground bg-transparent text-sm"
                          >
                            Load
                          </Button>
                        </div>
                        {errors.mediaUrl && (
                          <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {errors.mediaUrl}
                          </div>
                        )}
                        {coverImage && mediaType === "url" && (
                          <div className="relative border rounded-lg p-4 bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                            <img
                              src={coverImage || "/placeholder.svg"}
                              alt="Cover preview"
                              className="mx-auto max-h-[150px] md:max-h-[200px] rounded-lg object-cover shadow-md"
                            />
                            <div className="mt-3 md:mt-4 flex items-center justify-center gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 text-xs"
                              >
                                <Check className="mr-1 h-3 w-3" />
                                Image loaded
                              </Badge>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={removeCoverImage}
                                className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 bg-transparent text-xs"
                              >
                                <X className="mr-1 h-3 w-3" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Licensing Settings */}
              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-950">
                      <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg md:text-xl">Licensing & Rights</CardTitle>
                      <CardDescription className="text-sm">
                        Configure licensing terms for assets in this collection
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Default License Type</Label>
                    <RadioGroup
                      value={formData.licenseType}
                      onValueChange={(value) => updateFormData("licenseType", value)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
                    >
                      <div className="flex items-center space-x-2 border rounded-lg p-3 md:p-4 hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="cc" id="cc" />
                        <Label htmlFor="cc" className="flex-1 cursor-pointer">
                          <div className="font-medium text-sm">Creative Commons</div>
                          <div className="text-xs text-muted-foreground">Open licensing with attribution</div>
                          <Badge variant="outline" className="mt-1 text-xs">
                            Most Popular
                          </Badge>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 md:p-4 hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="commercial" id="commercial" />
                        <Label htmlFor="commercial" className="flex-1 cursor-pointer">
                          <div className="font-medium text-sm">Commercial License</div>
                          <div className="text-xs text-muted-foreground">Paid licensing for commercial use</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 md:p-4 hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="exclusive" id="exclusive" />
                        <Label htmlFor="exclusive" className="flex-1 cursor-pointer">
                          <div className="font-medium text-sm">Exclusive Rights</div>
                          <div className="text-xs text-muted-foreground">Full ownership transfer</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 md:p-4 hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom" className="flex-1 cursor-pointer">
                          <div className="font-medium text-sm">Custom License</div>
                          <div className="text-xs text-muted-foreground">Define your own terms</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="territory" className="text-sm font-medium">
                      Territory Restrictions
                    </Label>
                    <Select value={formData.territory} onValueChange={(value) => updateFormData("territory", value)}>
                      <SelectTrigger className="focus:border-primary">
                        <SelectValue placeholder="Select territory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="worldwide">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Worldwide
                          </div>
                        </SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="eu">European Union</SelectItem>
                        <SelectItem value="custom">Custom Territory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">License Permissions</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id="commercial-use"
                          checked={formData.permissions.commercial}
                          onCheckedChange={(checked) =>
                            updateFormData("permissions", {
                              ...formData.permissions,
                              commercial: checked,
                            })
                          }
                        />
                        <Label htmlFor="commercial-use" className="text-sm cursor-pointer flex-1">
                          Allow commercial use
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id="modifications"
                          checked={formData.permissions.modifications}
                          onCheckedChange={(checked) =>
                            updateFormData("permissions", {
                              ...formData.permissions,
                              modifications: checked,
                            })
                          }
                        />
                        <Label htmlFor="modifications" className="text-sm cursor-pointer flex-1">
                          Allow modifications
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id="distribution"
                          checked={formData.permissions.distribution}
                          onCheckedChange={(checked) =>
                            updateFormData("permissions", {
                              ...formData.permissions,
                              distribution: checked,
                            })
                          }
                        />
                        <Label htmlFor="distribution" className="text-sm cursor-pointer flex-1">
                          Allow redistribution
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id="attribution"
                          checked={formData.permissions.attribution}
                          onCheckedChange={(checked) =>
                            updateFormData("permissions", {
                              ...formData.permissions,
                              attribution: checked,
                            })
                          }
                        />
                        <Label htmlFor="attribution" className="text-sm cursor-pointer flex-1">
                          Require attribution
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end pt-4 md:pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name}
                  className="w-full md:w-auto min-w-[160px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating Collection...
                    </>
                  ) : (
                    <>
                      <FolderPlus className="mr-2 h-4 w-4" />
                      Create Collection
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Enhanced Collection Preview Sidebar */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="space-y-4 md:space-y-6 lg:sticky lg:top-24">
              {/* Enhanced Collection Preview */}
              <Card className="border-2 bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Live Preview
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Real-time preview of your collection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/20">
                    {coverImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={coverImage || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="flex items-center gap-2">
                            {getCollectionTypeIcon(formData.type)}
                            <Badge variant="secondary" className="text-xs bg-white/90 text-black">
                              {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8 mb-2" />
                        <p className="text-xs text-center">Cover image will appear here</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-sm md:text-base truncate">{formData.name || "Collection Name"}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mt-1">
                        {formData.description || "Collection description will appear here..."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="h-3 w-3" />
                      <span className="text-muted-foreground">{new Date().toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {formData.licenseType.toUpperCase()}
                      </Badge>
                      {formData.category && (
                        <Badge variant="secondary" className="text-xs">
                          {formData.category}
                        </Badge>
                      )}
                      {isPublic && (
                        <Badge variant="default" className="text-xs">
                          Public
                        </Badge>
                      )}
                    </div>

                    <div className="pt-2 border-t">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <CheckCircle
                            className={`h-3 w-3 ${formData.permissions.commercial ? "text-green-500" : "text-muted-foreground"}`}
                          />
                          <span
                            className={formData.permissions.commercial ? "text-foreground" : "text-muted-foreground"}
                          >
                            Commercial
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle
                            className={`h-3 w-3 ${formData.permissions.modifications ? "text-green-500" : "text-muted-foreground"}`}
                          />
                          <span
                            className={formData.permissions.modifications ? "text-foreground" : "text-muted-foreground"}
                          >
                            Modify
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle
                            className={`h-3 w-3 ${formData.permissions.distribution ? "text-green-500" : "text-muted-foreground"}`}
                          />
                          <span
                            className={formData.permissions.distribution ? "text-foreground" : "text-muted-foreground"}
                          >
                            Distribute
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle
                            className={`h-3 w-3 ${formData.permissions.attribution ? "text-green-500" : "text-muted-foreground"}`}
                          />
                          <span
                            className={formData.permissions.attribution ? "text-foreground" : "text-muted-foreground"}
                          >
                            Attribution
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Collection Settings */}
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg">Collection Settings</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Configure how your collection behaves
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <p className="font-medium text-sm">Visibility</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {isPublic ? "Anyone can view" : "Private access only"}
                        </p>
                      </div>
                      <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          <p className="font-medium text-sm">Open Edition</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Unlimited minting</p>
                      </div>
                      <Switch checked={isOpenEdition} onCheckedChange={setIsOpenEdition} />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <p className="font-medium text-sm">Collaborative</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Others can contribute</p>
                      </div>
                      <Switch checked={isCollaborative} onCheckedChange={setIsCollaborative} />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <p className="font-medium text-sm">Story Collection</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Connected narrative</p>
                      </div>
                      <Switch checked={isStoryCollection} onCheckedChange={setIsStoryCollection} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg">Collection Benefits</CardTitle>
                  <CardDescription className="text-xs md:text-sm">What you get with IP Manager</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-xs md:text-sm">Blockchain Protection</p>
                      <p className="text-xs text-muted-foreground">Immutable proof of ownership</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-xs md:text-sm">Smart Licensing</p>
                      <p className="text-xs text-muted-foreground">Automated royalty distribution</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-xs md:text-sm">Global Registry</p>
                      <p className="text-xs text-muted-foreground">Worldwide IP recognition</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-xs md:text-sm">Analytics Dashboard</p>
                      <p className="text-xs text-muted-foreground">Track usage and performance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Section */}
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 md:h-5 md:w-5" />
                    Need Help?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent hover:bg-muted text-xs md:text-sm"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Collection Guide
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent hover:bg-muted text-xs md:text-sm"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Licensing Best Practices
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent hover:bg-muted text-xs md:text-sm"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Success Drawer */}
      <Drawer open={showSuccessDrawer} onOpenChange={setShowSuccessDrawer}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-950">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <DrawerTitle className="text-2xl font-bold">Collection Created Successfully!</DrawerTitle>
            <DrawerDescription className="text-base">
              Your collection has been minted and is now live on the blockchain
            </DrawerDescription>
          </DrawerHeader>

          {createdCollection && (
            <div className="px-4 pb-4 space-y-6 overflow-y-auto">
              {/* Collection Preview in Drawer */}
              <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {createdCollection.coverImage ? (
                        <img
                          src={createdCollection.coverImage || "/placeholder.svg"}
                          alt={createdCollection.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{createdCollection.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {createdCollection.description || "No description provided"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {getCollectionTypeIcon(createdCollection.type)}
                        <Badge variant="outline" className="text-xs">
                          {createdCollection.type.charAt(0).toUpperCase() + createdCollection.type.slice(1)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {createdCollection.licenseType.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Collection Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Collection Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Collection ID</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{createdCollection.id}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(createdCollection.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span className="text-sm">{formatDate(createdCollection.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Territory</span>
                      <Badge variant="outline" className="text-xs">
                        {createdCollection.territory}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Blockchain Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Network</span>
                      <Badge variant="default" className="text-xs">
                        {createdCollection.blockchain.network}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Contract</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {createdCollection.blockchain.contractAddress.slice(0, 8)}...
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(createdCollection.blockchain.contractAddress)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Token ID</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        #{createdCollection.blockchain.tokenId}
                      </code>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* License Permissions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">License Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle
                        className={`h-4 w-4 ${createdCollection.permissions.commercial ? "text-green-500" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-sm ${createdCollection.permissions.commercial ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        Commercial Use
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle
                        className={`h-4 w-4 ${createdCollection.permissions.modifications ? "text-green-500" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-sm ${createdCollection.permissions.modifications ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        Modifications
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle
                        className={`h-4 w-4 ${createdCollection.permissions.distribution ? "text-green-500" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-sm ${createdCollection.permissions.distribution ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        Distribution
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle
                        className={`h-4 w-4 ${createdCollection.permissions.attribution ? "text-green-500" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-sm ${createdCollection.permissions.attribution ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        Attribution
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DrawerFooter className="flex-row gap-2">
            <Button
              variant="outline"
              onClick={() =>
                createdCollection && copyToClipboard(`${window.location.origin}/collections/${createdCollection.id}`)
              }
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Collection
            </Button>
            <Button
              onClick={() =>
                createdCollection &&
                window.open(`${window.location.origin}/collections/${createdCollection.id}`, "_blank")
              }
              className="flex-1"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Collection
            </Button>
            <DrawerClose asChild>
              <Button variant="secondary">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
