"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Star, Grid3X3, Shield, X } from "lucide-react"
import { Collection } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FEATURED_COLLECTION_IDS } from "@/lib/constants"

interface CollectionCardProps {
  collection: Collection
  index: number
  onClick?: () => void
}

export function CollectionCard({ collection, index, onClick }: CollectionCardProps) {
  const isFeatured = FEATURED_COLLECTION_IDS.includes(String(collection.id))
  const coverImage = collection.image || "/placeholder.svg"

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer group">
      <Link href={`/collections/${String(collection.id)}`}>
        <div className="relative h-52 w-full">
          <Image
            src={coverImage}
            alt={collection.name}
            fill
            className="object-cover transition-all duration-300 group-hover:brightness-90"
          />
          {collection.floorPrice && (
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-blue/80 backdrop-blur-sm text-xs">
                Floor: {collection.floorPrice} STRK
              </Badge>
            </div>
          )}
          {isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge
                variant="secondary"
                className="bg-yellow-500/90 hover:bg-yellow-500/80 dark:bg-yellow-500/80 dark:hover:bg-yellow-500/70 text-primary-foreground border-none"
              >
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            </div>
          )}
        </div>
      </Link>
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <Link href={`/collections/${String(collection.id)}`}>
          <h3 className="text-lg font-bold hover:text-primary transition-colors line-clamp-1">
            {collection.name}
          </h3>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1" onClick={(e) => e.preventDefault()}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/collections/${String(collection.id)}`}>
                View Collection
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <X className="mr-2 h-4 w-4" />
              Report Collection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {collection.description || "No description available"}
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center pt-4 justify-between w-full">
          <div className="flex items-center gap-1 text-sm">
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
            <span>{collection.itemCount} Assets</span>
          </div>
          {collection.type && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span className="text-xs">{collection.type}</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
