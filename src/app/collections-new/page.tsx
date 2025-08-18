"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CollectionCard } from "@/components/collection-card"
import { collections } from "@/lib/mock-data"
import type { IPType } from "@/types/asset"
import { Search, Grid3X3, List, TrendingUp, Users, Plus, Calendar, Shield, FileText, User } from "lucide-react"
import Link from "next/link"

type SortOption = "name" | "date" | "assets" | "creator"
type ViewMode = "grid" | "list"

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<IPType | "all">("all")
  const [sortBy, setSortBy] = useState<SortOption>("date")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  // Get unique types from collections
  const availableTypes = useMemo(() => {
    const types = Array.from(new Set(collections.map((c) => c.type)))
    return types.sort()
  }, [])

  // Filter and sort collections
  const filteredCollections = useMemo(() => {
    const filtered = collections.filter((collection) => {
      const matchesSearch =
        collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.creator.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === "all" || collection.type === selectedType
      return matchesSearch && matchesType
    })

    // Sort collections
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "date":
          return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        case "assets":
          return b.assetCount - a.assetCount
        case "creator":
          return a.creator.localeCompare(b.creator)
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedType, sortBy])

  // Calculate stats
  const stats = useMemo(() => {
    const totalCollections = collections.length
    const totalAssets = collections.reduce((sum, c) => sum + c.assetCount, 0)
    const uniqueCreators = new Set(collections.map((c) => c.creator)).size
    const avgAssetsPerCollection = Math.round(totalAssets / totalCollections)

    return {
      totalCollections,
      totalAssets,
      uniqueCreators,
      avgAssetsPerCollection,
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
     

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">IP Collections</h1>
          <p className="text-muted-foreground text-lg">
            Discover and explore curated collections of intellectual property assets
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Grid3X3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Collections</p>
                  <p className="text-2xl font-bold">{stats.totalCollections}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Assets</p>
                  <p className="text-2xl font-bold">{stats.totalAssets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Users className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Creators</p>
                  <p className="text-2xl font-bold">{stats.uniqueCreators}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Assets/Collection</p>
                  <p className="text-2xl font-bold">{stats.avgAssetsPerCollection}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search collections by name, description, or creator..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Select value={selectedType} onValueChange={(value) => setSelectedType(value as IPType | "all")}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {availableTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Latest</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="assets">Asset Count</SelectItem>
                      <SelectItem value="creator">Creator</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing {filteredCollections.length} of {collections.length} collections
            </p>
            <div className="flex gap-2">
              {selectedType !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {selectedType}
                  <button
                    onClick={() => setSelectedType("all")}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>

          {filteredCollections.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  <Grid3X3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No collections found</h3>
                  <p>Try adjusting your search criteria or create a new collection.</p>
                </div>
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCollections.map((collection, index) => (
                <CollectionCard key={collection.id} collection={collection} index={index} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCollections.map((collection, index) => (
                <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="relative md:w-48 h-32 md:h-auto">
                        <img
                          src={collection.coverImage || "/placeholder.svg"}
                          alt={collection.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <div>
                                <h3 className="text-xl font-semibold mb-1 hover:text-primary transition-colors">
                                  {collection.name}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                                  {collection.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span className="font-medium">{collection.creator}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Created {collection.creationDate}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                <span>{collection.assetCount} assets</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Shield className="h-4 w-4" />
                                <span>IP Protected</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                              <Badge variant="secondary">{collection.type}</Badge>
                              <Badge variant="outline">
                                {collection.assetCount} {collection.assetCount === 1 ? "asset" : "assets"}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 md:ml-4">
                            <Link href={`/collections/${collection.id}`}>
                              <Button className="w-full md:w-auto">View Collection</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
