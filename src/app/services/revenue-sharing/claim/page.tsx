"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ClaimableRevenue from "@/app/services/revenue-sharing/components/claimable-revenue"
import ClaimHistory from "@/app/services/revenue-sharing/components/claim-history"
import { getUserRevenue } from "@/app/services/revenue-sharing/lib/mock-data"
import RevenueNavigation from "@/app/services/revenue-sharing/components/revenue-navigation"
import { useSearchParams } from "next/navigation"

export default function ClaimRevenue() {
  const revenueData = getUserRevenue()
  const searchParams = useSearchParams()
  const defaultTab = searchParams?.get("tab") === "history" ? "history" : "available"

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Claim Your Revenue</h1>
      <p className="text-gray-600 mb-8">View and claim your share of revenue from IP assets you own</p>

      <RevenueNavigation />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available to Claim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{revenueData.claimableAmount} ETH</div>
            <p className="text-xs text-gray-500 mt-1">From {revenueData.claimableBreakdown.length} sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Claimed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{revenueData.totalClaimed} ETH</div>
            <p className="text-xs text-gray-500 mt-1">Lifetime earnings claimed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{revenueData.pendingRevenue} ETH</div>
            <p className="text-xs text-gray-500 mt-1">Generated but not yet claimable</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="available">Available to Claim</TabsTrigger>
          <TabsTrigger value="history">Claim History</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle>Claimable Revenue</CardTitle>
              <CardDescription>These are the revenues available for you to claim from your IP assets</CardDescription>
            </CardHeader>
            <CardContent>
              <ClaimableRevenue data={revenueData.claimableBreakdown} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Claim History</CardTitle>
              <CardDescription>View your history of claimed revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ClaimHistory />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
