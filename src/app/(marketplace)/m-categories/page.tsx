"use client"

import { useState } from "react"
import { categories, nfts } from "@/lib/mockMktData"
import { NFTCard } from "@/components/marketplace/ProductCard"
import { Pagination } from "@/components/pagination"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"
import Link from "next/link"

const ITEMS_PER_PAGE = 9

export default function CategoriesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredNFTs = nfts.filter(
    (nft) =>
      (selectedCategory === "All" || nft.category === selectedCategory) &&
      nft.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredNFTs.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedNFTs = filteredNFTs.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">NFT Categories</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search NFTs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                <Link href={`/category/${category.name.toLowerCase()}`}>{category.name}</Link>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedNFTs.map((nft) => (
            <NFTCard key={nft.id} {...nft} categoryLink={`/category/${nft.category.toLowerCase()}`} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedNFTs.map((nft) => (
            <div key={nft.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <img src={nft.image || "/background.jpg"} alt={nft.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{nft.name}</h3>
                <p className="text-sm text-muted-foreground">by {nft.creator}</p>
                <p className="text-sm text-muted-foreground">Collection: {nft.collection}</p>
                <p className="font-semibold">
                  {nft.price} {nft.currency}
                </p>
              </div>
              <Button asChild variant="secondary">
                <Link href={`/nft/${nft.id}`}>View</Link>
              </Button>
            </div>
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}

