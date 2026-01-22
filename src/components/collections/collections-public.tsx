"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
  Box,
  X,
} from "lucide-react"
import { ReportAssetDialog } from "@/components/report-asset-dialog"

type SortOption = "date-new" | "date-old" | "name-asc" | "name-desc" | "assets-high" | "assets-low"

export function CollectionsGrid({ collections, onCollectionClick }: { collections: Collection[], onCollectionClick?: (collection: Collection) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOption, setSortOption] = useState<SortOption>("date-new")
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [reportDialogState, setReportDialogState] = useState<{ isOpen: boolean; collectionId: string; collectionName: string }>({
    isOpen: false,
    collectionId: "",
    collectionName: ""
  })

  // Filter collections based on search query and featured status
  const filteredCollections = collections.filter((collection) => {
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFeatured = featuredOnly ? String(collection.id) === "bored-ape" || String(collection.id) === "cryptopunks" : true // Mock featured collections
    return matchesSearch && matchesFeatured
  })

  // Sort collections based on selected sort option
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch (sortOption) {
      case "date-new":
        return Number(b.lastMintTime || 0) - Number(a.lastMintTime || 0)
      case "date-old":
        return Number(a.lastMintTime || 0) - Number(b.lastMintTime || 0)
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "assets-high":
        return (b.itemCount || 0) - (a.itemCount || 0)
      case "assets-low":
        return (a.itemCount || 0) - (b.itemCount || 0)
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
  const featuredCollections = collections.filter((c) => String(c.id) === "bored-ape" || String(c.id) === "cryptopunks").slice(0, 1)
  const featuredCollection = featuredCollections.length > 0 ? featuredCollections[0] : null

  return (
    <div className="space-y-2">

      {/*}
      {featuredCollection && (
        <div className="mb-10">
          <FeaturedCollectionCard
            collection={featuredCollection}
            nftCount={featuredCollection.itemCount}
            onReportClick={() => setReportDialogState({
              isOpen: true,
              collectionId: String(featuredCollection.id),
              collectionName: featuredCollection.name
            })}
          />
        </div>
      )}*/}



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
                <DropdownMenuRadioItem value="date-new">Date: Newest</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="date-old">Date: Oldest</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name-asc">Name: A to Z</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name-desc">Name: Z to A</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="assets-high">Assets: High to Low</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="assets-low">Assets: Low to High</DropdownMenuRadioItem>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {sortedCollections.map((collection: Collection) => (
            <CollectionCard
              key={String(collection.id)}
              collection={collection}
              nftCount={collection.itemCount}
              onReportClick={() => setReportDialogState({
                isOpen: true,
                collectionId: String(collection.id),
                collectionName: collection.name
              })}
              onCollectionClick={onCollectionClick ? () => onCollectionClick(collection) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCollections.map((collection) => (
            <CollectionListItem
              key={String(collection.id)}
              collection={collection}
              nftCount={collection.itemCount}
              onReportClick={() => setReportDialogState({
                isOpen: true,
                collectionId: String(collection.id),
                collectionName: collection.name
              })}
              onCollectionClick={onCollectionClick ? () => onCollectionClick(collection) : undefined}
            />
          ))}
        </div>
      )}

      <ReportAssetDialog
        contentId={reportDialogState.collectionId}
        contentName={reportDialogState.collectionName}
        contentType="collection"
        open={reportDialogState.isOpen}
        onOpenChange={(open) => setReportDialogState(prev => ({ ...prev, isOpen: open }))}
      />
    </div>
  )
}

interface CollectionCardProps {
  collection: Collection
  nftCount: number
  onReportClick: () => void
  onCollectionClick?: () => void
}



function CollectionCard({ collection, nftCount, onReportClick, onCollectionClick }: CollectionCardProps) {
  const isFeatured = String(collection.id) === "5" || String(collection.id) === "0"
  if (isFeatured) { console.log("featured collection", collection.id) }
  console.log("collection", collection.id)
  const coverImage = collection.image || "/background.jpg"

  return (
    <Card
      className={cn(
        "bg-card/60 overflow-hidden transition-all hover:shadow-md cursor-pointer group hover:border-primary/50",
        onCollectionClick && "hover:ring-2 hover:ring-primary"
      )}
      onClick={onCollectionClick}
    >
      <div className={cn("contents", !onCollectionClick && "cursor-default")}>
        {!onCollectionClick ? (
          <Link href={`/collections/${collection.nftAddress || String(collection.id)}`}>
            <div className="relative h-64 w-full">
              <Image
                src={coverImage || "/background.jpg"}
                alt={collection.name}
                fill
                className="object-cover transition-all duration-300 group-hover:brightness-90 group-hover:scale-105"
              />
              {collection.floorPrice && (
                <div className="absolute bottom-2 right-2">
                  <Badge className="bg-blue/80 backdrop-blur-sm">Floor: {collection.floorPrice} STRK</Badge>
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
          </Link>
        ) : (
          <div className="relative h-64 w-full">
            <Image
              src={coverImage || "/background.jpg"}
              alt={collection.name}
              fill
              className="object-cover transition-all duration-300 group-hover:brightness-90 group-hover:scale-105"
            />
            {collection.floorPrice && (
              <div className="absolute bottom-2 right-2">
                <Badge className="bg-blue/80 backdrop-blur-sm">Floor: {collection.floorPrice} STRK</Badge>
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
        )}
      </div>
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        {!onCollectionClick ? (
          <Link href={`/collections/${collection.nftAddress || String(collection.id)}`}>
            <h3 className="text-xl font-bold hover:text-primary transition-colors">{collection.name}</h3>
          </Link>
        ) : (
          <h3 className="text-xl font-bold hover:text-primary transition-colors">{collection.name}</h3>
        )}
        <CollectionActionDropdown collectionId={String(collection.id)} collectionName={collection.name} onReportClick={onReportClick} />
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {collection.description || "No description available"}
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center pt-4 justify-between w-full">
          <div className="flex items-center gap-1 text-sm">
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
            <span>{nftCount} Assets</span>
          </div>
          <div className="flex items-center gap-1 text-sm bg-muted/50 px-2 py-1 rounded-md">
            <Box className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{collection.type || "Art"}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

function CollectionListItem({ collection, nftCount, onReportClick, onCollectionClick }: CollectionCardProps) {
  // Use the collection's image from IPFS metadata
  const coverImage = collection.image || "/placeholder.svg?height=400&width=600"
  const isFeatured = String(collection.id) === "5" || String(collection.id) === "0"

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors",
        onCollectionClick && "cursor-pointer hover:border-primary/50"
      )}
      onClick={onCollectionClick}
    >
      <div className={cn("contents", !onCollectionClick && "cursor-default")}>
        {!onCollectionClick ? (
          <Link href={`/collections/${collection.nftAddress || String(collection.id)}`} className="flex items-center gap-4 flex-grow cursor-pointer">
            <div className="relative h-16 w-16 sm:w-24 rounded-md overflow-hidden flex-shrink-0">
              <Image src={coverImage || "/background.jpg"} alt={collection.name} fill className="object-cover" />
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-start">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium hover:text-primary transition-colors">{collection.name}</h3>
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

            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                  <span>{nftCount} Assets</span>
                </div>
                {collection.floorPrice && (
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span>{collection.floorPrice} STRK</span>
                  </div>
                )}
                <div className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs font-medium">
                  <Box className="h-3 w-3 text-muted-foreground" />
                  <span>{collection.type || "Art"}</span>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-4 flex-grow">
            <div className="relative h-16 w-16 sm:w-24 rounded-md overflow-hidden flex-shrink-0">
              <Image src={coverImage || "/background.jpg"} alt={collection.name} fill className="object-cover" />
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-start">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium hover:text-primary transition-colors">{collection.name}</h3>
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

            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                  <span>{nftCount} Assets</span>
                </div>
                {collection.floorPrice && (
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span>{collection.floorPrice} STRK</span>
                  </div>
                )}
                <div className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs font-medium">
                  <Box className="h-3 w-3 text-muted-foreground" />
                  <span>{collection.type || "Art"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CollectionActionDropdown collectionId={String(collection.id)} collectionName={collection.name} onReportClick={onReportClick} />
    </div>
  )
}

export function FeaturedCollectionCard({ collection, nftCount, onReportClick }: CollectionCardProps) {

  const coverImage = collection.image || "/background.jpg"

  return (
    <div className="rounded-xl overflow-hidden border cursor-pointer hover:shadow transition-all">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <Link href={`/collections/${collection.nftAddress || String(collection.id)}`}>
          <div className="relative h-64 md:h-auto">
            <Image src={coverImage || "/background.jpg"} alt={collection.name} fill className="object-cover hover:brightness-90 transition-all duration-300" />
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
        </Link>
        <div className="p-4 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <Link href={`/collections/${collection.nftAddress || String(collection.id)}`}>
                <h2 className="text-xl md:text-2xl font-bold mb-2 hover:text-primary transition-colors">{collection.name}</h2>
              </Link>
              <CollectionActionDropdown collectionId={String(collection.id)} collectionName={collection.name} onReportClick={onReportClick} />
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 md:line-clamp-none">
              {collection.description}
            </p>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="space-y-1">
                <p className="text-xs md:text-sm text-muted-foreground">Total Assets</p>
                <p className="text-lg md:text-xl font-bold">{nftCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs md:text-sm text-muted-foreground">IP Type</p>
                <p className="text-lg md:text-xl font-bold">{collection.type || "Art"}</p>
              </div>
              {collection.floorPrice && (
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Floor Price</p>
                  <p className="text-lg md:text-xl font-bold">{collection.floorPrice} STRK</p>
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium mb-2">Preview</p>
            <div className="flex gap-2">
              {/* Show collection image in small preview sizes */}
              <div className="relative h-12 w-12 rounded-md overflow-hidden">
                <Image
                  src={collection.image}
                  alt={`${collection.name} preview`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="relative h-12 w-12 rounded-md overflow-hidden">
                <Image
                  src={collection.image}
                  alt={`${collection.name} preview`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="relative h-12 w-12 rounded-md overflow-hidden">
                <Image
                  src={collection.image}
                  alt={`${collection.name} preview`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="relative h-12 w-12 rounded-md overflow-hidden">
                <Image
                  src={collection.image}
                  alt={`${collection.name} preview`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CollectionActionDropdown({ collectionId, collectionName, onReportClick }: { collectionId: string; collectionName?: string; onReportClick: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            onReportClick()
          }}
          className="text-destructive focus:text-destructive"
        >
          <X className="mr-2 h-4 w-4" />
          Report Collection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

