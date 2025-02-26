"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getNFTs } from "@/lib/mockupPortfolioData"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Heart } from "lucide-react"

interface RelatedNFTsProps {
  collectionId: string
  currentNftId: string
}

export function RelatedNFTs({ collectionId, currentNftId }: RelatedNFTsProps) {
  const [favoriteNFTs, setFavoriteNFTs] = useState<string[]>([])

  const nfts = getNFTs()
    .filter((nft) => nft.collection.id === collectionId && nft.id !== currentNftId)
    .slice(0, 4)

  const toggleFavorite = (id: string) => {
    setFavoriteNFTs((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  if (nfts.length === 0) {
    return <p className="text-muted-foreground">No other NFTs found in this collection.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {nfts.map((nft) => (
        <Card key={nft.id} className="overflow-hidden group">
          <Link href={`/nft/${nft.id}`} className="block">
            <div className="relative aspect-square">
              <Image
                src={nft.image || "/placeholder.svg"}
                alt={nft.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">{nft.name}</h3>
              <p className="text-sm text-muted-foreground">{nft.collection.name}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Badge variant="outline" className="text-xs">
                {nft.tokenId}
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFavorite(nft.id)
                  }}
                >
                  <Heart className={cn("h-4 w-4", favoriteNFTs.includes(nft.id) && "fill-red-500 text-red-500")} />
                </Button>
                <p className="font-medium">{nft.price} ETH</p>
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  )
}

