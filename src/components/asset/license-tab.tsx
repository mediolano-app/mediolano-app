import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
              AI & Data Mining Policy
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
                No extended licensing terms specified.
              </div>
            )}
          </div>
        </CardContent>
      </Card>



    </div>
  )
} 