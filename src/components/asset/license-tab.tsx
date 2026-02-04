import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info, Shield, Check, X, Globe, Lock, BrainCircuit } from "lucide-react"
import { licenseTypes, geographicScopes } from "@/types/asset"

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
  // Find the matching license definition
  const licenseDef = licenseTypes.find(l => l.id === asset.licenseInfo.type) ||
    licenseTypes.find(l => l.name === asset.licenseInfo.type) // Fallback for legacy names

  const Icon = licenseDef?.icon || Shield

  return (
    <div className="space-y-6">
      {/* Main License Card */}
      <Card className="glass overflow-hidden border-primary/20">
        <div className="bg-primary/5 p-6 border-b border-primary/10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-background rounded-xl shadow-sm border">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">{licenseDef?.name || asset.licenseInfo.terms}</h2>
                {licenseDef?.recommended && (
                  <Badge variant="secondary" className="text-[10px] h-5">Verified</Badge>
                )}
              </div>
              <p className="text-muted-foreground text-lg">
                {licenseDef?.description || asset.licenseInfo.terms}
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border">
              <div className={`mt-0.5 p-1 rounded-full ${asset.licenseInfo.allowCommercial ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                {asset.licenseInfo.allowCommercial ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </div>
              <div>
                <span className="font-semibold block mb-0.5">Commercial Use</span>
                <span className="text-sm text-muted-foreground">
                  {asset.licenseInfo.allowCommercial
                    ? "You can use this work for commercial purposes."
                    : "Non-commercial use only."}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border">
              <div className={`mt-0.5 p-1 rounded-full ${asset.licenseInfo.allowDerivatives ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                {asset.licenseInfo.allowDerivatives ? <Check className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </div>
              <div>
                <span className="font-semibold block mb-0.5">Derivatives</span>
                <span className="text-sm text-muted-foreground">
                  {asset.licenseInfo.allowDerivatives
                    ? "You can remix and adapt this work."
                    : "Modifications are not permitted."}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border">
              <div className={`mt-0.5 p-1 rounded-full ${asset.licenseInfo.requireAttribution ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
                <Info className="h-4 w-4" />
              </div>
              <div>
                <span className="font-semibold block mb-0.5">Attribution</span>
                <span className="text-sm text-muted-foreground">
                  {asset.licenseInfo.requireAttribution
                    ? "You must credit the creator."
                    : "No attribution required."}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extended Licensing Terms */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass h-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Extended Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {asset.attributes?.map((attr) => {
                if (["License Duration", "Geographic Scope", "Grant-back Clause", "Field of Use"].includes(attr.trait_type)) {
                  if (!attr.value || attr.value === "None" || attr.value === "Unspecified" || attr.value === "Unrestricted") return null;

                  let displayValue = attr.value;
                  // Enhance Geographic Scope display
                  if (attr.trait_type === "Geographic Scope") {
                    const scope = geographicScopes.find(s => attr.value.startsWith(s.value));
                    if (scope) {
                      // Format could be "eu - Germany" or just "worldwide"
                      displayValue = attr.value.includes("-") ? attr.value : scope.label;
                    }
                  }

                  return (
                    <div key={attr.trait_type} className="flex justify-between items-start border-b border-border/50 pb-3 last:border-0 last:pb-0">
                      <span className="font-medium text-muted-foreground mr-4">{attr.trait_type}</span>
                      <span className="font-semibold text-right max-w-[60%]">{displayValue}</span>
                    </div>
                  )
                }
                return null;
              })}
              {/* Fallback if no extended attributes found */}
              {(!asset.attributes?.some(attr => ["License Duration", "Geographic Scope", "Grant-back Clause", "Field of Use"].includes(attr.trait_type) && attr.value && attr.value !== "None" && attr.value !== "Unspecified" && attr.value !== "Unrestricted")) && (
                <div className="text-sm text-muted-foreground italic text-center py-4">
                  No extended licensing terms specified.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI & Data Mining Policy */}
        <Card className="glass h-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              AI & Data Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {asset.attributes?.some(attr => attr.trait_type === "AI & Data Mining Policy" && attr.value !== "Unspecified") ? (
              <div className="bg-muted/30 p-5 rounded-lg border border-dashed">
                <p className="font-semibold text-base mb-2">
                  {asset.attributes.find(attr => attr.trait_type === "AI & Data Mining Policy")?.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  Specific terms regarding the use of this asset for Artificial Intelligence training and data mining.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <BrainCircuit className="h-10 w-10 mb-3 opacity-20" />
                <p>No specific AI usage policy defined.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>



    </div>
  )
} 