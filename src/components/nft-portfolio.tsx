"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getNFTs } from "@/lib/mockupPortfolioData"
import type { NFT } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Filter,
  Grid,
  MoreHorizontal,
  Search,
  List,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Sparkles,
  LineChart,
  FileText,
  Send,
  RefreshCw,
} from "lucide-react"
import NFTCard from "./NFTCard"
import { PortfolioStats } from "./portfolio-stats"
import { NFTLicensings } from "./nft-licensings"
import { useMIP } from "@/hooks/useMIP"
import { pinataClient } from "@/utils/pinataClient"
import { useReadContract } from "@starknet-react/core";
import { abi } from "../../src/abis/abi";
import { type Abi } from "starknet";

import { useBlockchainPortfolio } from "@/hooks/useBlockchainPortfolio"

type SortOption = "price-high" | "price-low" | "name-asc" | "name-desc" | "date-new" | "date-old"

export type IPType = "" | "patent" | "trademark" | "copyright" | "trade_secret"

export interface IP{
  name: string,
  description: string,
  external_url: string,
  image: string,
  attributes: []
}

export default function NFTPortfolio() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const [selectedCollection, setSelectedCollection] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOption, setSortOption] = useState<SortOption>("price-high")
  const [showStats, setShowStats] = useState(true)
  const [rarityFilter, setRarityFilter] = useState<string>("all")
  const [useBlockchainData, setUseBlockchainData] = useState(false)

  const {address, balance, balanceError, tokenIds, tokenIdsError, isLoading} = useMIP();

  // const { 
  //   nfts: blockchainNFTs, 
  //   isLoading, 
  //   error, 
  //   refetch 
  // } = useBlockchainPortfolio()

  // Load saved preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem("viewMode")
      const savedSortOption = localStorage.getItem("sortOption")
      const savedUseBlockchain = localStorage.getItem("useBlockchainData")

      if (savedViewMode) setViewMode(savedViewMode as "grid" | "list")
      if (savedSortOption) setSortOption(savedSortOption as SortOption)
      if (savedUseBlockchain) setUseBlockchainData(savedUseBlockchain === "true")
    }
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("viewMode", viewMode)
      localStorage.setItem("sortOption", sortOption)
      localStorage.setItem("useBlockchainData", useBlockchainData.toString())
    }
  }, [viewMode, sortOption, 
  // useBlockchainData
  ])

  const mockNFTs = getNFTs()
  
  // const nfts = useBlockchainData ? blockchainNFTs : mockNFTs
  
  // const collections = [
  //   { id: "all", name: "All Collections" },
  //   ...Array.from(
  //     new Set(
  //       nfts.map((nft) => nft.collection.id)
  //     )
  //   ).map((collectionId) => {
  //     const collection = nfts.find(nft => nft.collection.id === collectionId)?.collection
  //     return {
  //       id: collectionId,
  //       name: collection?.name || "Unknown Collection"
  //     }
  //   })
  // ]

  const rarityOptions = [
    { value: "all", label: "All Rarities" },
    { value: "Common", label: "Common" },
    { value: "Uncommon", label: "Uncommon" },
    { value: "Rare", label: "Rare" },
    { value: "Epic", label: "Epic" },
    { value: "Legendary", label: "Legendary" },
    { value: "Mythic", label: "Mythic" },
  ]

  // Filter NFTs based on search, collection, visibility, and rarity
  // const filteredNFTs = nfts.filter((nft) => {
  //   const matchesSearch =
  //     nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     nft.collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   const matchesCollection = selectedCollection === "all" || nft.collection.id === selectedCollection
  //   const matchesRarity = rarityFilter === "all" || nft.rarity === rarityFilter

  //   return matchesSearch && matchesCollection && matchesRarity
  // })

  // Sort NFTs based on selected sort option
  // const sortedNFTs = [...filteredNFTs].sort((a, b) => {
  //   switch (sortOption) {
  //     case "price-high":
  //       return b.price - a.price
  //     case "price-low":
  //       return a.price - b.price
  //     case "name-asc":
  //       return a.name.localeCompare(b.name)
  //     case "name-desc":
  //       return b.name.localeCompare(a.name)
  //     case "date-new":
  //       return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //     case "date-old":
  //       return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  //     default:
  //       return 0
  //   }
  // })

  const getSortIcon = () => {
    if (sortOption.includes("high") || sortOption.includes("desc")) {
      return <ArrowDown className="h-4 w-4" />
    }
    return <ArrowUp className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      
      {showStats && <PortfolioStats useBlockchainData={useBlockchainData} />}

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-[350px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            disabled
            placeholder="Search by name or collection..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowStats(!showStats)}
            className={cn(showStats && "bg-muted")}
          >
            <LineChart className="h-4 w-4" />
          </Button>

          <Button disabled variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>

          {/* Toggle button between mock & real data */}
          
          {/* <Button
            variant="outline"
            size="icon"
            onClick={() => setUseBlockchainData(!useBlockchainData)}
            className={cn(useBlockchainData && "bg-muted")}
            title={useBlockchainData ? "Using blockchain data" : "Using mock data"}
          >
            <FileText className="h-4 w-4" />
          </Button>

          {useBlockchainData && (
            <Button
              variant="outline"
              size="icon"
              onClick={refetch}
              disabled={isLoading}
              title="Refresh blockchain data"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          )} */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" disabled>
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setSelectedCollection("all")}>
                  <Grid className="mr-2 h-4 w-4" />
                  Show all collections
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={rarityFilter} onValueChange={setRarityFilter}>
                  {rarityOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.value !== "all" && <Sparkles className="mr-2 h-4 w-4" />}
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1" disabled>
                <ArrowUpDown className="h-4 w-4 mr-1" />
                Sort
                {getSortIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <DropdownMenuRadioItem value="name-asc">Name: A to Z</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name-desc">Name: Z to A</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="date-new">Date: Newest First</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="date-old">Date: Oldest First</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
{/* 
          <Select value={selectedCollection} onValueChange={setSelectedCollection}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Collections</SelectLabel>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select> */}
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">My IP Collection</TabsTrigger>
          <TabsTrigger value="licensings" disabled>Licensings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* {useBlockchainData && isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading blockchain assets...</p>
            </div>
          ) : useBlockchainData && error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <Button onClick={refetch} className="mt-4">Retry</Button>
            </div>
          ) : sortedNFTs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {useBlockchainData 
                  ? "No blockchain assets found. You may not have any NFTs in your wallet." 
                  : "No NFTs found matching your criteria"}
              </p>
              {useBlockchainData && (
                <Button onClick={refetch} className="mt-4">Refresh</Button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedNFTs.map((nft) => (
                <NFTCard key={nft.id} nft={nft} onClick={() => router.push(`/assets/${nft.id}`)} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedNFTs.map((nft) => (
                <NFTListItem key={nft.id} nft={nft} onClick={() => router.push(`/assets/${nft.id}`)} />
              ))}
            </div>
          )} */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tokenIds.map((tokenId, index) => (
              <NFTCard 
              key={index} 
              tokenId={tokenId} 
              status="Protected" 
              // onClick={() => router.push(`/assets/${tokenId}`)}
  
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="licensings" className="space-y-4">
          <NFTLicensings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// function NFTCard({ tokenId, status, onClick }: { tokenId: BigInt; status: string; onClick: () => void }) {
//   const contract = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`;
// 	const [metadata, setMetadata] = useState<IP | null>(null);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [error, setError] = useState<string | null>(null);

// 	status = 'MIP';

// 	const {
// 		data: tokenURI,
// 		isLoading: isContractLoading,
// 		error: contractError,
// 	} = useReadContract({
// 		abi: abi as Abi,
// 		functionName: "tokenURI",
// 		address: contract as `0x${string}`,
// 		args: [Number(tokenId)],
// 		watch: false,
// 	});

// 	console.log("Token URI:", tokenURI);

// 	useEffect(() => {
// 		const fetchMetadata = async () => {
// 			if (!tokenURI || typeof tokenURI !== "string") {
// 				return;
// 			}

// 			try {
// 				setIsLoading(true);
//         		console.log(tokenURI);
// 				const response = await pinataClient.gateways.get(tokenURI);
// 				console.log(response);
// 				let parsedData: any;
// 				try {
// 					parsedData =
// 						typeof response.data === "string"
// 							? JSON.parse(response.data)
// 							: response.data;
// 				} catch (parseError) {
// 					throw new Error("Failed to parse metadata");
// 				}
//         console.log("METADATA",parsedData);
// 				setMetadata(parsedData);
// 				setError(null);
// 			} catch (err) {
// 				setError(
// 					err instanceof Error ? err.message : "Failed to fetch metadata",
// 				);
// 				setMetadata(null);
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};

// 		fetchMetadata();
// 	}, [tokenURI]);

// 	if (isLoading || isContractLoading) {
// 		return <div>Loading...</div>;
// 	}

// 	if (error || contractError) {
// 		return <div>Error: {error || "Failed to fetch token data"}</div>;
// 	}

// 	if (!metadata) {
// 		return <div>No metadata available</div>;
// 	}
//   return (
//     <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={onClick}>
//       <div className="relative aspect-video">
//         {/* <Image
//           src={metadata.image || "/background.jpg"}
//           alt={metadata.name}
//           fill
//           className="object-cover transition-all duration-300 hover:brightness-90"
//         /> */}
//         {/* {nft.rarity && (
//           <div className="absolute top-2 left-2">
//             <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
//               <Sparkles className="h-3 w-3 mr-1" />
//               {nft.rarity}
//             </Badge>
//           </div>
//         )} */}
//       </div>
//       <CardContent className="p-4">
//         <div className="flex justify-between items-start">
//           <div>
//             <h3 className="font-semibold text-lg">{metadata.name}</h3>
//             {/* <p className="text-sm text-muted-foreground">{metadata.collection.name}</p> */}
//           </div>
//           <NFTActionDropdown nftId={tokenId.toString()} />
//         </div>
//       </CardContent>
//       <CardFooter className="p-4 pt-0 flex justify-between">
//         <Badge variant="outline" className="text-xs">
//           {metadata.attributes[1].value}
//         </Badge>
//         <Badge variant="outline" className="text-xs">
//           {metadata.attributes[0].value}
//         </Badge>
//       </CardFooter>
//     </Card>
//   )
// }

function NFTActionDropdown({ nftId }: { nftId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            // Handle new licensing action
            console.log("New Licensing for NFT:", nftId)
          }}
        >
          <FileText className="mr-2 h-4 w-4" />
          New Licensing
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            // Handle view asset action
            console.log("View Asset:", nftId)
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Asset
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            // Handle transfer asset action
            console.log("Transfer Asset:", nftId)
          }}
        >
          <Send className="mr-2 h-4 w-4" />
          Transfer Asset
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NFTListItem({ nft, onClick }: { nft: NFT; onClick: () => void }) {
  return (
    <div
      className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
        <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{nft.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">{nft.collection.name}</p>
              <Badge variant="outline" className="text-xs">
                {nft.tokenId}
              </Badge>
              {nft.rarity && (
                <Badge variant="secondary" className="text-xs">
                  {nft.rarity}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <NFTActionDropdown nftId={nft.id} />
      </div>
    </div>
  )
}
