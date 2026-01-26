"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Share2, Users, Calendar, Shield, Flag } from "lucide-react"
import { Collection } from "@/lib/types"
import Link from "next/link"
import { LazyImage } from "@/components/ui/lazy-image"
import { AddressLink } from "@/components/ui/address-link"
import { formatDate } from "@/lib/utils"
import { ReportCollectionDialog } from "@/components/report-collection-dialog"

interface CollectionCardProps {
  collection: Collection
  index: number
}

export function CollectionCard({ collection, index }: CollectionCardProps) {
  const [isReportOpen, setIsReportOpen] = useState(false)

  // Helper to safely format date key
  const getFormattedDate = (dateStr: string) => {
    if (!dateStr || dateStr === "0") return "Unknown"
    // Handle numeric timestamp (seconds or ms)
    if (/^\d+$/.test(dateStr)) {
      const num = Number(dateStr)
      // If > 1e12 likely ms, else seconds. Starknet uses seconds usually.
      // Current timestamp in seconds is ~1.7e9. In ms ~1.7e12.
      const date = num > 1e12 ? new Date(num) : new Date(num * 1000)

      // If invalid date, fallback
      if (isNaN(date.getTime())) return "Unknown"

      return formatDate(date.toISOString())
    }
    return formatDate(dateStr)
  }

  return (
    <>
      <div className="group h-full rounded-lg">
        <Card className="h-full glass flex flex-col">
          <CardHeader className="p-0">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <LazyImage
                src={collection.image}
                fallbackSrc="/placeholder.svg"
                alt={`${collection.name} preview ${index + 1}`}
                fill
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                  {collection.type || "Collection"}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 flex-1">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                  {collection.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{collection.description}</p>
              </div>

              <div className="flex items-center justify-between text-sm">

                <div className="flex items-center gap-1 text-muted-foreground">
                  {/* 
                  <Users className="h-4 w-4" />
                  <AddressLink address={collection.owner} className="font-medium text-muted-foreground hover:text-primary z-20 relative" />
                  */}
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                </div>
              </div>

            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex gap-2">
            <Link href={`/collections/${collection.nftAddress || collection.id}`} className="flex-1">
              <Button className="w-full bg-transparent" variant="outline">
                View Collection
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-transparent shrink-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/collections/${collection.nftAddress || collection.id}`} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    View Collection
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Collection
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsReportOpen(true)}>
                  <Flag className="mr-2 h-4 w-4" />
                  Report Collection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      </div>

      <ReportCollectionDialog
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
        collectionId={collection.id.toString()}
        collectionName={collection.name}
        collectionOwner={collection.owner}
      />
    </>
  )
}
