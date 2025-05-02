"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileCheck, AlertCircle, Info, ExternalLink } from "lucide-react"

interface AssetLicensingFormProps {
  formState: any
  updateFormField: (section: string, field: string, value: any) => void
}

export function AssetLicensingForm({ formState, updateFormField }: AssetLicensingFormProps) {
  const [activeTab, setActiveTab] = useState("standard")

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          Licensing Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard">Standard License</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>

          <TabsContent value="standard" className="mt-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="license-type">License Type</Label>
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
                    <SelectTrigger id="license-type">
                      <SelectValue placeholder="Select license type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(creativeLicenseTerms).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formState.licenseType === "cc" && (
                  <div className="space-y-2">
                    <Label htmlFor="cc-license">Creative Commons License</Label>
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
                      <SelectTrigger id="cc-license">
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
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>About {creativeLicenseTerms[formState.licenseType]}</AlertTitle>
                  <AlertDescription>
                    {formState.licenseType === "cc"
                      ? "Creative Commons licenses help creators share their work while maintaining copyright. Different CC licenses grant different permissions to users."
                      : formState.licenseType === "commercial"
                        ? "Commercial licenses allow others to use your work in commercial projects under specific terms and conditions that you define."
                        : formState.licenseType === "exclusive"
                          ? "Exclusive rights licenses grant unique rights to a single licensee, preventing the licensor from offering the same rights to others."
                          : "Custom licenses allow you to define your own terms and conditions for how others can use your intellectual property."}
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Usage Rights</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-commercial" className="cursor-pointer">
                      Allow Commercial Use
                    </Label>
                    <Switch
                      id="allow-commercial"
                      checked={formState.allowCommercial}
                      onCheckedChange={(checked) => updateFormField("licensing", "allowCommercial", checked)}
                      disabled={formState.licenseType === "cc" && formState.licenseTerms.includes("NC")}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Allow others to use your work for commercial purposes</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-derivatives" className="cursor-pointer">
                      Allow Derivative Works
                    </Label>
                    <Switch
                      id="allow-derivatives"
                      checked={formState.allowDerivatives}
                      onCheckedChange={(checked) => updateFormField("licensing", "allowDerivatives", checked)}
                      disabled={formState.licenseType === "cc" && formState.licenseTerms.includes("ND")}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow others to remix, transform, or build upon your work
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-attribution" className="cursor-pointer">
                      Require Attribution
                    </Label>
                    <Switch
                      id="require-attribution"
                      checked={formState.requireAttribution}
                      onCheckedChange={(checked) => updateFormField("licensing", "requireAttribution", checked)}
                      disabled={formState.licenseType === "cc"}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Require others to credit you when using your work</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="royalty-percentage">Royalty Percentage</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="royalty-percentage"
                      value={[formState.royaltyPercentage]}
                      onValueChange={(value) => updateFormField("licensing", "royaltyPercentage", value[0])}
                      max={30}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{formState.royaltyPercentage}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Percentage of revenue that will be paid to you when your work is used commercially
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Advanced Licensing Options</h3>

                <div className="space-y-2">
                  <Label htmlFor="license-duration">License Duration</Label>
                  <Select
                    defaultValue="perpetual"
                    onValueChange={(value) => updateFormField("licensing", "licenseDuration", value)}
                  >
                    <SelectTrigger id="license-duration">
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
                </div>

                <div className="space-y-2">
                  <Label>Geographical Restrictions</Label>
                  <RadioGroup defaultValue="worldwide">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="worldwide" id="worldwide" />
                      <Label htmlFor="worldwide">Worldwide (no restrictions)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="restricted" id="restricted" />
                      <Label htmlFor="restricted">Restricted by region</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Additional Terms</Label>
                  <Textarea
                    placeholder="Enter any additional terms or conditions for your license"
                    className="min-h-[100px]"
                    onChange={(e) => updateFormField("licensing", "additionalTerms", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Sub-licensing Rights</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allow-sublicensing"
                    onCheckedChange={(checked) => updateFormField("licensing", "allowSublicensing", checked)}
                  />
                  <Label htmlFor="allow-sublicensing">Allow Sub-licensing</Label>
                </div>
                <p className="text-sm text-muted-foreground">Allow the licensee to grant the same rights to others</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Termination Conditions</h3>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="breach-termination"
                      defaultChecked
                      onCheckedChange={(checked) => updateFormField("licensing", "breachTermination", checked)}
                    />
                    <Label htmlFor="breach-termination">Terminate on breach of terms</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notice-termination"
                      onCheckedChange={(checked) => updateFormField("licensing", "noticeTermination", checked)}
                    />
                    <Label htmlFor="notice-termination">Terminate with 30-day notice</Label>
                  </div>
                </div>
              </div>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  We recommend consulting with a legal professional before creating complex custom licenses with
                  advanced terms and conditions.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
