import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { getCreatorInfo } from "@/lib/mockAssetDashboard"
interface CreatorInfoProps {
  nftData: {
    creator: string
  }
}

export function CreatorInfo({ nftData }: CreatorInfoProps) {
  const creator = getCreatorInfo()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creator</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={creator.avatarUrl} alt={creator.name} />
          <AvatarFallback>{nftData.creator.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold mb-2">{nftData.creator || "Unknown"}</h3>
        <p className="text-sm text-muted-foreground mb-4">{creator.bio}</p>
        <div className="grid grid-cols-3 gap-4 w-full mb-4">
          <div>
            <p className="font-semibold">{creator.totalWorks}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Works</p>
          </div>
          <div>
            <p className="font-semibold">{creator.followers}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="font-semibold">{creator.totalSales} ETH</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Sales</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {creator.specialties.map((specialty, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button variant="outline" className="w-full sm:w-1/2">
            Follow Creator
          </Button>
          <Button variant="outline" className="w-full sm:w-1/2">
            <ExternalLink className="w-4 h-4 mr-2" />
            Full Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

