"use client"

import { useState } from "react"
import { getNFTs } from "@/lib/mockupPortfolioData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, TrendingUp, Wallet, BarChart3 } from "lucide-react"
import { useBlockchainPortfolio } from "@/hooks/useBlockchainPortfolio"

interface PortfolioStatsProps {
  useBlockchainData?: boolean;
}

type TimeframeValue = "day" | "week" | "month" | "year";

// Type for the highest value NFT to handle both blockchain and mock data
type HighestValueNFT = {
  name: string;
  price?: number;
  floorPrice?: number;
  collection: string | { name: string; id: string };
};

export function PortfolioStats({ useBlockchainData = false }: PortfolioStatsProps) {
  const [timeframe, setTimeframe] = useState<TimeframeValue>("month")
  
  // Get blockchain data
  const { 
    userAssets: blockchainAssets, 
    userCollections: blockchainCollections,
    portfolioStats: blockchainStats,
    isLoading
  } = useBlockchainPortfolio()
  
  // Get mock data as fallback
  const mockNFTs = getNFTs()

  // Calculate portfolio stats based on data source
  let totalValue: number;
  let totalNFTs: number;
  let uniqueCollections: number;
  let highestValueNFT: HighestValueNFT;
  
  if (useBlockchainData) {
    // Use blockchain data
    totalValue = blockchainStats.totalValue;
    totalNFTs = blockchainStats.totalNFTs;
    uniqueCollections = blockchainCollections.length;
    
    // Find highest value NFT
    highestValueNFT = blockchainAssets.length > 0 
      ? blockchainAssets.reduce((prev, current) => (prev.floorPrice > current.floorPrice ? prev : current))
      : { name: "No assets", collection: "None", floorPrice: 0 };
  } else {
    // Use mock data
    totalValue = mockNFTs.reduce((sum, nft) => sum + nft.price, 0);
    totalNFTs = mockNFTs.length;
    uniqueCollections = new Set(mockNFTs.map((nft) => nft.collection.id)).size;
    
    // Find highest value NFT
    const highestNFT = mockNFTs.reduce((prev, current) => (prev.price > current.price ? prev : current));
    highestValueNFT = {
      name: highestNFT.name,
      price: highestNFT.price,
      collection: highestNFT.collection
    };
  }

  // Mock data for portfolio growth
  const growthData = {
    day: 1.2,
    week: 3.8,
    month: 12.5,
    year: 42.7,
  }

  // Helper function to get the NFT price based on data source
  const getNFTPrice = () => {
    if (useBlockchainData) {
      return highestValueNFT.floorPrice || 0;
    } else {
      return highestValueNFT.price || 0;
    }
  };

  // Helper function to get the collection name based on data source
  const getCollectionName = () => {
    if (useBlockchainData) {
      return highestValueNFT.collection as string;
    } else {
      const collection = highestValueNFT.collection as { name: string };
      return collection.name;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {useBlockchainData && isLoading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : (
            <>
              <div className="text-2xl font-bold">{totalValue.toFixed(2)} {useBlockchainData ? 'STRK' : 'ETH'}</div>
              <p className="text-xs text-muted-foreground">≈ ${(totalValue * (useBlockchainData ? 1500 : 3500)).toLocaleString()}</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Growth</CardTitle>
          <div>
            <Tabs defaultValue={timeframe} onValueChange={(v) => setTimeframe(v as TimeframeValue)}>
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
          {useBlockchainData && isLoading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : (
            <>
              <div className="text-2xl font-bold">{totalNFTs}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">NFTs across {uniqueCollections} collections</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Highest Value NFT</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {useBlockchainData && isLoading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {getNFTPrice()} {useBlockchainData ? 'STRK' : 'ETH'}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {highestValueNFT.name} ({getCollectionName()})
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

