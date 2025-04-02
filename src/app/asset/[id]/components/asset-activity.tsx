"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { getAssetActivity } from "@/lib/mockAssetDashboard"

export function AssetActivity() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const allActivity = getAssetActivity()

  const filteredActivity = allActivity.filter(
    (item) =>
      (filter === "all" || item.event.toLowerCase() === filter) &&
      (item.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.to.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Activity (Demonstration)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activity"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setFilter("all")}>
              <Filter className="mr-2 h-4 w-4" /> All
            </Button>
            <Button variant="outline" size="sm" onClick={() => setFilter("minted")}>
              Minted
            </Button>
            <Button variant="outline" size="sm" onClick={() => setFilter("sold")}>
              Sold
            </Button>
            <Button variant="outline" size="sm" onClick={() => setFilter("transfer")}>
              Transfer
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivity.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.event}</TableCell>
                  <TableCell className="max-w-[100px] truncate">{item.from}</TableCell>
                  <TableCell className="max-w-[100px] truncate">{item.to}</TableCell>
                  <TableCell>{item.price} ETH</TableCell>
                  <TableCell>{item.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

