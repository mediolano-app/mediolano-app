import React from 'react';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NFTAsset } from '@/types/myasset';

interface AssetCardProps {
  asset: NFTAsset;
  onSelect?: (asset: NFTAsset) => void;
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

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={asset.imageUrl || '/placeholder-nft.png'}
          alt={asset.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-nft.png';
          }}
        />
      </div>

      {/* Content */}
      <CardHeader className="p-4 pb-0 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="font-semibold text-base line-clamp-1" title={asset.name}>
              {asset.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {asset.description}
            </p>
          </div>
          <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
            #{asset.tokenId}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-3 space-y-3">
        {/* Token ID Info */}
        <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/30">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">Token ID</div>
            <div className="text-sm font-mono font-medium">
              #{asset.tokenId}
            </div>
          </div>
        </div>

        {/* Attributes */}
        {asset.attributes.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Attributes</div>
            <div className="flex flex-wrap gap-1">
              {asset.attributes.slice(0, 3).map((attr, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
                >
                  {attr.trait_type}: {attr.value}
                </Badge>
              ))}
              {asset.attributes.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800/30"
                >
                  +{asset.attributes.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};