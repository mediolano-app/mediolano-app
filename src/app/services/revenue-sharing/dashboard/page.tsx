import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserRevenue, getRevenueAnalytics } from "@/app/services/revenue-sharing//lib/mock-data"
import RevenueOverview from "@/app/services/revenue-sharing/components/revenue-overview"
import RevenueAnalytics from "@/app/services/revenue-sharing/components/revenue-analytics"
import ClaimableRevenue from "@/app/services/revenue-sharing/components/claimable-revenue"
import ClaimHistory from "@/app/services/revenue-sharing/components/claim-history"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Download, BarChart3, PieChart, LineChart } from "lucide-react"
import RevenueNavigation from "@/app/services/revenue-sharing/components/revenue-navigation"

export default function RevenueDashboard() {
  const revenueData = getUserRevenue()
  const analytics = getRevenueAnalytics()

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Revenue Dashboard</h1>
          <p className="text-gray-600">Track and analyze revenue performance across your IP assets</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/services/revenue-sharing/claim">
              Claim Revenue <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <RevenueNavigation />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{revenueData.totalRevenue} ETH</div>
            <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Claimed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{revenueData.totalClaimed} ETH</div>
            <p className="text-xs text-gray-500 mt-1">Successfully claimed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available to Claim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{revenueData.claimableAmount} ETH</div>
            <p className="text-xs text-gray-500 mt-1">Ready for claiming</p>
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <RevenueOverview />
        </TabsContent>

        <TabsContent value="analytics">
          <RevenueAnalytics />
        </TabsContent>

        <TabsContent value="claims">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Claimable Revenue</CardTitle>
                <CardDescription>Revenue available for you to claim</CardDescription>
              </CardHeader>
              <CardContent>
                <ClaimableRevenue data={revenueData.claimableBreakdown} />
                <div className="mt-4 text-center">
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/services/revenue-sharing/claim">
                      View All Claimable Revenue <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Claims</CardTitle>
                <CardDescription>Your recent revenue claim history</CardDescription>
              </CardHeader>
              <CardContent>
                <ClaimHistory limit={5} />
                <div className="mt-4 text-center">
                  <Button asChild variant="outline">
                    <Link href="/services/revenue-sharing/claim?tab=history">
                      View Full Claim History <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Revenue by Source</CardTitle>
            <PieChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.bySource.map((source, index) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"][index % 4] }}
                    ></div>
                    <span className="text-sm">{source.name}</span>
                  </div>
                  <div className="font-medium text-sm">{source.value} ETH</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Top Performing Assets</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.byAsset.map((asset) => (
                <div key={asset.name} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{asset.name}</span>
                    <span className="text-sm font-medium">{asset.value} ETH</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600"
                      style={{ width: `${(asset.value / analytics.byAsset[0].value) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Monthly Trend</CardTitle>
            <LineChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthly.slice(-5).map((month) => (
                <div key={month.month} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{month.month}</span>
                    <span className="text-sm font-medium">{month.revenue} ETH</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600"
                      style={{
                        width: `${(month.revenue / Math.max(...analytics.monthly.map((m) => m.revenue))) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
