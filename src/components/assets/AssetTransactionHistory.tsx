"use client"

import { Button } from "@/components/ui/button"
import { Tag, Clock, ExternalLink } from "lucide-react"

export function AssetTransactionHistory({ assetId }: { assetId: string }) {


  // Mock transaction history data

  const transactions = [
    { id: 1, type: "Listed", price: "35.5", date: "2023-06-15", from: "0x1a92...3e56" },
    { id: 2, type: "Sold", price: "32.8", date: "2023-05-20", from: "0x7b43...9f21", to: "0x1a92...3e56" },
    { id: 3, type: "Transferred", date: "2023-04-10", from: "0x3f67...8c12", to: "0x7b43...9f21" },
    { id: 4, type: "Minted", date: "2023-03-01", to: "0x3f67...8c12" },
  ]

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b">
          <div className="flex items-start sm:items-center gap-2 mb-2 sm:mb-0">
            <Tag className={`h-4 w-4 mt-1 sm:mt-0 ${tx.type === "Sold" ? "text-green-500" : "text-primary"}`} />
            <div>
              <p className="font-medium">{tx.type}</p>
              <p className="text-sm text-muted-foreground">
                {tx.from && `From ${tx.from}`}
                {tx.to && tx.from && " to "}
                {tx.to && `To ${tx.to}`}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="text-right sm:mr-4">
              {tx.price && <p className="font-medium">{tx.price} ETH</p>}
              <p className="text-sm text-muted-foreground flex items-center justify-end">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(tx.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Details
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                Explorer
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

