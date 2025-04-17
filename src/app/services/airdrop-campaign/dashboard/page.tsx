"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CampaignCard } from "@/app/services/airdrop-campaign/components/campaign-card"
import type { Campaign } from "@/app/services/airdrop-campaign/lib/types"
import { getUserCampaigns } from "@/app/services/airdrop-campaign/lib/data"
import { ArrowRight, Plus } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<{
    created: Campaign[]
    participating: Campaign[]
    completed: Campaign[]
  }>({
    created: [],
    participating: [],
    completed: [],
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getUserCampaigns()
        setCampaigns(data)
      } catch (error) {
        console.error("Failed to fetch campaigns:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your campaigns...</p>
        </div>
      </div>
    )
  }

  const hasNoCampaigns =
    campaigns.created.length === 0 && campaigns.participating.length === 0 && campaigns.completed.length === 0

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your NFT airdrop campaigns</p>
        </div>
        <Button asChild>
          <Link href="/campaigns/create">
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Link>
        </Button>
      </div>

      {hasNoCampaigns ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Your First Campaign</CardTitle>
              <CardDescription>Start distributing your NFTs to build your community</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create an airdrop campaign to reward early adopters, promote your project, and build an active community
                around your NFTs.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/campaigns/create">
                  <Plus className="mr-2 h-4 w-4" /> Create Campaign
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Discover Campaigns</CardTitle>
              <CardDescription>Find and participate in active airdrop campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Browse active campaigns, complete tasks, and earn NFTs from various creators in the ecosystem.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  Browse Campaigns <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue="created" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="created">Created ({campaigns.created.length})</TabsTrigger>
            <TabsTrigger value="participating">Participating ({campaigns.participating.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({campaigns.completed.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.created.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="participating" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.participating.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.completed.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

