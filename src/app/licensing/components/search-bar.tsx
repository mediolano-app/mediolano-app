"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [assetType, setAssetType] = useState<string>("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (query.trim()) {
      params.append("search", query)
    }
    if (assetType) {
      params.append("type", assetType)
    }

    const searchParams = params.toString() ? `?${params.toString()}` : ""
    router.push(`/assets${searchParams}`)
  }

  const clearSearch = () => {
    setQuery("")
    setAssetType("")
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search assets by name, description, or ID..."
            className="pl-10 pr-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Select value={assetType} onValueChange={setAssetType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All asset types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All asset types</SelectItem>
              <SelectItem value="Audio">Audio</SelectItem>
              <SelectItem value="Art">Art</SelectItem>
              <SelectItem value="Documents">Documents</SelectItem>
              <SelectItem value="NFT">NFT</SelectItem>
              <SelectItem value="Video">Video</SelectItem>
              <SelectItem value="Patents">Patents</SelectItem>
              <SelectItem value="Posts">Posts</SelectItem>
              <SelectItem value="Publications">Publications</SelectItem>
              <SelectItem value="RWA">RWA</SelectItem>
              <SelectItem value="Software">Software</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" className="shrink-0">
            <Search className="mr-2 h-4 w-4" />
            <span>Search</span>
          </Button>

          {(query || assetType) && (
            <Button type="button" variant="ghost" onClick={clearSearch} className="shrink-0">
              <X className="mr-2 h-4 w-4" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
