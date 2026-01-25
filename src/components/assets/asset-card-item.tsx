"use client"

import { memo } from "react"
import Link from "next/link"
import { LazyImage } from "@/components/ui/lazy-image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
    Sparkles,
    MoreHorizontal,
    History,
    ShieldCheck,
    Flag,
    Eye,
} from "lucide-react"
import type { RecentAsset } from "@/hooks/use-recent-assets"

export function AssetCardSkeleton() {
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

function AssetCardItemComponent({ asset }: { asset: RecentAsset }) {
    return (
        <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-muted-foreground/20">
            <Link href={`/asset/${asset.collectionAddress}-${asset.tokenId}`}>
                <div className="aspect-square relative bg-muted/50 overflow-hidden cursor-pointer">
                    <LazyImage
                        src={asset.image}
                        fallbackSrc="/placeholder.svg"
                        alt={asset.name || "Asset"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </Link>
            <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <Link href={`/asset/${asset.collectionAddress}-${asset.tokenId}`} className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate text-base hover:text-primary transition-colors" title={asset.name}>
                                {asset.name}
                            </h3>
                        </Link>
                        <Badge variant="outline" className="font-mono text-[10px] shrink-0">
                            #{asset.tokenId}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Link href={`/collections/${asset.collectionAddress}`} className="hover:underline truncate max-w-[70%] font-medium text-foreground/80">
                            {asset.collectionName || `Collection #${asset.collectionId}`}
                        </Link>
                    </div>
                </div>

                <div className="pt-2 flex gap-2">
                    <Button asChild variant="default" size="sm" className="flex-1 h-8 text-xs gap-1">
                        <Link href={`/asset/${asset.collectionAddress}-${asset.tokenId}`}>
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
                                <Link href={`/create/remix/${asset.collectionAddress}-${asset.tokenId}`} className="cursor-pointer">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Remix Asset
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href={`/provenance/${asset.collectionAddress}-${asset.tokenId}`} className="cursor-pointer">
                                    <History className="mr-2 h-4 w-4" />
                                    Open Provenance
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href={`/proof-of-ownership/${asset.collectionAddress}-${asset.tokenId}`} className="cursor-pointer">
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

export const AssetCardItem = memo(AssetCardItemComponent)
