"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid3X3, Wallet, BarChart3 } from "lucide-react"
import { Collection } from "@/lib/types"
import { RemixStatsWidget } from "@/components/remix/remix-stats-widget"
import { TokenData } from "@/hooks/use-portfolio"

interface CollectionStatsProps {
  totalCollections: number;
  totalAssets: number;
  totalValue: number;
  topCollection: {
    name: string;
    value: number;
    tokenCount: number;
  };
  collections?: Collection[]; // Add collections data
  tokens?: Record<string, TokenData[]>;
}

export function CollectionStats({
  totalCollections,
  totalAssets,
  totalValue,
  topCollection,
  collections = [],
  tokens = {}
}: CollectionStatsProps) {

  // Calculate average collection size based on actual collection data
  const calculateAverageCollectionSize = () => {
    if (!collections || collections.length === 0) {
      return totalCollections > 0 ? totalAssets / totalCollections : 0;
    }

    // Sum up all collection item counts
    const totalItems = collections.reduce((sum, collection) => {
      const itemCount = collection.totalMinted - collection.totalBurned;
      return sum + itemCount;
    }, 0);

    return totalItems / collections.length;
  };

  const averageCollectionSize = calculateAverageCollectionSize();

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collections</CardTitle>
          <Grid3X3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCollections}</div>
          <p className="text-xs text-muted-foreground">with {totalAssets} IPs</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">IP Assets</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssets}</div>
          <p className="text-xs text-muted-foreground">onchain</p>
        </CardContent>
      </Card>

      <RemixStatsWidget tokens={tokens} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Collection</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(averageCollectionSize)}</div>
          <p className="text-xs text-muted-foreground">IPs per collection</p>
        </CardContent>
      </Card>
    </div>
  )
}