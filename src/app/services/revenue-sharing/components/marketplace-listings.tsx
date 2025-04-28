"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { MarketplaceListing } from "@/app/services/revenue-sharing/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface MarketplaceListingsProps {
  listings: MarketplaceListing[]
}

export default function MarketplaceListings({ listings }: MarketplaceListingsProps) {
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [isInvesting, setIsInvesting] = useState(false)

  const handleInvest = () => {
    setIsInvesting(true)

    // Simulate investment process
    setTimeout(() => {
      setIsInvesting(false)
      setSelectedListing(null)
      setInvestmentAmount("")
    }, 2000)
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No listings found in this category.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Card key={listing.id} className="overflow-hidden flex flex-col">
          <div className="relative h-48">
            <img
              src={listing.imageUrl || "/placeholder.svg"}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            {listing.featured && <Badge className="absolute top-2 right-2 bg-emerald-600">Featured</Badge>}
          </div>
          <CardContent className="pt-6 flex-grow">
            <h3 className="text-xl font-bold mb-2">{listing.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {listing.categories.map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Price</p>
                <p className="font-bold">{listing.price} ETH</p>
              </div>
              <div>
                <p className="text-gray-500">Revenue Share</p>
                <p className="font-bold">{listing.revenueShare}%</p>
              </div>
              <div>
                <p className="text-gray-500">Total Shares</p>
                <p className="font-bold">{listing.totalShares}</p>
              </div>
              <div>
                <p className="text-gray-500">Available</p>
                <p className="font-bold">{listing.availableShares}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Link href={`/marketplace/${listing.id}`} className="text-emerald-600 hover:text-emerald-800 font-medium">
              View Details
            </Link>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setSelectedListing(listing)}>
                  Invest
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Invest in {selectedListing?.title}</DialogTitle>
                  <DialogDescription>Purchase shares to earn revenue from this IP asset.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="ETH amount"
                      className="col-span-3"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Shares</Label>
                    <div className="col-span-3">
                      {investmentAmount && selectedListing
                        ? Math.floor(Number(investmentAmount) / selectedListing.price)
                        : 0}{" "}
                      shares
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleInvest}
                    disabled={isInvesting || !investmentAmount}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isInvesting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Investment"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
