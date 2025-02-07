"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { EclipseIcon as Ethereum, Heart } from "lucide-react"
import { featuredNFTs, type NFT } from "@/lib/mockNFTData"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function FeaturedNFTs() {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [likedNFTs, setLikedNFTs] = useState<Set<string>>(new Set())

  const handleLike = (id: string) => {
    setLikedNFTs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredNFTs.map((nft) => (
        <motion.div
          key={nft.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden group">
            <CardHeader className="p-0">
              <div className="relative">
                <img src={nft.image || "/background.jpg"} alt={nft.name} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" size="sm" onClick={() => setSelectedNFT(nft)}>
                    Quick View
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{nft.name}</CardTitle>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{nft.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Ethereum className="w-4 h-4 mr-1 text-primary" />
                  <span className="font-semibold">{nft.price} ETH</span>
                </div>
                <Badge variant="outline">{nft.collection}</Badge>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setSelectedNFT(nft)}>
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{selectedNFT?.name}</DialogTitle>
                    <DialogDescription>Collection: {selectedNFT?.collection}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <img
                      src={selectedNFT?.image || "/background.jpg"}
                      alt={selectedNFT?.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <p>{selectedNFT?.description}</p>
                    <div className="flex justify-between items-center">
                      <span>Creator: {selectedNFT?.creator}</span>
                      <div className="flex items-center">
                        <Ethereum className="w-4 h-4 mr-1 text-primary" />
                        <span className="font-semibold">{selectedNFT?.price} ETH</span>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleLike(nft.id)}
                className={likedNFTs.has(nft.id) ? "text-red-500" : ""}
              >
                <Heart className="w-5 h-5" fill={likedNFTs.has(nft.id) ? "currentColor" : "none"} />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

