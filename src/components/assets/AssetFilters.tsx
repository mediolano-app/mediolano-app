"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AssetFiltersProps {
  onFilterChange: (filters: AssetFilters) => void
  categories: string[]
  collections: string[]
}

export interface AssetFilters {
  search: string
  category: string
  collection: string
  visibility: string
}

export function AssetFilters({ onFilterChange, categories, collections }: AssetFiltersProps) {
  const [filters, setFilters] = useState<AssetFilters>({
    search: "",
    category: "all",
    collection: "all",
    visibility: "all",
  })

  const handleFilterChange = (key: keyof AssetFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      <div className="flex-1">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search assets..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={(value) => handleFilterChange("category", value)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="collection">Collection</Label>
        <Select onValueChange={(value) => handleFilterChange("collection", value)}>
          <SelectTrigger id="collection">
            <SelectValue placeholder="All Collections" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Collections</SelectItem>
            {collections.map((collection) => (
              <SelectItem key={collection} value={collection}>
                {collection}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="visibility">Visibility</Label>
        <Select onValueChange={(value) => handleFilterChange("visibility", value)}>
          <SelectTrigger id="visibility">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="visible">Visible</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

