"use client"

import { getAssetHistory } from "@/app/licensing/lib/mock-activity-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

interface AssetHistoryProps {
  assetId: string
}

export function AssetHistory({ assetId }: AssetHistoryProps) {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setHistory(getAssetHistory(assetId))
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [assetId])

  if (loading) {
    return isMobile ? (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-[120px] rounded-md bg-muted"></div>
                <div className="h-5 w-[80px] rounded-md bg-muted"></div>
              </div>
              <div className="mt-2 h-4 w-full rounded-md bg-muted"></div>
              <div className="mt-4 flex items-center justify-between">
                <div className="h-4 w-[100px] rounded-md bg-muted"></div>
                <div className="h-4 w-[100px] rounded-md bg-muted"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4].map((i) => (
              <TableRow key={i} className="animate-pulse">
                <TableCell>
                  <div className="h-5 w-[150px] rounded-md bg-muted"></div>
                  <div className="mt-1 h-4 w-[200px] rounded-md bg-muted"></div>
                </TableCell>
                <TableCell>
                  <div className="h-5 w-[100px] rounded-md bg-muted"></div>
                </TableCell>
                <TableCell>
                  <div className="h-5 w-[80px] rounded-md bg-muted"></div>
                </TableCell>
                <TableCell>
                  <div className="h-5 w-[100px] rounded-md bg-muted"></div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="ml-auto h-8 w-[60px] rounded-md bg-muted"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return isMobile ? (
    <div className="space-y-4">
      {history.map((event, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{event.event}</h3>
              <Badge variant="outline">{event.date}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{event.details}</p>

            <div className="mt-4 flex items-center justify-between text-sm">
              <div>
                <span className="text-muted-foreground">User: </span>
                {event.user}
              </div>
              {event.transactionHash && (
                <div className="flex items-center gap-1">
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    {`${event.transactionHash.slice(0, 8)}...`}
                  </code>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="sr-only">View transaction</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((event, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="font-medium">{event.event}</div>
                <div className="text-sm text-muted-foreground">{event.details}</div>
              </TableCell>
              <TableCell>{event.user}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  {event.transactionHash ? `${event.transactionHash.slice(0, 8)}...` : "N/A"}
                </code>
              </TableCell>
              <TableCell className="text-right">
                {event.transactionHash && (
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="text-xs">View</span>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
