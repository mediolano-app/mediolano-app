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

                <div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                            <Box className="h-5 w-5" />
                            IP Assets
                        </h2>
                        {totalCount > 0 && (
                            <span className="text-sm text-muted-foreground">
                                {searchQuery
                                    ? `${filteredAssets.length} of ${totalCount} assets`
                                    : `${assets.length} of ${totalCount} assets`
                                }
                            </span>
                        )}
                    </div>
                    <div className="py-4">
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search assets by name or ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-background/50 border-border/50"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="default"
                                onClick={refresh}
                                disabled={loading}
                                className="sm:w-auto bg-transparent"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading && !loadingMore ? "animate-spin" : ""}`} />
                            </Button>
                        </div>
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
