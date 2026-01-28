"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ArrowLeft,
    Search,
    Share2,
    Users,
    BarChart3,
    Grid3X3,
    Copy,
    ExternalLink,
    Shield,
    Star,
    Eye,
    AlertTriangle,
    Loader2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { isCollectionReported } from "@/lib/reported-content";
import Link from "next/link";
import Image from "next/image";
import { LazyImage } from "@/components/ui/lazy-image";
import NFTCard from "@/components/nft-card";
import {
    useCollectionMetadata,
    useCollectionAssets,
} from "@/hooks/use-collection-new";
import { Asset } from "@/types/asset";

interface CollectionDetailsProps {
    collectionAddress: string;
}

export default function CollectionDetails({ collectionAddress }: CollectionDetailsProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [copied, setCopied] = useState<string | null>(null);
    const [imageRatio, setImageRatio] = useState<number | null>(null);

    // Use new hooks for fetching data
    const {
        collection,
        loading: collectionLoading,
        error: collectionError,
    } = useCollectionMetadata(collectionAddress);

    const {
        assets: collectionAssets,
        loading: assetsLoading,
        error: assetsError,
    } = useCollectionAssets(collectionAddress);

    const isLoading = collectionLoading || assetsLoading;
    const error = collectionError || assetsError;

    const filteredAssets = (collectionAssets || []).filter((asset) => {
        const matchesSearch = asset.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesType =
            filterType === "all" ||
            asset.type.toLowerCase() === filterType.toLowerCase();
        return matchesSearch && matchesType;
    });

    const creator = (collection as any)?.creator;

    const handleCopy = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    const handleShare = () => {
        if (!collection) return;
        if (navigator.share) {
            navigator.share({
                title: collection.name,
                text: `Check out the ${collection.name} collection`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (collectionLoading) {
        return <CollectionPageSkeleton />;
    }

    if (error || !collection) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-destructive">
                        Error Loading Collection
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {error || "Collection not found"}
                    </p>
                    <Link href="/collections">
                        <Button variant="outline" className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Collections
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/*  Header */}
            <div className="relative overflow-hidden -mt-[88px] pt-[150px] pb-24 min-h-[500px] flex flex-col justify-center">
                {/* Background with gradient and blur */}
                <div className="absolute inset-0">
                    {/* Base gradient - More vivid */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-purple-500/20 to-secondary/40 mix-blend-overlay" />

                    {/* Collection Image Background - More visible */}
                    <Image
                        src={collection.image || "/placeholder.svg"}
                        alt="Collection Background"
                        fill
                        className="object-cover opacity-60 blur-2xl scale-110"
                        priority
                        sizes="100vw"
                    />

                    {/*  overlay - Lighter for vividness */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-background/90 backdrop-blur-[2px]" />
                </div>

                <div className="relative z-10 container mx-auto px-4 max-w-7xl">
                    {collection && isCollectionReported(collection.id.toString()) && (
                        <Alert
                            variant="destructive"
                            className="mb-8 border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive/50 backdrop-blur-md"
                        >
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Reported Content</AlertTitle>
                            <AlertDescription>
                                This collection has been flagged by the Mediolano Community.
                                Proceed with caution.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex flex-col gap-10">
                        {/* Top Section: Avatar + Info */}
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                            {/* Collection Avatar - Larger */}
                            <div className="flex-shrink-0 relative group w-full max-w-[200px] md:max-w-[300px] mx-auto lg:mx-0">
                                <div className="absolute -inset-1 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                                <div
                                    className="relative w-full rounded-2xl overflow-hidden border-[2px] border-white/20 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-in-out bg-black/20"
                                    style={{ aspectRatio: imageRatio || "1/1" }}
                                >
                                    <LazyImage
                                        src={collection.image || "/placeholder.svg"}
                                        alt={collection.name}
                                        fill
                                        className="object-cover"
                                        priority
                                        onLoad={(e) => {
                                            const img = e.currentTarget;
                                            if (img.naturalWidth && img.naturalHeight) {
                                                setImageRatio(img.naturalWidth / img.naturalHeight);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Collection Info */}
                            <div className="flex-1 text-white text-center lg:text-left flex flex-col justify-center h-full pt-4">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-2">
                                        <h1 className="text-5xl lg:text-7xl font-bold drop-shadow-xl tracking-tight leading-none">{collection.name}</h1>
                                        {collection.type && (
                                            <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-md px-3 py-1 text-base">
                                                {collection.type}
                                            </Badge>
                                        )}
                                    </div>

                                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed drop-shadow-md font-medium">
                                        {collection.description || "No description available."}
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="border-white/30 text-white hover:bg-white/20 backdrop-blur-xl bg-white/10 transition-all text-base px-6 h-12"
                                            onClick={handleShare}
                                        >
                                            <Share2 className="h-5 w-5 mr-2" />
                                            Share
                                        </Button>
                                        <a
                                            href={`https://sepolia.starkscan.co/contract/${collection.nftAddress}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="border-white/30 text-white hover:bg-white/20 backdrop-blur-xl bg-white/10 transition-all text-base px-6 h-12"
                                            >
                                                <ExternalLink className="h-5 w-5 mr-2" />
                                                Explorer
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Stats Widget - Moved below */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mt-4">
                            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-black/30 transition-all duration-300">
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium text-white/70 mb-2 uppercase tracking-wider">Total Assets</p>
                                    <p className="text-3xl md:text-4xl font-bold text-white">{collection.itemCount || 0}</p>
                                </div>
                            </div>
                            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-black/30 transition-all duration-300">
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium text-white/70 mb-2 uppercase tracking-wider">Total Minted</p>
                                    <p className="text-3xl md:text-4xl font-bold text-white">{collection.totalMinted || 0}</p>
                                </div>
                            </div>
                            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-black/30 transition-all duration-300">
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium text-white/70 mb-2 uppercase tracking-wider">Floor Price</p>
                                    <p className="text-3xl md:text-4xl font-bold text-white">--</p>
                                </div>
                            </div>
                            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-black/30 transition-all duration-300">
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium text-white/70 mb-2 uppercase tracking-wider">Owners</p>
                                    <p className="text-3xl md:text-4xl font-bold text-white">--</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contract and Creator Details - Inline or minimal */}
                    <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start items-center text-sm text-white/80 font-medium">
                        <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                            <span className="mr-2">Contract:</span>
                            <button
                                onClick={() => handleCopy(collection.nftAddress, "address")}
                                className="font-mono hover:text-white transition-colors flex items-center"
                            >
                                {collection.nftAddress.substring(0, 6)}...{collection.nftAddress.substring(collection.nftAddress.length - 4)}
                                <Copy className="h-3 w-3 ml-2" />
                            </button>
                            {copied === "address" && <span className="ml-2 text-green-400 text-xs">Copied!</span>}
                        </div>

                        {!creator && collection.owner && (
                            <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                <span className="mr-2">Owner:</span>
                                <Link href={`/creator/${collection.owner}`} className="font-mono hover:text-white transition-colors hover:underline">
                                    {collection.owner.substring(0, 6)}...
                                </Link>
                            </div>
                        )}

                        {creator && (
                            <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/10 gap-2">
                                <span className="mr-1">Creator:</span>
                                <Avatar className="h-5 w-5">
                                    <AvatarImage src={(creator as any).avatar} />
                                    <AvatarFallback className="text-[10px]">{(creator as any).name?.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <Link href={`/creator/${(creator as any).id}`} className="hover:text-white hover:underline">
                                    {(creator as any).name}
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Assets Section */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Collection Assets</h2>
                            <p className="text-muted-foreground">
                                {filteredAssets.length} of {collectionAssets.length} IP assets
                            </p>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search assets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {assetsLoading ? (
                        <AssetsSkeleton />
                    ) : filteredAssets.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredAssets.map((asset) => (
                                <NFTCard key={asset.id} asset={asset as Asset} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                            <div className="bg-muted/30 p-6 rounded-full">
                                <Grid3X3 className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <div className="text-muted-foreground mb-4">
                                {searchQuery
                                    ? "No assets found matching your search."
                                    : "No assets in this collection yet."}
                            </div>
                            {searchQuery && (
                                <Button variant="outline" onClick={() => setSearchQuery("")}>
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function CollectionPageSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Skeleton - Matches new design */}
            <div className="relative overflow-hidden -mt-[88px] pt-[150px] pb-24 min-h-[500px] flex flex-col justify-center">
                <div className="relative z-10 container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col gap-10">
                        {/* Top Section: Avatar + Info */}
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                            {/* Avatar */}
                            <div className="flex-shrink-0 relative">
                                <Skeleton className="h-40 w-40 md:h-56 md:w-56 rounded-2xl border-[3px] border-white/20" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col items-center lg:items-start justify-center pt-4 space-y-4 w-full">
                                <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start w-full">
                                    <Skeleton className="h-16 w-3/4 max-w-lg" />
                                    <Skeleton className="h-8 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-24 w-full max-w-2xl" />
                                <div className="flex gap-4 pt-2">
                                    <Skeleton className="h-12 w-32 rounded-md" />
                                    <Skeleton className="h-12 w-32 rounded-md" />
                                </div>
                            </div>
                        </div>

                        {/* Stats Widget */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mt-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 h-32 flex flex-col justify-center space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-16" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-10 w-64" />
                    </div>
                    <AssetsSkeleton />
                </div>
            </main>
        </div>
    )
}

function AssetsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(null).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}
