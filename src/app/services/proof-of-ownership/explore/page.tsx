import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter } from "lucide-react"
import AssetGrid from "@/app/services/proof-of-ownership/components/asset-grid"
import { getAllAssets } from "@/app/services/proof-of-ownership/lib/mock-data"

export default function ExplorePage() {
  const assets = getAllAssets()

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Assets</h1>
          <p className="text-muted-foreground">Discover intellectual property registered on Mediolano</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Assets</CardTitle>
          <CardDescription>Find intellectual property by title, creator, or type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search by title, creator, or description..." className="pl-8" />
            </div>
            <Button variant="outline" className="sm:w-auto">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="mt-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="artwork">Artwork</TabsTrigger>
          <TabsTrigger value="music">Music</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="literature">Literature</TabsTrigger>
          <TabsTrigger value="software">Software</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <AssetGrid assets={assets} />
        </TabsContent>
        <TabsContent value="artwork">
          <AssetGrid assets={assets.filter((asset) => asset.type === "artwork")} />
        </TabsContent>
        <TabsContent value="music">
          <AssetGrid assets={assets.filter((asset) => asset.type === "music")} />
        </TabsContent>
        <TabsContent value="video">
          <AssetGrid assets={assets.filter((asset) => asset.type === "video")} />
        </TabsContent>
        <TabsContent value="literature">
          <AssetGrid assets={assets.filter((asset) => asset.type === "literature")} />
        </TabsContent>
        <TabsContent value="software">
          <AssetGrid assets={assets.filter((asset) => asset.type === "software")} />
        </TabsContent>
      </Tabs>

      <div className="mt-12 text-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  )
}
