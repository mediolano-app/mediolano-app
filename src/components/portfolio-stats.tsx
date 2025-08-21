"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getNFTs } from "@/lib/mockupPortfolioData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, TrendingUp, Wallet, BarChart3, LayoutGrid } from "lucide-react"
import { useBlockchainPortfolio } from "@/hooks/useBlockchainPortfolio"
import { NFTLicensings } from "./nft-licensings"
import { useMIP } from "@/hooks/contracts/use-mip"
import { pinataClient } from "@/utils/pinataClient"
import { useReadContract } from "@starknet-react/core";
import { abi } from "../../src/abis/abi";
import { type Abi } from "starknet";



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


    const {address, balance, balanceError, tokenIds, tokenIdsError, isLoading} = useMIP();
  
  
  // Get blockchain data
  const { 
    userAssets: blockchainAssets, 
    userCollections: blockchainCollections,
    portfolioStats: blockchainStats,
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
    <>
    
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-background/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                1
              </div>
              <p className="text-xs text-muted-foreground">IP Collection</p>
            </CardContent>
          </Card>
          <Card className="bg-background/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {address && isLoading ? "Loading..." : balanceError ? "Error" : balance.toString()}
              </div>
              <p className="text-xs text-muted-foreground">Total IPs in your portfolio</p>
            </CardContent>
          </Card>
          <Card className="bg-background/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Collection</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-1xl font-bold">
                   IP Collection
              </div>
              <p className="text-xs text-muted-foreground">
                {address && isLoading ? "" : "(New collections soon)"}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-1xl font-bold">
                {address && isLoading ? "Loading..." 
                  // : (portfolioStats.recentActivity.length > 0 
                  // ? portfolioStats.recentActivity[0].item 
                  : "No recorded activity"}
              </div>
              <p className="text-xs text-muted-foreground">
                {address && isLoading ? "" 
                  // : (portfolioStats.recentActivity.length > 0 
                  // ? `${portfolioStats.recentActivity[0].type === "buy" ? "Bought" : "Sold"} for ${portfolioStats.recentActivity[0].price} STRK` 
                  : "(Preview)"}
              </p>
            </CardContent>
          </Card>
        </section>
    
    </>
  )
}

