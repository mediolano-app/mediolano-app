"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Filter, X } from "lucide-react"

interface FilterState {
  assetTypes: string[]
  collections: string[]
  sortBy: string
  verified: boolean
}

interface AssetFilterDrawerProps {
  onFiltersChange: (filters: FilterState) => void
}

const assetTypes = ["Art", "Audio", "Patent", "Software", "NFT"]
const collections = ["Digital Horizon", "Audio Landscapes", "AI Innovation", "Cyberpunk City"]

export function AssetFilterDrawer({ onFiltersChange }: AssetFilterDrawerProps) {
  const [filters, setFilters] = useState<FilterState>({
    assetTypes: [],
    collections: [],
    sortBy: "newest",
    verified: false,
  })

  const handleAssetTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked ? [...filters.assetTypes, type] : filters.assetTypes.filter((t) => t !== type)

    const newFilters = { ...filters, assetTypes: newTypes }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleCollectionChange = (collection: string, checked: boolean) => {
    const newCollections = checked
      ? [...filters.collections, collection]
      : filters.collections.filter((c) => c !== collection)

    const newFilters = { ...filters, collections: newCollections }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...filters, sortBy }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleVerifiedChange = (verified: boolean) => {
    const newFilters = { ...filters, verified }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const newFilters = {
      assetTypes: [],
      collections: [],
      sortBy: "newest",
      verified: false,
    }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const activeFiltersCount =
    filters.assetTypes.length +
    filters.collections.length +
    (filters.verified ? 1 : 0) +
    (filters.sortBy !== "newest" ? 1 : 0)

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="relative bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Filter IP Assets</DrawerTitle>
            <DrawerDescription>Refine your search to find specific intellectual property assets</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 space-y-6">
            {/* Asset Types */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Asset Types</Label>
              <div className="space-y-2">
                {assetTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.assetTypes.includes(type)}
                      onCheckedChange={(checked) => handleAssetTypeChange(type, checked as boolean)}
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Collections */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Collections</Label>
              <div className="space-y-2">
                {collections.map((collection) => (
                  <div key={collection} className="flex items-center space-x-2">
                    <Checkbox
                      id={`collection-${collection}`}
                      checked={filters.collections.includes(collection)}
                      onCheckedChange={(checked) => handleCollectionChange(collection, checked as boolean)}
                    />
                    <Label htmlFor={`collection-${collection}`} className="text-sm">
                      {collection}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sort By</Label>
              <RadioGroup value={filters.sortBy} onValueChange={handleSortChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="newest" id="newest" />
                  <Label htmlFor="newest" className="text-sm">
                    Newest First
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oldest" id="oldest" />
                  <Label htmlFor="oldest" className="text-sm">
                    Oldest First
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="name" id="name" />
                  <Label htmlFor="name" className="text-sm">
                    Name A-Z
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="creator" id="creator" />
                  <Label htmlFor="creator" className="text-sm">
                    Creator A-Z
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Verified Only */}
            <div className="flex items-center space-x-2">
              <Checkbox id="verified" checked={filters.verified} onCheckedChange={handleVerifiedChange} />
              <Label htmlFor="verified" className="text-sm">
                Verified Assets Only
              </Label>
            </div>
          </div>
          <DrawerFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters} className="flex-1 bg-transparent">
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <DrawerClose asChild>
                <Button className="flex-1">Apply Filters</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
