"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
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

function AssetCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-4 w-1/2" />
                <div className="pt-2 flex gap-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </Card>
    )
}

function AssetCard({ asset }: { asset: RecentAsset }) {
    const nftAddress = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS as string;

    return (
        <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-muted-foreground/20">
            <Link href={`/asset/${nftAddress}-${asset.tokenId}`}>
                <div className="aspect-square relative bg-muted/50 overflow-hidden cursor-pointer">
                    <Image
                        src={asset.image || "/placeholder.svg"}
                        alt={asset.name || "Asset"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </Link>
            <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <Link href={`/asset/${nftAddress}-${asset.tokenId}`} className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate text-base hover:text-primary transition-colors" title={asset.name}>
                                {asset.name}
                            </h3>
                        </Link>
                        <Badge variant="outline" className="font-mono text-[10px] shrink-0">
                            #{asset.tokenId}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Link href={`/collections/${nftAddress}`} className="hover:underline truncate max-w-[70%] font-medium text-foreground/80">
                            Collection #{asset.collectionId}
                        </Link>
                    </div>
                </div>

                <div className="pt-2 flex gap-2">
                    <Button asChild variant="default" size="sm" className="flex-1 h-8 text-xs gap-1">
                        <Link href={`/asset/${nftAddress}-${asset.tokenId}`}>
                            <Eye className="h-3 w-3" />
                            View Asset
                        </Link>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link href={`/create/remix/${nftAddress}-${asset.tokenId}`} className="cursor-pointer">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Remix Asset
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href={`/provenance/${asset.collectionId}-${asset.tokenId}`} className="cursor-pointer">
                                    <History className="mr-2 h-4 w-4" />
                                    Open Provenance
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href={`/proof-of-ownership/${asset.collectionId}-${asset.tokenId}`} className="cursor-pointer">
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    View Proof
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <Flag className="mr-2 h-4 w-4" />
                                Report Asset
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )
}

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
            <main className="container mx-auto px-4 py-8 md:py-12 lg:py-16 space-y-8 md:space-y-12">
                {/* Hero Section */}
                <div className="text-center space-y-4 md:space-y-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-xs text-primary">Mediolano Protocol</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Explore Assets
                    </h1>
                    <p className="text-base text-muted-foreground leading-relaxed px-4">
                        Discover the latest minted IP assets from our global creator community
                    </p>
                </div>

                {/* Search Bar */}
                <Card className="glass">
                    <div className="p-3 md:p-4 lg:p-6">
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
                </Card>

                {/* Assets Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                            <Box className="h-5 w-5" />
                            Recent Assets
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

                    {error && (
                        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <p>{error}</p>
                            <Button variant="link" onClick={refresh} className="h-auto p-0 ml-2">Try Again</Button>
                        </div>
                    )}

                    {loading && !loadingMore && assets.length === 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array(8).fill(0).map((_, i) => (
                                <AssetCardSkeleton key={i} />
                            ))}
                        </div>
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
                                    <AssetCard key={asset.id} asset={asset} />
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
