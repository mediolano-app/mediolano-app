"use client"

import { useState } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDown,
  Gem,
  LayoutGrid,
  ListFilter,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react"
import Link from "next/link";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { mockNFTs, mockCollections, mockPortfolioStats } from "@/lib/dashboardData"


export default function DashboardPage() {
  const [recentAssetsCount, setRecentAssetsCount] = useState(4)
  const [userAssetsPage, setUserAssetsPage] = useState(1)
  const [userAssetsSearch, setUserAssetsSearch] = useState("")
  const [userAssetsFilter, setUserAssetsFilter] = useState("all")
  const [displayedCollections, setDisplayedCollections] = useState(6)

  const filteredUserAssets = mockNFTs.filter(
    (nft) =>
      nft.name.toLowerCase().includes(userAssetsSearch.toLowerCase()) &&
      (userAssetsFilter === "all" || nft.collection.toLowerCase() === userAssetsFilter.toLowerCase()),
  )

  const paginatedUserAssets = filteredUserAssets.slice((userAssetsPage - 1) * 6, userAssetsPage * 6)

  return (
    <div className="container mx-auto px-4 py-8 mt-10 mb-20">
      
      <main className="p-4 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Onchain Assets Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Input type="search" placeholder="Search assets..." className="flex-1" />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ListFilter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Portfolio Stats Section */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-background/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPortfolioStats.totalValue} STRK</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-background/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total NFTs</CardTitle>
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPortfolioStats.totalNFTs}</div>
              <p className="text-xs text-muted-foreground">+2 new acquisitions</p>
            </CardContent>
          </Card>
          <Card className="bg-background/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Collection</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPortfolioStats.topCollection.name}</div>
              <p className="text-xs text-muted-foreground">Value: {mockPortfolioStats.topCollection.value} ETH</p>
            </CardContent>
          </Card>
          <Card className="bg-background/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPortfolioStats.recentActivity[0].item}</div>
              <p className="text-xs text-muted-foreground">
                {mockPortfolioStats.recentActivity[0].type === "buy" ? "Bought" : "Sold"} for{" "}
                {mockPortfolioStats.recentActivity[0].price} ETH
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Recent Assets Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Recent Assets</h2>
            <Button variant="outline"><Link href="/portfolio">Open Portfolio</Link></Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockNFTs.slice(0, recentAssetsCount).map((nft) => (
              <Card key={nft.id} className="bg-background/80">
                <CardHeader>
                  <CardTitle className="truncate">{nft.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={nft.image || "/background.jpg"}
                    alt={nft.name}
                    width={200}
                    height={200}
                    className="w-full h-auto rounded-lg"
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="truncate">{nft.collection}</span>
                  <span className="flex items-center">
                    <Gem className="h-4 w-4 mr-1" />
                    {nft.floorPrice} ETH
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
          {recentAssetsCount < mockNFTs.length && (
            <div className="mt-4 text-center">
              <Button onClick={() => setRecentAssetsCount((prev) => Math.min(prev + 4, mockNFTs.length))}>
                Load More
              </Button>
            </div>
          )}
        </section>

        {/* Top Collections Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Top Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCollections.slice(0, displayedCollections).map((collection) => (
              <Card key={collection.id} className="bg-background/80">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="truncate">{collection.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Floor Price</p>
                      <p className="font-semibold">{collection.floorPrice} ETH</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">24h Volume</p>
                      <p className="font-semibold flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                        {collection.volume24h} ETH
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {displayedCollections < mockCollections.length && (
            <div className="mt-4 text-center">
              <Button onClick={() => setDisplayedCollections((prev) => Math.min(prev + 3, mockCollections.length))}>
                Load More Collections
              </Button>
            </div>
          )}
        </section>

        {/* Recent Activity Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <Card className="bg-background/80">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent NFT transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPortfolioStats.recentActivity.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <span
                          className={`flex items-center ${activity.type === "buy" ? "text-green-500" : "text-red-500"}`}
                        >
                          {activity.type === "buy" ? (
                            <ArrowDownIcon className="mr-1 h-4 w-4" />
                          ) : (
                            <ArrowUpIcon className="mr-1 h-4 w-4" />
                          )}
                          {activity.type === "buy" ? "Buy" : "Sell"}
                        </span>
                      </TableCell>
                      <TableCell>{activity.item}</TableCell>
                      <TableCell>{activity.price} ETH</TableCell>
                      <TableCell>{activity.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* User Assets Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Assets</h2>
          <Card className="bg-background/80">
            <CardHeader>
              <CardTitle>Asset List</CardTitle>
              <CardDescription>Search and filter your NFT assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Input
                  type="search"
                  placeholder="Search assets..."
                  value={userAssetsSearch}
                  onChange={(e) => setUserAssetsSearch(e.target.value)}
                  className="flex-1"
                />
                <Select value={userAssetsFilter} onValueChange={setUserAssetsFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Collections</SelectItem>
                    {Array.from(new Set(mockNFTs.map((nft) => nft.collection))).map((collection) => (
                      <SelectItem key={collection} value={collection.toLowerCase()}>
                        {collection}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Collection</TableHead>
                    <TableHead>Floor Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUserAssets.map((nft) => (
                    <TableRow key={nft.id}>
                      <TableCell className="font-medium">{nft.name}</TableCell>
                      <TableCell>{nft.collection}</TableCell>
                      <TableCell>{nft.floorPrice} ETH</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setUserAssetsPage((prev) => Math.max(prev - 1, 1))}
                  disabled={userAssetsPage === 1}
                >
                  Previous
                </Button>
                <span>
                  Page {userAssetsPage} of {Math.ceil(filteredUserAssets.length / 6)}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setUserAssetsPage((prev) => Math.min(prev + 1, Math.ceil(filteredUserAssets.length / 6)))
                  }
                  disabled={userAssetsPage === Math.ceil(filteredUserAssets.length / 6)}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

