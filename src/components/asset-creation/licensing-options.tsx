"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Shield, Globe, FileText, CreativeCommons } from "lucide-react"

interface LicensingOptionsProps {
  formState: any
  updateFormField: (field: string, value: any) => void
}

const licenseTypes = [
  {
    id: "all-rights-reserved",
    name: "All Rights Reserved",
    description: "Full copyright protection. You retain all rights to your work.",
    icon: Shield,
    recommended: true,
  },
  {
    id: "cc-by",
    name: "Creative Commons BY",
    description: "Others can distribute, remix, and build upon your work, with attribution.",
    icon: CreativeCommons,
  },
  {
    id: "cc-by-sa",
    name: "Creative Commons BY-SA",
    description: "Others can remix and build upon your work with attribution and same license.",
    icon: CreativeCommons,
  },
  {
    id: "cc-by-nc",
    name: "Creative Commons BY-NC",
    description: "Others can use your work non-commercially with attribution.",
    icon: CreativeCommons,
  },
  {
    id: "custom",
    name: "Custom License",
    description: "Define your own licensing terms and conditions.",
    icon: FileText,
  },
]

const geographicScopes = [
  { value: "worldwide", label: "Worldwide" },
  { value: "us", label: "United States" },
  { value: "eu", label: "European Union" },
  { value: "uk", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
  { value: "other", label: "Other" },
]

export function LicensingOptions({ formState, updateFormField }: LicensingOptionsProps) {
  const selectedLicense = licenseTypes.find((license) => license.id === formState.licenseType) || licenseTypes[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Licensing & Protection
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Define how others can use your intellectual property and set geographic protection scope.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* License Type Selection */}
        <div className="space-y-4">
          <Label className="text-base font-medium">License Type</Label>
          <RadioGroup
            value={formState.licenseType || "all-rights-reserved"}
            onValueChange={(value) => updateFormField("licenseType", value)}
            className="space-y-3"
          >
            {licenseTypes.map((license) => {
              const IconComponent = license.icon
              return (
                <div key={license.id} className="flex items-start space-x-3">
                  <RadioGroupItem value={license.id} id={license.id} className="mt-1" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={license.id} className="font-medium cursor-pointer">
                        {license.name}
                      </Label>
                      {license.recommended && (
                        <Badge variant="secondary" className="text-xs">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{license.description}</p>
                  </div>
                  <IconComponent className="h-5 w-5 text-muted-foreground mt-0.5" />
                </div>
              )
            })}
          </RadioGroup>
        </div>

        {/* Custom License Terms */}
        {formState.licenseType === "custom" && (
          <div className="space-y-2">
            <Label htmlFor="customLicense" className="text-base font-medium">
              Custom License Terms
            </Label>
            <Textarea
              id="customLicense"
              placeholder="Define your custom licensing terms and conditions..."
              value={formState.customLicense || ""}
              onChange={(e) => updateFormField("customLicense", e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        )}

        {/* Geographic Scope */}
        <div className="space-y-2">
          <Label className="text-base font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Geographic Protection Scope
          </Label>
          <Select
            value={formState.geographicScope || "worldwide"}
            onValueChange={(value) => updateFormField("geographicScope", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select geographic scope" />
            </SelectTrigger>
            <SelectContent>
              {geographicScopes.map((scope) => (
                <SelectItem key={scope.value} value={scope.value}>
                  {scope.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Choose where your intellectual property rights will be protected and enforced.
          </p>
        </div>

        {/* License Summary */}
        <div className="p-4 bg-muted/30 rounded-lg border">
          <h4 className="font-medium mb-2">License Summary</h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Type:</span> {selectedLicense.name}
            </p>
            <p>
              <span className="font-medium">Scope:</span>{" "}
              {geographicScopes.find((s) => s.value === (formState.geographicScope || "worldwide"))?.label}
            </p>
            <p>
              <span className="font-medium">Protection:</span> Blockchain-verified ownership and timestamp
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
