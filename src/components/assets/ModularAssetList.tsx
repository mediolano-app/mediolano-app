import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export interface ModularAsset {
  id: string;
  name: string;
  type: string; // e.g., "IP Token", "IP Coin", "NFT"
  balance?: number | string; // For fungible tokens
  image?: string;
  contractAddress: string;
  tokenId: string;
  collection?: string;
  previewUrl?: string;
}

interface ModularAssetListProps {
  assets: ModularAsset[];
  onSelectAssets: (selected: ModularAsset[]) => void;
  initialSelected?: string[]; // array of asset ids
  multiSelect?: boolean;
}

const ModularAssetList: React.FC<ModularAssetListProps> = ({
  assets,
  onSelectAssets,
  initialSelected = [],
  multiSelect = true,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelected);

  const handleSelect = (id: string) => {
    let updated: string[];
    if (multiSelect) {
      updated = selectedIds.includes(id)
        ? selectedIds.filter((sid) => sid !== id)
        : [...selectedIds, id];
    } else {
      updated = selectedIds.includes(id) ? [] : [id];
    }
    setSelectedIds(updated);
    onSelectAssets(assets.filter((a) => updated.includes(a.id)));
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {assets.map((asset) => (
        <Card
          key={asset.id}
          className={`relative transition-all duration-200 ${selectedIds.includes(asset.id) ? "ring-2 ring-primary" : ""}`}
        >
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-4">
              <input
                type={multiSelect ? "checkbox" : "radio"}
                checked={selectedIds.includes(asset.id)}
                onChange={() => handleSelect(asset.id)}
                className="accent-primary h-5 w-5"
                aria-label={multiSelect ? "Select asset" : "Choose asset"}
              />
              <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {asset.image ? (
                  <Image src={asset.image} alt={asset.name} width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-xs text-gray-500">No image</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg mb-1 truncate">{asset.name}</CardTitle>
                <div className="flex flex-wrap gap-1 items-center">
                  <Badge variant="secondary">{asset.type}</Badge>
                  {asset.collection && <Badge>{asset.collection}</Badge>}
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate">
                  {asset.contractAddress && (
                    <span title={asset.contractAddress}>
                      Contract: {asset.contractAddress.slice(0, 6)}...{asset.contractAddress.slice(-4)}
                    </span>
                  )}
                  {asset.tokenId && (
                    <span className="ml-2">Token ID: {asset.tokenId}</span>
                  )}
                </div>
                {asset.balance !== undefined && (
                  <div className="text-xs mt-1">Balance: {asset.balance}</div>
                )}
              </div>
            </div>
            {asset.previewUrl && (
              <div className="mt-2">
                <Image src={asset.previewUrl} alt="Preview" width={128} height={128} className="rounded" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModularAssetList;
