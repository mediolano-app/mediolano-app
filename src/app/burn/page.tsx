"use client"

import { useState } from "react"
import Image from "next/image"
import { useAccount } from "@starknet-react/core"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search,
    Box,
    Flame,
    AlertTriangle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BurnAssetDialog, BurnableAsset } from "@/components/burn-asset-dialog"

import { usePortfolio } from "@/hooks/use-portfolio"

export default function BurnPage() {
    const { address } = useAccount()
    const [searchQuery, setSearchQuery] = useState("")
    const [visibleAssetsCount, setVisibleAssetsCount] = useState(12)
    const [selectedAsset, setSelectedAsset] = useState<BurnableAsset | null>(null)

    // Data Hooks
    const { tokens: myTokens, collections: myCollections, loading: myAssetsLoading, refetch } = usePortfolio()

    // Derived Data
    const myAssets = Object.values(myTokens).flat()

    // Filter My Assets
    const filteredMyAssets = myAssets.filter(asset =>
        asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.collection_id?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const visibleMyAssets = filteredMyAssets.slice(0, visibleAssetsCount)
    const hasMoreAssets = filteredMyAssets.length > visibleAssetsCount

    const handleBurnAsset = (asset: any) => {
        const nftAddress = myCollections.find(c => c.id.toString() === asset.collection_id)?.nftAddress
        if (!nftAddress) return

        setSelectedAsset({
            id: asset.token_id,
            name: asset.name,
            nftAddress: nftAddress,
            collectionName: asset.collectionName
        })
    }

    const handleBurnComplete = () => {
        refetch()
        setSelectedAsset(null)
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
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-red-600 dark:text-red-500 flex items-center gap-3">
                                <Flame className="h-10 w-10 fill-red-600 dark:fill-red-500" />
                                Burn Assets
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                Permanently destroy assets from your portfolio. This action is irreversible.
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
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass border border-red-500/10 bg-red-500/5">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium">
                            <AlertTriangle className="h-5 w-5" />
                            <span>Warning: Burned assets cannot be recovered.</span>
                        </div>

                        <div className="relative w-full md:w-[300px] px-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search your assets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-background/40 border-0 focus-visible:ring-1 focus-visible:ring-red-500/50 backdrop-blur-sm h-10 rounded-xl"
                            />
                        </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="my-assets"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {!address ? (
                                    <EmptyState
                                        title="Wallet Not Connected"
                                        description="Please connect your wallet to view your assets."
                                    />
                                ) : myAssetsLoading ? (
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
                                                        onBurn={() => handleBurnAsset(asset)}
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
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            <BurnAssetDialog
                assets={selectedAsset ? [selectedAsset] : []}
                isOpen={!!selectedAsset}
                onClose={() => setSelectedAsset(null)}
                onBurnComplete={handleBurnComplete}
            />
        </div>
    )
}

// --- Subcomponents ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AssetCard({ asset, onBurn }: { asset: any, onBurn: () => void }) {
    return (
        <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 glass-card border-white/5 dark:border-white/5 bg-white/5 dark:bg-black/20 hover:border-red-500/30 dark:hover:border-red-500/30">
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
                    <h3 className="font-semibold truncate text-base pr-2 group-hover:text-red-500 transition-colors" title={asset.name}>{asset.name}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate max-w-[70%] font-medium opacity-80">{asset.collectionName || "Collection"}</span>
                        <span className="opacity-50">#{asset.token_id || "0"}</span>
                    </div>
                </div>

                <Button
                    onClick={onBurn}
                    className="w-full gap-2 font-medium shadow-sm hover:shadow-md transition-all glass-button text-xs h-9 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 hover:text-red-500 border-red-500/20"
                    size="sm"
                    variant="ghost"
                >
                    <Flame className="h-3.5 w-3.5" />
                    Burn Asset
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
