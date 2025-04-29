"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ExternalLink,
  MoreHorizontal,
  Verified,
  Calendar,
  Palette,
  Music,
  FileText,
  Code,
  Hexagon,
  Video,
  Lightbulb,
  BadgeCheck,
  Box,
  Shield,
  Send,
  FileCheck,
  BarChart3,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Asset, IPType } from "@/types/asset"

interface NFTCardProps extends Partial<Asset> {
  className?: string
}

export default function NFTCard({
  id = "1",
  name = "Abstract Dimension #312",
  creator = "0xArtist",
  verified = true,
  image = "/background.jpg",
  collection = "Digital Masterpieces",
  licenseType = "Creative Commons",
  description = "Digital asset with programmable licensing terms and royalty structures.",
  registrationDate = "March 15, 2025",
  type = "Art",
  templateType = "Standard Art",
  protectionLevel = 90,
  value = "0.85 ETH",
  className,
}: NFTCardProps) {
  const getTypeIcon = (type: IPType) => {
    switch (type) {
      case "Art":
        return <Palette className="h-4 w-4" />
      case "Audio":
        return <Music className="h-4 w-4" />
      case "Video":
        return <Video className="h-4 w-4" />
      case "Document":
        return <FileText className="h-4 w-4" />
      case "Software":
        return <Code className="h-4 w-4" />
      case "NFT":
        return <Hexagon className="h-4 w-4" />
      case "Patent":
        return <Lightbulb className="h-4 w-4" />
      case "Trademark":
        return <BadgeCheck className="h-4 w-4" />
      default:
        return <Box className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: IPType) => {
    const colorMap: Record<IPType, string> = {
      Art: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/30",
      Audio: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/30",
      Video: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/30",
      Document:
        "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/30",
      Patent:
        "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/30",
      Trademark:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/30",
      Software:
        "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-800/30",
      NFT: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800/30",
      Other: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800/30",
    }

    return colorMap[type] || colorMap["Other"]
  }

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
      {/* Image */}
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={image || "/background.jpg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Content */}
      <CardHeader className="p-4 pb-0 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-base line-clamp-1" title={name}>
              {name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="truncate max-w-[120px]">{creator}</span>
              {verified && <Verified className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />}
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {value}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-3 space-y-3">
        {/* Template and Type Information */}
        <div className="flex flex-col gap-2">
          {/* Template Type - Highlighted */}
          <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/30">
            <div className={`rounded-md p-1.5 ${getTypeColor(type)}`}>{getTypeIcon(type)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">Template</div>
              <div className="text-sm font-medium truncate" title={templateType}>
                {templateType}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground block">Collection</span>
              <span className="font-medium truncate block">{collection}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">License</span>
              <span className="font-medium truncate block">{licenseType}</span>
            </div>
          </div>
        </div>

        {/* Registration Date - Subtle */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Registered on {registrationDate}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Link href={`/assets/${id}`} className="flex-1">
          <Button size="sm" className="w-full">
            View IP
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Asset Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Proof of Ownership</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Send className="mr-2 h-4 w-4" />
              <span>Transfer Asset</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <FileCheck className="mr-2 h-4 w-4" />
              <span>Licensing Options</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Asset Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Monetize</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
