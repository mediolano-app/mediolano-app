"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Settings, Globe, Shield, Clock } from "lucide-react"

interface AdvancedLicensingSectionProps {
  formState: any
  updateFormField: (field: string, value: any) => void
}

/* ✅ exported name now matches what other modules expect */
export function AdvancedLicensingSection({ formState, updateFormField }: AdvancedLicensingSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          Advanced Licensing Options
          <Badge variant="outline" className="text-xs">
            Optional
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Duration & geography */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* License Duration */}
          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              License Duration
            </Label>
            <Select
              value={formState.licenseDuration}
              onValueChange={(value) => updateFormField("licenseDuration", value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="perpetual">Perpetual</SelectItem>
                <SelectItem value="1year">1&nbsp;Year</SelectItem>
                <SelectItem value="5years">5&nbsp;Years</SelectItem>
                <SelectItem value="10years">10&nbsp;Years</SelectItem>
                <SelectItem value="custom">Custom Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Geographic Scope */}
          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Geographic Scope
            </Label>
            <Select
              value={formState.geoRestriction}
              onValueChange={(value) => updateFormField("geoRestriction", value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="worldwide">Worldwide</SelectItem>
                <SelectItem value="north-america">North&nbsp;America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="custom">Custom Regions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Switch-based options */}
        <div className="space-y-4">
          {[
            {
              field: "allowSublicensing",
              label: "Allow Sublicensing",
              description: "Permit licensees to grant rights to others",
              icon: Shield,
            },
            {
              field: "breachTermination",
              label: "Breach Termination",
              description: "Auto-terminate on license violations",
              icon: Shield,
            },
            {
              field: "noticeTermination",
              label: "Notice Termination",
              description: "Allow termination with advance notice",
              icon: Shield,
            },
          ].map(({ field, label, description, icon: Icon }) => (
            <div key={field} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </Label>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <Switch checked={formState[field]} onCheckedChange={(checked) => updateFormField(field, checked)} />
            </div>
          ))}
        </div>

        {/* Additional Terms */}
        <div className="space-y-2">
          <Label className="text-base font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Additional Terms &amp; Conditions
          </Label>
          <Textarea
            placeholder="Add any additional licensing terms, restrictions, or requirements..."
            value={formState.additionalTerms}
            onChange={(e) => updateFormField("additionalTerms", e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  )
}
