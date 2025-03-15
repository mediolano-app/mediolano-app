"use client"

import { useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import type { Asset } from "@/lib/types"

export function RelatedAssetsCarousel({ assets }: { assets: Asset[] }) {
  const router = useRouter()
  const carouselRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth
      carouselRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }

  return (
    <div className="relative">
      <div ref={carouselRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-4 pb-4">
        {assets.map((asset) => (
          <div key={asset.id} className="snap-start flex-shrink-0 w-64">
            <AssetCard asset={asset} onClick={() => router.push(`/asset/${asset.id}`)} />
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

function AssetCard({ asset, onClick }: { asset: Asset; onClick: () => void }) {
  return (
    <Card className="overflow-hidden cursor-pointer" onClick={onClick}>
      <div className="relative aspect-square">
        <Image src={asset.image || "/placeholder.svg"} alt={asset.name} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold truncate">{asset.name}</h3>
            <p className="text-sm text-muted-foreground">{asset.collection.name}</p>
          </div>
          <AssetCardMenu assetId={asset.id} />
        </div>
      </CardContent>
    </Card>
  )
}

function AssetCardMenu({ assetId }: { assetId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => console.log(`View details: ${assetId}`)}>View details</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => console.log(`Add to watchlist: ${assetId}`)}>
          Add to watchlist
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => console.log(`Share: ${assetId}`)}>Share</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

