"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Gem,
  LayoutGrid,
  ListFilter,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { ConnectWallet } from "@/components/ConnectWallet"
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMIP } from "@/hooks/useMIP";
import { useRouter } from "next/navigation";
import NFTCard from "@/components/NFTCard";

export default function DashboardPage() {
  // const { userAssets, userCollections, portfolioStats, isLoading, account, error, refetch } = usePortfolio();

  // const [recentAssetsCount, setRecentAssetsCount] = useState(4)
  // const [userAssetsPage, setUserAssetsPage] = useState(1)
  // const [userAssetsSearch, setUserAssetsSearch] = useState("")
  // const [userAssetsFilter, setUserAssetsFilter] = useState("all")
  // const [displayedCollections, setDisplayedCollections] = useState(6)

  // const filteredUserAssets = userAssets.filter(
  //   (asset) =>
  //     asset.name.toLowerCase().includes(userAssetsSearch.toLowerCase()) &&
  //     (userAssetsFilter === "all" || asset.collection.toLowerCase() === userAssetsFilter.toLowerCase()),
  // )

  // const paginatedUserAssets = filteredUserAssets.slice((userAssetsPage - 1) * 6, userAssetsPage * 6)

  // useEffect(() => {
  //   setUserAssetsPage(1)
  // }, [userAssetsSearch, userAssetsFilter])

  const router = useRouter();
  const { address, balance, balanceError, tokenIds, tokenIdsError, isLoading } =
    useMIP();
  console.log(address);
  console.log(balance);
  console.log(tokenIds);

  return (
    <div className="container mx-auto px-4 py-8 mt-10 mb-20">
      <main className="p-4 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Onchain Assets Dashboard</h1>
          {/* <div className="flex items-center space-x-2">
            <Input 
              type="search" 
              placeholder="Search assets..." 
              className="flex-1"
              value={userAssetsSearch}
              onChange={(e) => setUserAssetsSearch(e.target.value)}
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ListFilter className="h-4 w-4" />
            </Button>
          </div> */}

          {/* put this back later */}
        </div>

        {/* Portfolio Stats Section */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-background/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Collections
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                Programmable IP Collection
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Assets
              </CardTitle>
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {address && isLoading
                  ? "Loading..."
                  : balanceError
                  ? "Error"
                  : balance.toString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Total IPs in your portfolio
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Collection
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-1xl font-bold">
                Programmable IP Collection
              </div>
              <p className="text-xs text-muted-foreground">
                {address && isLoading ? "" : "(New collections soon)"}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Activity
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-1xl font-bold">
                {address && isLoading
                  ? "Loading..."
                  : // : (portfolioStats.recentActivity.length > 0
                    // ? portfolioStats.recentActivity[0].item
                    "No recorded activity"}
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

        {/* Recent Assets Section */}
        <section>
          <div className="flex justify-between items-center mb-4 mt-10">
            <h2 className="text-2xl font-semibold">IP Assets</h2>
            <Button onClick={() => router.push("/portfolio")} variant="outline">
              Open portfolio
            </Button>
          </div>
          {address && isLoading ? (
            <div className="text-center py-8">Loading your assets...</div>
          ) : tokenIdsError ? (
            <div className="text-center py-8 text-red-500">{tokenIdsError.message}</div>          
          ) : balance === BigInt(0) ? (
            <div className="text-center py-8">
              <p>Your Programmable IP will appear here after creation.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tokenIds.map((tokenId, index) => (
                  <NFTCard key={index} tokenId={tokenId} status={"teste"} />
                ))}
                {/*                 
                {userAssets.slice(0, recentAssetsCount).map((asset) => (
                  <Card key={asset.id} className="bg-background/80">
                    <CardHeader>
                      <CardTitle className="truncate">{asset.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src={asset.image || "/background.jpg"}
                        alt={asset.name}
                        width={200}
                        height={200}
                        className="w-full h-auto rounded-lg"
                      />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <span className="truncate">{asset.collection}</span>
                      <span className="flex items-center">
                        <Gem className="h-4 w-4 mr-1" />
                        {asset.floorPrice} STRK
                      </span>
                    </CardFooter>
                  </Card>
                ))} */}
              </div>
              {/* {recentAssetsCount < userAssets.length && (
                <div className="mt-4 text-center">
                  <Button onClick={() => setRecentAssetsCount((prev) => Math.min(prev + 4, userAssets.length))}>
                    Load More
                  </Button>
                </div>
              )} */}
            </>
          )}
        </section>

        {/* Top Collections Section */}
        {/* <section>
          <h2 className="text-2xl font-semibold mb-4">Your Collections</h2>
          {account && isLoading ? (
            <div className="text-center py-8">Loading your collections...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : userCollections.length === 0 ? (
            <div className="text-center py-8">You don&apos;t have any collections yet.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userCollections.slice(0, displayedCollections).map((collection) => (
                  <Card key={collection.id} className="bg-background/80">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Image
                          src={collection.image || "/background.jpg"}
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
                          <p className="font-semibold">{collection.floorPrice} STRK</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Assets</p>
                          <p className="font-semibold flex items-center">
                            <LayoutGrid className="h-4 w-4 mr-1 text-green-500" />
                            {collection.tokenCount}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {displayedCollections < userCollections.length && (
                <div className="mt-4 text-center">
                  <Button onClick={() => setDisplayedCollections((prev) => Math.min(prev + 3, userCollections.length))}>
                    Load More Collections
                  </Button>
                </div>
              )}
            </>
          )}
        </section> */}

        {/* Recent Activity Section */}
        {/* <section>
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <Card className="bg-background/80">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent NFT transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {account && isLoading ? (
                <div className="text-center py-8">Loading your activity...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : portfolioStats.recentActivity.length === 0 ? (
                <div className="text-center py-8">No recent activity found.</div>
              ) : (
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
                    {portfolioStats.recentActivity.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <span
                            className={`flex items-center ${activity.type === "buy" || activity.type === "mint" ? "text-green-500" : "text-red-500"}`}
                          >
                            {activity.type === "buy" || activity.type === "mint" ? (
                              <ArrowDownIcon className="mr-1 h-4 w-4" />
                            ) : (
                              <ArrowUpIcon className="mr-1 h-4 w-4" />
                            )}
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{activity.item}</TableCell>
                        <TableCell>{activity.price} STRK</TableCell>
                        <TableCell>{activity.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section> */}

        {/* User Assets Section */}
        {/* <section>
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
                    {Array.from(new Set(userAssets.map((asset) => asset.collection))).map((collection) => (
                      <SelectItem key={collection} value={collection.toLowerCase()}>
                        {collection}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {account && isLoading ? (
                <div className="text-center py-8">Loading your assets...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : filteredUserAssets.length === 0 ? (
                <div className="text-center py-8">
                  {userAssetsSearch || userAssetsFilter !== "all" 
                    ? "No assets match your search criteria." 
                    : "You don't have any assets yet."}
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Collection</TableHead>
                        <TableHead>Floor Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUserAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium">{asset.name}</TableCell>
                          <TableCell>{asset.collection}</TableCell>
                          <TableCell>{asset.floorPrice} STRK</TableCell>
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
                      Page {userAssetsPage} of {Math.ceil(filteredUserAssets.length / 6) || 1}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setUserAssetsPage((prev) => Math.min(prev + 1, Math.ceil(filteredUserAssets.length / 6)))
                      }
                      disabled={userAssetsPage === Math.ceil(filteredUserAssets.length / 6) || filteredUserAssets.length === 0}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section> */}
      </main>
    </div>
  );
}
