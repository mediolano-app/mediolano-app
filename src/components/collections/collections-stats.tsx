"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid3X3, Wallet, BarChart3 } from "lucide-react"
import { Collection } from "@/hooks/use-collection"

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
}

export function CollectionStats({
  totalCollections,
  totalAssets,
  totalValue,
  topCollection,
  collections = []
}: CollectionStatsProps) {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "year">("month")

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

  // Mock data for collection growth 
  const growthData = {
    day: 0.0,
    week: 0.0,
    month: 0.0,
    year: 0.0,
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Growth</CardTitle>
          <div>
            <Tabs defaultValue={timeframe} onValueChange={(v) => setTimeframe(v as "day" | "week" | "month" | "year")}>
              <TabsList className="h-7 w-fit">
                <TabsTrigger value="day" className="text-xs px-2">
                  1D
                </TabsTrigger>
                <TabsTrigger value="week" className="text-xs px-2">
                  1W
                </TabsTrigger>
                <TabsTrigger value="month" className="text-xs px-2">
                  1M
                </TabsTrigger>
                <TabsTrigger value="year" className="text-xs px-2">
                  1Y
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{growthData[timeframe]}%</div>
          <p className="text-xs text-muted-foreground">Compared to previous {timeframe}</p>
        </CardContent>
      </Card>

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