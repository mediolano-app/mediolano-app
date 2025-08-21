import { Button } from "@/components/ui/button"
import { AssetList } from "@/app/licensing/components/asset-list"
import { SearchBar } from "@/app/licensing/components/search-bar"
import Link from "next/link"
import { FilePlus, Plus } from "lucide-react"

export default function AssetsPage() {
  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold">Assets</h1>
        <div className="flex gap-2">
          <Link href="/create">
            <Button variant="outline" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create Asset
            </Button>
          </Link>
          <Link href="/create-license">
            <Button className="w-full sm:w-auto">
              <FilePlus className="mr-2 h-4 w-4" />
              Create License
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <SearchBar />
      </div>

      <div className="mt-8 pb-16 md:pb-0">
        <AssetList />
      </div>
    </div>
  )
}
