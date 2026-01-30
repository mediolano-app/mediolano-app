"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Shield, Globe, FileText, CreativeCommons } from "lucide-react"
import { Input } from "@/components/ui/input"

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
    recommended: false,
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
        <div className="space-y-2">
          <Label className="text-base font-medium">License Type</Label>
          <Select
            value={formState.licenseType || "all-rights-reserved"}
            onValueChange={(value) => updateFormField("licenseType", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select license type" />
            </SelectTrigger>
            <SelectContent>
              {licenseTypes.map((license) => {
                const IconComponent = license.icon
                return (
                  <SelectItem key={license.id} value={license.id} className="py-3">
                    <div className="flex items-center gap-2 text-left">
                      <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium flex items-center gap-2">
                          {license.name}
                          {license.recommended && (
                            <Badge variant="secondary" className="text-[10px] h-4 px-1">
                              Recommended
                            </Badge>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {license.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground mt-2 p-3 bg-muted/30 rounded-md border flex gap-3 items-start">
            <selectedLicense.icon className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <p className="font-medium text-foreground">{selectedLicense.name}</p>
              <p>{selectedLicense.description}</p>
            </div>
          </div>
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
        <div className="space-y-2 pt-2 border-t mt-6">
          <Label className="text-base font-medium flex items-center gap-2 pt-4">
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

          {/* Specific Territory (if restricted or custom) */}
          {(formState.geographicScope === "other" || formState.geographicScope === "custom" || formState.geographicScope === "eu") && (
            <div className="mt-2">
              <Label htmlFor="territory" className="text-sm font-medium">Specific Territory</Label>
              <Input
                id="territory"
                placeholder="e.g. Germany, France, Japan..."
                value={formState.territory || ""}
                onChange={(e) => updateFormField("territory", e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </div>

        {/* Field of Use */}
        <div className="space-y-2">
          <Label htmlFor="fieldOfUse" className="text-base font-medium">Field of Use</Label>
          <Textarea
            id="fieldOfUse"
            placeholder="Specify industries or applications (e.g. Medical devices, Education, Non-profit use only)..."
            value={formState.fieldOfUse || ""}
            onChange={(e) => updateFormField("fieldOfUse", e.target.value)}
            className="resize-none"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="licenseDuration" className="text-base font-medium">License Duration</Label>
          <Input
            id="licenseDuration"
            placeholder="e.g. Perpetual, 5 years, until 2030..."
            value={formState.licenseDuration || ""}
            onChange={(e) => updateFormField("licenseDuration", e.target.value)}
          />
        </div>

        {/* Advanced Clauses & AI */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium text-base">Advanced Clauses</h4>

          <div className="space-y-2">
            <Label htmlFor="grantBack" className="text-base font-medium">Grant-back Clause</Label>
            <Input
              id="grantBack"
              placeholder="e.g. Licensee must grant back rights to improvements..."
              value={formState.grantBack || ""}
              onChange={(e) => updateFormField("grantBack", e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Specify conditions for improvements made to the IP.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="aiRights" className="text-base font-medium">AI & Data Mining Policy</Label>
            <Input
              id="aiRights"
              placeholder="e.g. No AI Training allowed, Zero Retention required..."
              value={formState.aiRights || ""}
              onChange={(e) => updateFormField("aiRights", e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Define rights regarding Artificial Intelligence training and data usage.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
