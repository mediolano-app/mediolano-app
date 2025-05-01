"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileCheck, FilePlus, MoreVertical } from "lucide-react"
import Link from "next/link"
import { ipAssets } from "@/app/licensing/lib/mock-asset-data"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"
import { AssetTypeIcon } from "@/app/licensing/components/asset-type-icon"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function AssetList() {
  const [assets] = useState(ipAssets)
  const isMobile = useIsMobile()

  return isMobile ? (
    <div className="space-y-4">
      {assets.map((asset) => (
        <Card key={asset.id} className="overflow-hidden">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                <Image
                  src={asset.image || `/placeholder.svg?height=56&width=56&text=${asset.assetType?.charAt(0) || "IP"}`}
                  alt={asset.name}
                  className="object-cover"
                  fill
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{asset.name}</h3>
                </div>

                <div className="flex items-center gap-1 mt-1">
                  <AssetTypeIcon type={asset.assetType || "Custom"} className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{asset.assetType || "Custom"}</span>
                </div>

                <p className="text-sm text-muted-foreground truncate mt-1">{asset.description}</p>

                {asset.licenseInfo && (
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <div
                      className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full", "bg-primary/10 text-primary")}
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

            <div className="mt-4 flex gap-2">
              <Link href={`/licensing/assets/${asset.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <FileCheck className="mr-2 h-4 w-4" />
                  View
                </Button>
              </Link>
              <Link href={`/licensing/create-license?assetId=${asset.id}`} className="flex-1">
                <Button size="sm" className="w-full">
                  <FilePlus className="mr-2 h-4 w-4" />
                  License
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Asset</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View Licenses</DropdownMenuItem>
                  <DropdownMenuItem>View Transactions</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete Asset</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}
    </div>
  ) : (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead>Asset Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>License</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>
                <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={
                      asset.image || `/placeholder.svg?height=40&width=40&text=${asset.assetType?.charAt(0) || "IP"}`
                    }
                    alt={asset.name}
                    className="object-cover"
                    fill
                  />
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
                    {asset.licenseInfo.version && <span className="text-primary/70">v{asset.licenseInfo.version}</span>}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
              <TableCell>{new Date(asset.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/licensing/assets/${asset.id}`}>
                    <Button variant="outline" size="icon">
                      <FileCheck className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </Link>
                  <Link href={`/licensing/create-license?assetId=${asset.id}`}>
                    <Button size="icon">
                      <FilePlus className="h-4 w-4" />
                      <span className="sr-only">Create license</span>
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Asset</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Licenses</DropdownMenuItem>
                      <DropdownMenuItem>View Transactions</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete Asset</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
