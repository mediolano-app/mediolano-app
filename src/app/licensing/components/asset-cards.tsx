import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ipAssets } from "@/app/licensing/lib/mock-asset-data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileCheck, FilePlus } from "lucide-react"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AssetCards() {
  // Display only first 3 assets for dashboard preview
  const displayedAssets = ipAssets.slice(0, 3)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {displayedAssets.map((asset) => (
        <Card key={asset.id} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={asset.image || "/placeholder.svg?height=200&width=400"}
              alt={asset.name}
              className="object-cover"
              fill
            />
          </AspectRatio>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="line-clamp-1 text-lg">{asset.name}</CardTitle>
              <Badge variant={asset.type === "original" ? "default" : "secondary"}>{asset.type}</Badge>
            </div>
            <CardDescription className="line-clamp-2">{asset.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p>{new Date(asset.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Licenses</p>
                <p>{asset.licenseCount}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-auto flex gap-2 pt-2">
            <Link href={`/licensing/assets/${asset.id}`} className="flex-1">
              <Button variant="secondary" className="w-full" size="sm">
                <FileCheck className="mr-2 h-4 w-4" />
                View
              </Button>
            </Link>
            <Link href={`/licensing/create-license?assetId=${asset.id}`} className="flex-1">
              <Button className="w-full" size="sm">
                <FilePlus className="mr-2 h-4 w-4" />
                License
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
