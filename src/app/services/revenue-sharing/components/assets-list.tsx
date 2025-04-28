"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Asset } from "@/app/services/revenue-sharing/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ExternalLink, Edit, Share2 } from "lucide-react"

interface AssetsListProps {
  assets: Asset[]
}

export default function AssetsList({ assets }: AssetsListProps) {
  const [filter, setFilter] = useState("all")

  const filteredAssets = filter === "all" ? assets : assets.filter((asset) => asset.categories.includes(filter))

  const categories = Array.from(new Set(assets.flatMap((asset) => asset.categories)))

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(category)}
            className={filter === category ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Revenue Share</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={asset.imageUrl || "/placeholder.svg"}
                      alt={asset.title}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <div>
                      <div className="font-medium">{asset.title}</div>
                      <div className="text-xs text-gray-500">ID: {asset.id.substring(0, 8)}...</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {asset.categories.map((category) => (
                      <Badge key={category} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{asset.revenueShare}%</div>
                  <div className="text-xs text-gray-500">{asset.ownerCount} owners</div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      asset.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : asset.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }
                  >
                    {asset.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href={`/assets/${asset.id}`} className="flex items-center w-full">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/assets/${asset.id}/edit`} className="flex items-center w-full">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Asset
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/assets/${asset.id}/share`} className="flex items-center w-full">
                          <Share2 className="mr-2 h-4 w-4" />
                          Manage Sharing
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
