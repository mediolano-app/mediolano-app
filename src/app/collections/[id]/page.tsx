import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { getCollections, getNFTs } from "@/lib/mockupPortfolioData"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Grid3X3, BarChart3, TrendingUp, Clock, Star, Plus, Edit } from "lucide-react"
import IPPortfolio from "@/components/IPPortfolio"
import { Skeleton } from "@/components/ui/skeleton"

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
  const collections = getCollections()
  const collection = collections.find((c) => c.id === params.id)

  if (!collection) {
    return (
      <div className="container py-10">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/collections">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Collection Not Found</h1>
        </div>
        <p>The collection you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  const nfts = getNFTs().filter((nft) => nft.collection.id === collection.id)
  const totalValue = nfts.reduce((sum, nft) => sum + nft.price, 0)
  const averagePrice = nfts.length > 0 ? totalValue / nfts.length : 0

  // Get a random image from the collection to display as cover
  const coverImage = nfts.length > 0 ? nfts[0].image : "/placeholder.svg?height=400&width=600"

  // Check if this is a featured collection (mock data)
  const isFeatured = collection.id === "bored-ape" || collection.id === "cryptopunks"

  return (
    <main className="container py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/collections">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{collection.name}</h1>
          {isFeatured && (
            <Badge
              variant="secondary"
              className="bg-yellow-500/90 hover:bg-yellow-500/80 dark:bg-yellow-500/80 dark:hover:bg-yellow-500/70 text-primary-foreground border-none ml-2"
            >
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add NFT</span>
          </Button>
          <Button variant="outline" className="gap-1">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image src={coverImage || "/placeholder.svg"} alt={collection.name} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {nfts.slice(0, 4).map((nft) => (
              <div key={nft.id} className="relative aspect-square rounded-md overflow-hidden">
                <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Collection Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total NFTs</span>
                </div>
                <span className="font-medium">{nfts.length}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Value</span>
                </div>
                <span className="font-medium">{totalValue.toFixed(2)} ETH</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Average Price</span>
                </div>
                <span className="font-medium">{averagePrice.toFixed(2)} ETH</span>
              </div>
              {collection.floorPrice && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Floor Price</span>
                  </div>
                  <span className="font-medium">{collection.floorPrice} ETH</span>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{collection.description || "No description available"}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="nfts" className="mt-8">
        <TabsList className="mb-4">
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="nfts" className="space-y-6">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <CollectionNFTs collectionId={collection.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Added</Badge>
                    <div>
                      <p className="font-medium">New NFT added to collection</p>
                      <p className="text-sm text-muted-foreground">Bored Ape #7329</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Price Update</Badge>
                    <div>
                      <p className="font-medium">Floor price updated</p>
                      <p className="text-sm text-muted-foreground">28.5 ETH → {collection.floorPrice} ETH</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">1 week ago</p>
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Created</Badge>
                    <div>
                      <p className="font-medium">Collection created</p>
                      <p className="text-sm text-muted-foreground">Initial collection setup</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">1 month ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Collection analytics visualization</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Price Trend</h3>
                    <p className="text-2xl font-bold text-green-500">+12.5%</p>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Trading Volume</h3>
                    <p className="text-2xl font-bold">152.8 ETH</p>
                    <p className="text-sm text-muted-foreground">Total volume</p>
                  </CardContent>
                </Card>
                <Card className="sm:col-span-2 md:col-span-1">
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Unique Owners</h3>
                    <p className="text-2xl font-bold">{Math.ceil(nfts.length * 0.7)}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(nfts.length > 0 ? (Math.ceil(nfts.length * 0.7) / nfts.length) * 100 : 0)}% of items
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

function CollectionNFTs({ collectionId }: { collectionId: string }) {
  // This is a simplified version of NFTPortfolio that only shows NFTs from a specific collection
  const nfts = getNFTs().filter((nft) => nft.collection.id === collectionId)

  if (nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No NFTs found in this collection</p>
      </div>
    )
  }

  return <IPPortfolio initialCollectionId={collectionId} />
}

