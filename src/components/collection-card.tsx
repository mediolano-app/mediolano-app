"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Share2, Star, Users, Calendar, Shield } from "lucide-react"
// import type { Collection } from "@/types/asset"
import { Collection } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

interface CollectionCardProps {
  collection: Collection
  index: number
}

export function CollectionCard({ collection, index }: CollectionCardProps) {
  return (
    <div className="group">
      <Card className="h-full overflow-hidden border-0 bg-gradient-to-br from-background to-muted/20 shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden">
            <Image
                              src={collection.image || "/placeholder.svg"} 
                              alt={`${collection.name} preview ${index + 1}`} 
                              fill 
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
         
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                {collection.type}
              </Badge>
              <Badge variant="outline" className="bg-white/20 text-white backdrop-blur-sm border-white/30">
                {/* {collection.assetCount} assets */}
              </Badge>
            </div>
            <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Collection
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Star className="mr-2 h-4 w-4" />
                    Add to Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Collection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {collection.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{collection.description}</p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="font-medium">{collection.owner.slice(0, 6)}...{collection.owner.slice(-4)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span className="text-xs">Protected</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Created {collection.lastMintTime}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Link href={`/collections/${collection.id}`} className="w-full">
            <Button className="w-full bg-transparent" variant="outline">
              View Collection
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
