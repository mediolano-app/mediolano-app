"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"
import { LazyImage } from "@/components/ui/lazy-image"
import { Calendar, DollarSign, FileCheck, Clock, Info, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Asset {
  id: string
  name: string
  creator: string
  verified: boolean
  image: string
  collection: string
  licenseType: string
  description: string
  registrationDate: string
  acquired: string
  value: string
}

interface SelectedAssetDetailsProps {
  asset: Asset
}

export function SelectedAssetDetails({ asset }: SelectedAssetDetailsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Selected Asset</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/asset/${asset.id}`} className="text-muted-foreground hover:text-primary">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>View details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative rounded-md overflow-hidden">
          <LazyImage
            src={asset.image}
            fallbackSrc="/placeholder.svg"
            alt={asset.name}
            width={400}
            height={300}
            className="w-full h-auto object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary/80 text-primary-foreground">#{asset.id}</Badge>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-lg">{asset.name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">by {asset.creator}</p>
            {asset.verified && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="h-5 px-1">
                      ✓
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verified creator</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">License:</span>
          </div>
          <div className="text-right font-medium">{asset.licenseType}</div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Value:</span>
          </div>
          <div className="text-right font-medium">{asset.value}</div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Registered:</span>
          </div>
          <div className="text-right">{asset.registrationDate}</div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Acquired:</span>
          </div>
          <div className="text-right">{asset.acquired}</div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium mb-1">Description</h4>
          <p className="text-sm text-muted-foreground">{asset.description}</p>
        </div>

        <div className="rounded-md bg-muted/50 p-3 flex items-start gap-2">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Transfer Information</p>
            <p>
              Transferring this asset will change ownership and all associated rights. This action cannot be undone.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
