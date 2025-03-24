import Link from "next/link"
import { getAssetById, getCollectionAssets } from "@/lib/mockupAssets"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react"
import { ShareButton } from "@/components/ShareButton"
import { AssetTransactionHistory } from "@/components/assets/AssetTransactionHistory"
import { AssetLicensings } from "@/components/assets/AssetLicensings"
import { AssetViewer } from "@/components/assets/AssetViewer"
import { RelatedAssetsCarousel } from "@/components/assets/AssetsRelatedCarousel"
import { MonetizationOptions } from "@/components/assets/AssetMonetizationOptions"
import { AssetOverview } from "@/components/assets/AssetOverview"

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const asset = getAssetById(params.id)

  if (!asset) {
    return (
      <div className="container py-10">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Asset Not Found</h1>
        </div>
        <p>The asset you're looking for doesn't exist.</p>
      </div>
    )
  }

  const relatedAssets = getCollectionAssets(asset.collection.id).filter((item) => item.id !== asset.id)

  return (
    <main className="container py-10 mx-auto px-4 mb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/portfolio">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{asset.name}</h1>
        </div>
        <ShareButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          <AssetViewer asset={asset} />

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">Properties</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {asset.attributes?.map((attr, index) => (
                  <div key={index} className="border rounded-lg p-3 text-center hover:border-primary transition-colors">
                    <p className="text-xs text-primary uppercase font-medium">{attr.trait_type}</p>
                    <p className="font-medium truncate">{attr.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-muted-foreground">{asset.collection.name}</p>
              <Badge variant="outline">{asset.tokenId}</Badge>
              {asset.rarity && (
                <Badge variant="secondary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {asset.rarity}
                </Badge>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-4">{asset.name}</h2>
            <p className="text-muted-foreground">{asset.description}</p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="licensing">Licensing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <AssetOverview asset={asset} />
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Contract Address</p>
                      <p className="font-medium flex items-center">
                        0x1a92...3e56
                        <ExternalLink className="ml-1 h-3 w-3 cursor-pointer" />
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Token ID</p>
                      <p className="font-medium">{asset.tokenId.replace("#", "")}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Token Standard</p>
                      <p className="font-medium">ERC-721</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Chain</p>
                      <p className="font-medium">Ethereum</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(asset.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Creator Royalty</p>
                      <p className="font-medium">2.5%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Transaction History</h3>
                  <AssetTransactionHistory assetId={asset.id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="licensing" className="mt-4">
              <AssetLicensings assetId={asset.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-12 space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6">More from this collection</h2>
          <RelatedAssetsCarousel assets={relatedAssets} />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Monetize this asset</h2>
          <MonetizationOptions assetId={asset.id} />
        </section>
      </div>
    </main>
  )
}

