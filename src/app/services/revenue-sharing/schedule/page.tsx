import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DistributionSchedule from "@/app/services/revenue-sharing/components/distribution-schedule"
import RevenueNavigation from "@/app/services/revenue-sharing/components/revenue-navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function SchedulePage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Distribution Schedule</h1>
      <p className="text-gray-600 mb-8">Manage scheduled revenue distributions for your IP assets</p>

      <RevenueNavigation />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Scheduled Distributions</CardTitle>
            <CardDescription>View and manage upcoming revenue distributions</CardDescription>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" /> Schedule New
          </Button>
        </CardHeader>
        <CardContent>
          <DistributionSchedule />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>About Scheduled Distributions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Scheduled distributions allow you to automate the process of allocating revenue to fractional owners. This
              does not automatically transfer funds to their wallets - owners will still need to manually claim their
              share.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
              <li>Set up recurring distributions on a daily, weekly, or monthly basis</li>
              <li>Define minimum threshold amounts to trigger distributions</li>
              <li>Receive notifications when distributions are processed</li>
              <li>View detailed reports of all scheduled and completed distributions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-500">Default Distribution Frequency</span>
                <span className="font-medium">Monthly</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-500">Minimum Distribution Amount</span>
                <span className="font-medium">0.1 ETH</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-500">Distribution Notifications</span>
                <span className="font-medium text-green-600">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Auto-retry Failed Distributions</span>
                <span className="font-medium text-green-600">Enabled</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
