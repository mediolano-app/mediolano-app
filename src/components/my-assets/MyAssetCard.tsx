import React from 'react';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NFTAsset, Asset, isNFTAsset, NFTAttribute } from '@/types/myasset';

interface AssetCardProps {
  asset: Asset | NFTAsset;
  onSelect?: (asset: Asset | NFTAsset) => void;
  className?: string;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onSelect,
  className = ''
}) => {
  const handleClick = () => {
    onSelect?.(asset);
  };

  const isNFT = isNFTAsset(asset);

  // Helper function to get media type icon
  const getMediaTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
      case 'audio':
        return '🎵';
      case 'document':
        return '📄';
      case '3d-model':
        return '🏗️';
      default:
        return '📁';
    }
  };

  // Helper function to get NFT attributes safely
  const getNFTAttributes = (nftAsset: NFTAsset): NFTAttribute[] => {
    // First check if attributes exist directly on the asset
    if (nftAsset.attributes && Array.isArray(nftAsset.attributes)) {
      return nftAsset.attributes;
    }
    
    // Then check if they exist in metadata
    if (nftAsset.metadata?.attributes && Array.isArray(nftAsset.metadata.attributes)) {
      return nftAsset.metadata.attributes;
    }
    
    return [];
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer group",
        className
      )}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={asset.mediaUrl || '/placeholder-asset.png'}
          alt={asset.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-asset.png';
          }}
        />
        
        {/* Media Type Indicator */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs bg-black/70 text-white border-none">
            {getMediaTypeIcon(asset.type)} {asset.type.toUpperCase()}
          </Badge>
        </div>

        {/* NFT Indicator */}
        {isNFT && (
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="text-xs bg-purple-600 text-white">
              NFT
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <CardHeader className="p-4 pb-0 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="font-semibold text-base line-clamp-1" title={asset.title}>
              {asset.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {asset.description}
            </p>
            <p className="text-xs text-muted-foreground">
              by {asset.author}
            </p>
          </div>
          <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
            {asset.id}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-3 space-y-3">
        {/* Asset Details */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-md border bg-muted/30">
            <div className="text-xs text-muted-foreground">Collection</div>
            <div className="text-sm font-medium line-clamp-1" title={asset.collection}>
              {asset.collection}
            </div>
          </div>
          <div className="p-2 rounded-md border bg-muted/30">
            <div className="text-xs text-muted-foreground">Version</div>
            <div className="text-sm font-medium">
              {asset.version}
            </div>
          </div>
        </div>

        {/* License Information */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">License</div>
          <div className="flex flex-wrap gap-1">
            <Badge
              variant="outline"
              className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/30"
            >
              {asset.licenseType}
            </Badge>
            
            {/* License Features */}
            {asset.commercialUse && (
              <Badge
                variant="outline"
                className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
              >
                Commercial Use
              </Badge>
            )}
            
            {asset.modifications && (
              <Badge
                variant="outline"
                className="text-xs bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/30"
              >
                Modifications OK
              </Badge>
            )}
            
            {asset.attribution && (
              <Badge
                variant="outline"
                className="text-xs bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800/30"
              >
                Attribution Required
              </Badge>
            )}
          </div>
        </div>

        {/* NFT-specific attributes */}
        {isNFT && (() => {
          const attributes = getNFTAttributes(asset);
          return attributes.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">NFT Attributes</div>
              <div className="flex flex-wrap gap-1">
                {attributes.slice(0, 2).map((attr, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/30"
                  >
                    {attr.trait_type}: {attr.value}
                  </Badge>
                ))}
                {attributes.length > 2 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800/30"
                  >
                    +{attributes.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          );
        })()}

        {/* Registration Date */}
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            Registered: {new Date(asset.registrationDate).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};