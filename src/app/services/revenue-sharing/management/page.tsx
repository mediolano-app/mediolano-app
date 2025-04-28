import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight } from "lucide-react"
import AssetRevenueList from "@/app/services/revenue-sharing/components/asset-revenue-list"
import DistributionHistory from "@/app/services/revenue-sharing/components/distribution-history"
import DistributionSchedule from "@/app/services/revenue-sharing/components/distribution-schedule"
import RevenueNavigation from "@/app/services/revenue-sharing/components/revenue-navigation"

export default function RevenueManagement() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Revenue Sharing Management</h1>
          <p className="text-gray-600">Manage revenue sharing for your intellectual property assets</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <Button asChild variant="outline">
            <Link href="/services/revenue-sharing/claim">Claim Revenue</Link>
          </Button>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/services/revenue-sharing/setup">
              <Plus className="mr-2 h-4 w-4" /> Setup New
            </Link>
          </Button>
        </div>
      </div>

      <RevenueNavigation />

      <Tabs defaultValue="assets" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="assets">IP Assets</TabsTrigger>
          <TabsTrigger value="distributions">Distribution History</TabsTrigger>
          <TabsTrigger value="schedule">Scheduled Distributions</TabsTrigger>
        </TabsList>

        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>IP Assets with Revenue Sharing</CardTitle>
              <CardDescription>Manage revenue sharing settings for your intellectual property assets</CardDescription>
            </CardHeader>
            <CardContent>
              <AssetRevenueList />

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-4">Want to set up revenue sharing for a new IP asset?</p>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/services/revenue-sharing/setup">
                    Setup Revenue Sharing <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distributions">
          <Card>
            <CardHeader>
              <CardTitle>Distribution History</CardTitle>
              <CardDescription>View the history of revenue distributions for your IP assets</CardDescription>
            </CardHeader>
            <CardContent>
              <DistributionHistory />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Distributions</CardTitle>
              <CardDescription>View and manage upcoming revenue distributions</CardDescription>
            </CardHeader>
            <CardContent>
              <DistributionSchedule />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="bg-emerald-100 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <span>
                  <span className="font-medium">Setup</span> - Configure revenue sharing for your IP assets
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-emerald-100 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <span>
                  <span className="font-medium">Manage</span> - Adjust settings and monitor distributions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-emerald-100 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <span>
                  <span className="font-medium">Claim</span> - Fractional owners claim their share of revenue
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Manual Claiming</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Remember that revenue is not automatically distributed to wallets. Fractional owners must manually claim
              their share through the platform.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/services/revenue-sharing/claim">View Claimable Revenue</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Track revenue performance, distribution metrics, and claim rates for your IP assets.
            </p>
            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Link href="/services/revenue-sharing/dashboard">View Revenue Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
