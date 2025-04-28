"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getScheduledDistributions } from "@/app/services/revenue-sharing/lib/mock-data"
import { ArrowUpDown, Calendar, Clock, Edit, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DistributionSchedule() {
  const [sortField, setSortField] = useState<string>("scheduledDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filter, setFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedDistribution, setSelectedDistribution] = useState<any>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const scheduledDistributions = getScheduledDistributions()

  // Filter and sort the scheduled distributions
  const filteredSchedule = scheduledDistributions
    .filter((dist) => {
      if (filter !== "all" && dist.type !== filter) return false
      if (searchTerm && !dist.assetName.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof b]

      if (sortField === "scheduledDate") {
        return sortDirection === "asc"
          ? new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
          : new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
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
      setSortDirection("asc")
    }
  }

  const handleDelete = () => {
    setDeleting(true)

    // Simulate deletion process
    setTimeout(() => {
      setDeleting(false)
      setShowDeleteDialog(false)
      // In a real app, you would remove the item from the state/database
    }, 1500)
  }

  // Get unique distribution types for filtering
  const distributionTypes = Array.from(new Set(scheduledDistributions.map((dist) => dist.type)))

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
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {distributionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredSchedule.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No scheduled distributions found</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("scheduledDate")}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Scheduled Date <ArrowUpDown className="h-3 w-3" />
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
                    onClick={() => toggleSort("estimatedAmount")}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Est. Amount <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("type")}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Type <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedule.map((distribution) => {
                const isUpcoming = new Date(distribution.scheduledDate) > new Date()

                return (
                  <TableRow key={distribution.id}>
                    <TableCell>
                      <div className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        {new Date(distribution.scheduledDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(distribution.scheduledDate).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>{distribution.assetName}</TableCell>
                    <TableCell>
                      <div className="font-medium">{distribution.estimatedAmount} ETH</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{distribution.type}</Badge>
                    </TableCell>
                    <TableCell>{distribution.frequency}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setSelectedDistribution(distribution)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete this scheduled distribution?</DialogDescription>
          </DialogHeader>

          {selectedDistribution && (
            <div className="py-4">
              <Alert>
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  This will permanently delete the scheduled distribution for {selectedDistribution.assetName} on{" "}
                  {new Date(selectedDistribution.scheduledDate).toLocaleDateString()}. This action cannot be undone.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
