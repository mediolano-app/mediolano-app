"use client"

import { useState } from "react"
import { getNFTs } from "@/lib/mockupPortfolioData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, TrendingUp, Wallet, BarChart3 } from "lucide-react"

export function PortfolioStats() {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "year">("month")
  const nfts = getNFTs()

  // Calculate portfolio stats
  const totalValue = nfts.reduce((sum, nft) => sum + nft.price, 0)
  const totalNFTs = nfts.length
  const uniqueCollections = new Set(nfts.map((nft) => nft.collection.id)).size

  // Mock data for portfolio growth
  const growthData = {
    day: 1.2,
    week: 3.8,
    month: 12.5,
    year: 42.7,
  }

  // Mock data for highest value NFT
  const highestValueNFT = nfts.reduce((prev, current) => (prev.price > current.price ? prev : current))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          <CardTitle className="text-sm font-medium">Portfolio Growth</CardTitle>
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
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold">+{growthData[timeframe]}%</div>
            <div className="text-sm text-green-500 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>Up</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Compared to previous {timeframe}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collection Stats</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalNFTs}</div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">NFTs across {uniqueCollections} collections</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Highest Value NFT</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highestValueNFT.price} ETH</div>
          <p className="text-xs text-muted-foreground truncate">
            {highestValueNFT.name} ({highestValueNFT.collection.name})
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

