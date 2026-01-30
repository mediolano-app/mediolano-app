"use client"
// template-specific-fields.tsx
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  Camera,
  Image as ImageIcon,
  XCircle,
  Upload,
  X,
} from "lucide-react"

interface TemplateSpecificFieldsProps {
  template: any
  formState: any
  updateFormField: (field: string, value: any) => void
  onFeaturedImageChange?: (file: File | null) => void
}

export function TemplateSpecificFields({ template, formState, updateFormField, onFeaturedImageChange }: TemplateSpecificFieldsProps) {
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
      photography: Camera,
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
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="spotifyUrl">Spotify Link</Label>
        <Input
          id="spotifyUrl"
          placeholder="e.g., https://open.spotify.com/track/..."
          value={getMetadataValue("spotifyUrl")}
          onChange={(e) => updateMetadataField("spotifyUrl", e.target.value)}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="youtubeUrl">YouTube Link</Label>
        <Input
          id="youtubeUrl"
          placeholder="e.g., https://youtube.com/watch?v=..."
          value={getMetadataValue("youtubeUrl")}
          onChange={(e) => updateMetadataField("youtubeUrl", e.target.value)}
        />
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
        <Label htmlFor="creationDate">Creation Date</Label>
        <Input
          id="creationDate"
          placeholder="e.g., 2024 or 2024-01-20"
          value={getMetadataValue("creationDate")}
          onChange={(e) => updateMetadataField("creationDate", e.target.value)}
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
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          placeholder="e.g., 5:30"
          value={getMetadataValue("duration")}
          onChange={(e) => updateMetadataField("duration", e.target.value)}
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
        <Label htmlFor="genre">Genre</Label>
        <Input
          id="genre"
          placeholder="e.g., Documentary, Animation, Music Video"
          value={getMetadataValue("genre")}
          onChange={(e) => updateMetadataField("genre", e.target.value)}
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
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="youtubeUrl">YouTube Video Link</Label>
        <Input
          id="youtubeUrl"
          placeholder="e.g., https://youtube.com/watch?v=..."
          value={getMetadataValue("youtubeUrl")}
          onChange={(e) => updateMetadataField("youtubeUrl", e.target.value)}
        />
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
        <Label htmlFor="license">Software License</Label>
        <Select
          value={getMetadataValue("license")}
          onValueChange={(value) => updateMetadataField("license", value)}
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
            <SelectItem value="ethereum">Starknet</SelectItem>
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

  const renderPhotographyFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="camera">Camera Model</Label>
        <Input
          id="camera"
          placeholder="e.g., Canon EOS R5, Sony A7IV"
          value={getMetadataValue("camera")}
          onChange={(e) => updateMetadataField("camera", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lens">Lens</Label>
        <Input
          id="lens"
          placeholder="e.g., 24-70mm f/2.8"
          value={getMetadataValue("lens")}
          onChange={(e) => updateMetadataField("lens", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fileFormat">File Format</Label>
        <Select value={getMetadataValue("fileFormat")} onValueChange={(value) => updateMetadataField("fileFormat", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="raw">RAW</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
            <SelectItem value="tiff">TIFF</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="film">Film Scan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="resolution">Resolution</Label>
        <Input
          id="resolution"
          placeholder="e.g., 45MP, 8192x5464"
          value={getMetadataValue("resolution")}
          onChange={(e) => updateMetadataField("resolution", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="iso">ISO</Label>
        <Input
          id="iso"
          placeholder="e.g., 100, 400, 1600"
          value={getMetadataValue("iso")}
          onChange={(e) => updateMetadataField("iso", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="aperture">Aperture</Label>
        <Input
          id="aperture"
          placeholder="e.g., f/1.8, f/5.6"
          value={getMetadataValue("aperture")}
          onChange={(e) => updateMetadataField("aperture", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="shutterSpeed">Shutter Speed</Label>
        <Input
          id="shutterSpeed"
          placeholder="e.g., 1/200, 30s"
          value={getMetadataValue("shutterSpeed")}
          onChange={(e) => updateMetadataField("shutterSpeed", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="focalLength">Focal Length</Label>
        <Input
          id="focalLength"
          placeholder="e.g., 35mm, 85mm"
          value={getMetadataValue("focalLength")}
          onChange={(e) => updateMetadataField("focalLength", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="takenDate">Date Taken</Label>
        <Input
          id="takenDate"
          type="date"
          value={getMetadataValue("takenDate")}
          onChange={(e) => updateMetadataField("takenDate", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="e.g., New York, NY"
          value={getMetadataValue("location")}
          onChange={(e) => updateMetadataField("location", e.target.value)}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="software">Post-Processing Software</Label>
        <Input
          id="software"
          placeholder="e.g., Lightroom, Photoshop"
          value={getMetadataValue("software")}
          onChange={(e) => updateMetadataField("software", e.target.value)}
        />
      </div>
    </div>
  )

  const renderPostsFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="platform">Platform</Label>
        <Select value={getMetadataValue("platform")} onValueChange={(value) => updateMetadataField("platform", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="x">X (Twitter)</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="publicationDate">Publication Date</Label>
        <Input
          id="publicationDate"
          type="date"
          value={getMetadataValue("publicationDate")}
          onChange={(e) => updateMetadataField("publicationDate", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          placeholder="e.g., Lifestyle, Tech, News"
          value={getMetadataValue("category")}
          onChange={(e) => updateMetadataField("category", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="wordCount">Word/Character Count</Label>
        <Input
          id="wordCount"
          type="number"
          placeholder="e.g., 280"
          value={getMetadataValue("wordCount")}
          onChange={(e) => updateMetadataField("wordCount", e.target.value)}
        />
      </div>

      {/* Social Links */}
      <div className="space-y-2 md:col-span-2 pt-4">
        <Label className="text-base font-semibold">Social Links</Label>
        <p className="text-sm text-muted-foreground mb-4">Add direct links to your social media presence.</p>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="instagramUrl">Instagram Link</Label>
        <Input
          id="instagramUrl"
          placeholder="https://instagram.com/..."
          value={getMetadataValue("instagramUrl")}
          onChange={(e) => updateMetadataField("instagramUrl", e.target.value)}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="tiktokUrl">TikTok Link</Label>
        <Input
          id="tiktokUrl"
          placeholder="https://tiktok.com/@..."
          value={getMetadataValue("tiktokUrl")}
          onChange={(e) => updateMetadataField("tiktokUrl", e.target.value)}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="youtubeUrl">YouTube Link</Label>
        <Input
          id="youtubeUrl"
          placeholder="https://youtube.com/..."
          value={getMetadataValue("youtubeUrl")}
          onChange={(e) => updateMetadataField("youtubeUrl", e.target.value)}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="facebookUrl">Facebook Link</Label>
        <Input
          id="facebookUrl"
          placeholder="https://facebook.com/..."
          value={getMetadataValue("facebookUrl")}
          onChange={(e) => updateMetadataField("facebookUrl", e.target.value)}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="xUrl">X (Twitter) Link</Label>
        <Input
          id="xUrl"
          placeholder="https://x.com/..."
          value={getMetadataValue("xUrl")}
          onChange={(e) => updateMetadataField("xUrl", e.target.value)}
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
      case "documents":
        return renderDocumentFields()
      case "software":
        return renderSoftwareFields()
      case "nft":
        return renderNFTFields()
      case "photography":
        return renderPhotographyFields()
      case "posts":
        return renderPostsFields()
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
        </CardTitle>
      </CardHeader>
      <CardContent>{renderTemplateFields()}</CardContent>
    </Card>
  )
}
