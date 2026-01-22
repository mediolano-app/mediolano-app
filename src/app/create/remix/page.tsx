"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAccount } from "@starknet-react/core"
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Grid3X3,
  Box,
  Users,
  Layers,
  Sparkles,
  BarChart3,
  Loader2,
  Package,
  ArrowUpRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

import { usePortfolio } from "@/hooks/use-portfolio"
import { useGetAllCollections } from "@/hooks/use-collection"
import { useCollectionAssets } from "@/hooks/use-collection-new"
import { Collection } from "@/lib/types"

export default function RemixDiscoveryPage() {
  const router = useRouter()
  const { address } = useAccount()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("my-assets")
  const [viewState, setViewState] = useState<"collections" | "assets">("collections")
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)

  // Data Hooks
  const { tokens: myTokens, collections: myCollections, loading: myAssetsLoading } = usePortfolio()
  const { collections: allCollections, loading: collectionsLoading } = useGetAllCollections()

  // Selected Collection Assets Hook (only active when collection selected)
  const {
    assets: collectionAssets,
    loading: collectionAssetsLoading
  } = useCollectionAssets(selectedCollection?.nftAddress)

  // Derived Data
  const myAssets = Object.values(myTokens).flat()

  // Filter My Assets
  const filteredMyAssets = myAssets.filter(asset =>
    asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.collection_id?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter Collections
  const filteredCollections = (allCollections || []).filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter Collection Assets
  const filteredCollectionAssets = (collectionAssets || []).filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectCollection = (collection: Collection) => {
    setSelectedCollection(collection)
    setViewState("assets")
    setSearchQuery("") // Reset search when entering collection
  }

  const handleBackToCollections = () => {
    setSelectedCollection(null)
    setViewState("collections")
    setSearchQuery("")
  }

  const handleRemixAsset = (nftAddress: string, tokenId: string) => {
    router.push(`/create/remix/${nftAddress}-${tokenId}`)
  }

  return (
    <div className="min-h-screen bg-background/60">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/create">
              <Button variant="ghost" size="sm" className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Create
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">IP Remix</h1>
          <p className="text-muted-foreground">
            Select an asset to create a remix. You can remix your own assets or explore IP collections.
          </p>
        </div>

        {/* Tabs & Search */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={(val) => {
              setActiveTab(val)
              if (val === "collections") handleBackToCollections() // Reset Drilldown
            }} className="w-full md:w-auto">
              <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                <TabsTrigger value="my-assets" className="gap-2">
                  <Package className="h-4 w-4" />
                  My Assets
                </TabsTrigger>
                <TabsTrigger value="collections" className="gap-2">
                  <Layers className="h-4 w-4" />
                  Browse Collections
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  activeTab === "my-assets" ? "Search your assets..." :
                    viewState === "collections" ? "Search collections..." :
                      "Search assets in collection..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="min-h-[400px]">

            {/* TAB: MY ASSETS */}
            {activeTab === "my-assets" && (
              <>
                {myAssetsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(8).fill(0).map((_, i) => <AssetCardSkeleton key={i} />)}
                  </div>
                ) : filteredMyAssets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMyAssets.map((asset) => (
                      <AssetCard
                        key={`${asset.collection_id}-${asset.token_id}`}
                        asset={asset}
                        nftAddress={
                          // Try to find nft address from myCollections
                          myCollections.find(c => c.id.toString() === asset.collection_id)?.nftAddress || ""
                        }
                        onRemix={() => {
                          const nftAddr = myCollections.find(c => c.id.toString() === asset.collection_id)?.nftAddress;
                          if (nftAddr) handleRemixAsset(nftAddr, asset.token_id)
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No Assets Found"
                    description={searchQuery ? "Try a different search term" : "You don't own any assets locally."}
                  />
                )}
              </>
            )}

            {/* TAB: COLLECTIONS */}
            {activeTab === "collections" && (
              <>
                {/* VIEW: LIST COLLECTIONS */}
                {viewState === "collections" && (
                  <>
                    {collectionsLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(6).fill(0).map((_, i) => <CollectionCardSkeleton key={i} />)}
                      </div>
                    ) : filteredCollections.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCollections.map((collection) => (
                          <CollectionCard
                            key={String(collection.id)}
                            collection={collection}
                            onClick={() => handleSelectCollection(collection)}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="No Collections Found"
                        description="No collections match your search."
                      />
                    )}
                  </>
                )}

                {/* VIEW: INSIDE COLLECTION (ASSETS) */}
                {viewState === "assets" && selectedCollection && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Collection Header */}
                    <div className="flex items-center gap-4 border-b pb-6">
                      <Button variant="ghost" size="icon" onClick={handleBackToCollections}>
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border">
                          <Image
                            src={selectedCollection.image || "/placeholder.svg"}
                            alt={selectedCollection.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">{selectedCollection.name}</h2>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{selectedCollection.itemCount} Items</span>
                            <Badge variant="outline" className="text-xs h-5 px-1 ml-2">
                              {selectedCollection.type || "Collection"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Assets Grid */}
                    {collectionAssetsLoading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array(8).fill(0).map((_, i) => <AssetCardSkeleton key={i} />)}
                      </div>
                    ) : filteredCollectionAssets.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCollectionAssets.map(asset => {
                          const tokenId = asset.id.split("-").pop() || "0"
                          return (
                            <AssetCard
                              key={asset.id}
                              asset={{
                                name: asset.name,
                                image: asset.image,
                                token_id: tokenId,
                                collection_id: selectedCollection.id.toString(), // or nftAddress
                                owner: "Unknown",
                                metadata_uri: ""
                              }}
                              nftAddress={selectedCollection.nftAddress}
                              onRemix={() => handleRemixAsset(selectedCollection.nftAddress, tokenId)}
                            />
                          )
                        })}
                      </div>
                    ) : (
                      <EmptyState
                        title="No Assets Found"
                        description="This collection seems to be empty or search returned no results."
                      />
                    )}
                  </div>
                )}
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

// --- Subcomponents ---

function AssetCard({ asset, nftAddress, onRemix }: { asset: any, nftAddress: string, onRemix: () => void }) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="aspect-square relative bg-muted">
        <Image
          src={asset.image || "/placeholder.svg"}
          alt={asset.name || "Asset"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button onClick={onRemix} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Remix This
          </Button>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium truncate flex-1" title={asset.name}>{asset.name}</h3>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            #{asset.token_id}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-1">
          {nftAddress ? `${nftAddress.slice(0, 6)}...${nftAddress.slice(-4)}` : "Unknown Contract"}
        </p>
      </CardContent>
    </Card>
  )
}

function CollectionCard({ collection, onClick }: { collection: Collection, onClick: () => void }) {
  return (
    <Card
      className="cursor-pointer group hover:shadow-md hover:border-primary/50 transition-all overflow-hidden"
      onClick={onClick}
    >
      <div className="relative h-48 w-full bg-muted">
        <Image
          src={collection.image || "/placeholder.svg"}
          alt={collection.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
          <h3 className="text-white font-bold text-lg truncate">{collection.name}</h3>
          <p className="text-white/80 text-xs truncate max-w-[90%]">{collection.description || "No description"}</p>
        </div>
      </div>
      <CardFooter className="p-3 flex justify-between items-center text-sm text-muted-foreground bg-card">
        <div className="flex items-center gap-1">
          <Grid3X3 className="h-3 w-3" />
          <span>{collection.itemCount || 0} Assets</span>
        </div>
        {collection.floorPrice && (
          <div className="flex items-center gap-1 text-foreground font-medium">
            <BarChart3 className="h-3 w-3" />
            <span>{collection.floorPrice} STRK</span>
          </div>
        )}
        <div className="group-hover:translate-x-1 transition-transform">
          <ArrowRight className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}

function AssetCardSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

function CollectionCardSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-3 flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  )
}

function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Box className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground max-w-sm mt-1 mb-6">{description}</p>
    </div>
  )
}
