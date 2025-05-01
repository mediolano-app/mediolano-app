"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAssetLicenses } from "@/app/licensing/lib/mock-asset-data"
import { FileCheck, LinkIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useState, useEffect } from "react"

interface AssetLicensesProps {
  assetId: string
}

export function AssetLicenses({ assetId }: AssetLicensesProps) {
  const [licenses, setLicenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLicenses(getAssetLicenses(assetId))
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [assetId])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse overflow-hidden">
            <CardHeader className="pb-2">
              <div className="h-6 w-3/4 rounded-md bg-muted"></div>
              <div className="mt-2 h-4 w-full rounded-md bg-muted"></div>
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              <div className="h-6 w-full rounded-md bg-muted"></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 w-full rounded-md bg-muted"></div>
                <div className="h-10 w-full rounded-md bg-muted"></div>
              </div>
              <div className="h-10 w-full rounded-md bg-muted"></div>
              <div className="flex justify-end">
                <div className="h-9 w-[100px] rounded-md bg-muted"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!licenses.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <FileCheck className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-medium">No Licenses</h3>
          <p className="mt-2 text-center text-muted-foreground">This asset doesn't have any licenses yet.</p>
          <Link href={`/licensing/create-license?assetId=${assetId}`}>
            <Button className="mt-4">Create License</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {licenses.map((license) => (
        <Card key={license.id} className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="line-clamp-1 text-lg">{license.name}</CardTitle>
              <Badge variant={license.status === "active" ? "success" : "destructive"}>{license.status}</Badge>
            </div>
            <CardDescription className="line-clamp-2">{license.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={license.licenseeAvatar || "/placeholder.svg"} />
                <AvatarFallback>{license.licensee.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <span className="text-muted-foreground">Licensee: </span>
                <span className="truncate">{license.licensee}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Created: </span>
                {new Date(license.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="text-muted-foreground">Expires: </span>
                {license.expiryDate ? new Date(license.expiryDate).toLocaleDateString() : "Never"}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border p-2 text-sm">
              <span>License ID</span>
              <div className="flex items-center gap-1">
                <code className="rounded bg-muted px-1 py-0.5 text-xs">{license.id.slice(0, 8)}...</code>
                <LinkIcon className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
            <div className="flex justify-end">
              <Link href={`/licensing/licenses/${license.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
