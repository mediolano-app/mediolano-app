"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, Send } from "lucide-react";
import type { UserAsset } from "@/hooks/use-user-assets";

interface AssetsSelectionHeaderProps {
  selectedAssets: string[];
  allAssets: UserAsset[];
  onSelectAll: () => void;
  onClearSelection: () => void;
  onTransfer: () => void;
  className?: string;
}

export function AssetsSelectionHeader({
  selectedAssets,
  allAssets,
  onSelectAll,
  onClearSelection,
  onTransfer,
  className = "",
}: AssetsSelectionHeaderProps) {
  // Calculate selection stats
  const selectedValue = allAssets
    .filter((asset) => selectedAssets.includes(asset.id))
    .reduce((sum, asset) => {
      const value = Number.parseFloat(asset.value?.split(" ")[0] || "0") || 0;
      return sum + value;
    }, 0);

  const isAllSelected = selectedAssets.length === allAssets.length && allAssets.length > 0;
  const hasSelection = selectedAssets.length > 0;

  return (
    <Card className={`border-dashed border-2 border-primary/20 bg-primary/5 ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Checkbox
              id="select-all"
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
            />
            <div>
              <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                {hasSelection
                  ? `${selectedAssets.length} of ${allAssets.length} assets selected`
                  : `Select all ${allAssets.length} assets`}
              </label>
              {hasSelection && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Zap className="h-3 w-3 text-primary" />
                  Total value: {selectedValue.toFixed(2)} ETH
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasSelection && (
              <Button variant="ghost" size="sm" onClick={onClearSelection}>
                Clear Selection
              </Button>
            )}
            <Button
              onClick={onTransfer}
              disabled={!hasSelection}
              size="sm"
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Transfer Selected
              {hasSelection && (
                <Badge variant="secondary" className="ml-1">
                  {selectedAssets.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}