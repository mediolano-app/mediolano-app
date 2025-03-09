"use client"

import { useState } from "react"
import Link from "next/link"
import { EclipseIcon as Ethereum, ArrowRight, Wallet, Clock, BarChart3, Image, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { portfolioSummary, recentTransactions, topCollections, ownedNFTs } from "@/lib/mockDashboardPreviewData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="bg-muted/50 rounded-xl p-4 md:p-6 shadow-lg">
      <h3 className="text-2xl font-bold mb-6">Assets Dashboard</h3>
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <Ethereum className="w-4 h-4 text-primary" />
                  <span className="text-2xl font-bold">{portfolioSummary.totalValue}</span>
                  <span className="text-muted-foreground">ETH</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {portfolioSummary.changeDirection === "up" ? "+" : "-"}
                  {portfolioSummary.changePercentage}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">NFTs Owned</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{portfolioSummary.nftCount}</div>
                <p className="text-xs text-muted-foreground">Across collections</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentTransactions.length}</div>
                <p className="text-xs text-muted-foreground">Transactions this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Collection</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold truncate">{topCollections[0].name}</div>
                <p className="text-xs text-muted-foreground">Most traded this week</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>NFT</TableHead>
                      <TableHead>Collection</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.slice(0, 3).map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className={transaction.type === "buy" ? "text-green-500" : "text-red-500"}>
                          {transaction.type === "buy" ? "Buy" : "Sell"}
                        </TableCell>
                        <TableCell>
                          <Link href={`/asset/${transaction.id}`} className="hover:underline">
                            {transaction.nftName}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link href={`/collection/${transaction.collectionId}`} className="hover:underline">
                            {transaction.collection}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Collection</TableHead>
                      <TableHead>NFT Type</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCollections.slice(0, 3).map((collection) => (
                      <TableRow key={collection.id}>
                        <TableCell>
                          <Link href={`/collection/${collection.id}`} className="hover:underline">
                            {collection.name}
                          </Link>
                        </TableCell>
                        <TableCell>{collection.nftType}</TableCell>
                        <TableCell>
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/collection/${collection.id}`}>
                              View <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>Your NFT Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownedNFTs.map((nft) => (
                  <Card key={nft.id} className="flex flex-col">
                    <CardHeader className="p-4">
                      <div className="aspect-square relative mb-2">
                        <img src={nft.image || "/background.jpg"} alt={nft.name} className="object-cover rounded-lg" />
                      </div>
                      <CardTitle className="text-lg">
                        <Link href={`/asset/${nft.id}`} className="hover:underline">
                          {nft.name}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-grow">
                      <div className="flex flex-col space-y-2">
                        <Badge variant="secondary">{nft.ipType}</Badge>
                        <Link
                          href={`/collection/${nft.collectionId}`}
                          className="text-sm text-muted-foreground hover:underline"
                        >
                          {nft.collection}
                        </Link>
                      </div>
                    </CardContent>
                    <div className="p-4 pt-0 flex justify-between">
                      <Button asChild size="sm">
                        <Link href={`/asset/${nft.id}`}>
                          View Details <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>NFT</TableHead>
                    <TableHead>Collection</TableHead>
                    <TableHead>NFT Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className={transaction.type === "buy" ? "text-green-500" : "text-red-500"}>
                        {transaction.type === "buy" ? "Buy" : "Sell"}
                      </TableCell>
                      <TableCell>
                        <Link href={`/asset/${transaction.id}`} className="hover:underline">
                          {transaction.nftName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/collection/${transaction.collectionId}`} className="hover:underline">
                          {transaction.collection}
                        </Link>
                      </TableCell>
                      <TableCell>{transaction.nftType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="market">
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Collection</TableHead>
                    <TableHead>NFT Type</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCollections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        <Link href={`/collection/${collection.id}`} className="hover:underline font-medium">
                          {collection.name}
                        </Link>
                      </TableCell>
                      <TableCell>{collection.nftType}</TableCell>
                      <TableCell>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/collection/${collection.id}`}>
                            View Collection <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button size="lg" className="group">
          Explore Full Dashboard
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </div>
  )
}

