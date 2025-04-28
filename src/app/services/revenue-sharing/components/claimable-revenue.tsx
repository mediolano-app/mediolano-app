"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { ClaimableRevenueItem } from "@/app/services/revenue-sharing/lib/types"
import { Check, AlertCircle, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface ClaimableRevenueProps {
  data: ClaimableRevenueItem[]
}

export default function ClaimableRevenue({ data }: ClaimableRevenueProps) {
  const [claiming, setClaiming] = useState<string | null>(null)
  const [claimed, setClaimed] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<ClaimableRevenueItem | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  const handleClaim = (id: string) => {
    setClaiming(id)

    // Simulate claiming process
    setTimeout(() => {
      setClaiming(null)
      setClaimed([...claimed, id])
    }, 2000)
  }

  const openClaimDialog = (item: ClaimableRevenueItem) => {
    setSelectedItem(item)
    setShowDialog(true)
  }

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const isClaimable = !claimed.includes(item.id)

        return (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row sm:items-center p-4">
                <div className="flex-1 mb-4 sm:mb-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{item.assetName}</h3>
                    {claimed.includes(item.id) && (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="mr-1 h-3 w-3" />
                        Claimed
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">{item.amount} ETH</span>
                    <span className="text-gray-500"> • From {item.source}</span>
                  </div>

                  {item.expiresAt && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                      <Info className="h-3 w-3" />
                      Expires on {new Date(item.expiresAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openClaimDialog(item)} disabled={!isClaimable}>
                    Details
                  </Button>

                  <Button
                    onClick={() => handleClaim(item.id)}
                    disabled={!isClaimable || claiming === item.id}
                    size="sm"
                    className={isClaimable ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300"}
                  >
                    {claiming === item.id ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Claiming...
                      </span>
                    ) : isClaimable ? (
                      "Claim"
                    ) : (
                      "Claimed"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {data.length === 0 && (
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No claimable revenue</h3>
          <p className="mt-1 text-sm text-gray-500">You don't have any claimable revenue at the moment.</p>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Revenue Details</DialogTitle>
            <DialogDescription>Details about this revenue and claiming process</DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm text-gray-500">Asset</div>
                <div className="col-span-2 font-medium">{selectedItem.assetName}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm text-gray-500">Amount</div>
                <div className="col-span-2 font-medium">{selectedItem.amount} ETH</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm text-gray-500">Source</div>
                <div className="col-span-2 font-medium">{selectedItem.source}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm text-gray-500">Description</div>
                <div className="col-span-2">{selectedItem.description}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm text-gray-500">Generated On</div>
                <div className="col-span-2">
                  {selectedItem.generatedAt ? new Date(selectedItem.generatedAt).toLocaleDateString() : "N/A"}
                </div>
              </div>

              {selectedItem.expiresAt && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-sm text-gray-500">Expires On</div>
                  <div className="col-span-2 text-amber-600">
                    {new Date(selectedItem.expiresAt).toLocaleDateString()}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <h4 className="font-medium mb-2">Claiming Process</h4>
                <p className="text-sm text-gray-600">
                  When you claim this revenue, it will be transferred to your connected wallet. The transaction will be
                  processed on the Starknet blockchain and may take a few minutes to complete.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedItem) {
                  handleClaim(selectedItem.id)
                  setShowDialog(false)
                }
              }}
              disabled={selectedItem ? claimed.includes(selectedItem.id) : true}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Claim Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
