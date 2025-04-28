"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getDistributionHistory } from "@/app/services/revenue-sharing/lib/mock-data"
import { ArrowUpDown, ExternalLink, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DistributionHistory() {
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filter, setFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedDistribution, setSelectedDistribution] = useState<any>(null)

  const distributionHistory = getDistributionHistory()

  // Filter and sort the distribution history
  const filteredHistory = distributionHistory
    .filter((dist) => {
      if (filter !== "all" && dist.status !== filter) return false
      if (searchTerm && !dist.assetName.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1">
          <Input
            placeholder="Search by asset name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
                  onClick={() => toggleSort("totalAmount")}
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                >
                  Amount <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("recipientCount")}
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                >
                  Recipients <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("status")}
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                >
                  Status <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No distribution history found
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((distribution) => (
                <TableRow key={distribution.id}>
                  <TableCell>
                    <div className="font-medium">{new Date(distribution.date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{new Date(distribution.date).toLocaleTimeString()}</div>
                  </TableCell>
                  <TableCell>{distribution.assetName}</TableCell>
                  <TableCell>
                    <div className="font-medium">{distribution.totalAmount} ETH</div>
                  </TableCell>
                  <TableCell>{distribution.recipientCount} recipients</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        distribution.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : distribution.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {distribution.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => setSelectedDistribution(distribution)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Distribution Details</DialogTitle>
                            <DialogDescription>Detailed information about this revenue distribution</DialogDescription>
                          </DialogHeader>

                          {selectedDistribution && (
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 text-sm text-gray-500">Asset</div>
                                <div className="col-span-2 font-medium">{selectedDistribution.assetName}</div>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 text-sm text-gray-500">Distribution Date</div>
                                <div className="col-span-2 font-medium">
                                  {new Date(selectedDistribution.date).toLocaleString()}
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 text-sm text-gray-500">Total Amount</div>
                                <div className="col-span-2 font-medium">{selectedDistribution.totalAmount} ETH</div>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 text-sm text-gray-500">Status</div>
                                <div className="col-span-2">
                                  <Badge
                                    className={
                                      selectedDistribution.status === "Completed"
                                        ? "bg-green-100 text-green-800"
                                        : selectedDistribution.status === "Processing"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                    }
                                  >
                                    {selectedDistribution.status}
                                  </Badge>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 text-sm text-gray-500">Transaction Hash</div>
                                <div className="col-span-2">
                                  <a
                                    href={`https://starkscan.co/tx/${selectedDistribution.transactionHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 hover:underline"
                                  >
                                    {selectedDistribution.transactionHash.substring(0, 10)}...
                                    {selectedDistribution.transactionHash.substring(
                                      selectedDistribution.transactionHash.length - 10,
                                    )}
                                  </a>
                                </div>
                              </div>

                              <div className="mt-6">
                                <h4 className="font-medium mb-2">Recipients</h4>
                                <div className="rounded-md border max-h-[200px] overflow-y-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Wallet</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedDistribution.recipients.map((recipient: any, index: number) => (
                                        <TableRow key={index}>
                                          <TableCell>
                                            <div className="font-mono text-xs">
                                              {recipient.wallet.substring(0, 6)}...
                                              {recipient.wallet.substring(recipient.wallet.length - 4)}
                                            </div>
                                          </TableCell>
                                          <TableCell>{recipient.amount} ETH</TableCell>
                                          <TableCell>
                                            <Badge
                                              className={
                                                recipient.claimed
                                                  ? "bg-green-100 text-green-800"
                                                  : "bg-yellow-100 text-yellow-800"
                                              }
                                            >
                                              {recipient.claimed ? "Claimed" : "Pending"}
                                            </Badge>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button asChild size="icon" variant="ghost">
                        <a
                          href={`https://starkscan.co/tx/${distribution.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View Transaction</span>
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
