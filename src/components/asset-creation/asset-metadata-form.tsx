"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, X, Info, HelpCircle, Database } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AssetMetadataFormProps {
  formState: any
  updateFormField: (section: string, field: string, value: any) => void
  template?: {
    id: string
    name: string
    icon: string
    description: string
    color: string
  }
}

export function AssetMetadataForm({ formState, updateFormField, template }: AssetMetadataFormProps) {
  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string; type: string }>>([])
  const [newFieldKey, setNewFieldKey] = useState("")
  const [newFieldValue, setNewFieldValue] = useState("")
  const [newFieldType, setNewFieldType] = useState("text")
  const [showCustomFields, setShowCustomFields] = useState(false)

  const addCustomField = () => {
    if (newFieldKey && newFieldValue) {
      const newField = { key: newFieldKey, value: newFieldValue, type: newFieldType }
      const updatedFields = [...customFields, newField]
      setCustomFields(updatedFields)
      updateFormField("metadata", "customFields", updatedFields)
      setNewFieldKey("")
      setNewFieldValue("")
      setNewFieldType("text")
    }
  }

  const removeCustomField = (index: number) => {
    const updatedFields = customFields.filter((_, i) => i !== index)
    setCustomFields(updatedFields)
    updateFormField("metadata", "customFields", updatedFields)
  }

  // Template-specific fields based on the template type
  const getTemplateFields = () => {
    if (!template) return []

    switch (template.id) {
      case "audio":
        return [
          { key: "duration", label: "Duration", type: "text", placeholder: "e.g., 3:45" },
          {
            key: "genre",
            label: "Genre",
            type: "select",
            options: ["Pop", "Rock", "Jazz", "Classical", "Electronic", "Hip Hop", "Country", "Other"],
          },
          { key: "bpm", label: "BPM", type: "number", placeholder: "e.g., 120" },
          { key: "key", label: "Musical Key", type: "text", placeholder: "e.g., C Major" },
          { key: "instruments", label: "Instruments", type: "text", placeholder: "e.g., Guitar, Piano, Drums" },
          { key: "recordingDate", label: "Recording Date", type: "date" },
        ]
      case "art":
        return [
          {
            key: "medium",
            label: "Medium",
            type: "select",
            options: ["Digital", "Oil Paint", "Watercolor", "Acrylic", "Pencil", "Mixed Media", "Photography", "Other"],
          },
          { key: "dimensions", label: "Dimensions", type: "text", placeholder: "e.g., 1920x1080 or 24x36 inches" },
          {
            key: "style",
            label: "Art Style",
            type: "select",
            options: [
              "Abstract",
              "Realistic",
              "Impressionist",
              "Modern",
              "Contemporary",
              "Pop Art",
              "Minimalist",
              "Other",
            ],
          },
          { key: "colorPalette", label: "Color Palette", type: "text", placeholder: "e.g., Warm tones, Monochrome" },
          { key: "technique", label: "Technique", type: "text", placeholder: "e.g., Digital painting, Oil on canvas" },
          { key: "inspiration", label: "Inspiration", type: "textarea", placeholder: "What inspired this artwork?" },
        ]
      case "video":
        return [
          { key: "duration", label: "Duration", type: "text", placeholder: "e.g., 10:30" },
          { key: "resolution", label: "Resolution", type: "select", options: ["720p", "1080p", "4K", "8K", "Other"] },
          {
            key: "frameRate",
            label: "Frame Rate",
            type: "select",
            options: ["24fps", "30fps", "60fps", "120fps", "Other"],
          },
          {
            key: "genre",
            label: "Genre",
            type: "select",
            options: ["Documentary", "Animation", "Short Film", "Music Video", "Tutorial", "Commercial", "Other"],
          },
          { key: "language", label: "Language", type: "text", placeholder: "e.g., English, Spanish" },
          { key: "subtitles", label: "Subtitles Available", type: "checkbox" },
        ]
      case "software":
        return [
          { key: "version", label: "Version", type: "text", placeholder: "e.g., 1.0.0" },
          {
            key: "programmingLanguage",
            label: "Programming Language",
            type: "select",
            options: ["JavaScript", "Python", "Java", "C++", "C#", "Go", "Rust", "Swift", "Other"],
          },
          {
            key: "platform",
            label: "Platform",
            type: "select",
            options: ["Web", "Mobile", "Desktop", "Cross-platform", "Other"],
          },
          { key: "dependencies", label: "Dependencies", type: "textarea", placeholder: "List main dependencies" },
          {
            key: "minRequirements",
            label: "Minimum Requirements",
            type: "textarea",
            placeholder: "System requirements",
          },
          { key: "openSource", label: "Open Source", type: "checkbox" },
        ]
      case "documents":
        return [
          {
            key: "documentType",
            label: "Document Type",
            type: "select",
            options: ["Contract", "Agreement", "Manual", "Report", "Research Paper", "Legal Document", "Other"],
          },
          { key: "pageCount", label: "Page Count", type: "number", placeholder: "Number of pages" },
          { key: "language", label: "Language", type: "text", placeholder: "e.g., English" },
          { key: "format", label: "Format", type: "select", options: ["PDF", "DOC", "DOCX", "TXT", "HTML", "Other"] },
          { key: "wordCount", label: "Word Count", type: "number", placeholder: "Approximate word count" },
          { key: "confidential", label: "Confidential", type: "checkbox" },
        ]
      case "nft":
        return [
          {
            key: "blockchain",
            label: "Blockchain",
            type: "select",
            options: ["Starknet"],
          },
          {
            key: "tokenStandard",
            label: "Token Standard",
            type: "select",
            options: ["ERC-721", "ERC-1155", "SPL", "Other"],
          },
          { key: "mintDate", label: "Mint Date", type: "date" },
          { key: "totalSupply", label: "Total Supply", type: "number", placeholder: "e.g., 1 for unique NFT" },
          { key: "royaltyPercentage", label: "Royalty %", type: "number", placeholder: "e.g., 5" },
          {
            key: "rarity",
            label: "Rarity",
            type: "select",
            options: ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Unique"],
          },
        ]
      default:
        return []
    }
  }

  const templateFields = getTemplateFields()

  // General metadata fields that apply to all asset types
  const generalFields = [
    { key: "creator", label: "Creator/Author", type: "text", placeholder: "Creator or author name" },
    { key: "creationDate", label: "Creation Date", type: "date", placeholder: "" },
    { key: "location", label: "Location", type: "text", placeholder: "Where was this created?" },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        "Art & Design",
        "Music & Audio",
        "Video & Film",
        "Writing & Literature",
        "Software & Code",
        "Photography",
        "Other",
      ],
    },
    { key: "keywords", label: "Keywords", type: "text", placeholder: "Enter keywords separated by commas" },
    {
      key: "additionalNotes",
      label: "Additional Notes",
      type: "textarea",
      placeholder: "Any additional information about this asset...",
    },
  ]

  // Render a field based on its type
  const renderField = (field: any) => {
    const fieldValue = formState.metadataFields[field.key] || ""

    switch (field.type) {
      case "text":
        return (
          <Input
            id={field.key}
            placeholder={field.placeholder}
            value={fieldValue}
            onChange={(e) => updateFormField("metadata", `metadataFields.${field.key}`, e.target.value)}
            className="h-12 text-base"
          />
        )
      case "number":
        return (
          <Input
            id={field.key}
            type="number"
            placeholder={field.placeholder}
            value={fieldValue}
            onChange={(e) => updateFormField("metadata", `metadataFields.${field.key}`, e.target.value)}
            className="h-12 text-base"
          />
        )
      case "date":
        return (
          <Input
            id={field.key}
            type="date"
            value={fieldValue}
            onChange={(e) => updateFormField("metadata", `metadataFields.${field.key}`, e.target.value)}
            className="h-12 text-base"
          />
        )
      case "textarea":
        return (
          <Textarea
            id={field.key}
            placeholder={field.placeholder}
            value={fieldValue}
            onChange={(e) => updateFormField("metadata", `metadataFields.${field.key}`, e.target.value)}
            rows={3}
            className="resize-none text-base"
          />
        )
      case "select":
        return (
          <Select
            value={fieldValue}
            onValueChange={(value) => updateFormField("metadata", `metadataFields.${field.key}`, value)}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "checkbox":
        return (
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Checkbox
              id={field.key}
              checked={fieldValue || false}
              onCheckedChange={(checked) => updateFormField("metadata", `metadataFields.${field.key}`, checked)}
            />
            <Label htmlFor={field.key} className="text-base cursor-pointer">
              {field.label}
            </Label>
          </div>
        )
      default:
        return <Input placeholder={field.placeholder} className="h-12 text-base" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Asset Details</h2>
        <p className="text-muted-foreground">
          {template
            ? `Add ${template.name.toLowerCase()}-specific metadata to enhance your asset's discoverability and protection.`
            : "Add detailed metadata to enhance your asset's discoverability and protection."}
        </p>
      </div>

      {/* Template-Specific Fields */}
      {templateFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5" />
              {template?.name} Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {templateFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={field.key} className="text-base font-medium">
                      {field.label}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            {field.type === "select"
                              ? `Choose from available ${field.label.toLowerCase()} options`
                              : field.placeholder || `Enter ${field.label.toLowerCase()}`}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5" />
            General Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {generalFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key} className="text-base font-medium">
                  {field.label}
                </Label>
                {renderField(field)}
                {field.key === "keywords" && (
                  <p className="text-sm text-muted-foreground">Add relevant keywords to improve discoverability</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Custom Fields
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowCustomFields(!showCustomFields)}>
              {showCustomFields ? "Hide" : "Add Custom"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing custom fields */}
          {customFields.length > 0 && (
            <div className="space-y-3">
              {customFields.map((field, index) => (
                <div key={index} className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {field.type}
                      </Badge>
                      <span className="font-medium">{field.key}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{field.value}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeCustomField(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Separator />
            </div>
          )}

          {/* Add new custom field */}
          {showCustomFields && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fieldKey" className="text-base font-medium">
                    Field Name
                  </Label>
                  <Input
                    id="fieldKey"
                    placeholder="e.g., Edition Number"
                    value={newFieldKey}
                    onChange={(e) => setNewFieldKey(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fieldType" className="text-base font-medium">
                      Type
                    </Label>
                    <Select value={newFieldType} onValueChange={setNewFieldType}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fieldValue" className="text-base font-medium">
                      Value
                    </Label>
                    <Input
                      id="fieldValue"
                      placeholder="Enter value"
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                </div>
                <Button onClick={addCustomField} disabled={!newFieldKey || !newFieldValue} className="w-full" size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Field
                </Button>
              </div>
            </div>
          )}

          {customFields.length === 0 && !showCustomFields && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Add custom fields to include additional metadata specific to your asset. This can help with
                categorization, search, and providing more context about your intellectual property.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
