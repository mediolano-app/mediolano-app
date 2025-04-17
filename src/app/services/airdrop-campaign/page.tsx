import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CampaignCard } from "@/app/services/airdrop-campaign/components/campaign-card"
import { getCampaigns } from "@/app/services/airdrop-campaign/lib/data"
import { ArrowRight, Plus } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { activeCampaigns, popularCampaigns, myCampaigns } = getCampaigns()

  return (
    <div className="container mx-auto px-4 py-6">


<div className="space-y-1 mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Airdrop Campaign</h1>
        <p className="text-muted-foreground">Create and manage Programmable IP Airdrop Campaigns</p>
      </div>


      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Card className="w-full md:w-1/3">
          <CardHeader className="pb-2">
            <CardTitle>Create Campaign</CardTitle>
            <CardDescription>Launch a new NFT airdrop campaign</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Define tasks, set eligibility criteria, and distribute your NFTs to build your community.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/services/airdrop-campaign/campaigns/create">
                <Plus className="mr-2 h-4 w-4" /> Create Campaign
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-full md:w-1/3">
          <CardHeader className="pb-2">
            <CardTitle>Manage Campaigns</CardTitle>
            <CardDescription>View and edit your existing campaigns</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Track participation, adjust parameters, and monitor the success of your airdrops.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/services/airdrop-campaign/campaigns/my-campaigns">
                Manage Campaigns <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-full md:w-1/3">
          <CardHeader className="pb-2">
            <CardTitle>Participate</CardTitle>
            <CardDescription>Join active airdrop campaigns</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Complete tasks to become eligible for NFT airdrops from various creators.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/services/airdrop-campaign/campaigns/active">
                Browse Campaigns <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Campaigns</TabsTrigger>
          <TabsTrigger value="popular">Popular Campaigns</TabsTrigger>
          <TabsTrigger value="my">My Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

