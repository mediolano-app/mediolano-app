"use client"

import { useState } from "react"
import { getCollections, getNFTs } from "@/lib/mockupPortfolioData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid3X3, Wallet, BarChart3 } from "lucide-react"

export function CollectionStats() {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "year">("month")
  const collections = getCollections()
  const nfts = getNFTs()

  // Calculate collection stats
  const totalCollections = collections.length
  const totalNFTs = nfts.length
  const totalValue = nfts.reduce((sum, nft) => sum + nft.price, 0)
  const averageCollectionSize = totalCollections > 0 ? totalNFTs / totalCollections : 0

  // Mock data for collection growth
  const growthData = {
    day: 0.5,
    week: 2.3,
    month: 8.7,
    year: 32.1,
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
          <p className="text-xs text-muted-foreground">Across {totalNFTs} NFTs</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalValue.toFixed(2)} ETH</div>
          <p className="text-xs text-muted-foreground">≈ ${(totalValue * 3500).toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collection Growth</CardTitle>
          <div>
            <Tabs defaultValue={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
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
          <CardTitle className="text-sm font-medium">Average Collection Size</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageCollectionSize.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">NFTs per collection</p>
        </CardContent>
      </Card>
    </div>
  )
}

