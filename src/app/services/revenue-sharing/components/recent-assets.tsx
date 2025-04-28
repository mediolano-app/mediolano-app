import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRecentAssets } from "@/app/services/revenue-sharing/lib/mock-data"

export default function RecentAssets() {
  const assets = getRecentAssets()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset) => (
        <Card key={asset.id} className="overflow-hidden">
          <div className="relative h-48">
            <img src={asset.imageUrl || "/placeholder.svg"} alt={asset.title} className="w-full h-full object-cover" />
            <Badge className="absolute top-2 right-2 bg-emerald-600">{asset.category}</Badge>
          </div>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-2">{asset.title}</h3>
            <p className="text-gray-600 mb-4">{asset.description}</p>
            <div className="flex justify-between text-sm">
              <span>Owners: {asset.ownerCount}</span>
              <span>Revenue: {asset.totalRevenue} ETH</span>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Link href={`/assets/${asset.id}`} className="text-emerald-600 hover:text-emerald-800 font-medium">
              View Details
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
