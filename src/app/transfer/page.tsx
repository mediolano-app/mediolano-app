"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Search,
  CheckCircle,
  ChevronDown,
  X,
  ArrowRight,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Filter,
  Users,
  Package,
  Zap,
  Calendar,
  Shield,
  BadgeCheck,
  Palette,
  Music,
  Video,
  FileText,
  Lightbulb,
  Code,
  Hexagon,
  Box,
  Send,
  Copy,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { TransferAssetDialog } from "@/components/transfer-asset-dialog"
import { useToast } from "@/hooks/use-toast"
import type { IPType } from "@/types/asset"


const typeIcons: Record<IPType, any> = {
  Art: Palette,
  Audio: Music,
  Video: Video,
  Document: FileText,
  Patent: Lightbulb,
  RWA: BadgeCheck,
  Software: Code,
  NFT: Hexagon,
  Custom: Box,
}

const typeColors: Record<IPType, string> = {
  Art: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Audio: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Video: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Document: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Patent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  RWA: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Software: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  NFT: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  Custom: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

import { usePortfolio } from "@/hooks/use-portfolio"
import { useAccount } from "@starknet-react/core"
import { shortenAddress } from "@/lib/utils"

// ... imports remain the same ...

export default function TransferPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Real data hooks
  const { address } = useAccount()
  const { tokens, collections, loading: portfolioLoading, refetch } = usePortfolio()

  // State for asset selection and filtering
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list") // Default to list view
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "value">("newest")
  const [filterType, setFilterType] = useState<string | null>(null)
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("owned")

  // Flatten and enhance tokens from portfolio
  const enhancedAssets = Object.entries(tokens).flatMap(([collectionId, collectionTokens]) => {
    const collection = collections.find(c => c.id.toString() === collectionId)

    return collectionTokens.map(token => ({
      id: token.token_id, // This is the numerical ID
      name: token.name || `Asset #${token.token_id}`,
      description: token.description || "",
      image: token.image || "/placeholder.svg",
      creator: collection?.owner ? shortenAddress(collection.owner) : "Unknown",
      type: (collection?.type as IPType) || "NFT",
      // Important for transfer
      nftAddress: collection?.nftAddress || "",
      collectionName: collection?.name || "IP Collection",
      // Normalized fields for UI
      value: token.floorPrice ? `${token.floorPrice} ETH` : "N/A",
      numericValue: token.floorPrice || 0,
      owner: token.owner || address || "",
      registrationDate: "N/A", // Not in token data usually
      protectionLevel: 0,
      licenseType: "Standard",
      verified: true
    }))
  })

  // Filter assets based on search query and filters
  const filteredAssets = enhancedAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.collectionName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterType ? asset.type === filterType : true

    // For portfolio, we mostly care about "owned" assets. 
    // "Received" logic might depend on how the API distinguishes them, 
    // but typically everything in 'tokens' is owned by the user.
    // If we want to simulate "Received", we'd need transfer history.
    // For now, let's assume all fetched tokens are "My Assets".
    const matchesTab = activeTab === "owned"
      ? (address && asset.owner.toLowerCase() === address.toLowerCase())
      : (address && asset.owner.toLowerCase() !== address.toLowerCase())

    // If matchesTab logic filters out everything because owner might be missing case sensitivity or format issues:
    // Basic fix: normalize addresses in comparison.
    // Fallback: If 'tokens' only contains user's tokens, matching 'owned' is implicitly true for all.

    return matchesSearch && matchesFilter
  })

  // Sort assets
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      // We don't have createdAt in basic token data, so might need to rely on ID or randomized date
      case "newest":
        // Fallback to sorting by ID if date not available (higher ID = newer usually)
        return parseInt(b.id) - parseInt(a.id)
      case "oldest":
        return parseInt(a.id) - parseInt(b.id)
      case "name":
        return a.name.localeCompare(b.name)
      case "value":
        return b.numericValue - a.numericValue
      default:
        return 0
    }
  })

  // Handle asset selection
  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets((prev) => (prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]))
  }

  // Select/deselect all visible assets
  const toggleSelectAll = () => {
    if (selectedAssets.length === sortedAssets.length && sortedAssets.length > 0) {
      setSelectedAssets([])
    } else {
      setSelectedAssets(sortedAssets.map((asset) => asset.id))
    }
  }

  // Handle transfer completion
  const handleTransferComplete = (recipientAddress: string, memo?: string) => {
    const transferredAssets = enhancedAssets.filter((asset) => selectedAssets.includes(asset.id))
    const totalValue = transferredAssets.reduce((sum, asset) => sum + asset.numericValue, 0)

    toast({
      title: "Transfer Complete",
      description: `${selectedAssets.length} asset${selectedAssets.length > 1 ? "s" : ""} (${(totalValue / 1000).toFixed(2)} ETH) transferred to ${recipientAddress.substring(0, 6)}...${recipientAddress.substring(recipientAddress.length - 4)}`,
    })

    // Reset selection after transfer
    setSelectedAssets([])
  }

  // Copy address to clipboard
  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
    } catch (error) {
      console.error("Failed to copy address:", error)
    }
  }

  // Asset type filters based on actual data
  const assetTypes = [
    { value: null, label: "All Types" },
    { value: "Art", label: "Art" },
    { value: "Audio", label: "Audio" },
    { value: "Video", label: "Video" },
    { value: "Document", label: "Documents" },
    { value: "Patent", label: "Patents" },
    { value: "Software", label: "Software" },
    { value: "NFT", label: "NFTs" },
  ]

  // Calculate selection stats
  const selectedValue = enhancedAssets
    .filter((asset) => selectedAssets.includes(asset.id))
    .reduce((sum, asset) => sum + asset.numericValue, 0)

  const ownedAssets = enhancedAssets.filter((a) => address && a.owner.toLowerCase() === address.toLowerCase())
  const receivedAssets = enhancedAssets.filter((a) => address && a.owner.toLowerCase() !== address.toLowerCase())

  const isLoading = portfolioLoading

  return (
    <div className="flex flex-col min-h-screen bg-background mb-20">

      <main className="flex-1 container p-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()} className="hidden md:flex">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold hidden md:block">Transfer Assets</h1>
              <p className="text-muted-foreground hidden md:block">
                Select assets to transfer ownership to anCustom wallet
              </p>
            </div>
          </div>

          {/* Selection Summary - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {selectedAssets.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>{selectedAssets.length} selected</span>
                <Separator orientation="vertical" className="h-4" />
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-medium">{(selectedValue / 1000).toFixed(2)} ETH</span>
              </div>
            )}
            {selectedAssets.length > 0 && (
              <Button onClick={() => setTransferDialogOpen(true)} className="gap-2">
                <Send className="h-4 w-4" />
                Transfer Selected
                <Badge variant="secondary" className="ml-1">
                  {selectedAssets.length}
                </Badge>
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="owned" onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="owned" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                My Assets ({ownedAssets.length})
              </TabsTrigger>
              <TabsTrigger value="received" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Received ({receivedAssets.length})
              </TabsTrigger>
            </TabsList>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <div className="border rounded-md flex">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none h-9 w-9"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none h-9 w-9"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, creator, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <SlidersHorizontal className="h-4 w-4" />
                      Sort
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      Newest First
                      {sortBy === "newest" && <CheckCircle className="ml-2 h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                      Oldest First
                      {sortBy === "oldest" && <CheckCircle className="ml-2 h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("name")}>
                      Name (A-Z)
                      {sortBy === "name" && <CheckCircle className="ml-2 h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("value")}>
                      Value (High-Low)
                      {sortBy === "value" && <CheckCircle className="ml-2 h-4 w-4" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <Filter className="h-4 w-4" />
                      {filterType || "All Types"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {assetTypes.map((type) => (
                      <DropdownMenuItem key={type.value || "all"} onClick={() => setFilterType(type.value)}>
                        {type.label}
                        {filterType === type.value && <CheckCircle className="ml-2 h-4 w-4" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Quick Filter Chips */}
            {(searchQuery || filterType) && (
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                  </Badge>
                )}
                {filterType && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {filterType}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterType(null)} />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setFilterType(null)
                  }}
                  className="h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="owned" className="mt-0 space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-muted animate-pulse rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-muted animate-pulse rounded w-1/3" />
                          <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                        </div>
                        <div className="h-4 bg-muted animate-pulse rounded w-20" />
                      </div>
                    </Card>
                  ))}
              </div>
            ) : sortedAssets.length > 0 ? (
              <>
                {/* Selection Header */}
                <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="select-all"
                          checked={selectedAssets.length === sortedAssets.length && sortedAssets.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                        <div>
                          <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                            {selectedAssets.length > 0
                              ? `${selectedAssets.length} of ${sortedAssets.length} assets selected`
                              : `Select all ${sortedAssets.length} assets`}
                          </label>
                          {selectedAssets.length > 0 && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Zap className="h-3 w-3 text-primary" />
                              Total value: {(selectedValue / 1000).toFixed(2)} ETH
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedAssets.length > 0 && (
                          <Button variant="ghost" size="sm" onClick={() => setSelectedAssets([])}>
                            Clear Selection
                          </Button>
                        )}
                        <Button
                          onClick={() => setTransferDialogOpen(true)}
                          disabled={selectedAssets.length === 0}
                          size="sm"
                          className="gap-2"
                        >
                          <Send className="h-4 w-4" />
                          Transfer Selected
                          {selectedAssets.length > 0 && (
                            <Badge variant="secondary" className="ml-1">
                              {selectedAssets.length}
                            </Badge>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Asset List */}
                {viewMode === "list" ? (
                  <div className="space-y-2">
                    {sortedAssets.map((asset) => {
                      const TypeIcon = typeIcons[asset.type] || Box
                      const isSelected = selectedAssets.includes(asset.id)

                      return (
                        <Card
                          key={asset.id}
                          className={`transition-all duration-200 hover:shadow-md cursor-pointer ${isSelected ? "ring-2 ring-primary bg-primary/5 border-primary/20" : "hover:bg-muted/50"
                            }`}
                          onClick={() => toggleAssetSelection(asset.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleAssetSelection(asset.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-shrink-0"
                              />

                              {/* Asset Image */}
                              <div className="relative h-16 w-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={asset.image || "/placeholder.svg"}
                                  alt={asset.name}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute top-1 right-1">
                                  <Badge className={`${typeColors[asset.type]} text-xs px-1 py-0`}>
                                    <TypeIcon className="h-2.5 w-2.5" />
                                  </Badge>
                                </div>
                              </div>

                              {/* Asset Info */}
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-semibold text-base truncate">{asset.name}</h3>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <Zap className="h-3 w-3 text-primary" />
                                    <span className="font-semibold text-primary text-sm">{asset.value}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Avatar className="h-4 w-4">
                                    <AvatarFallback className="text-xs">{asset.creator.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <span className="truncate">by {asset.creator}</span>
                                  {asset.verified && <BadgeCheck className="h-3 w-3 text-blue-500 flex-shrink-0" />}
                                </div>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{asset.registrationDate}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Shield className="h-3 w-3" />
                                    <span>{asset.protectionLevel}% protected</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {asset.licenseType}
                                  </Badge>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-1">{asset.description}</p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyAddress(asset.owner)
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(`/assets/${asset.id}`, "_blank")
                                  }}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {sortedAssets.map((asset) => {
                      const TypeIcon = typeIcons[asset.type] || Box
                      const isSelected = selectedAssets.includes(asset.id)

                      return (
                        <Card
                          key={asset.id}
                          className={`overflow-hidden transition-all hover:shadow-md cursor-pointer group ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""
                            }`}
                          onClick={() => toggleAssetSelection(asset.id)}
                        >
                          <div className="relative">
                            <div className="absolute top-2 left-2 z-10">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleAssetSelection(asset.id)}
                                className="bg-background/90 backdrop-blur-sm border-2"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="aspect-square bg-muted">
                              <Image
                                src={asset.image || "/placeholder.svg"}
                                alt={asset.name}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-medium text-sm truncate" title={asset.name}>
                              {asset.name}
                            </h3>
                            <div className="flex items-center justify-between mt-1">
                              <Badge className={`${typeColors[asset.type]} text-xs px-1.5 py-0.5`}>
                                <TypeIcon className="h-2.5 w-2.5 mr-1" />
                                {asset.type}
                              </Badge>
                              <span className="text-xs font-medium">{asset.value}</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-1">{asset.creator}</p>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No Assets Found</h3>
                <p className="text-muted-foreground mt-1 mb-6">
                  {searchQuery || filterType
                    ? "Try adjusting your search or filters"
                    : "You have no assets to transfer"}
                </p>
                <div className="flex gap-2 justify-center">
                  {(searchQuery || filterType) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("")
                        setFilterType(null)
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                  <Button asChild>
                    <Link href="/create">Create New Asset</Link>
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="received" className="mt-0">
            {receivedAssets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {receivedAssets.map((asset) => {
                  const TypeIcon = typeIcons[asset.type] || Box

                  return (
                    <Card key={asset.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-muted relative">
                        <Image src={asset.image || "/placeholder.svg"} alt={asset.name} fill className="object-cover" />
                        <div className="absolute top-3 left-3">
                          <Badge className={typeColors[asset.type]}>
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {asset.type}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium truncate">{asset.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{asset.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-xs">{asset.creator.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span>from {asset.creator}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Badge variant="outline">{asset.licenseType}</Badge>
                        <span className="text-sm font-medium">{asset.value}</span>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ArrowRight className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No Received Assets</h3>
                <p className="text-muted-foreground mt-1 mb-6">Assets transferred to you will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Transfer Dialog */}
      {selectedAssets.length > 0 && (
        <TransferAssetDialog
          assets={enhancedAssets
            .filter((a) => selectedAssets.includes(a.id))
            .map(a => ({
              id: a.id,
              name: a.name,
              nftAddress: a.nftAddress,
              collectionName: a.collectionName
            }))}
          currentOwner={address || ""}
          isOpen={transferDialogOpen}
          onClose={() => setTransferDialogOpen(false)}
          onTransferComplete={handleTransferComplete}
        />
      )}

      {/* Mobile Floating Action Button */}
      {selectedAssets.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 flex justify-center md:hidden z-10">
          <Button onClick={() => setTransferDialogOpen(true)} size="lg" className="shadow-lg gap-2 w-full max-w-sm">
            <Send className="h-4 w-4" />
            Transfer Selected
            <Badge variant="secondary" className="ml-1">
              {selectedAssets.length}
            </Badge>
          </Button>
        </div>
      )}

      {/* Mobile Selection Summary */}
      {selectedAssets.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 md:hidden z-10">
          <Card className="bg-background/95 backdrop-blur border-primary/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span>{selectedAssets.length} selected</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="font-medium">{(selectedValue / 1000).toFixed(2)} ETH</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
