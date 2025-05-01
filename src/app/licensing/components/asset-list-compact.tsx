import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ipAssets } from "@/app/licensing/lib/mock-asset-data"
import { FileCheck, FilePlus, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { AssetTypeIcon } from "@/app/licensing/components/asset-type-icon"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function AssetList() {
  // Display only first 5 assets for dashboard preview
  const displayedAssets = ipAssets.slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Assets</h2>
        <Link href="/assets">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {displayedAssets.map((asset) => (
              <div key={asset.id} className="flex items-start gap-4 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={
                      asset.image || `/placeholder.svg?height=64&width=64&text=${asset.assetType?.charAt(0) || "IP"}`
                    }
                    alt={asset.name}
                    className="object-cover"
                    fill
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{asset.name}</h3>
                    <div className="flex items-center gap-1">
                      <AssetTypeIcon type={asset.assetType || "Custom"} className="h-4 w-4" />
                      <Badge variant="outline" className="shrink-0 text-xs font-normal">
                        {asset.assetType || "Custom"}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground truncate mt-1">{asset.description}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs">
                    <span className="text-muted-foreground">
                      Created: {new Date(asset.createdAt).toLocaleDateString()}
                    </span>

                    {asset.licenseInfo && (
                      <div
                        className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full", "bg-primary/10 text-primary")}
                      >
                        <span className="font-medium">{asset.licenseInfo.type || "Standard"}</span>
                        {asset.licenseInfo.version && (
                          <span className="text-primary/70">v{asset.licenseInfo.version}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <Link href={`/assets/${asset.id}`}>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <FileCheck className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </Link>
                  <Link href={`/create-license?assetId=${asset.id}`}>
                    <Button size="sm" className="h-8">
                      <FilePlus className="h-4 w-4 mr-2" />
                      <span>License</span>
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Asset</DropdownMenuItem>
                      <DropdownMenuItem>View Licenses</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete Asset</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {displayedAssets.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground">You don't have any assets yet.</p>
            <Link href="/assets/create">
              <Button className="mt-4">Create Your First Asset</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
