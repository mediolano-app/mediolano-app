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
import NFTCard from "@/components/nft-card";
import { useParams } from "next/navigation";
import {
  useCollectionMetadata,
  useCollectionAssets,
} from "@/hooks/use-collection-new";
import { Asset } from "@/types/asset";

export default function CollectionPage() {
  const { collectionAddress } = useParams<{ collectionAddress: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [copied, setCopied] = useState<string | null>(null);

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

  const creator = (collection as any)?.creator; // Note: Collection type usually stores owner address, not full creator obj unless enriched. 
  // If useCollectionMetadata doesn't enrich creator, this might be undefined.
  // We'll handle refined UI later if needed.

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
    <div className="min-h-screen bg-background/60">
      <main className="container mx-auto px-4 py-8 max-w-7xl">

        {collection && isCollectionReported(collection.id.toString()) && (
          <Alert
            variant="destructive"
            className="mb-6 border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive/50"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Reported Content</AlertTitle>
            <AlertDescription>
              This collection has been flagged by the Mediolano Community.
              Proceed with caution.
            </AlertDescription>
          </Alert>
        )}

        {/* Collection Header */}
        <div className="relative mb-8">
          {/* Cover Image */}
          <div className="aspect-video relative overflow-hidden rounded-xl mb-6">
            <img
              src={collection.image || "/placeholder.svg"}
              alt={collection.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {collection.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    {collection.type && (
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white backdrop-blur-sm"
                      >
                        {collection.type}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="bg-white/20 text-white backdrop-blur-sm border-white/30"
                    >
                      {collection.itemCount || 0} assets
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleShare}
                    className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardContent className="mt-4">
                <p className="text-muted-foreground leading-relaxed">
                  {collection.description || "No description available."}
                </p>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Assets
                      </p>
                      <p className="text-2xl font-bold">{collection.itemCount || 0}</p>
                    </div>
                    <Grid3X3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Minted
                      </p>
                      <p className="text-2xl font-bold">
                        {collection.totalMinted || 0}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Floor Price
                      </p>
                      <p className="text-2xl font-bold"></p>
                    </div>
                    <Eye className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Owners</p>
                      <p className="text-2xl font-bold">
                        --
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            {/* Collection Details */}
            <Card>
              <CardContent className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Contract Address
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopy(collection.nftAddress, "address")
                    }
                    className="h-auto p-1 font-mono text-xs"
                  >
                    {collection.nftAddress.substring(0, 6)}...
                    {collection.nftAddress.substring(
                      collection.nftAddress.length - 4,
                    )}
                    <Copy className="h-3 w-3 ml-1" />
                  </Button>
                </div>

                {!creator && collection.owner && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Owner
                    </span>
                    <span className="text-sm font-mono truncate max-w-[150px]">
                      {collection.owner}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Blockchain
                  </span>
                  <Badge variant="outline">Starknet</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Token Standard
                  </span>
                  <Badge variant="outline">ERC-721</Badge>
                </div>

                <div className="pt-2">
                  <a
                    href={`https://starkscan.co/contract/${collection.nftAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Explorer
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Creator Info */}
            {creator && (
              <Card>
                <CardHeader>
                  <CardTitle>Creator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          (creator as any).avatar ||
                          "/placeholder.svg?height=40&width=40"
                        }
                        alt={(creator as any).name}
                      />
                      <AvatarFallback>
                        {(creator as any).name?.substring(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/creators/${(creator as any).id}`}>
                          <h3 className="font-semibold hover:text-primary transition-colors cursor-pointer">
                            {(creator as any).name && (creator as any).name.length > 10
                              ? (creator as any).name.substring(0, 10) + "..."
                              : (creator as any).name || "Unknown"}
                          </h3>
                        </Link>
                        {(creator as any).verified && (
                          <Badge variant="secondary">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <Link href={`/creators/${(creator as any).id}`}>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}



          </div>
        </div>

        {/* Assets Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Assets</h3>
              <p className="text-muted-foreground">
                {filteredAssets.length} of {collectionAssets.length} assets
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
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
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Skeleton className="w-full aspect-video rounded-xl mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(4).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
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
