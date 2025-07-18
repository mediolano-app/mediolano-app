"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Info, ExternalLink, Shield, Clock, DollarSign, Users, Settings } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface AssetLicensingFormProps {
  formState: any
  updateFormField: (section: string, field: string, value: any) => void
}

export function AssetLicensingForm({ formState, updateFormField }: AssetLicensingFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const creativeLicenseTerms = {
    cc: "Creative Commons",
    commercial: "Commercial License",
    exclusive: "Exclusive Rights",
    custom: "Custom License",
  }

  const ccTypes = {
    "CC BY": "Attribution",
    "CC BY-SA": "Attribution-ShareAlike",
    "CC BY-ND": "Attribution-NoDerivs",
    "CC BY-NC": "Attribution-NonCommercial",
    "CC BY-NC-SA": "Attribution-NonCommercial-ShareAlike",
    "CC BY-NC-ND": "Attribution-NonCommercial-NoDerivs",
  }

  const licenseDescriptions = {
    cc: "Creative Commons licenses help creators share their work while maintaining copyright. Different CC licenses grant different permissions to users.",
    commercial:
      "Commercial licenses allow others to use your work in commercial projects under specific terms and conditions that you define.",
    exclusive:
      "Exclusive rights licenses grant unique rights to a single licensee, preventing the licensor from offering the same rights to others.",
    custom:
      "Custom licenses allow you to define your own terms and conditions for how others can use your intellectual property.",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Licensing & Rights</h2>
        <p className="text-muted-foreground">
          Define how others can use your intellectual property and set up royalty structures to protect your rights.
        </p>
      </div>

      {/* License Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            License Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="license-type" className="text-base font-medium">
                Choose License Type
              </Label>
              <Select
                value={formState.licenseType || "cc"}
                onValueChange={(value) => {
                  updateFormField("licensing", "licenseType", value)
                  // Update default terms based on license type
                  if (value === "cc") {
                    updateFormField("licensing", "licenseTerms", "CC BY-NC-SA 4.0")
                  } else if (value === "commercial") {
                    updateFormField("licensing", "licenseTerms", "Standard Commercial License")
                  } else if (value === "exclusive") {
                    updateFormField("licensing", "licenseTerms", "Exclusive Rights License")
                  } else {
                    updateFormField("licensing", "licenseTerms", "Custom License")
                  }
                }}
              >
                <SelectTrigger id="license-type" className="h-12 text-base">
                  <SelectValue placeholder="Select license type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(creativeLicenseTerms).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{value}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {licenseDescriptions[formState.licenseType as keyof typeof licenseDescriptions] ||
                  licenseDescriptions.cc}
              </p>
            </div>

            {formState.licenseType === "cc" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cc-license" className="text-base font-medium">
                    Creative Commons License
                  </Label>
                  <Select
                    value={formState.licenseTerms}
                    onValueChange={(value) => {
                      updateFormField("licensing", "licenseTerms", value)

                      // Update other fields based on CC license
                      if (value.includes("NC")) {
                        updateFormField("licensing", "allowCommercial", false)
                      } else {
                        updateFormField("licensing", "allowCommercial", true)
                      }

                      if (value.includes("ND")) {
                        updateFormField("licensing", "allowDerivatives", false)
                      } else {
                        updateFormField("licensing", "allowDerivatives", true)
                      }
                    }}
                  >
                    <SelectTrigger id="cc-license" className="h-12 text-base">
                      <SelectValue placeholder="Select CC license" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ccTypes).map(([key, value]) => (
                        <SelectItem key={key} value={`${key} 4.0`}>
                          {value} (4.0)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center justify-between pt-2">
                    <Label className="text-sm" htmlFor="learn-more">
                      Learn more about Creative Commons
                    </Label>
                    <Button variant="link" size="sm" id="learn-more" className="h-auto p-0">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Visit creativecommons.org
                    </Button>
                  </div>
                </div>

                {/* CC License Visual Indicators */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Attribution Required</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        formState.licenseTerms?.includes("NC") ? "bg-red-500" : "bg-green-500"
                      }`}
                    ></div>
                    <span className="text-sm font-medium">
                      Commercial Use {formState.licenseTerms?.includes("NC") ? "Prohibited" : "Allowed"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        formState.licenseTerms?.includes("ND") ? "bg-red-500" : "bg-green-500"
                      }`}
                    ></div>
                    <span className="text-sm font-medium">
                      Derivatives {formState.licenseTerms?.includes("ND") ? "Prohibited" : "Allowed"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        formState.licenseTerms?.includes("SA") ? "bg-blue-500" : "bg-gray-500"
                      }`}
                    ></div>
                    <span className="text-sm font-medium">
                      Share-Alike {formState.licenseTerms?.includes("SA") ? "Required" : "Not Required"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Usage Rights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-muted/30">
              <div className="space-y-1">
                <Label htmlFor="allow-commercial" className="cursor-pointer font-medium text-base">
                  Allow Commercial Use
                </Label>
                <p className="text-sm text-muted-foreground">Allow others to use your work for commercial purposes</p>
              </div>
              <Switch
                id="allow-commercial"
                checked={formState.allowCommercial}
                onCheckedChange={(checked) => updateFormField("licensing", "allowCommercial", checked)}
                disabled={formState.licenseType === "cc" && formState.licenseTerms?.includes("NC")}
                className="shrink-0"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-muted/30">
              <div className="space-y-1">
                <Label htmlFor="allow-derivatives" className="cursor-pointer font-medium text-base">
                  Allow Derivative Works
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to remix, transform, or build upon your work
                </p>
              </div>
              <Switch
                id="allow-derivatives"
                checked={formState.allowDerivatives}
                onCheckedChange={(checked) => updateFormField("licensing", "allowDerivatives", checked)}
                disabled={formState.licenseType === "cc" && formState.licenseTerms?.includes("ND")}
                className="shrink-0"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-muted/30">
              <div className="space-y-1">
                <Label htmlFor="require-attribution" className="cursor-pointer font-medium text-base">
                  Require Attribution
                </Label>
                <p className="text-sm text-muted-foreground">Require others to credit you when using your work</p>
              </div>
              <Switch
                id="require-attribution"
                checked={formState.requireAttribution}
                onCheckedChange={(checked) => updateFormField("licensing", "requireAttribution", checked)}
                disabled={formState.licenseType === "cc"}
                className="shrink-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Royalty Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5" />
            Royalty Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="royalty-percentage" className="text-base font-medium">
                  Royalty Percentage
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        Percentage of revenue that will be paid to you when your work is used commercially
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Slider
                    id="royalty-percentage"
                    value={[formState.royaltyPercentage || 5]}
                    onValueChange={(value) => updateFormField("licensing", "royaltyPercentage", value[0])}
                    max={30}
                    step={1}
                    className="flex-1"
                  />
                  <div className="w-16 text-center">
                    <Badge variant="outline" className="text-base font-semibold px-3 py-1">
                      {formState.royaltyPercentage || 5}%
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Percentage of revenue that will be paid to you when your work is used commercially
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced Options
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? "Hide Advanced" : "Show Advanced"}
            </Button>
          </CardTitle>
        </CardHeader>
        {showAdvanced && (
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="license-duration" className="text-base font-medium">
                  License Duration
                </Label>
                <Select
                  value={formState.licenseDuration || "perpetual"}
                  onValueChange={(value) => updateFormField("licensing", "licenseDuration", value)}
                >
                  <SelectTrigger id="license-duration" className="h-12 text-base">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="5years">5 Years</SelectItem>
                    <SelectItem value="perpetual">Perpetual</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {formState.licenseDuration === "perpetual"
                      ? "License will not expire"
                      : `License will expire after ${
                          formState.licenseDuration === "30days"
                            ? "30 days"
                            : formState.licenseDuration === "6months"
                              ? "6 months"
                              : formState.licenseDuration === "1year"
                                ? "1 year"
                                : "5 years"
                        }`}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">Geographical Restrictions</Label>
                <RadioGroup
                  value={formState.geoRestriction || "worldwide"}
                  onValueChange={(value) => updateFormField("licensing", "geoRestriction", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="worldwide" id="worldwide" />
                    <Label htmlFor="worldwide" className="cursor-pointer text-base">
                      Worldwide (no restrictions)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="restricted" id="restricted" />
                    <Label htmlFor="restricted" className="cursor-pointer text-base">
                      Restricted by region
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-base font-medium">Additional Terms</Label>
                <Textarea
                  placeholder="Enter any additional terms or conditions for your license"
                  className="min-h-[100px] text-base resize-none"
                  value={formState.additionalTerms || ""}
                  onChange={(e) => updateFormField("licensing", "additionalTerms", e.target.value)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-base font-medium">Sub-licensing & Termination</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id="allow-sublicensing"
                      checked={formState.allowSublicensing || false}
                      onCheckedChange={(checked) => updateFormField("licensing", "allowSublicensing", checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="allow-sublicensing" className="cursor-pointer text-base font-medium">
                        Allow Sub-licensing
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow the licensee to grant the same rights to others
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id="breach-termination"
                      checked={formState.breachTermination !== false}
                      onCheckedChange={(checked) => updateFormField("licensing", "breachTermination", checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="breach-termination" className="cursor-pointer text-base font-medium">
                        Terminate on breach of terms
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically terminate license if terms are violated
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id="notice-termination"
                      checked={formState.noticeTermination || false}
                      onCheckedChange={(checked) => updateFormField("licensing", "noticeTermination", checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="notice-termination" className="cursor-pointer text-base font-medium">
                        Terminate with 30-day notice
                      </Label>
                      <p className="text-sm text-muted-foreground">Allow termination with advance notice</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Legal Notice */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Legal Notice</AlertTitle>
        <AlertDescription>
          We recommend consulting with a legal professional before creating complex custom licenses with advanced terms
          and conditions. This tool provides guidance but does not constitute legal advice.
        </AlertDescription>
      </Alert>
    </div>
  )
}
