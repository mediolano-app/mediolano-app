"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { LazyImage } from "@/components/ui/lazy-image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Search,
    Box,
    Sparkles,
    RefreshCw,
    Loader2,
    AlertCircle,
    MoreHorizontal,
    History,
    ShieldCheck,
    Flag,
    Eye,
} from "lucide-react"
import { useRecentAssets, type RecentAsset } from "@/hooks/use-recent-assets"

import { AssetCardItem, AssetCardSkeleton } from "@/components/assets/asset-card-item"

export default function AssetsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const { assets, loading, loadingMore, error, hasMore, totalCount, loadMore, refresh } = useRecentAssets(50)

    // Client-side filtering of loaded assets
    const filteredAssets = useMemo(() => {
        if (!searchQuery) return assets

        const lowerQuery = searchQuery.toLowerCase()
        return assets.filter(
            (asset) =>
                asset.name.toLowerCase().includes(lowerQuery) ||
                asset.tokenId.includes(searchQuery) ||
                asset.collectionId.includes(searchQuery)
        )
    }, [assets, searchQuery])

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">

                <div className="relative mb-12">
                    {/* Hero Background Effect */}
                    <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                    </div>

                    <div className="relative flex flex-col md:flex-row items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary/80 mb-1">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Explore</span>
                            </div>
                            <h1 className="tracking-tight text-foreground text-3xl">
                                IP Assets
                            </h1>

                        </div>

                        {totalCount > 0 && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-secondary/30 backdrop-blur-md rounded-full border border-border/50">
                                <Box className="h-4 w-4 text-blue-600" />
                                <span className="font-semibold">{totalCount}</span>
                                <span className="text-muted-foreground text-sm">Assets</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl blur-sm transition-opacity opacity-0 group-hover:opacity-100" />
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search by name, ID, or collection..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-12 text-base bg-background/50 border-input/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl shadow-sm transition-all"
                                />
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={refresh}
                            disabled={loading}
                            className="h-12 px-6 border-input/50 bg-background/50 hover:bg-secondary/50 backdrop-blur-sm rounded-xl"
                        >
                            <RefreshCw className={`h-5 w-5 mr-2 ${loading && !loadingMore ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Assets Grid */}
                <div className="space-y-6">


                    {error && (
                        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <p>{error}</p>
                            <Button variant="link" onClick={refresh} className="h-auto p-0 ml-2">Try Again</Button>
                        </div>
                    )}

                    {loading && !loadingMore && assets.length === 0 ? (
                        <Card className="border-dashed">
                            <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium">Retrieving onchain data...</h3>
                                    <p className="text-sm text-muted-foreground max-w-sm">
                                        Please wait while we fetch the latest assets directly from the blockchain. This might take a moment.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ) : filteredAssets.length === 0 && !loading ? (
                        <Card className="border-dashed">
                            <div className="p-8 md:p-12 text-center space-y-4">
                                <Box className="h-10 md:h-12 w-10 md:w-12 mx-auto text-muted-foreground/50" />
                                <div className="space-y-2">
                                    <p className="text-base md:text-lg font-medium">No assets found</p>
                                    <p className="text-sm text-muted-foreground">
                                        {searchQuery ? "Try a different search term" : "No assets have been minted yet"}
                                    </p>
                                </div>
                                {searchQuery && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setSearchQuery("")}
                                    >
                                        Clear Search
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredAssets.map((asset) => (
                                    <AssetCardItem key={asset.id} asset={asset} />
                                ))}
                            </div>

                            {/* Load More Pagination */}
                            {hasMore && !searchQuery && (
                                <div className="flex justify-center pt-8">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        className="min-w-[200px]"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Loading more...
                                            </>
                                        ) : (
                                            "Load More Assets"
                                        )}
                                    </Button>
                                </div>
                            )}
                            {!hasMore && assets.length > 0 && !searchQuery && (
                                <p className="text-center text-muted-foreground text-sm pt-8">
                                    You have reached the end of the asset list.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
