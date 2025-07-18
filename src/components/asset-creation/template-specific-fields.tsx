"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Music,
  Palette,
  Video,
  FileText,
  Code,
  Hexagon,
  MessageSquare,
  BookOpen,
  Building,
  Award,
  Settings,
} from "lucide-react"

interface TemplateSpecificFieldsProps {
  template: any
  formState: any
  updateFormField: (field: string, value: any) => void
}

export function TemplateSpecificFields({ template, formState, updateFormField }: TemplateSpecificFieldsProps) {
  const getIconForTemplate = (templateId: string) => {
    const icons: Record<string, any> = {
      audio: Music,
      art: Palette,
      video: Video,
      documents: FileText,
      software: Code,
      nft: Hexagon,
      posts: MessageSquare,
      publications: BookOpen,
      rwa: Building,
      patents: Award,
      custom: Settings,
    }
    return icons[templateId] || FileText
  }

  const IconComponent = getIconForTemplate(template.id)

  const updateMetadataField = (field: string, value: any) => {
    const currentMetadata = formState.metadataFields || {}
    updateFormField("metadataFields", {
      ...currentMetadata,
      [field]: value,
    })
  }

  const getMetadataValue = (field: string) => {
    return formState.metadataFields?.[field] || ""
  }

  const renderAudioFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          placeholder="e.g., 3:45"
          value={getMetadataValue("duration")}
          onChange={(e) => updateMetadataField("duration", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="genre">Genre</Label>
        <Select value={getMetadataValue("genre")} onValueChange={(value) => updateMetadataField("genre", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rock">Rock</SelectItem>
            <SelectItem value="pop">Pop</SelectItem>
            <SelectItem value="jazz">Jazz</SelectItem>
            <SelectItem value="classical">Classical</SelectItem>
            <SelectItem value="electronic">Electronic</SelectItem>
            <SelectItem value="hip-hop">Hip Hop</SelectItem>
            <SelectItem value="country">Country</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bpm">BPM (Beats Per Minute)</Label>
        <Input
          id="bpm"
          type="number"
          placeholder="e.g., 120"
          value={getMetadataValue("bpm")}
          onChange={(e) => updateMetadataField("bpm", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="key">Musical Key</Label>
        <Input
          id="key"
          placeholder="e.g., C Major"
          value={getMetadataValue("key")}
          onChange={(e) => updateMetadataField("key", e.target.value)}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="instruments">Instruments Used</Label>
        <Input
          id="instruments"
          placeholder="e.g., Guitar, Piano, Drums"
          value={getMetadataValue("instruments")}
          onChange={(e) => updateMetadataField("instruments", e.target.value)}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="containsSamples"
            checked={getMetadataValue("containsSamples") || false}
            onCheckedChange={(checked) => updateMetadataField("containsSamples", checked)}
          />
          <Label htmlFor="containsSamples">Contains samples from other works</Label>
        </div>
      </div>
    </div>
  )

  const renderArtFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="medium">Medium</Label>
        <Select value={getMetadataValue("medium")} onValueChange={(value) => updateMetadataField("medium", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select medium" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="digital">Digital Art</SelectItem>
            <SelectItem value="oil">Oil Painting</SelectItem>
            <SelectItem value="acrylic">Acrylic Painting</SelectItem>
            <SelectItem value="watercolor">Watercolor</SelectItem>
            <SelectItem value="pencil">Pencil Drawing</SelectItem>
            <SelectItem value="photography">Photography</SelectItem>
            <SelectItem value="mixed">Mixed Media</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="style">Art Style</Label>
        <Input
          id="style"
          placeholder="e.g., Abstract, Realistic, Impressionist"
          value={getMetadataValue("style")}
          onChange={(e) => updateMetadataField("style", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dimensions">Dimensions</Label>
        <Input
          id="dimensions"
          placeholder="e.g., 1920x1080 or 24x36 inches"
          value={getMetadataValue("dimensions")}
          onChange={(e) => updateMetadataField("dimensions", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="yearCreated">Year Created</Label>
        <Input
          id="yearCreated"
          type="number"
          placeholder="e.g., 2024"
          value={getMetadataValue("yearCreated")}
          onChange={(e) => updateMetadataField("yearCreated", e.target.value)}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="allowPrints"
            checked={getMetadataValue("allowPrints") || false}
            onCheckedChange={(checked) => updateMetadataField("allowPrints", checked)}
          />
          <Label htmlFor="allowPrints">Allow commercial printing and reproduction</Label>
        </div>
      </div>
    </div>
  )

  const renderVideoFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="videoDuration">Duration</Label>
        <Input
          id="videoDuration"
          placeholder="e.g., 5:30"
          value={getMetadataValue("videoDuration")}
          onChange={(e) => updateMetadataField("videoDuration", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resolution">Resolution</Label>
        <Select
          value={getMetadataValue("resolution")}
          onValueChange={(value) => updateMetadataField("resolution", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select resolution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4k">4K (3840x2160)</SelectItem>
            <SelectItem value="1080p">1080p (1920x1080)</SelectItem>
            <SelectItem value="720p">720p (1280x720)</SelectItem>
            <SelectItem value="480p">480p (854x480)</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="frameRate">Frame Rate</Label>
        <Select
          value={getMetadataValue("frameRate")}
          onValueChange={(value) => updateMetadataField("frameRate", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frame rate" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24fps">24 FPS</SelectItem>
            <SelectItem value="30fps">30 FPS</SelectItem>
            <SelectItem value="60fps">60 FPS</SelectItem>
            <SelectItem value="120fps">120 FPS</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="videoGenre">Genre</Label>
        <Input
          id="videoGenre"
          placeholder="e.g., Documentary, Animation, Music Video"
          value={getMetadataValue("videoGenre")}
          onChange={(e) => updateMetadataField("videoGenre", e.target.value)}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="allowClips"
            checked={getMetadataValue("allowClips") || false}
            onCheckedChange={(checked) => updateMetadataField("allowClips", checked)}
          />
          <Label htmlFor="allowClips">Allow short clips for promotional use</Label>
        </div>
      </div>
    </div>
  )

  const renderSoftwareFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="version">Version</Label>
        <Input
          id="version"
          placeholder="e.g., 1.0.0"
          value={getMetadataValue("version")}
          onChange={(e) => updateMetadataField("version", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="programmingLanguage">Programming Language</Label>
        <Input
          id="programmingLanguage"
          placeholder="e.g., JavaScript, Python, Java"
          value={getMetadataValue("programmingLanguage")}
          onChange={(e) => updateMetadataField("programmingLanguage", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="platform">Platform</Label>
        <Select value={getMetadataValue("platform")} onValueChange={(value) => updateMetadataField("platform", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="web">Web</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
            <SelectItem value="server">Server</SelectItem>
            <SelectItem value="cross-platform">Cross-platform</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="softwareLicense">Software License</Label>
        <Select
          value={getMetadataValue("softwareLicense")}
          onValueChange={(value) => updateMetadataField("softwareLicense", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select license" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="proprietary">Proprietary</SelectItem>
            <SelectItem value="mit">MIT</SelectItem>
            <SelectItem value="apache">Apache 2.0</SelectItem>
            <SelectItem value="gpl">GPL</SelectItem>
            <SelectItem value="bsd">BSD</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="allowModifications"
            checked={getMetadataValue("allowModifications") || false}
            onCheckedChange={(checked) => updateMetadataField("allowModifications", checked)}
          />
          <Label htmlFor="allowModifications">Allow modifications and derivative works</Label>
        </div>
      </div>
    </div>
  )

  const renderNFTFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="blockchain">Blockchain</Label>
        <Select
          value={getMetadataValue("blockchain")}
          onValueChange={(value) => updateMetadataField("blockchain", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select blockchain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ethereum">Ethereum</SelectItem>
            <SelectItem value="polygon">Polygon</SelectItem>
            <SelectItem value="solana">Solana</SelectItem>
            <SelectItem value="binance">Binance Smart Chain</SelectItem>
            <SelectItem value="avalanche">Avalanche</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tokenStandard">Token Standard</Label>
        <Select
          value={getMetadataValue("tokenStandard")}
          onValueChange={(value) => updateMetadataField("tokenStandard", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select standard" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="erc721">ERC-721</SelectItem>
            <SelectItem value="erc1155">ERC-1155</SelectItem>
            <SelectItem value="spl">SPL Token</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="editionSize">Edition Size</Label>
        <Input
          id="editionSize"
          type="number"
          placeholder="e.g., 1 for unique, 100 for limited"
          value={getMetadataValue("editionSize")}
          onChange={(e) => updateMetadataField("editionSize", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rarity">Rarity Level</Label>
        <Select value={getMetadataValue("rarity")} onValueChange={(value) => updateMetadataField("rarity", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="common">Common</SelectItem>
            <SelectItem value="uncommon">Uncommon</SelectItem>
            <SelectItem value="rare">Rare</SelectItem>
            <SelectItem value="epic">Epic</SelectItem>
            <SelectItem value="legendary">Legendary</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="traits">Traits/Attributes</Label>
        <Textarea
          id="traits"
          placeholder="Describe special traits or attributes (e.g., Background: Blue, Eyes: Green)"
          value={getMetadataValue("traits")}
          onChange={(e) => updateMetadataField("traits", e.target.value)}
          rows={3}
        />
      </div>
    </div>
  )

  const renderDocumentFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="documentType">Document Type</Label>
        <Select
          value={getMetadataValue("documentType")}
          onValueChange={(value) => updateMetadataField("documentType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="agreement">Agreement</SelectItem>
            <SelectItem value="research">Research Paper</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="report">Report</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Input
          id="language"
          placeholder="e.g., English, Spanish, French"
          value={getMetadataValue("language")}
          onChange={(e) => updateMetadataField("language", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pageCount">Page Count</Label>
        <Input
          id="pageCount"
          type="number"
          placeholder="e.g., 25"
          value={getMetadataValue("pageCount")}
          onChange={(e) => updateMetadataField("pageCount", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="format">Format</Label>
        <Select value={getMetadataValue("format")} onValueChange={(value) => updateMetadataField("format", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="docx">DOCX</SelectItem>
            <SelectItem value="txt">TXT</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="allowTranslations"
            checked={getMetadataValue("allowTranslations") || false}
            onCheckedChange={(checked) => updateMetadataField("allowTranslations", checked)}
          />
          <Label htmlFor="allowTranslations">Allow translations to other languages</Label>
        </div>
      </div>
    </div>
  )

  const renderDefaultFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          placeholder="e.g., Educational, Entertainment, Business"
          value={getMetadataValue("category")}
          onChange={(e) => updateMetadataField("category", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="format">Format</Label>
        <Input
          id="format"
          placeholder="e.g., Digital, Physical, Hybrid"
          value={getMetadataValue("format")}
          onChange={(e) => updateMetadataField("format", e.target.value)}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="additionalNotes">Additional Notes</Label>
        <Textarea
          id="additionalNotes"
          placeholder="Any additional information about your asset..."
          value={getMetadataValue("additionalNotes")}
          onChange={(e) => updateMetadataField("additionalNotes", e.target.value)}
          rows={3}
        />
      </div>
    </div>
  )

  const renderTemplateFields = () => {
    switch (template.id) {
      case "audio":
        return renderAudioFields()
      case "art":
        return renderArtFields()
      case "video":
        return renderVideoFields()
      case "software":
        return renderSoftwareFields()
      case "nft":
        return renderNFTFields()
      case "documents":
        return renderDocumentFields()
      default:
        return renderDefaultFields()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconComponent className="h-5 w-5" />
          {template.name} Details
          <Badge variant="outline" className="ml-auto">
            {template.category}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Specialized fields optimized for {template.name.toLowerCase()} intellectual property registration.
        </p>
      </CardHeader>
      <CardContent>{renderTemplateFields()}</CardContent>
    </Card>
  )
}
