import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, FileEdit, FilePlus } from "lucide-react"
import { AssetDetails } from "@/app/licensing/components/asset-details"
import { AssetLicenses } from "@/app/licensing/components/asset-licenses"
import { AssetHistory } from "@/app/licensing/components/asset-history"
import { getAssetById } from "@/app/licensing/lib/mock-asset-data"

interface AssetPageProps {
  params: { id: string }
}

export default function AssetPage({ params }: AssetPageProps) {
  const asset = getAssetById(params.id)

  if (!asset) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Asset not found</h1>
          <p className="mt-2 text-muted-foreground">The asset you are looking for does not exist.</p>
          <Link href="/assets">
            <Button className="mt-4">Back to Assets</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/assets" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{asset.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <FileEdit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Link href={`/create-license?assetId=${asset.id}`}>
            <Button size="sm" className="w-full sm:w-auto">
              <FilePlus className="mr-2 h-4 w-4" />
              Create License
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="details" className="mt-6 pb-16 md:pb-0">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4">
          <AssetDetails asset={asset} />
        </TabsContent>
        <TabsContent value="licenses" className="mt-4">
          <AssetLicenses assetId={asset.id} />
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <AssetHistory assetId={asset.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
