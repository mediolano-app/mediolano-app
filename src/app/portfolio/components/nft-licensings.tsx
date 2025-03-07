import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw } from "lucide-react"
import type { Licensing } from "@/lib/types"
import { usePortfolioLicensing } from "../hooks/usePortfolioLicensing"

interface NFTLicensingsProps {
  licensings?: Licensing[]
}

export function NFTLicensings({ licensings }: NFTLicensingsProps) {
  // Use the hook if no licensings are provided
  const { licensingsForUI, isLoading, error, fetchUserLicenses } = usePortfolioLicensing()
  
  // Use provided licensings or ones from the hook
  const displayLicensings = licensings || licensingsForUI
  
  if (isLoading) {
    return <LicensingsSkeleton />
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchUserLicenses}>Retry</Button>
      </div>
    )
  }
  
  if (displayLicensings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No licenses found</p>
        <Button onClick={fetchUserLicenses} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your IP Licenses</h2>
        <Button variant="outline" size="sm" onClick={fetchUserLicenses}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {displayLicensings.map((license) => (
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

function LicensingsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-24" />
      </div>
      
      {[1, 2].map((i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

