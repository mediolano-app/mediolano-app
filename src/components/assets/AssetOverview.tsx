import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Zap, Shield, Trophy } from "lucide-react"
import type { Asset } from "@/lib/types"

export function AssetOverview({ asset }: { asset: Asset }) {
  // Mock data for demonstration purposes
  const utilityScore = 85
  const communityScore = 92
  const uniquenessScore = 78

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Asset Highlights</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span>Rarity: {asset.rarity}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>Utility Score: {utilityScore}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Community Score: {communityScore}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-500" />
              <span>Uniqueness: {uniquenessScore}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Key Attributes</h3>
          <div className="space-y-4">
            {asset.attributes?.slice(0, 3).map((attr, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{attr.trait_type}</span>
                  <span className="text-sm font-medium">{attr.value}</span>
                </div>
                <Progress value={Math.random() * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Asset Utility</h3>
          <div className="space-y-2">
            <Badge className="mr-2">Access Pass</Badge>
            <Badge className="mr-2">Governance</Badge>
            <Badge className="mr-2">Staking Rewards</Badge>
            <Badge>Exclusive Content</Badge>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            This asset provides various utilities within its ecosystem, including access to exclusive events, voting
            rights in community decisions, staking rewards, and access to premium content.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

