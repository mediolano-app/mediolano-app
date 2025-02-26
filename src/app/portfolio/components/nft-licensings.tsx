import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Licensing } from "@/lib/types"

interface NFTLicensingsProps {
  licensings: Licensing[]
}

export function NFTLicensings({ licensings }: NFTLicensingsProps) {
  return (
    <div className="space-y-4">
      {licensings.map((license) => (
        <Card key={license.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{license.type} License</CardTitle>
                <CardDescription>Issued to {license.licensee}</CardDescription>
              </div>
              <Badge variant={license.type === "Exclusive" ? "destructive" : "default"}>{license.type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Start Date</span>
                <span>{new Date(license.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">End Date</span>
                <span>{new Date(license.endDate).toLocaleDateString()}</span>
              </div>
              <div className="pt-2">
                <span className="text-sm text-muted-foreground">Terms</span>
                <p className="mt-1">{license.terms}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

