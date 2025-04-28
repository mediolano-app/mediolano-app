import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAssetById } from "@/app/services/revenue-sharing/lib/mock-data"
import AssetRevenueOverview from "@/app/services/revenue-sharing/components/asset-revenue-overview"
import AssetRevenueDistribution from "@/app/services/revenue-sharing/components/asset-revenue-distribution"
import AssetRevenueSettings from "@/app/services/revenue-sharing/components/asset-revenue-settings"
import { notFound } from "next/navigation"

interface AssetPageProps {
  params: {
    id: string
  }
}

export default function AssetPage({ params }: AssetPageProps) {
  const asset = getAssetById(params.id)

  if (!asset) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <img
          src={asset.imageUrl || "/placeholder.svg"}
          alt={asset.title}
          className="h-16 w-16 rounded-lg object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold">{asset.title}</h1>
          <p className="text-gray-600">Revenue sharing management</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AssetRevenueOverview assetId={params.id} />
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Distribution</CardTitle>
              <CardDescription>View how revenue is distributed among fractional owners</CardDescription>
            </CardHeader>
            <CardContent>
              <AssetRevenueDistribution assetId={params.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Settings</CardTitle>
              <CardDescription>Configure revenue sharing settings for this asset</CardDescription>
            </CardHeader>
            <CardContent>
              <AssetRevenueSettings assetId={params.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
