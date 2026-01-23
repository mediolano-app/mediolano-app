"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import NFTCard from "@/components/nft-card"
import NFTSkeleton from "@/components/nft-skeleton"
import { AssetFilterDrawer } from "@/components/asset-filter-drawer"
import { Search, X, ChevronLeft, ChevronRight, Globe, TrendingUp, Users, Zap } from "lucide-react"
import { assets } from "@/lib/mock-data"

interface FilterState {
  assetTypes: string[]
  collections: string[]
  sortBy: string
  verified: boolean
}

const ASSETS_PER_PAGE = 12

export default function AssetsPage() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<FilterState>({
    assetTypes: [],
    collections: [],
    sortBy: "newest",
    verified: false,
  })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleClearFilter = (filterType: string, value?: string) => {
    const newFilters = { ...filters }

    if (filterType === "assetTypes" && value) {
      newFilters.assetTypes = newFilters.assetTypes.filter((type) => type !== value)
    } else if (filterType === "collections" && value) {
      newFilters.collections = newFilters.collections.filter((collection) => collection !== value)
    } else if (filterType === "verified") {
      newFilters.verified = false
    } else if (filterType === "all") {
      newFilters.assetTypes = []
      newFilters.collections = []
      newFilters.verified = false
      newFilters.sortBy = "newest"
    }

    setFilters(newFilters)
    setCurrentPage(1)
  }

  // Apply filters and search with memoization for performance
  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        // Search filter
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
          asset.name.toLowerCase().includes(searchLower) ||
          asset.creator.toLowerCase().includes(searchLower) ||
          asset.description.toLowerCase().includes(searchLower) ||
          (asset.collection && asset.collection.toLowerCase().includes(searchLower))

        // Asset type filter
        const matchesType = filters.assetTypes.length === 0 || filters.assetTypes.includes(asset.type)

        // Collection filter
        const matchesCollection =
          filters.collections.length === 0 || (asset.collection && filters.collections.includes(asset.collection))

        // Verified filter
        const matchesVerified = !filters.verified || asset.verified

        return matchesSearch && matchesType && matchesCollection && matchesVerified
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "oldest":
            return new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime()
          case "name":
            return a.name.localeCompare(b.name)
          case "creator":
            return a.creator.localeCompare(b.creator)
          case "value-high":
            return (b.numericValue || 0) - (a.numericValue || 0)
          case "value-low":
            return (a.numericValue || 0) - (b.numericValue || 0)
          case "newest":
          default:
            return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
        }
      })
  }, [assets, searchQuery, filters])

  // Pagination calculations
  const totalPages = Math.ceil(filteredAssets.length / ASSETS_PER_PAGE)
  const startIndex = (currentPage - 1) * ASSETS_PER_PAGE
  const endIndex = startIndex + ASSETS_PER_PAGE
  const currentAssets = filteredAssets.slice(startIndex, endIndex)

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const renderPaginationButtons = useMemo(() => {
    const buttons = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(i)}
            className="rounded-full min-w-10"
          >
            {i}
          </Button>,
        )
      }
    } else {
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(1)}
          className="rounded-full min-w-10"
        >
          1
        </Button>,
      )

      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis1" className="px-2 text-muted-foreground">
            ...
          </span>,
        )
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          buttons.push(
            <Button
              key={i}
              variant={currentPage === i ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(i)}
              className="rounded-full min-w-10"
            >
              {i}
            </Button>,
          )
        }
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="px-2 text-muted-foreground">
            ...
          </span>,
        )
      }

      if (totalPages > 1) {
        buttons.push(
          <Button
            key={totalPages}
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            className="rounded-full min-w-10"
          >
            {totalPages}
          </Button>,
        )
      }
    }

    return buttons
  }, [totalPages, currentPage, handlePageChange])

  // Get active filter count
  const activeFilterCount = filters.assetTypes.length + filters.collections.length + (filters.verified ? 1 : 0)

  // Calculate stats
  const stats = useMemo(() => {
    const totalAssets = assets.length
    const totalValue = assets.reduce((sum, asset) => sum + (asset.numericValue || 0), 0)
    const uniqueCreators = new Set(assets.map((asset) => asset.creator)).size
    const verifiedAssets = assets.filter((asset) => asset.verified).length

    return {
      totalAssets,
      totalValue: totalValue.toFixed(1),
      uniqueCreators,
      verifiedAssets,
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Explore IP Assets
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover and explore intellectual property assets from creators around the world. From digital art to
            patents, find the perfect IP for your next project.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 text-center">
            <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalAssets}</div>
            <div className="text-sm text-muted-foreground">Total Assets</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 text-center">
            <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalValue} ETH</div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-xl p-6 text-center">
            <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.uniqueCreators}</div>
            <div className="text-sm text-muted-foreground">Creators</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 text-center">
            <Globe className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.verifiedAssets}</div>
            <div className="text-sm text-muted-foreground">Verified</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search assets, creators, collections..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filters.sortBy}
                onValueChange={(value) => {
                  setFilters({ ...filters, sortBy: value })
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="creator">Creator A-Z</SelectItem>
                  <SelectItem value="value-high">Value High-Low</SelectItem>
                  <SelectItem value="value-low">Value Low-High</SelectItem>
                </SelectContent>
              </Select>
              <AssetFilterDrawer onFiltersChange={handleFiltersChange} />
            </div>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filters.assetTypes.map((type) => (
                <Badge key={type} variant="secondary" className="gap-1">
                  {type}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleClearFilter("assetTypes", type)}
                  />
                </Badge>
              ))}
              {filters.collections.map((collection) => (
                <Badge key={collection} variant="secondary" className="gap-1">
                  {collection}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleClearFilter("collections", collection)}
                  />
                </Badge>
              ))}
              {filters.verified && (
                <Badge variant="secondary" className="gap-1">
                  Verified Only
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleClearFilter("verified")}
                  />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={() => handleClearFilter("all")} className="h-6 px-2 text-xs">
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Loading assets..."
              : filteredAssets.length === 0
                ? "No assets found"
                : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredAssets.length)} of ${filteredAssets.length} assets`}
          </p>
        </div>

        {/* Assets Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(ASSETS_PER_PAGE)
              .fill(0)
              .map((_, i) => (
                <NFTSkeleton key={i} />
              ))}
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium">No IP assets found</p>
              <p className="text-sm">Try adjusting your search terms or filters</p>
            </div>
            {activeFilterCount > 0 && (
              <Button variant="outline" onClick={() => handleClearFilter("all")}>
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentAssets.map((asset) => (
                <NFTCard key={asset.id} asset={asset} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>

                <div className="hidden sm:flex items-center gap-1">{renderPaginationButtons}</div>

                <div className="flex sm:hidden items-center gap-2 px-3">
                  <span className="text-sm text-muted-foreground">
                    {currentPage} / {totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-full"
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
