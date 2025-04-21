"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface Transaction {
  id: string
  type: string
  user: string
  amount: string
  tokens: string
  tokenAmount: number
  date: Date
  timeAgo: string
  change: string
}

interface TokenTransactionsProps {
  transactions: Transaction[]
  symbol: string
}

export function TokenTransactions({ transactions, symbol }: TokenTransactionsProps) {
  const [visibleTransactions, setVisibleTransactions] = useState(5)

  const loadMore = () => {
    setVisibleTransactions((prev) => Math.min(prev + 5, transactions.length))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest trading activity for {symbol}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, visibleTransactions).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    tx.type === "buy"
                      ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {tx.type === "buy" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium capitalize">{tx.type}</p>
                  <div className="flex items-center gap-1">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-[10px]">{tx.user.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground">{tx.user}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{tx.amount}</p>
                <div className="flex items-center gap-1 justify-end">
                  <Badge variant="outline" className="text-xs">
                    {tx.tokens}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{tx.timeAgo}</span>
                </div>
              </div>
            </div>
          ))}

          {visibleTransactions < transactions.length && (
            <Button variant="outline" size="sm" className="w-full" onClick={loadMore}>
              Load More
            </Button>
          )}

          {transactions.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
