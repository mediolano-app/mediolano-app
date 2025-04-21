"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, ArrowDownRight, Search, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useTokenStore } from "@/app/services/ip-coin/lib/hooks/use-token-store"
import { contentCategories, contentTags } from "@/app/services/ip-coin/lib/mock-data"

export default function ExplorePage() {
  const { tokens } = useTokenStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("trending")
  const [filteredTokens, setFilteredTokens] = useState(tokens)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort tokens
  useEffect(() => {
    let result = [...tokens]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (token) =>
          token.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((token) => token.category === selectedCategory)
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      result = result.filter((token) => selectedTags.some((tag) => token.tags.includes(tag)))
    }

    // Apply sorting
    switch (sortBy) {
      case "trending":
        result.sort((a, b) => b.changeValue - a.changeValue)
        break
      case "newest":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case "oldest":
        result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case "price-high":
        result.sort((a, b) => b.currentPrice - a.currentPrice)
        break
      case "price-low":
        result.sort((a, b) => a.currentPrice - b.currentPrice)
        break
      case "market-cap":
        result.sort((a, b) => b.marketCapValue - a.marketCapValue)
        break
      case "volume":
        result.sort((a, b) => b.volumeValue - a.volumeValue)
        break
    }

    setFilteredTokens(result)
  }, [tokens, searchQuery, sortBy, selectedCategory, selectedTags])

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedTags([])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Explore IP Coins</h1>
          <p className="text-muted-foreground">Discover and invest in tokenized intellectual property</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search IP Coins..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="market-cap">Market Cap</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters {(selectedCategory || selectedTags.length > 0) && "(Active)"}
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="mb-2">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {contentCategories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {contentTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredTokens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredTokens.map((coin) => (
              <Card key={coin.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={coin.creator.avatar || "/placeholder.svg"} alt={coin.creator.displayName} />
                        <AvatarFallback>{coin.creator.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{coin.creator.displayName}</p>
                        <p className="text-xs text-muted-foreground">@{coin.creator.username}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{coin.symbol}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Link href={`/ip/${coin.id}`}>
                    <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">{coin.title}</CardTitle>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{coin.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{coin.category}</Badge>
                    {coin.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Market Cap</p>
                      <p className="font-medium">{coin.marketCap}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">24h Volume</p>
                      <p className="font-medium">{coin.volume}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Current Price</p>
                    <p className="font-medium">{coin.currentPrice} ETH</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-500">
                    {coin.changeValue > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${coin.changeValue > 0 ? "text-green-500" : "text-red-500"}`}>
                      {coin.change}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                    asChild
                  >
                    <Link href={`/ip/${coin.id}`}>View</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No IP Coins Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? `No results found for "${searchQuery}". Try a different search term or clear filters.`
                : "No IP Coins match your current filters. Try adjusting your criteria."}
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}
