"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getNFTs } from "@/lib/mockupPortfolioData"
import type { Collection } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Grid3X3,
  BarChart3,
  Grid,
  List,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Star,
  Filter,
} from "lucide-react"

type SortOption = "value-high" | "value-low" | "name-asc" | "name-desc" | "size-high" | "size-low"

export function CollectionsGrid({ collections }: { collections: Collection[] }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOption, setSortOption] = useState<SortOption>("value-high")
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const nfts = getNFTs()

  // Filter collections based on search query and featured status
  const filteredCollections = collections.filter((collection) => {
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFeatured = featuredOnly ? collection.id === "bored-ape" || collection.id === "cryptopunks" : true // Mock featured collections
    return matchesSearch && matchesFeatured
  })

  // Get NFT count for each collection
  const getCollectionNFTCount = (collectionId: string) => {
    return nfts.filter((nft) => nft.collection.id === collectionId).length
  }

  // Get total value for each collection
  const getCollectionValue = (collectionId: string) => {
    return nfts.filter((nft) => nft.collection.id === collectionId).reduce((sum, nft) => sum + nft.price, 0)
  }

  // Sort collections based on selected sort option
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch (sortOption) {
      case "value-high":
        return getCollectionValue(b.id) - getCollectionValue(a.id)
      case "value-low":
        return getCollectionValue(a.id) - getCollectionValue(b.id)
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "size-high":
        return getCollectionNFTCount(b.id) - getCollectionNFTCount(a.id)
      case "size-low":
        return getCollectionNFTCount(a.id) - getCollectionNFTCount(b.id)
      default:
        return 0
    }
  })

  const getSortIcon = () => {
    if (sortOption.includes("high") || sortOption.includes("desc")) {
      return <ArrowDown className="h-4 w-4" />
    }
    return <ArrowUp className="h-4 w-4" />
  }

  // Find featured collections for the featured section
  const featuredCollections = collections.filter((c) => c.id === "bored-ape" || c.id === "cryptopunks").slice(0, 1)
  const featuredCollection = featuredCollections.length > 0 ? featuredCollections[0] : null

  return (
    <div className="space-y-8">
      {featuredCollection && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Featured Collection</h2>
          <FeaturedCollectionCard
            collection={featuredCollection}
            nftCount={getCollectionNFTCount(featuredCollection.id)}
            totalValue={getCollectionValue(featuredCollection.id)}
            onClick={() => router.push(`/collections/${featuredCollection.id}`)}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-[350px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search collections..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFeaturedOnly(!featuredOnly)}>
                <Star
                  className={cn(
                    "mr-2 h-4 w-4",
                    featuredOnly && "text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400",
                  )}
                />
                {featuredOnly ? "Show all collections" : "Show featured only"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <ArrowUpDown className="h-4 w-4 mr-1" />
                <span className="hidden xs:inline">Sort</span>
                {getSortIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <DropdownMenuRadioItem value="value-high">Price: High to Low</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="value-low">Price: Low to High</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name-asc">Name: A to Z</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name-desc">Name: Z to A</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="size-high">Size: Large to Small</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="size-low">Size: Small to Large</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="gap-1 ml-auto sm:ml-0">
            <Plus className="h-4 w-4" />
            <span className="hidden xs:inline">New Collection</span>
          </Button>
        </div>
      </div>

      {filteredCollections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No collections found matching your criteria</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              nftCount={getCollectionNFTCount(collection.id)}
              totalValue={getCollectionValue(collection.id)}
              onClick={() => router.push(`/collections/${collection.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCollections.map((collection) => (
            <CollectionListItem
              key={collection.id}
              collection={collection}
              nftCount={getCollectionNFTCount(collection.id)}
              totalValue={getCollectionValue(collection.id)}
              onClick={() => router.push(`/collections/${collection.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CollectionCardProps {
  collection: Collection
  nftCount: number
  totalValue: number
  onClick: () => void
}

function CollectionCard({ collection, nftCount, totalValue, onClick }: CollectionCardProps) {
  // Get a random image from the collection to display as cover
  const nfts = getNFTs().filter((nft) => nft.collection.id === collection.id)
  const coverImage = nfts.length > 0 ? nfts[0].image : "/placeholder.svg?height=400&width=600"

  // Check if this is a featured collection (mock data)
  const isFeatured = collection.id === "bored-ape" || collection.id === "cryptopunks"

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer group" onClick={onClick}>
      <div className="relative h-40 w-full">
        <Image
          src={coverImage || "/placeholder.svg"}
          alt={collection.name}
          fill
          className="object-cover transition-all duration-300 group-hover:brightness-90"
        />
        {collection.floorPrice && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-background/80 backdrop-blur-sm">Floor: {collection.floorPrice} ETH</Badge>
          </div>
        )}
        {isFeatured && (
          <div className="absolute top-2 left-2">
            <Badge
              variant="secondary"
              className="bg-yellow-500/90 hover:bg-yellow-500/80 dark:bg-yellow-500/80 dark:hover:bg-yellow-500/70 text-primary-foreground border-none"
            >
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <h3 className="text-xl font-bold">{collection.name}</h3>
        <CollectionActionDropdown collectionId={collection.id} />
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {collection.description || "No description available"}
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-1 text-sm">
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
            <span>{nftCount} NFTs</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span>{totalValue.toFixed(2)} ETH</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

function CollectionListItem({ collection, nftCount, totalValue, onClick }: CollectionCardProps) {
  // Get a random image from the collection to display as cover
  const nfts = getNFTs().filter((nft) => nft.collection.id === collection.id)
  const coverImage = nfts.length > 0 ? nfts[0].image : "/placeholder.svg?height=400&width=600"

  // Check if this is a featured collection (mock data)
  const isFeatured = collection.id === "bored-ape" || collection.id === "cryptopunks"

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="relative h-16 w-16 sm:w-24 rounded-md overflow-hidden flex-shrink-0">
        <Image src={coverImage || "/placeholder.svg"} alt={collection.name} fill className="object-cover" />
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-start">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium">{collection.name}</h3>
              {isFeatured && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/90 hover:bg-yellow-500/80 dark:bg-yellow-500/80 dark:hover:bg-yellow-500/70 text-primary-foreground border-none"
                >
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {collection.description || "No description available"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <div className="flex items-center gap-1 text-sm">
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
            <span>{nftCount} NFTs</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span>{totalValue.toFixed(2)} ETH</span>
          </div>
        </div>
        <CollectionActionDropdown collectionId={collection.id} />
      </div>
    </div>
  )
}

function FeaturedCollectionCard({ collection, nftCount, totalValue, onClick }: CollectionCardProps) {
  // Get images from the collection to display
  const nfts = getNFTs()
    .filter((nft) => nft.collection.id === collection.id)
    .slice(0, 4)
  const coverImage = nfts.length > 0 ? nfts[0].image : "/placeholder.svg?height=400&width=600"

  return (
    <div className="rounded-xl overflow-hidden border cursor-pointer hover:shadow transition-all" onClick={onClick}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="relative h-64 md:h-auto">
          <Image src={coverImage || "/placeholder.svg"} alt={collection.name} fill className="object-cover" />
          <div className="absolute top-4 left-4">
            <Badge
              variant="secondary"
              className="bg-yellow-500/90 hover:bg-yellow-500/80 dark:bg-yellow-500/80 dark:hover:bg-yellow-500/70 text-primary-foreground border-none"
            >
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured Collection
            </Badge>
          </div>
        </div>
        <div className="p-4 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-xl md:text-2xl font-bold mb-2">{collection.name}</h2>
              <CollectionActionDropdown collectionId={collection.id} />
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 md:line-clamp-none">
              {collection.description}
            </p>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="space-y-1">
                <p className="text-xs md:text-sm text-muted-foreground">Total NFTs</p>
                <p className="text-lg md:text-xl font-bold">{nftCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs md:text-sm text-muted-foreground">Total Value</p>
                <p className="text-lg md:text-xl font-bold">{totalValue.toFixed(2)} ETH</p>
              </div>
              {collection.floorPrice && (
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Floor Price</p>
                  <p className="text-lg md:text-xl font-bold">{collection.floorPrice} ETH</p>
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium mb-2">Preview</p>
            <div className="flex gap-2">
              {nfts.map((nft, index) => (
                <div key={nft.id} className="relative h-12 w-12 rounded-md overflow-hidden">
                  <Image
                    src={nft.image || "/placeholder.svg"}
                    alt={`${collection.name} NFT ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CollectionActionDropdown({ collectionId }: { collectionId: string }) {
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
            // Handle edit collection action
            console.log("Edit Collection:", collectionId)
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Collection
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            // Handle add NFT action
            console.log("Add NFT to Collection:", collectionId)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add NFT
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            // Handle delete collection action
            console.log("Delete Collection:", collectionId)
          }}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Collection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

