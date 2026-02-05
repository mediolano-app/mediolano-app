"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAccount } from "@starknet-react/core"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Search,
  Layers,
  Sparkles,
  Loader2,
  Package,
  Box,
  Users
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

import { usePortfolio } from "@/hooks/use-portfolio"
import { usePaginatedCollections } from "@/hooks/use-collection"
import { useCollectionAssets } from "@/hooks/use-collection-new"
import { CollectionsGrid } from "@/components/collections/collections-public"
import { Collection } from "@/lib/types"

export default function RemixDiscoveryPage() {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { address } = useAccount()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("my-assets")
  const [viewState, setViewState] = useState<"collections" | "assets">("collections")
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [visibleAssetsCount, setVisibleAssetsCount] = useState(12)

  // Data Hooks
  const { tokens: myTokens, collections: myCollections, loading: myAssetsLoading } = usePortfolio()
  const { collections: allCollections, loading: collectionsLoading, hasMore, loadMore, loadingMore } = usePaginatedCollections(12)

  // Selected Collection Assets Hook (only active when collection selected)
  const {
    assets: collectionAssets,
    loading: collectionAssetsLoading
  } = useCollectionAssets(selectedCollection?.nftAddress || "")

  // Derived Data
  const myAssets = Object.values(myTokens).flat()

  // Filter My Assets
  const filteredMyAssets = myAssets.filter(asset =>
    asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.collection_id?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Reset pagination when search changes
  useEffect(() => {
    setVisibleAssetsCount(12)
  }, [searchQuery])

  const visibleMyAssets = filteredMyAssets.slice(0, visibleAssetsCount)
  const hasMoreAssets = filteredMyAssets.length > visibleAssetsCount

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
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 space-y-4"
        >

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                IP Remix
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Create derivative works, adaptations, and remixes. Select an asset from your portfolio or explore public collections to begin.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-1.5 rounded-2xl glass border border-white/20 dark:border-white/10">
            <Tabs
              value={activeTab}
              onValueChange={(val) => {
                setActiveTab(val)
                if (val === "collections") handleBackToCollections()
              }}
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-transparent">
                <TabsTrigger
                  value="my-assets"
                  className="gap-2 data-[state=active]:bg-background/80 data-[state=active]:backdrop-blur-sm data-[state=active]:shadow-sm rounded-xl transition-all"
                >
                  <Package className="h-4 w-4" />
                  My Assets
                </TabsTrigger>
                <TabsTrigger
                  value="collections"
                  className="gap-2 data-[state=active]:bg-background/80 data-[state=active]:backdrop-blur-sm data-[state=active]:shadow-sm rounded-xl transition-all"
                >
                  <Layers className="h-4 w-4" />
                  Public Collections
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {activeTab === "my-assets" && (
              <div className="relative w-full md:w-[300px] px-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/40 border-0 focus-visible:ring-1 focus-visible:ring-primary/50 backdrop-blur-sm h-10 rounded-xl"
                />
              </div>
            )}
            {viewState === "assets" && activeTab === "collections" && (
              <div className="relative w-full md:w-[300px] px-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/40 border-0 focus-visible:ring-1 focus-visible:ring-primary/50 backdrop-blur-sm h-10 rounded-xl"
                />
              </div>
            )}
          </div>

          {/* CONTENT AREA */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {/* TAB: MY ASSETS */}
              {activeTab === "my-assets" && (
                <motion.div
                  key="my-assets"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {myAssetsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {Array(8).fill(0).map((_, i) => <AssetCardSkeleton key={i} />)}
                    </div>
                  ) : visibleMyAssets.length > 0 ? (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {visibleMyAssets.map((asset, i) => (
                          <motion.div
                            key={`${asset.collection_id}-${asset.token_id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <AssetCard
                              asset={asset}
                              nftAddress={
                                myCollections.find(c => c.id.toString() === asset.collection_id)?.nftAddress || ""
                              }
                              onRemix={() => {
                                const nftAddr = myCollections.find(c => c.id.toString() === asset.collection_id)?.nftAddress;
                                if (nftAddr) handleRemixAsset(nftAddr, asset.token_id)
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Load More Button */}
                      {hasMoreAssets && (
                        <div className="flex flex-col items-center justify-center gap-2 pt-8">
                          <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => setVisibleAssetsCount(prev => prev + 12)}
                            className="min-w-[150px] glass-button"
                          >
                            Load More Assets
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Showing {visibleMyAssets.length} of {filteredMyAssets.length} assets
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      title="No Assets Found"
                      description={searchQuery ? "Try a different search term" : "You don't own any assets locally."}
                    />
                  )}
                </motion.div>
              )}

              {/* TAB: COLLECTIONS */}
              {activeTab === "collections" && (
                <motion.div
                  key="collections"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* VIEW: LIST COLLECTIONS */}
                  {viewState === "collections" && (
                    <div className="space-y-8">
                      {collectionsLoading && allCollections.length === 0 ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-muted-foreground justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <p>Loading collections...</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(6).fill(0).map((_, i) => <CollectionCardSkeleton key={i} />)}
                          </div>
                        </div>
                      ) : allCollections && allCollections.length > 0 ? (
                        <>
                          <CollectionsGrid
                            collections={allCollections}
                            onCollectionClick={handleSelectCollection}
                          />
                          {hasMore && (
                            <div className="flex justify-center pt-8">
                              <Button
                                onClick={() => loadMore()}
                                disabled={loadingMore}
                                variant="outline"
                                size="lg"
                                className="glass-button"
                              >
                                {loadingMore ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading more...
                                  </>
                                ) : "Load More Collections"}
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <EmptyState
                          title="No Collections Found"
                          description="No collections available at the moment."
                        />
                      )}
                    </div>
                  )}

                  {/* VIEW: INSIDE COLLECTION (ASSETS) */}
                  {viewState === "assets" && selectedCollection && (
                    <div className="space-y-6">
                      {/* Collection Header */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 glass p-6 rounded-2xl mb-8"
                      >
                        <Button variant="ghost" size="icon" onClick={handleBackToCollections} className="shrink-0 rounded-full hover:bg-white/10">
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                          <Image
                            src={selectedCollection.image || "/placeholder.svg"}
                            alt={selectedCollection.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{selectedCollection.name}</h2>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary/50">
                              <Users className="h-3.5 w-3.5" />
                              <span>{selectedCollection.itemCount} Items</span>
                            </div>
                            <Badge variant="outline" className="text-xs h-6 px-2 bg-transparent border-white/20">
                              {selectedCollection.type || "Collection"}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>

                      {/* Assets Grid */}
                      {collectionAssetsLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {Array(8).fill(0).map((_, i) => <AssetCardSkeleton key={i} />)}
                        </div>
                      ) : filteredCollectionAssets.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {filteredCollectionAssets.map((asset, i) => {
                            const tokenId = asset.id.split("-").pop() || "0"
                            return (
                              <motion.div
                                key={asset.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                              >
                                <AssetCard
                                  asset={{
                                    name: asset.name,
                                    image: asset.image,
                                    token_id: tokenId,
                                    collection_id: selectedCollection.id.toString(), // or nftAddress
                                    owner: "Unknown",
                                    collectionName: selectedCollection.name,
                                    type: selectedCollection.type || "Art",
                                    metadata_uri: ""
                                  }}
                                  nftAddress={selectedCollection.nftAddress}
                                  onRemix={() => handleRemixAsset(selectedCollection.nftAddress, tokenId)}
                                />
                              </motion.div>
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

// --- Subcomponents ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AssetCard({ asset, onRemix }: { asset: any, nftAddress: string, onRemix: () => void }) {
  return (
    <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 glass-card border-white/5 dark:border-white/5 bg-white/5 dark:bg-black/20 hover:border-primary/30 dark:hover:border-primary/30">
      <div className="aspect-square relative bg-muted/20 overflow-hidden">
        <Image
          src={asset.image || "/placeholder.svg"}
          alt={asset.name || "Asset"}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-4 space-y-3 relative">
        <div className="space-y-1">
          <h3 className="font-semibold truncate text-base pr-2 group-hover:text-primary transition-colors" title={asset.name}>{asset.name}</h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="truncate max-w-[70%] font-medium opacity-80">{asset.collectionName || "Collection"}</span>
            <span className="opacity-50">#{asset.token_id || "0"}</span>
          </div>
        </div>

        <Button
          onClick={onRemix}
          className="w-full gap-2 font-medium shadow-sm hover:shadow-md transition-all glass-button text-xs h-9 bg-primary/10 hover:bg-primary/20 hover:text-primary border-primary/20"
          size="sm"
          variant="ghost"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Remix This Asset
        </Button>
      </CardContent>
    </Card>
  )
}

function AssetCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <Skeleton className="aspect-square w-full bg-white/5" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4 bg-white/5" />
        <Skeleton className="h-3 w-1/2 bg-white/5" />
      </div>
    </div>
  )
}

function CollectionCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <Skeleton className="h-56 w-full bg-white/5" />
      <div className="p-4 flex justify-between">
        <Skeleton className="h-5 w-32 bg-white/5" />
        <Skeleton className="h-5 w-16 bg-white/5" />
      </div>
    </div>
  )
}

function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-6 glass border-white/10">
        <Box className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
    </div>
  )
}
