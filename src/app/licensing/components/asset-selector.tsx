"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"
import { ipAssets } from "@/app/licensing/lib/mock-asset-data"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { AssetTypeIcon } from "@/app/licensing/components/asset-type-icon"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export function AssetSelector() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [assetType, setAssetType] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter assets to only show originals that can be licensed
  const filteredAssets = ipAssets.filter(
    (asset) =>
      asset.type === "original" &&
      asset.status === "active" &&
      (search === "" ||
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.description.toLowerCase().includes(search.toLowerCase())) &&
      (assetType === "" || asset.assetType === assetType),
  )

  const handleSelect = (assetId: string) => {
    router.push(`/licensing/create-license?assetId=${assetId}`)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>

        {isMobile ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-14 w-14 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Skeleton className="h-9 w-[100px]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]"></TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4].map((i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell>
                        <Skeleton className="h-10 w-10 rounded-md" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[150px] mb-1" />
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[100px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Skeleton className="h-9 w-[100px]" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your IP assets..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={assetType} onValueChange={setAssetType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All asset types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All asset types</SelectItem>
              <SelectItem value="Audio">Audio</SelectItem>
              <SelectItem value="Art">Art</SelectItem>
              <SelectItem value="Documents">Documents</SelectItem>
              <SelectItem value="NFT">NFT</SelectItem>
              <SelectItem value="Video">Video</SelectItem>
              <SelectItem value="Patents">Patents</SelectItem>
              <SelectItem value="Posts">Posts</SelectItem>
              <SelectItem value="Publications">Publications</SelectItem>
              <SelectItem value="RWA">RWA</SelectItem>
              <SelectItem value="Software">Software</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSearch("")
              setAssetType("")
            }}
          >
            <Filter className="h-4 w-4" />
            <span className="sr-only">Reset filters</span>
          </Button>
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {filteredAssets.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No IP assets found. Please create an original asset first.</p>
            </Card>
          ) : (
            filteredAssets.map((asset) => (
              <Card key={asset.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                      <AspectRatio ratio={1}>
                        <Image
                          src={
                            asset.image ||
                            `/placeholder.svg?height=56&width=56&text=${asset.assetType?.charAt(0) || "IP"}`
                          }
                          alt={asset.name}
                          className="object-cover"
                          fill
                        />
                      </AspectRatio>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{asset.name}</h3>

                      <div className="flex items-center gap-1 mt-1">
                        <AssetTypeIcon
                          type={asset.assetType || "Custom"}
                          className="h-3.5 w-3.5 text-muted-foreground"
                        />
                        <span className="text-xs text-muted-foreground">{asset.assetType || "Custom"}</span>
                      </div>

                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{asset.description}</p>

                      {asset.licenseInfo && (
                        <div className="mt-2 flex items-center gap-1 text-xs">
                          <div
                            className={cn(
                              "flex items-center gap-1 px-2 py-0.5 rounded-full",
                              "bg-primary/10 text-primary",
                            )}
                          >
                            <span className="font-medium">{asset.licenseInfo.type}</span>
                            {asset.licenseInfo.version && (
                              <span className="text-primary/70">v{asset.licenseInfo.version}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => handleSelect(asset.id)}>Select</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No IP assets found. Please create an original asset first.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                        <AspectRatio ratio={1}>
                          <Image
                            src={
                              asset.image ||
                              `/placeholder.svg?height=40&width=40&text=${asset.assetType?.charAt(0) || "IP"}`
                            }
                            alt={asset.name}
                            className="object-cover"
                            fill
                          />
                        </AspectRatio>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[300px]">{asset.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <AssetTypeIcon type={asset.assetType || "Custom"} />
                        <Badge variant="outline" className="font-normal">
                          {asset.assetType || "Custom"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {asset.licenseInfo ? (
                        <div
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                            "bg-primary/10 text-primary",
                          )}
                        >
                          <span className="font-medium">{asset.licenseInfo.type}</span>
                          {asset.licenseInfo.version && (
                            <span className="text-primary/70">v{asset.licenseInfo.version}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(asset.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => handleSelect(asset.id)}>Select</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
