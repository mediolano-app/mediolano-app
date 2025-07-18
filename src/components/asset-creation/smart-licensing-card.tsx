"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Shield, Settings, ChevronDown, ChevronUp, Info, Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SmartLicensingCardProps {
  formState: any
  onToggleAdvanced: () => void
  showAdvanced: boolean
}

const licenseOptions = [
  {
    id: "cc",
    name: "Creative Commons",
    description: "Open licensing for creative works",
    terms: "CC BY-NC-SA 4.0",
    color: "blue",
  },
  {
    id: "commercial",
    name: "Commercial License",
    description: "Full commercial rights included",
    terms: "Commercial Use Permitted",
    color: "green",
  },
  {
    id: "restricted",
    name: "Restricted License",
    description: "Limited usage rights",
    terms: "Personal Use Only",
    color: "orange",
  },
  {
    id: "custom",
    name: "Custom License",
    description: "Define your own terms",
    terms: "Custom Terms",
    color: "purple",
  },
]

export function SmartLicensingCard({ formState, onToggleAdvanced, showAdvanced }: SmartLicensingCardProps) {
  const selectedLicense = licenseOptions.find((license) => license.id === formState.licenseType) || licenseOptions[0]

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
              <Shield className="h-4 w-4 text-primary" />
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Smart Licensing</CardTitle>
              <p className="text-sm text-muted-foreground">Automated rights management</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onToggleAdvanced} className="bg-transparent">
            <Settings className="mr-2 h-4 w-4" />
            Advanced
            {showAdvanced ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* License Type Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">License Type</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {licenseOptions.map((license) => (
              <div
                key={license.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedLicense.id === license.id
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => {
                  // updateFormField("licenseType", license.id)
                  // updateFormField("licenseTerms", license.terms)
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{license.name}</h4>
                  <Badge variant={selectedLicense.id === license.id ? "default" : "outline"} className="text-xs">
                    {license.color}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{license.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Commercial Use */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Commercial Use</Label>
              <Switch
                checked={formState.allowCommercial}
                onCheckedChange={(checked) => {
                  // updateFormField("allowCommercial", checked)
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground">Allow others to use your asset for commercial purposes</p>
          </div>

          {/* Derivatives */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Allow Derivatives</Label>
              <Switch
                checked={formState.allowDerivatives}
                onCheckedChange={(checked) => {
                  // updateFormField("allowDerivatives", checked)
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground">Allow others to modify and build upon your work</p>
          </div>
        </div>

        {/* Royalty Settings */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Royalty Percentage</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">0%</span>
              <span className="font-medium">{formState.royaltyPercentage}%</span>
              <span className="text-sm text-muted-foreground">20%</span>
            </div>
            <Slider
              value={[formState.royaltyPercentage]}
              onValueChange={(value) => {
                // updateFormField("royaltyPercentage", value[0])
              }}
              min={0}
              max={20}
              step={0.5}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Percentage you'll receive from secondary sales and licensing
            </p>
          </div>
        </div>

        {/* Benefits Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Smart Licensing Benefits:</p>
              <ul className="text-sm space-y-1">
                <li>• Automated royalty distribution</li>
                <li>• Transparent usage tracking</li>
                <li>• Instant licensing approvals</li>
                <li>• Global rights management</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
