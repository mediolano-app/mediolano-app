import type { Asset } from "@/app/services/proof-of-ownership/lib/types"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, Share2, FileText, Code, Brain, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface AssetGridProps {
  assets: Asset[]
  showVerificationStatus?: boolean
}

export default function AssetGrid({ assets, showVerificationStatus = false }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No assets found in this category.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {assets.map((asset, index) => {
        // For demo purposes, we'll alternate verification statuses
        const verificationStatus = index % 3 === 2 ? "pending" : "verified"

        return (
          <Card key={asset.id} className="overflow-hidden">
            <div className="aspect-square relative bg-muted">
              {asset.type === "artwork" || asset.type === "video" ? (
                <Image src={asset.thumbnailUrl || "/placeholder.svg"} alt={asset.title} fill className="object-cover" />
              ) : asset.type === "music" ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-primary/30"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  {asset.type === "literature" && <FileText className="h-12 w-12 text-muted-foreground" />}
                  {asset.type === "software" && <Code className="h-12 w-12 text-muted-foreground" />}
                  {asset.type === "ai-model" && <Brain className="h-12 w-12 text-muted-foreground" />}
                </div>
              )}

              {/* Verification Status Badge */}
              {showVerificationStatus && (
                <div
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium
                  ${
                    verificationStatus === "verified"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                  }`}
                >
                  {verificationStatus === "verified" ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Verified</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3" />
                      <span>Pending</span>
                    </>
                  )}
                </div>
              )}

              {/* Protection Period Badge */}
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/60 text-white text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>70 years protection</span>
              </div>
            </div>
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium line-clamp-1">{asset.title}</h3>
                  <p className="text-sm text-muted-foreground">{asset.registrationDate}</p>
                </div>
                <Badge
                  variant={asset.type === "artwork" ? "default" : asset.type === "music" ? "secondary" : "outline"}
                >
                  {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex justify-between gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/asset/${asset.id}`}>
                  <Eye className="h-4 w-4 mr-1" /> View Proof
                </Link>
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
