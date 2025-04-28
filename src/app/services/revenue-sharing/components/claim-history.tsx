"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getClaimHistory } from "@/app/services/revenue-sharing/lib/mock-data"
import { ArrowUpDown, ExternalLink } from "lucide-react"

interface ClaimHistoryProps {
  limit?: number
}

export default function ClaimHistory({ limit }: ClaimHistoryProps) {
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const claimHistory = getClaimHistory()

  // Apply limit if provided
  const displayHistory = limit ? claimHistory.slice(0, limit) : claimHistory

  // Sort the claim history
  const sortedHistory = [...displayHistory].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a]
    const bValue = b[sortField as keyof typeof b]

    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("date")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Date <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("assetName")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Asset <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("amount")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Amount <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Transaction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedHistory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No claim history found
              </TableCell>
            </TableRow>
          ) : (
            sortedHistory.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell>
                  <div className="font-medium">{new Date(claim.date).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">{new Date(claim.date).toLocaleTimeString()}</div>
                </TableCell>
                <TableCell>{claim.assetName}</TableCell>
                <TableCell>
                  <div className="font-medium">{claim.amount} ETH</div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      claim.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : claim.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {claim.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="ghost">
                    <a
                      href={`https://starkscan.co/tx/${claim.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View Transaction</span>
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
