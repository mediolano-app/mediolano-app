"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Database, Info, Layers, Clock, Plus, X } from "lucide-react"

interface AssetMetadataFormProps {
  formState: any
  updateFormField: (section: string, field: string, value: any) => void
  template: { id: string; name: string; icon: string; color: string }
}

export function AssetMetadataForm({ formState, updateFormField, template }: AssetMetadataFormProps) {
  const [activeTab, setActiveTab] = useState("standard")
  const [customField, setCustomField] = useState({ name: "", value: "" })
  const [customFields, setCustomFields] = useState<{ name: string; value: string }[]>([])

  const addCustomField = () => {
    if (customField.name && customField.value) {
      const newFields = [...customFields, { ...customField }]
      setCustomFields(newFields)
      setCustomField({ name: "", value: "" })

      // Update the main form state with the custom fields
      const updatedMetadataFields = { ...formState.metadataFields }
      updatedMetadataFields[customField.name] = customField.value
      updateFormField("metadata", "customFields", updatedMetadataFields)
    }
  }

  const removeCustomField = (fieldName: string) => {
    const newFields = customFields.filter((field) => field.name !== fieldName)
    setCustomFields(newFields)

    // Also remove from the form state
    const updatedMetadataFields = { ...formState.metadataFields }
    delete updatedMetadataFields[fieldName]
    updateFormField("metadata", "customFields", updatedMetadataFields)
  }

  // Render appropriate form fields based on template type
  const renderTemplateFields = () => {
    switch (template.id) {
      case "audio":
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="duration"
                    value={formState.metadataFields.duration}
                    onChange={(e) => updateFormField("metadata", "duration", e.target.value)}
                    placeholder="3:45"
                  />
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Select
                  value={formState.metadataFields.genre || ""}
                  onValueChange={(value) => updateFormField("metadata", "genre", value)}
                >
                  <SelectTrigger id="genre">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronic">Electronic</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="jazz">Jazz</SelectItem>
                    <SelectItem value="classical">Classical</SelectItem>
                    <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                    <SelectItem value="ambient">Ambient</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bpm">BPM</Label>
                <Input
                  id="bpm"
                  type="number"
                  value={formState.metadataFields.bpm}
                  onChange={(e) => updateFormField("metadata", "bpm", e.target.value)}
                  placeholder="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="key">Musical Key</Label>
                <Select
                  value={formState.metadataFields.key || ""}
                  onValueChange={(value) => updateFormField("metadata", "key", value)}
                >
                  <SelectTrigger id="key">
                    <SelectValue placeholder="Select key" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c-major">C Major</SelectItem>
                    <SelectItem value="c-minor">C Minor</SelectItem>
                    <SelectItem value="d-major">D Major</SelectItem>
                    <SelectItem value="d-minor">D Minor</SelectItem>
                    <SelectItem value="e-major">E Major</SelectItem>
                    <SelectItem value="e-minor">E Minor</SelectItem>
                    <SelectItem value="f-major">F Major</SelectItem>
                    <SelectItem value="f-minor">F Minor</SelectItem>
                    <SelectItem value="g-major">G Major</SelectItem>
                    <SelectItem value="g-minor">G Minor</SelectItem>
                    <SelectItem value="a-major">A Major</SelectItem>
                    <SelectItem value="a-minor">A Minor</SelectItem>
                    <SelectItem value="b-major">B Major</SelectItem>
                    <SelectItem value="b-minor">B Minor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="audioFormat">Audio Format</Label>
                  <Select
                    value={formState.metadataFields.audioFormat || "WAV"}
                    onValueChange={(value) => updateFormField("metadata", "audioFormat", value)}
                  >
                    <SelectTrigger id="audioFormat">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WAV">WAV</SelectItem>
                      <SelectItem value="MP3">MP3</SelectItem>
                      <SelectItem value="FLAC">FLAC</SelectItem>
                      <SelectItem value="AAC">AAC</SelectItem>
                      <SelectItem value="OGG">OGG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sampleRate">Sample Rate</Label>
                  <Select
                    value={formState.metadataFields.sampleRate || "48kHz"}
                    onValueChange={(value) => updateFormField("metadata", "sampleRate", value)}
                  >
                    <SelectTrigger id="sampleRate">
                      <SelectValue placeholder="Select sample rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="44.1kHz">44.1kHz</SelectItem>
                      <SelectItem value="48kHz">48kHz</SelectItem>
                      <SelectItem value="96kHz">96kHz</SelectItem>
                      <SelectItem value="192kHz">192kHz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="composer">Composer</Label>
                  <Input
                    id="composer"
                    value={formState.metadataFields.composer}
                    onChange={(e) => updateFormField("metadata", "composer", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    value={formState.metadataFields.publisher}
                    onChange={(e) => updateFormField("metadata", "publisher", e.target.value)}
                    placeholder="Music Publishing Co."
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case "art":
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medium">Medium</Label>
                <Select
                  value={formState.metadataFields.medium || "Digital"}
                  onValueChange={(value) => updateFormField("metadata", "medium", value)}
                >
                  <SelectTrigger id="medium">
                    <SelectValue placeholder="Select medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Digital">Digital</SelectItem>
                    <SelectItem value="Oil">Oil</SelectItem>
                    <SelectItem value="Acrylic">Acrylic</SelectItem>
                    <SelectItem value="Watercolor">Watercolor</SelectItem>
                    <SelectItem value="Mixed Media">Mixed Media</SelectItem>
                    <SelectItem value="Photography">Photography</SelectItem>
                    <SelectItem value="Sculpture">Sculpture</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formState.metadataFields.dimensions}
                  onChange={(e) => updateFormField("metadata", "dimensions", e.target.value)}
                  placeholder="3000x2000 px or 24x36 inches"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select
                  value={formState.metadataFields.style || ""}
                  onValueChange={(value) => updateFormField("metadata", "style", value)}
                >
                  <SelectTrigger id="style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Abstract">Abstract</SelectItem>
                    <SelectItem value="Realistic">Realistic</SelectItem>
                    <SelectItem value="Impressionist">Impressionist</SelectItem>
                    <SelectItem value="Expressionist">Expressionist</SelectItem>
                    <SelectItem value="Minimalist">Minimalist</SelectItem>
                    <SelectItem value="Surrealist">Surrealist</SelectItem>
                    <SelectItem value="Pop Art">Pop Art</SelectItem>
                    <SelectItem value="Digital Art">Digital Art</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creationDate">Creation Date</Label>
                <Input
                  id="creationDate"
                  type="date"
                  value={formState.metadataFields.creationDate}
                  onChange={(e) => updateFormField("metadata", "creationDate", e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="technique">Technique</Label>
                <Input
                  id="technique"
                  value={formState.metadataFields.technique}
                  onChange={(e) => updateFormField("metadata", "technique", e.target.value)}
                  placeholder="Digital Painting, Oil on Canvas, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="software">Software Used (if digital)</Label>
                <Input
                  id="software"
                  value={formState.metadataFields.software}
                  onChange={(e) => updateFormField("metadata", "software", e.target.value)}
                  placeholder="Adobe Photoshop, Procreate, etc."
                />
              </div>
            </div>
          </div>
        )

      case "nft":
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blockchain">Blockchain</Label>
                <Select
                  value={formState.metadataFields.blockchain || "Ethereum"}
                  onValueChange={(value) => updateFormField("metadata", "blockchain", value)}
                >
                  <SelectTrigger id="blockchain">
                    <SelectValue placeholder="Select blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ethereum">Ethereum</SelectItem>
                    <SelectItem value="Polygon">Polygon</SelectItem>
                    <SelectItem value="Solana">Solana</SelectItem>
                    <SelectItem value="Binance">Binance Smart Chain</SelectItem>
                    <SelectItem value="Flow">Flow</SelectItem>
                    <SelectItem value="Tezos">Tezos</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenStandard">Token Standard</Label>
                <Select
                  value={formState.metadataFields.tokenStandard || "ERC-721"}
                  onValueChange={(value) => updateFormField("metadata", "tokenStandard", value)}
                >
                  <SelectTrigger id="tokenStandard">
                    <SelectValue placeholder="Select token standard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ERC-721">ERC-721</SelectItem>
                    <SelectItem value="ERC-1155">ERC-1155</SelectItem>
                    <SelectItem value="SPL">SPL (Solana)</SelectItem>
                    <SelectItem value="BEP-721">BEP-721</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractAddress">Contract Address (optional)</Label>
                <Input
                  id="contractAddress"
                  value={formState.metadataFields.contractAddress}
                  onChange={(e) => updateFormField("metadata", "contractAddress", e.target.value)}
                  placeholder="0x..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenId">Token ID (optional)</Label>
                <Input
                  id="tokenId"
                  value={formState.metadataFields.tokenId}
                  onChange={(e) => updateFormField("metadata", "tokenId", e.target.value)}
                  placeholder="Token ID if known"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rarity">Rarity</Label>
                  <Select
                    value={formState.metadataFields.rarity || "Common"}
                    onValueChange={(value) => updateFormField("metadata", "rarity", value)}
                  >
                    <SelectTrigger id="rarity">
                      <SelectValue placeholder="Select rarity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Common">Common</SelectItem>
                      <SelectItem value="Uncommon">Uncommon</SelectItem>
                      <SelectItem value="Rare">Rare</SelectItem>
                      <SelectItem value="Epic">Epic</SelectItem>
                      <SelectItem value="Legendary">Legendary</SelectItem>
                      <SelectItem value="Unique">Unique (1 of 1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editions">Editions</Label>
                  <Input
                    id="editions"
                    type="number"
                    value={formState.metadataFields.editions}
                    onChange={(e) => updateFormField("metadata", "editions", e.target.value)}
                    placeholder="Number of editions"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mintDate">Mint Date (optional)</Label>
                <Input
                  id="mintDate"
                  type="date"
                  value={formState.metadataFields.mintDate}
                  onChange={(e) => updateFormField("metadata", "mintDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case "video":
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="duration"
                    value={formState.metadataFields.duration}
                    onChange={(e) => updateFormField("metadata", "duration", e.target.value)}
                    placeholder="12:34"
                  />
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution</Label>
                <Select
                  value={formState.metadataFields.resolution || "1080p"}
                  onValueChange={(value) => updateFormField("metadata", "resolution", value)}
                >
                  <SelectTrigger id="resolution">
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720p">720p (HD)</SelectItem>
                    <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                    <SelectItem value="1440p">1440p (QHD)</SelectItem>
                    <SelectItem value="4K">4K (Ultra HD)</SelectItem>
                    <SelectItem value="8K">8K</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frameRate">Frame Rate</Label>
                <Select
                  value={formState.metadataFields.frameRate || "30 fps"}
                  onValueChange={(value) => updateFormField("metadata", "frameRate", value)}
                >
                  <SelectTrigger id="frameRate">
                    <SelectValue placeholder="Select frame rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24 fps">24 fps (Film)</SelectItem>
                    <SelectItem value="25 fps">25 fps (PAL)</SelectItem>
                    <SelectItem value="30 fps">30 fps</SelectItem>
                    <SelectItem value="60 fps">60 fps</SelectItem>
                    <SelectItem value="120 fps">120 fps</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="codec">Codec</Label>
                <Select
                  value={formState.metadataFields.codec || "H.264"}
                  onValueChange={(value) => updateFormField("metadata", "codec", value)}
                >
                  <SelectTrigger id="codec">
                    <SelectValue placeholder="Select codec" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="H.264">H.264/AVC</SelectItem>
                    <SelectItem value="H.265">H.265/HEVC</SelectItem>
                    <SelectItem value="ProRes">ProRes</SelectItem>
                    <SelectItem value="VP9">VP9</SelectItem>
                    <SelectItem value="AV1">AV1</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="director">Director</Label>
                  <Input
                    id="director"
                    value={formState.metadataFields.director}
                    onChange={(e) => updateFormField("metadata", "director", e.target.value)}
                    placeholder="Director name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="releaseDate">Release Date</Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={formState.metadataFields.releaseDate}
                    onChange={(e) => updateFormField("metadata", "releaseDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={formState.metadataFields.language}
                    onChange={(e) => updateFormField("metadata", "language", e.target.value)}
                    placeholder="English"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Standard Metadata</AlertTitle>
              <AlertDescription>
                Enter basic metadata for your {template.name} asset. Add additional custom fields below as needed.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Input
                id="format"
                value={formState.metadataFields.format}
                onChange={(e) => updateFormField("metadata", "format", e.target.value)}
                placeholder="File format (PDF, JPG, etc.)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creationDate">Creation Date</Label>
              <Input
                id="creationDate"
                type="date"
                value={formState.metadataFields.creationDate}
                onChange={(e) => updateFormField("metadata", "creationDate", e.target.value)}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Template Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard">Standard Fields</TabsTrigger>
            <TabsTrigger value="custom">Custom Fields</TabsTrigger>
          </TabsList>

          <TabsContent value="standard" className="mt-4">
            {renderTemplateFields()}
          </TabsContent>

          <TabsContent value="custom" className="mt-4">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-field-name">Field Name</Label>
                  <Input
                    id="custom-field-name"
                    value={customField.name}
                    onChange={(e) => setCustomField({ ...customField, name: e.target.value })}
                    placeholder="Field name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-field-value">Field Value</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-field-value"
                      value={customField.value}
                      onChange={(e) => setCustomField({ ...customField, value: e.target.value })}
                      placeholder="Field value"
                    />
                    <Button onClick={addCustomField} className="shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {customFields.length > 0 ? (
                <div className="border rounded-md p-4 space-y-2">
                  <h4 className="text-sm font-medium">Added Custom Fields</h4>
                  <div className="space-y-2">
                    {customFields.map((field, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{field.name}</p>
                          <p className="text-sm text-muted-foreground">{field.value}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeCustomField(field.name)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 border border-dashed rounded-md">
                  <Layers className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h4 className="font-medium">No Custom Fields Added</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add custom fields to include additional metadata for your asset
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
