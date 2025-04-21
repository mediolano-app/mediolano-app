"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, TrendingUp } from "lucide-react"
import { useTokenStore } from "@/app/services/ip-coin/lib/hooks/use-token-store"
import { Badge } from "@/components/ui/badge"

export function FeaturedContent() {
  const { getTrendingTokens } = useTokenStore()
  const featuredItems = getTrendingTokens(3)

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Trending IP Coins</h2>
          <Button variant="ghost" asChild>
            <Link href="/explore" className="flex items-center gap-1">
              View All <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="p-4 pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.creator.avatar || "/placeholder.svg"} alt={item.creator.displayName} />
                      <AvatarFallback>{item.creator.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{item.creator.displayName}</p>
                      <p className="text-xs text-muted-foreground">@{item.creator.username}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <Link href={`/ip/${item.id}`}>
                  <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">{item.title}</CardTitle>
                </Link>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Market Cap</p>
                    <p className="font-medium">{item.marketCap}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">24h Volume</p>
                    <p className="font-medium">{item.volume}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Current Price</p>
                  <p className="font-medium">{item.currentPrice} ETH</p>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">{item.change}</span>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  asChild
                >
                  <Link href={`/ip/${item.id}`}>View</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
