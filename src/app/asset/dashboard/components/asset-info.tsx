import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Share2, ExternalLink } from "lucide-react"
import { getAssetInfo } from "@/lib/mockAssetDashboard"

export function AssetInfo() {
  const asset = getAssetInfo()

  return (
    <Card className="bg-background/60">
      <CardHeader>
        <CardTitle>Asset Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{asset.title}</h2>
            <p className="text-sm text-muted-foreground">{asset.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {asset.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Collection</p>
              <p className="font-semibold">{asset.collection}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Token ID</p>
              <p className="font-semibold">{asset.tokenId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Token Standard</p>
              <p className="font-semibold">{asset.tokenStandard}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Blockchain</p>
              <p className="font-semibold">Starknet</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Add to Favorites
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View on IPFS
            </Button>
          </div>
        </div>
        <div className="relative aspect-square">
          <Image
            src={asset.imageUrl || "/placeholder.svg"}
            alt={asset.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </CardContent>
    </Card>
  )
}

