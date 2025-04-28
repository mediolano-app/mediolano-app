"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAssetDistributionData } from "@/app/services/revenue-sharing/lib/mock-data"
import { AlertCircle, ArrowUpDown, Copy, ExternalLink } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface AssetRevenueDistributionProps {
  assetId: string
}

export default function AssetRevenueDistribution({ assetId }: AssetRevenueDistributionProps) {
  const [sortField, setSortField] = useState<string>("percentage")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const { toast } = useToast()

  const distributionData = getAssetDistributionData(assetId)

  if (!distributionData || distributionData.owners.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No distribution data</h3>
        <p className="mt-1 text-sm text-gray-500">No revenue distribution data available for this asset.</p>
      </div>
    )
  }

  // Sort the owners
  const sortedOwners = [...distributionData.owners].sort((a, b) => {
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
      setSortDirection("desc")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The wallet address has been copied to your clipboard.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="font-medium mb-2">Distribution Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500">Total Owners</div>
            <div className="text-xl font-bold">{distributionData.owners.length}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Creator Share</div>
            <div className="text-xl font-bold">{distributionData.creatorShare}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total Shares</div>
            <div className="text-xl font-bold">{distributionData.totalShares}</div>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Owner</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("percentage")}
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                >
                  Percentage <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("shares")}
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                >
                  Shares <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("totalReceived")}
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                >
                  Total Received <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOwners.map((owner) => (
              <TableRow key={owner.wallet}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {owner.isCreator && (
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded">Creator</span>
                    )}
                    <div>
                      <div className="font-mono text-xs">
                        {owner.wallet.substring(0, 6)}...{owner.wallet.substring(owner.wallet.length - 4)}
                      </div>
                      {owner.name && <div className="text-xs text-gray-500">{owner.name}</div>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{owner.percentage}%</div>
                  <Progress value={owner.percentage} className="h-1 mt-1" />
                </TableCell>
                <TableCell>{owner.shares}</TableCell>
                <TableCell>{owner.totalReceived} ETH</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={() => copyToClipboard(owner.wallet)}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy Address</span>
                    </Button>
                    <Button asChild size="icon" variant="ghost">
                      <a
                        href={`https://starkscan.co/contract/${owner.wallet}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View on Explorer</span>
                      </a>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
