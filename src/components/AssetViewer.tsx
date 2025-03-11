"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Expand, Minimize } from "lucide-react"
import type { Asset } from "@/lib/types"

export function AssetViewer({ asset }: { asset: Asset | undefined }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  if (!asset) {
    return (
      <Card className="overflow-hidden">
        <div className="relative aspect-square bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Asset not found</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className={`relative ${isFullscreen ? "h-screen" : "aspect-square"}`}>
          <Image src={asset.image || "/placeholder.svg"} alt={asset.name} fill className="object-cover" />
        </div>
        <Button variant="secondary" size="icon" className="absolute bottom-4 right-4" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  )
}

