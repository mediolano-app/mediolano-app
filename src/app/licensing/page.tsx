
import { SearchBar } from "@/app/licensing/components/search-bar"
import { AssetList } from "@/app/licensing/components/asset-list-compact"
import { RecentActivity } from "@/app/licensing/components/recent-activity"
import { QuickActions } from "@/app/licensing/components/quick-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">

      <div className="mt-6">
        <SearchBar />
      </div>

      <div className="mt-8">
        <QuickActions />
      </div>

      <div className="mt-8">
        <Tabs defaultValue="assets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="assets">Your Assets</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="mt-0">
            <AssetList />
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <RecentActivity />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
