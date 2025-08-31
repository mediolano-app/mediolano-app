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
} from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import NFTCard from "@/components/nft-card";
import {
  getCollectionBySlug,
  getAssetsByCollection,
  getCreatorByName,
} from "@/lib/mock-data";

interface CollectionPageProps {
  params: {
    slug: string;
  };
}
/*
  Route by Collection Address
  Get Collection Data from Smart Contract
  Handle Error gracefully or Provide fallback data if collection not found
  Retrieve Assets in a Collection
  Display the Assets
  Include Search and Pagination for Assets
*/
export default function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = params;
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [copied, setCopied] = useState<string | null>(null);

  // Get collection from mock data
  const collection = getCollectionBySlug(slug);
  const collectionAssets = collection
    ? getAssetsByCollection(collection.name)
    : [];
  const creator = collection ? getCreatorByName(collection.creator) : null;

  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Collection Not Found</h1>
          <p className="text-muted-foreground">
            The collection you're looking for doesn't exist.
          </p>
          <Link href="/collections">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collections
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredAssets = collectionAssets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Link href="/collections" className="inline-block mb-8">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Button>
        </Link>

        {/* Collection Header */}
        <div className="relative mb-8">
          {/* Cover Image */}
          <div className="h-48 md:h-64 relative overflow-hidden rounded-xl mb-6">
            <img
              src={collection.coverImage || "/placeholder.svg"}
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
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white backdrop-blur-sm"
                    >
                      {collection.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-white/20 text-white backdrop-blur-sm border-white/30"
                    >
                      {collection.assetCount} assets
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Favorite
                  </Button>
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
              <CardHeader>
                <CardTitle>About this Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {collection.description}
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
                      <p className="text-2xl font-bold">
                        {collection.assetCount}
                      </p>
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
                        Total Value
                      </p>
                      <p className="text-2xl font-bold">
                        {collection.totalValue}
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
                      <p className="text-2xl font-bold">0.3 ETH</p>
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
                        {Math.ceil(collection.assetCount * 0.7)}
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
              <CardHeader>
                <CardTitle>Collection Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Contract Address
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(collection.slug, "address")}
                    className="h-auto p-1 font-mono text-xs"
                  >
                    {collection.slug.substring(0, 6)}...
                    {collection.slug.substring(collection.slug.length - 4)}
                    <Copy className="h-3 w-3 ml-1" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Blockchain
                  </span>
                  <Badge variant="outline">Ethereum</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Token Standard
                  </span>
                  <Badge variant="outline">ERC-721</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">{collection.creationDate}</span>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Etherscan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle>Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        creator?.avatar || "/placeholder.svg?height=40&width=40"
                      }
                      alt={collection.creator}
                    />
                    <AvatarFallback>
                      {collection.creator.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {creator ? (
                        <Link href={`/creators/${creator.slug}`}>
                          <h3 className="font-semibold hover:text-primary transition-colors cursor-pointer">
                            {collection.creator}
                          </h3>
                        </Link>
                      ) : (
                        <h3 className="font-semibold">{collection.creator}</h3>
                      )}
                      {creator?.verified && (
                        <Badge variant="secondary">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    {creator && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {creator.bio}
                      </p>
                    )}
                    {creator && (
                      <Link href={`/creators/${creator.slug}`}>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
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

          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAssets.map((asset) => (
                <NFTCard key={asset.id} asset={asset} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
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
