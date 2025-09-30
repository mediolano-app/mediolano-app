"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Shield, 
  BadgeCheck, 
  Palette,
  Music,
  Video,
  FileText,
  Lightbulb,
  Code,
  Hexagon,
  Box,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Package
} from "lucide-react";
import { useUserAssets } from "@/hooks/use-user-assets";
import { useToast } from "@/hooks/use-toast";
import type { IPType } from "@/types/asset";

interface UserAssetsListProps {
  selectedAssets?: string[];
  onAssetToggle?: (assetId: string) => void;
  onSelectAll?: () => void;
  showSelection?: boolean;
  viewMode?: "grid" | "list";
  searchQuery?: string;
  filterType?: string | null;
  sortBy?: "newest" | "oldest" | "name" | "value";
  className?: string;
}

const typeIcons: Record<IPType, React.ElementType> = {
  Art: Palette,
  Audio: Music,
  Video: Video,
  Document: FileText,
  Patent: Lightbulb,
  RWA: BadgeCheck,
  Software: Code,
  NFT: Hexagon,
  Custom: Box,
};

const typeColors: Record<IPType, string> = {
  Art: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Audio: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Video: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Document: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Patent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  RWA: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Software: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  NFT: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  Custom: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function UserAssetsList({
  selectedAssets = [],
  onAssetToggle,
  showSelection = false,
  viewMode = "list",
  searchQuery = "",
  filterType = null,
  sortBy = "newest",
  className = "",
}: UserAssetsListProps) {
  const { assets, loading, error, refetch } = useUserAssets();
  const { toast } = useToast();

  // Filter and sort assets
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = searchQuery === "" || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.creator.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === null || asset.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.registrationDate || "").getTime() - new Date(a.registrationDate || "").getTime();
      case "oldest":
        return new Date(a.registrationDate || "").getTime() - new Date(b.registrationDate || "").getTime();
      case "name":
        return a.name.localeCompare(b.name);
      case "value":
        return Number.parseFloat(b.value?.split(" ")[0] || "0") - Number.parseFloat(a.value?.split(" ")[0] || "0");
      default:
        return 0;
    }
  });

  // Copy address to clipboard
  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        description: "Contract address copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  // Handle retry
  const handleRetry = async () => {
    await refetch();
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </Card>
          ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Failed to load assets: {error}</span>
          <Button variant="outline" size="sm" onClick={handleRetry} className="ml-4">
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (sortedAssets.length === 0 && !loading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No Assets Found</h3>
        <p className="text-muted-foreground mt-1 mb-6">
          {searchQuery || filterType
            ? "Try adjusting your search or filters"
            : "Connect your wallet and create your first MIP Collection asset"}
        </p>
        <Button onClick={handleRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Assets
        </Button>
      </div>
    );
  }

  // List view
  if (viewMode === "list") {
    return (
      <div className={`space-y-2 ${className}`}>
        {sortedAssets.map((asset) => {
          const TypeIcon = typeIcons[asset.type] || Box;
          const isSelected = selectedAssets.includes(asset.id);

          return (
            <Card
              key={asset.id}
              className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                isSelected ? "ring-2 ring-primary bg-primary/5 border-primary/20" : "hover:bg-muted/50"
              }`}
              onClick={() => onAssetToggle?.(asset.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {showSelection && (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onAssetToggle?.(asset.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0"
                    />
                  )}

                  {/* Asset Image */}
                  <div className="relative h-16 w-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to placeholder on image error
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute top-1 right-1">
                      <Badge className={`${typeColors[asset.type]} text-xs px-1 py-0`}>
                        <TypeIcon className="h-2.5 w-2.5" />
                      </Badge>
                    </div>
                  </div>

                  {/* Asset Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-base truncate" title={asset.name}>
                        {asset.name}
                      </h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="font-semibold text-primary text-sm">{asset.value}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-xs">
                          {asset.creator.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">by {asset.creator}</span>
                      {asset.verified && <BadgeCheck className="h-3 w-3 text-blue-500 flex-shrink-0" />}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{asset.registrationDate}</span>
                      </div>
                      {asset.protectionLevel && (
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          <span>{asset.protectionLevel}% protected</span>
                        </div>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {asset.licenseType}
                      </Badge>
                    </div>

                    {asset.collection && (
                      <p className="text-xs text-muted-foreground">
                        Collection: {asset.collection}
                      </p>
                    )}

                    <p className="text-sm text-muted-foreground line-clamp-1" title={asset.description}>
                      {asset.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyAddress(asset.contractAddress);
                      }}
                      title="Copy contract address"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/asset/${asset.id}`, "_blank");
                      }}
                      title="View asset details"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Grid view
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 ${className}`}>
      {sortedAssets.map((asset) => {
        const TypeIcon = typeIcons[asset.type] || Box;
        const isSelected = selectedAssets.includes(asset.id);

        return (
          <Card
            key={asset.id}
            className={`overflow-hidden transition-all hover:shadow-md cursor-pointer group ${
              isSelected ? "ring-2 ring-primary bg-primary/5" : ""
            }`}
            onClick={() => onAssetToggle?.(asset.id)}
          >
            <div className="relative">
              {showSelection && (
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onAssetToggle?.(asset.id)}
                    className="bg-background/90 backdrop-blur-sm border-2"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              <div className="aspect-square bg-muted">
                <Image
                  src={asset.image}
                  alt={asset.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    // Fallback to placeholder on image error
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm truncate" title={asset.name}>
                {asset.name}
              </h3>
              <div className="flex items-center justify-between mt-1">
                <Badge className={`${typeColors[asset.type]} text-xs px-1.5 py-0.5`}>
                  <TypeIcon className="h-2.5 w-2.5 mr-1" />
                  {asset.type}
                </Badge>
                <span className="text-xs font-medium">{asset.value}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-1" title={asset.creator}>
                {asset.creator}
              </p>
              {asset.collection && (
                <p className="text-xs text-muted-foreground/80 truncate" title={asset.collection}>
                  {asset.collection}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}