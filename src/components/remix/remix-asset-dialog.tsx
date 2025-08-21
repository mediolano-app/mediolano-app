"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Palette,
  Music,
  Video,
  FileText,
  Lightbulb,
  BadgeCheck,
  Code,
  Hexagon,
  Box,
  Upload,
  Sparkles,
  CheckCircle,
  X,
  Info,
} from "lucide-react"
import Image from "next/image"
import type { Asset, IPType } from "@/types/asset"

interface RemixAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  originalAsset: Asset
  onRemixCreated?: (remixAsset: Asset) => void
}

const typeIcons: Record<IPType, any> = {
  Art: Palette,
  Audio: Music,
  Video: Video,
  Document: FileText,
  Patent: Lightbulb,
  Trademark: BadgeCheck,
  Software: Code,
  NFT: Hexagon,
  Other: Box,
}

const licenseTypes = [
  { value: "cc-by", label: "Creative Commons BY", description: "Attribution required" },
  { value: "cc-by-sa", label: "Creative Commons BY-SA", description: "Attribution + Share Alike" },
  { value: "cc-by-nc", label: "Creative Commons BY-NC", description: "Attribution + Non-Commercial" },
  { value: "mit", label: "MIT License", description: "Permissive open source" },
  { value: "apache", label: "Apache 2.0", description: "Permissive with patent grant" },
  { value: "custom", label: "Custom License", description: "Define your own terms" },
]

export function RemixAssetDialog({ open, onOpenChange, originalAsset, onRemixCreated }: RemixAssetDialogProps) {
  const [step, setStep] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [remixData, setRemixData] = useState({
    name: `${originalAsset.name} (Remix)`,
    description: `A creative remix of "${originalAsset.name}" by ${originalAsset.creator}`,
    file: null as File | null,
    licenseType: "cc-by",
    customLicense: "",
    royaltyPercentage: 5,
    allowCommercial: true,
    allowDerivatives: true,
    requireAttribution: true,
    remixType: "derivative" as "derivative" | "adaptation" | "transformation",
    tags: [] as string[],
  })

  const TypeIcon = typeIcons[originalAsset.type] || Box
  const progress = (step / 4) * 100

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setRemixData({ ...remixData, file })
    }
  }

  const handleCreateRemix = async () => {
    setIsCreating(true)

    // Simulate remix creation process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const newRemixAsset: Asset = {
      id: `remix-${Date.now()}`,
      name: remixData.name,
      creator: "Current User", // This would be the actual user
      verified: false,
      image: originalAsset.image, // In real app, this would be the new uploaded file
      collection: `${originalAsset.collection} Remixes`,
      licenseType: remixData.licenseType,
      description: remixData.description,
      registrationDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      value: "0.1 ETH",
      type: originalAsset.type,
      templateType: `${originalAsset.templateType} Remix`,
      templateId: originalAsset.templateId,
      protectionLevel: 85,
      metadata: {
        ...originalAsset.metadata,
        originalAsset: originalAsset.id,
        remixType: remixData.remixType,
        royaltyPercentage: remixData.royaltyPercentage,
      },
      owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      createdAt: new Date().toISOString(),
      numericValue: 100,
    }

    setIsCreating(false)
    onRemixCreated?.(newRemixAsset)
    onOpenChange(false)
    setStep(1)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Create a Remix</h3>
              <p className="text-sm text-muted-foreground">
                Transform this original work into something new while respecting the creator's rights
              </p>
            </div>

            {/* Original Asset Preview */}
            <Card className="border-2 border-dashed border-muted">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={originalAsset.image || "/placeholder.svg"}
                      alt={originalAsset.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary">{originalAsset.type}</Badge>
                    </div>
                    <h4 className="font-medium truncate">{originalAsset.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage
                          src={`/placeholder-icon.png?height=16&width=16&text=${originalAsset.creator.substring(0, 2)}`}
                        />
                        <AvatarFallback className="text-xs">{originalAsset.creator.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">by {originalAsset.creator}</span>
                      {originalAsset.verified && <BadgeCheck className="h-3 w-3 text-blue-500" />}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Remix Type Selection */}
            <div className="space-y-3">
              <Label>Remix Type</Label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    value: "derivative",
                    title: "Derivative Work",
                    description: "Build upon the original with modifications",
                  },
                  {
                    value: "adaptation",
                    title: "Adaptation",
                    description: "Transform into a different medium or format",
                  },
                  {
                    value: "transformation",
                    title: "Transformation",
                    description: "Significant creative reinterpretation",
                  },
                ].map((type) => (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-colors ${
                      remixData.remixType === type.value
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/50"
                    }`}
                    onClick={() => setRemixData({ ...remixData, remixType: type.value as any })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            remixData.remixType === type.value ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}
                        />
                        <div>
                          <h4 className="font-medium">{type.title}</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Your Remix</h3>
              <p className="text-sm text-muted-foreground">
                Upload your remixed version and provide details about your creation
              </p>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="remix-file">Remix File</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <input
                  id="remix-file"
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
                />
                <Label htmlFor="remix-file" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Click to upload your remix</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports images, audio, video, and documents</p>
                </Label>
                {remixData.file && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{remixData.file.name}</p>
                    <p className="text-xs text-muted-foreground">{(remixData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Details */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="remix-name">Remix Title</Label>
                <Input
                  id="remix-name"
                  value={remixData.name}
                  onChange={(e) => setRemixData({ ...remixData, name: e.target.value })}
                  placeholder="Enter a title for your remix"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remix-description">Description</Label>
                <Textarea
                  id="remix-description"
                  value={remixData.description}
                  onChange={(e) => setRemixData({ ...remixData, description: e.target.value })}
                  placeholder="Describe your remix and what makes it unique"
                  rows={4}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BadgeCheck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">License Your Remix</h3>
              <p className="text-sm text-muted-foreground">Choose how others can use your remix and set your terms</p>
            </div>

            {/* License Type */}
            <div className="space-y-3">
              <Label>License Type</Label>
              <Select
                value={remixData.licenseType}
                onValueChange={(value) => setRemixData({ ...remixData, licenseType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {licenseTypes.map((license) => (
                    <SelectItem key={license.value} value={license.value}>
                      <div>
                        <div className="font-medium">{license.label}</div>
                        <div className="text-xs text-muted-foreground">{license.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* License Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-commercial"
                  checked={remixData.allowCommercial}
                  onCheckedChange={(checked) => setRemixData({ ...remixData, allowCommercial: checked as boolean })}
                />
                <Label htmlFor="allow-commercial" className="text-sm">
                  Allow commercial use
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-derivatives"
                  checked={remixData.allowDerivatives}
                  onCheckedChange={(checked) => setRemixData({ ...remixData, allowDerivatives: checked as boolean })}
                />
                <Label htmlFor="allow-derivatives" className="text-sm">
                  Allow derivative works
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="require-attribution"
                  checked={remixData.requireAttribution}
                  onCheckedChange={(checked) => setRemixData({ ...remixData, requireAttribution: checked as boolean })}
                />
                <Label htmlFor="require-attribution" className="text-sm">
                  Require attribution
                </Label>
              </div>
            </div>

            {/* Royalty Percentage */}
            <div className="space-y-2">
              <Label htmlFor="royalty">Royalty Percentage</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="royalty"
                  type="number"
                  min="0"
                  max="50"
                  value={remixData.royaltyPercentage}
                  onChange={(e) => setRemixData({ ...remixData, royaltyPercentage: Number(e.target.value) })}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">%</span>
                <p className="text-xs text-muted-foreground flex-1">
                  Percentage you'll receive from future sales and licenses
                </p>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Review & Create</h3>
              <p className="text-sm text-muted-foreground">
                Review your remix details before minting your new IP asset
              </p>
            </div>

            {/* Summary */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Remix Title</span>
                  <span className="text-sm">{remixData.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Type</span>
                  <Badge variant="secondary">{remixData.remixType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">License</span>
                  <span className="text-sm">{licenseTypes.find((l) => l.value === remixData.licenseType)?.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Royalty</span>
                  <span className="text-sm">{remixData.royaltyPercentage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Original Creator</span>
                  <span className="text-sm">{originalAsset.creator}</span>
                </div>
              </CardContent>
            </Card>

            {/* Attribution Notice */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Attribution Required</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This remix will automatically include attribution to the original creator "{originalAsset.creator}"
                    and link back to the original work as required by the license terms.
                  </p>
                </div>
              </div>
            </div>

            {/* Estimated Costs */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Estimated Costs</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Minting Fee</span>
                    <span>0.005 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>0.002 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gas Fee (estimated)</span>
                    <span>0.008 ETH</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>0.015 ETH</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Create Remix</DialogTitle>
              <DialogDescription>
                Step {step} of 4 - Transform an existing IP asset into something new
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progress} className="mt-4" />
        </DialogHeader>

        <div className="py-6">{renderStep()}</div>

        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => (step > 1 ? setStep(step - 1) : onOpenChange(false))}
            disabled={isCreating}
          >
            {step > 1 ? "Previous" : "Cancel"}
          </Button>

          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !remixData.remixType) ||
                (step === 2 && (!remixData.file || !remixData.name.trim())) ||
                (step === 3 && !remixData.licenseType)
              }
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleCreateRemix} disabled={isCreating}>
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Remix...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Remix
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
