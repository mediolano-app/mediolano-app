"use client"

import { useState, useMemo, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { creators } from "@/lib/mock-data"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  MapPin,
  Users,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

type SortOption = "name" | "assets" | "collections" | "date"

const CREATORS_PER_PAGE = 12

export default function CreatorsPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(searchParams?.get("specialty") || "all")
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams?.get("verified") === "true")
  const [sortBy, setSortBy] = useState<SortOption>(searchParams?.get("sort") as SortOption || "assets")
  const [currentPage, setCurrentPage] = useState(1)

  const availableSpecialties = useMemo(() => {
    const specialties = new Set<string>()
    creators.forEach((c) => c.specialties?.forEach((s) => specialties.add(s)))
    return Array.from(specialties).sort()
  }, [])

  const filteredCreators = useMemo(() => {
    const filtered = creators.filter((creator) => {
      const matchesSearch =
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.location?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSpecialty =
        selectedSpecialty === "all" || creator.specialties?.includes(selectedSpecialty)
      const matchesVerified = !verifiedOnly || creator.verified
      return matchesSearch && matchesSpecialty && matchesVerified
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "assets":
          return (b.totalAssets || 0) - (a.totalAssets || 0)
        case "collections":
          return (b.collections?.length || 0) - (a.collections?.length || 0)
        case "date":
          return new Date(b.joinDate || "").getTime() - new Date(a.joinDate || "").getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedSpecialty, verifiedOnly, sortBy])

  const totalPages = Math.ceil(filteredCreators.length / CREATORS_PER_PAGE)
  const startIndex = (currentPage - 1) * CREATORS_PER_PAGE
  const endIndex = startIndex + CREATORS_PER_PAGE
  const currentCreators = filteredCreators.slice(startIndex, endIndex)

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
          </Button>
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
        </Button>
      )

      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis1" className="px-2 text-muted-foreground">
            ...
          </span>
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
            </Button>
          )
        }
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="px-2 text-muted-foreground">
            ...
          </span>
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
          </Button>
        )
      }
    }

    return buttons
  }, [totalPages, currentPage, handlePageChange])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption)
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || selectedSpecialty !== "all" || verifiedOnly

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Creators
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover talented creators building the future of intellectual property
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search creators..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 rounded-full border-border/60"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={selectedSpecialty} onValueChange={handleSpecialtyChange}>
              <SelectTrigger className="w-36 rounded-full">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {availableSpecialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-36 rounded-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assets">Most Assets</SelectItem>
                <SelectItem value="collections">Most Collections</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="date">Newest</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={verifiedOnly ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setVerifiedOnly(!verifiedOnly)
                setCurrentPage(1)
              }}
              className="rounded-full"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Verified
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1 rounded-full">
                {searchQuery}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => handleSearchChange("")}
                />
              </Badge>
            )}
            {selectedSpecialty !== "all" && (
              <Badge variant="secondary" className="gap-1 rounded-full">
                {selectedSpecialty}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => handleSpecialtyChange("all")}
                />
              </Badge>
            )}
            {verifiedOnly && (
              <Badge variant="secondary" className="gap-1 rounded-full">
                Verified
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => setVerifiedOnly(false)}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleSearchChange("")
                handleSpecialtyChange("all")
                setVerifiedOnly(false)
              }}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredCreators.length === 0
              ? "No creators found"
              : `${filteredCreators.length} creator${filteredCreators.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Creators Grid */}
        {filteredCreators.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-medium mb-2">No creators found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Try adjusting your filters
            </p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-transparent"
              onClick={() => {
                handleSearchChange("")
                handleSpecialtyChange("all")
                setVerifiedOnly(false)
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentCreators.map((creator) => (
                <Link key={creator.id} href={`/creators/${creator.slug}`}>
                  <Card className="group relative overflow-hidden border-border/40 hover:border-border hover:shadow-lg transition-all duration-300 h-full">
                    {/* Banner Background */}
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={creator.bannerImage || creator.avatar || "/placeholder.svg"}
                        alt=""
                        fill
                        className="object-cover opacity-15 group-hover:opacity-20 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
                    </div>
                    
                    <CardContent className="relative z-10 p-6">
                      <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="relative mb-4">
                          <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                            <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                            <AvatarFallback className="text-lg font-medium bg-muted">
                              {creator.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {creator.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 shadow-md">
                              <CheckCircle className="h-3.5 w-3.5 text-primary-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Name */}
                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors mb-1">
                          {creator.name}
                        </h3>

                        {/* Location */}
                        {creator.location && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                            <MapPin className="h-3 w-3" />
                            <span>{creator.location}</span>
                          </div>
                        )}

                        {/* Bio */}
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                          {creator.bio}
                        </p>

                        {/* Specialties */}
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {creator.specialties?.slice(0, 3).map((specialty) => (
                            <Badge
                              key={specialty}
                              variant="secondary"
                              className="text-[10px] px-2 py-0.5 rounded-full"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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

export const dynamic = "force-dynamic"
