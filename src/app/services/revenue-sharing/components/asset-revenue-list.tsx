"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAssetRevenueSettings } from "@/app/services/revenue-sharing/lib/mock-data"
import { ArrowUpDown, ExternalLink, History, Settings } from "lucide-react"

export default function AssetRevenueList() {
  const [sortField, setSortField] = useState<string>("title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const assets = getAssetRevenueSettings()

  const sortedAssets = [...assets].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a]
    const bValue = b[sortField as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("title")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Asset <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("totalShares")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Total Shares <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("creatorShare")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Creator Share <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("pendingRevenue")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Pending Revenue <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAssets.map((asset) => (
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
              <TableCell>{asset.totalShares}</TableCell>
              <TableCell>{asset.creatorShare}%</TableCell>
              <TableCell>{asset.pendingRevenue} ETH</TableCell>
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
                <div className="flex justify-end gap-2">
                  <Button asChild size="icon" variant="ghost">
                    <Link href={`/revenue-sharing/assets/${asset.id}`}>
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                  <Button asChild size="icon" variant="ghost">
                    <Link href={`/revenue-sharing/assets/${asset.id}/history`}>
                      <History className="h-4 w-4" />
                      <span className="sr-only">History</span>
                    </Link>
                  </Button>
                  <Button asChild size="icon" variant="ghost">
                    <Link href={`/revenue-sharing/assets/${asset.id}/settings`}>
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
