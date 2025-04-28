import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DistributionHistory from "@/app/services/revenue-sharing/components/distribution-history"
import DistributionSchedule from "@/app/services/revenue-sharing/components/distribution-schedule"
import RevenueNavigation from "@/app/services/revenue-sharing/components/revenue-navigation"

export default function Distributions() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Revenue Distributions</h1>
      <p className="text-gray-600 mb-8">Track and manage revenue distributions for your IP assets</p>

      <RevenueNavigation />

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList>
          <TabsTrigger value="history">Distribution History</TabsTrigger>
          <TabsTrigger value="schedule">Scheduled Distributions</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
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
    </div>
  )
}
