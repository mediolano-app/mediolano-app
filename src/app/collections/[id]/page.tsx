"use client"

import React, { Suspense, useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Grid3X3, BarChart3, TrendingUp, Star, Plus, Hash, ExternalLink, Flag } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetCollection } from "@/hooks/use-collection"
import { useParams, useRouter } from "next/navigation"
import { Collection } from "@/lib/types"
import { shortenAddress, normalizeStarknetAddress, toHexString } from "@/lib/utils"
import { EXPLORER_URL } from "@/services/constants"
import { useCollectionAssets } from "@/hooks/use-collection-assets"
import { ProgressiveAssetGrid } from "@/components/collections/progressive-asset-grid"
import { ReportCollectionDialog } from "@/components/report-collection-dialog"

export default function CollectionDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { fetchCollection } = useGetCollection()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const router = useRouter();

  useEffect(() => {
    const loadCollection = async () => {
      try {
        setLoading(true)
        const collectionData = await fetchCollection(id)
        setCollection(collectionData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch collection")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadCollection()
    }
  }, [id, fetchCollection])


  if (loading) {
    return (
      <div className="container mx-auto py-10 xl:px-4">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => router.back()} size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Loading Collection...</h1>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Error Loading Collection</h1>
        </div>
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Collection Not Found</h1>
        </div>
        <p>The collection you&apos;re looking for doesn&apos;t exist or has been removed.</p>
      </div>
    )
  }

  // Use collection image as cover - validate before displaying
  const coverImage = collection.image && collection.image !== '/placeholder.svg'
    ? collection.image
    : "/placeholder.svg?height=600&width=600"

  // Check if this is a featured collection (collection with id "5")
  const isFeatured = collection.id.toString() === "5"


  const contractHex = collection.nftAddress
    ? normalizeStarknetAddress(String(collection.nftAddress))
    : "N/A";
  const ownerHex = collection.owner
    ? normalizeStarknetAddress(String(collection.owner))
    : "N/A";

  return (
    <main className="container px-4 py-10 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">

          {/* Back Button 
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>*/}

          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>{collection.name}</span>

            {/* Collection Symbol 
            {collection.symbol && (
              <Badge variant="outline" className="text-xs mt-1
               px-2 py-0.5">
                {collection.symbol}
              </Badge>
            )}*/}


          </h1>
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
          <Button variant="outline" size="icon" onClick={() => setIsReportOpen(true)} title="Report Collection">
            <Flag className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-1" onClick={() => router.push("/create")}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Asset</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image src={coverImage || "/placeholder.svg"} alt={collection.name} fill className="object-cover" />
          </div>

        </div>
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 mt-6">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Assets</span>
                </div>
                <span className="font-medium">{collection.itemCount}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Supply</span>
                </div>
                <span className="font-medium">{collection.totalSupply || 0}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Minted</span>
                </div>
                <span className="font-medium">{collection.totalMinted || 0}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Owner</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs font-mono" title={ownerHex}>
                    {shortenAddress(ownerHex)}
                  </span>
                  <a
                    className="inline-flex items-center justify-center h-7 px-2 rounded-md text-sm"
                    href={`${EXPLORER_URL?.replace(/\/$/, "")}/contract/${ownerHex}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in explorer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Address</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs font-mono" title={contractHex}>
                    {shortenAddress(contractHex)}
                  </span>
                  <a
                    className="inline-flex items-center justify-center h-7 px-2  rounded-md text-sm"
                    href={`${EXPLORER_URL?.replace(/\/$/, "")}/contract/${contractHex}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in explorer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{collection.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{collection.description || "No description available"}</p>
            </CardContent>
          </Card>
        </div>
      </div>



      <Tabs defaultValue="nfts" className="mt-8">

        {/* Header Tabs */}
        <TabsList className="mb-4">
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
          <TabsTrigger value="activity" disabled>Activity</TabsTrigger>
          <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="nfts" className="space-y-6">
          <Suspense fallback={<Skeleton className="h-16 w-full" />}>
            <CollectionNFTs
              nftAddress={String(collection.nftAddress)}
              totalSupply={Number(collection.totalSupply || collection.itemCount || 0)}
            />
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
                    <p className="text-2xl font-bold font-mono" title={collection?.owner || "N/A"}>
                      {shortenAddress(collection?.owner || "N/A")}
                    </p>
                    <p className="text-sm text-muted-foreground">Collection owner</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {collection && (
        <ReportCollectionDialog
          open={isReportOpen}
          onOpenChange={setIsReportOpen}
          collectionId={collection.id.toString()}
          collectionName={collection.name}
          collectionOwner={collection.owner}
        />
      )}
    </main>
  )
}

const CollectionNFTs = React.memo(({ nftAddress, totalSupply }: { nftAddress: string; totalSupply: number }) => {
  // Memoize the hook call parameters
  const hookParams = useMemo(() => ({
    totalSupply,
    limit: Math.min(totalSupply || 10, 10),//limit is ten for now
  }), [totalSupply]);

  const { assets, loading, error, loadedCount, totalCount } = useCollectionAssets(
    toHexString(nftAddress) as `0x${string}`,
    hookParams
  );

  return (
    <ProgressiveAssetGrid
      assets={assets}
      loading={loading}
      loadedCount={loadedCount}
      totalCount={totalCount}
      error={error}
    />
  );
});

CollectionNFTs.displayName = 'CollectionNFTs';
