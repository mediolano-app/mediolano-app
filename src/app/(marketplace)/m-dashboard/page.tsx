"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight, Activity, TrendingUp, DollarSign, BarChart2 } from "lucide-react"
import { NFTCard } from "@/components/marketplace/ProductCard"
import { nfts } from "@/lib/mockMktData"

// Enhanced mock data for the dashboard
const dashboardData = {
  overview: {
    totalSales: 15.5,
    totalRevenue: 12500,
    averagePrice: 806.45,
    activeListings: 7,
    totalVolume: 25000,
    floorPrice: 0.25,
  },
  recentTransactions: [
    { id: "1", type: "sale", item: "Cosmic Dream #1", price: 0.5, date: "2023-05-01", buyer: "0xabcd...1234" },
    { id: "2", type: "purchase", item: "Pixel Punk #3", price: 0.3, date: "2023-04-28", seller: "0x9876...5432" },
    {
      id: "3",
      type: "transfer",
      item: "Nature's Beauty",
      to: "0x1234...5678",
      date: "2023-04-25",
      from: "0xfedc...7890",
    },
    { id: "4", type: "sale", item: "Digital Dreamscape", price: 0.75, date: "2023-04-22", buyer: "0x2468...1357" },
    { id: "5", type: "purchase", item: "Neon Nights", price: 0.4, date: "2023-04-20", seller: "0x1357...2468" },
  ],
  topNFTs: [
    { id: "1", name: "Cosmic Dream #1", sales: 5, revenue: 2500, avgPrice: 500 },
    { id: "2", name: "Pixel Punk #3", sales: 3, revenue: 1500, avgPrice: 500 },
    { id: "3", name: "Nature's Beauty", sales: 2, revenue: 1000, avgPrice: 500 },
    { id: "4", name: "Digital Dreamscape", sales: 4, revenue: 3000, avgPrice: 750 },
    { id: "5", name: "Neon Nights", sales: 3, revenue: 1200, avgPrice: 400 },
  ],
  starknetActivity: [
    { id: "1", type: "Mint", item: "Cosmic Dream #2", transactionHash: "0x123...abc", date: "2023-05-02" },
    {
      id: "2",
      type: "Transfer",
      item: "Pixel Punk #5",
      from: "0xdef...456",
      to: "0x789...ghi",
      transactionHash: "0x456...def",
      date: "2023-05-01",
    },
    { id: "3", type: "Sale", item: "Digital Horizon", price: 0.6, transactionHash: "0x789...jkl", date: "2023-04-30" },
    { id: "4", type: "Bid", item: "Ethereal Essence", price: 0.4, transactionHash: "0xabc...123", date: "2023-04-29" },
    {
      id: "5",
      type: "Listing",
      item: "Quantum Quill",
      price: 0.55,
      transactionHash: "0xdef...456",
      date: "2023-04-28",
    },
  ],
}

const recentAssets = nfts.slice(0, 3).map(nft => ({
  ...nft,
  categoryLink: `/m-category/${nft.category.toLowerCase()}`, // Add categoryLink property
}))

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Seller Dashboard</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.totalSales} ETH</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData.overview.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">+15.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData.overview.averagePrice}</div>
            <p className="text-xs text-muted-foreground">-3.4% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.activeListings}</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData.overview.totalVolume}</div>
            <p className="text-xs text-muted-foreground">+12.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Floor Price</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.floorPrice} ETH</div>
            <p className="text-xs text-muted-foreground">+0.05 ETH from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center">
                  {transaction.type === "sale" && <ArrowUpRight className="h-4 w-4 mr-2 text-green-500" />}
                  {transaction.type === "purchase" && <ArrowDownRight className="h-4 w-4 mr-2 text-red-500" />}
                  {transaction.type === "transfer" && <ArrowLeftRight className="h-4 w-4 mr-2 text-blue-600" />}
                  <div className="flex-1">
                    <p className="font-medium">{transaction.item}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                  {transaction.price && <p className="font-medium">{transaction.price} ETH</p>}
                  {transaction.buyer && <p className="text-sm text-muted-foreground">Buyer: {transaction.buyer}</p>}
                  {transaction.seller && <p className="text-sm text-muted-foreground">Seller: {transaction.seller}</p>}
                  {transaction.to && <p className="text-sm text-muted-foreground">To: {transaction.to}</p>}
                  {transaction.from && <p className="text-sm text-muted-foreground">From: {transaction.from}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing NFTs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topNFTs.map((nft) => (
                <div key={nft.id} className="flex items-center">
                  <div className="flex-1">
                    <p className="font-medium">{nft.name}</p>
                    <p className="text-sm text-muted-foreground">{nft.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${nft.revenue}</p>
                    <p className="text-sm text-muted-foreground">Avg: ${nft.avgPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentAssets.map((nft) => (
            <NFTCard key={nft.id} {...nft} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Starknet Blockchain Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>Recent Starknet Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.starknetActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="flex-1">
                    <p className="font-medium">
                      {activity.type}: {activity.item}
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                    <p className="text-xs text-muted-foreground">Tx: {activity.transactionHash}</p>
                  </div>
                  {activity.price && <p className="font-medium">{activity.price} ETH</p>}
                  {activity.from && <p className="text-sm text-muted-foreground">From: {activity.from}</p>}
                  {activity.to && <p className="text-sm text-muted-foreground">To: {activity.to}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

