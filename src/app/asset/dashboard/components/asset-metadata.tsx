import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAssetMetadata } from "@/lib/mockAssetDashboard"

export function AssetMetadata() {
  const metadata = getAssetMetadata()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Metadata</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
              <dd className="text-sm font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

