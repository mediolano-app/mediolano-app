"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Holder {
  id: string
  address: string
  amount: number
  percentage: string
  isCreator: boolean
}

interface TokenHoldersProps {
  holders: Holder[]
  symbol: string
  totalSupply: number
}

export function TokenHolders({ holders, symbol, totalSupply }: TokenHoldersProps) {
  const [visibleHolders, setVisibleHolders] = useState(5)

  const loadMore = () => {
    setVisibleHolders((prev) => Math.min(prev + 5, holders.length))
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Holders</CardTitle>
        <CardDescription>Accounts holding {symbol} tokens</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {holders.slice(0, visibleHolders).map((holder, index) => (
            <div key={holder.id} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{index + 1}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{holder.address}</p>
                    {holder.isCreator && (
                      <Badge variant="secondary" className="text-xs">
                        Creator
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{formatAmount(holder.amount)} tokens</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{holder.percentage}%</p>
                <p className="text-xs text-muted-foreground">of supply</p>
              </div>
            </div>
          ))}

          {visibleHolders < holders.length && (
            <Button variant="outline" size="sm" className="w-full" onClick={loadMore}>
              Load More
            </Button>
          )}

          {holders.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No holders yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
