import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Calendar, CheckCircle, Users } from "lucide-react"
import type { Campaign } from "@/app/services/airdrop-campaign/lib/types"
import { formatDate } from "@/app/services/airdrop-campaign/lib/utils"

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = Math.round((campaign.participants / campaign.maxParticipants) * 100)

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        <img src={campaign.image || "/placeholder.svg"} alt={campaign.name} className="h-full w-full object-cover" />
        <Badge variant={campaign.status === "active" ? "default" : "secondary"} className="absolute top-3 right-3">
          {campaign.status}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{campaign.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(campaign.endDate)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{campaign.description}</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{campaign.participants} participants</span>
            </div>
            <span className="text-muted-foreground">{campaign.maxParticipants} max</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>{campaign.tasks.length} tasks</span>
            </div>
            <span className="text-muted-foreground">{campaign.reward} NFTs per user</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/campaigns/${campaign.id}`}>
            View Campaign <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

