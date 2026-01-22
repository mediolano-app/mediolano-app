import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LicenseTabProps {
  asset: {
    licenseInfo: {
      type: string
      terms: string
      allowCommercial: boolean
      allowDerivatives: boolean
      requireAttribution: boolean
      royaltyPercentage: number
    }
    attributes?: Array<{ trait_type: string; value: string }>
  }
}

export function LicenseTab({ asset }: LicenseTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl capitalize font-semibold">{asset.licenseInfo.type}</h2>
              <p className="text-muted-foreground">{asset.licenseInfo.terms}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-3">License Terms</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Badge
                    variant={asset.licenseInfo.allowCommercial ? "default" : "destructive"}
                    className="mr-2"
                  >
                    {asset.licenseInfo.allowCommercial ? "Allowed" : "Not Allowed"}
                  </Badge>
                  Commercial Use
                </li>
                <li className="flex items-center">
                  <Badge
                    variant={asset.licenseInfo.allowDerivatives ? "default" : "destructive"}
                    className="mr-2"
                  >
                    {asset.licenseInfo.allowDerivatives ? "Allowed" : "Not Allowed"}
                  </Badge>
                  Derivative Works
                </li>
                <li className="flex items-center">
                  <Badge
                    variant={asset.licenseInfo.requireAttribution ? "default" : "secondary"}
                    className="mr-2"
                  >
                    {asset.licenseInfo.requireAttribution ? "Required" : "Not Required"}
                  </Badge>
                  Attribution
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI & Data Mining Policy */}
      {asset.attributes?.some(attr => attr.trait_type === "AI & Data Mining Policy" && attr.value !== "Unspecified") && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-primary">🤖</span> AI & Data Mining Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="font-medium text-sm">
                {asset.attributes.find(attr => attr.trait_type === "AI & Data Mining Policy")?.value}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Specific terms regarding the use of this asset for Artificial Intelligence training and data mining.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extended Licensing Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Extended Licensing Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {asset.attributes?.map((attr) => {
              if (["License Duration", "Geographic Scope", "Grant-back Clause", "Field of Use"].includes(attr.trait_type)) {
                if (!attr.value || attr.value === "None" || attr.value === "Unspecified" || attr.value === "Unrestricted") return null;
                return (
                  <div key={attr.trait_type} className="space-y-1">
                    <h4 className="font-medium text-sm text-muted-foreground">{attr.trait_type}</h4>
                    <p className="font-medium">{attr.value}</p>
                  </div>
                )
              }
              return null;
            })}
            {/* Fallback if no extended attributes found */}
            {(!asset.attributes?.some(attr => ["License Duration", "Geographic Scope", "Grant-back Clause", "Field of Use"].includes(attr.trait_type) && attr.value && attr.value !== "None" && attr.value !== "Unspecified" && attr.value !== "Unrestricted")) && (
              <div className="col-span-2 text-sm text-muted-foreground italic">
                No extended licensing terms specified. Standard terms apply.
              </div>
            )}
          </div>
        </CardContent>
      </Card>


      {/* Will be replaced by REMIX component 
      <Card>
        <CardHeader>
          <CardTitle>Create New License</CardTitle>
          <CardDescription>Customize a license agreement for this digital asset</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="license-type">License Type</Label>
                <Select defaultValue="custom">
                  <SelectTrigger id="license-type">
                    <SelectValue placeholder="Select license type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cc">Creative Commons</SelectItem>
                    <SelectItem value="commercial">Commercial License</SelectItem>
                    <SelectItem value="exclusive">Exclusive Rights</SelectItem>
                    <SelectItem value="custom">Custom License</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">License Duration</Label>
                <Select defaultValue="1year">
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="perpetual">Perpetual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Usage Rights</Label>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="commercial-use" />
                  <Label htmlFor="commercial-use" className="font-normal">
                    Commercial Use
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="derivatives" />
                  <Label htmlFor="derivatives" className="font-normal">
                    Create Derivatives
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="distribution" />
                  <Label htmlFor="distribution" className="font-normal">
                    Distribution Rights
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sublicense" />
                  <Label htmlFor="sublicense" className="font-normal">
                    Sublicense Rights
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="territory">Territory</Label>
              <RadioGroup defaultValue="worldwide" className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="worldwide" id="worldwide" />
                  <Label htmlFor="worldwide" className="font-normal">
                    Worldwide
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regional" id="regional" />
                  <Label htmlFor="regional" className="font-normal">
                    Regional
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="royalty">Royalty Percentage</Label>
              <div className="flex items-center space-x-4">
                <Input id="royalty" type="number" placeholder="5" min="0" max="100" className="w-24" />
                <span>%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Percentage of revenue that will be paid to the author
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">Additional Terms</Label>
              <Textarea
                id="terms"
                placeholder="Enter any additional terms or conditions for this license"
                className="min-h-[100px]"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Preview License</Button>
          <Button>Create License</Button>
        </CardFooter>
      </Card>
      */}



    </div>
  )
} 