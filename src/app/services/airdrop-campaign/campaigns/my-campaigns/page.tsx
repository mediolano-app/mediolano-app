"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Trash,
  Users,
} from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// Types and utilities
import type { Campaign } from "@/app/services/airdrop-campaign/lib/types"
import { formatDate } from "@/app/services/airdrop-campaign/lib/utils"

// Mock data for my campaigns
const mockMyCampaigns: Campaign[] = [
  {
    id: "my-1",
    name: "Genesis NFT Collection Launch",
    description: "Join our Genesis NFT collection launch and be among the first to receive our exclusive NFTs.",
    image: "/placeholder.svg?height=400&width=600&text=Genesis",
    creator: "0x1234567890123456789012345678901234567890",
    contractAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    status: "active",
    participants: 450,
    maxParticipants: 1000,
    reward: 2,
    tasks: [
      {
        id: "task-1-1",
        title: "Follow on Twitter",
        description: "Follow our official Twitter account",
        type: "social",
        verificationUrl: "https://twitter.com/example",
      },
      {
        id: "task-1-2",
        title: "Join Discord",
        description: "Join our Discord community",
        type: "community",
        verificationUrl: "https://discord.gg/example",
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "my-2",
    name: "Artistic Pioneers Program",
    description: "Exclusive NFTs for early supporters of our artistic platform.",
    image: "/placeholder.svg?height=400&width=600&text=Artistic",
    creator: "0x1234567890123456789012345678901234567890",
    contractAddress: "0xbcdef1234567890abcdef1234567890abcdef123",
    status: "active",
    participants: 275,
    maxParticipants: 500,
    reward: 1,
    tasks: [
      {
        id: "task-2-1",
        title: "Subscribe to Newsletter",
        description: "Subscribe to our newsletter for updates",
        type: "community",
      },
      {
        id: "task-2-2",
        title: "Complete Survey",
        description: "Complete a short survey about digital art",
        type: "quiz",
      },
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: "my-3",
    name: "DeFi Integration Celebration",
    description: "Celebrating our DeFi integration with an exclusive NFT drop.",
    image: "/placeholder.svg?height=400&width=600&text=DeFi",
    creator: "0x1234567890123456789012345678901234567890",
    contractAddress: "0xcdef1234567890abcdef1234567890abcdef1234",
    status: "upcoming",
    participants: 0,
    maxParticipants: 2000,
    reward: 3,
    tasks: [
      {
        id: "task-3-1",
        title: "Test Our DeFi Platform",
        description: "Make a test transaction on our DeFi platform",
        type: "transaction",
      },
      {
        id: "task-3-2",
        title: "Refer a Friend",
        description: "Refer a friend to our platform",
        type: "referral",
      },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "my-4",
    name: "Community Champions",
    description: "Rewarding our most active community members with exclusive NFTs.",
    image: "/placeholder.svg?height=400&width=600&text=Community",
    creator: "0x1234567890123456789012345678901234567890",
    contractAddress: "0xdef1234567890abcdef1234567890abcdef12345",
    status: "completed",
    participants: 750,
    maxParticipants: 750,
    reward: 1,
    tasks: [
      {
        id: "task-4-1",
        title: "Participate in AMA",
        description: "Participate in our Ask Me Anything session",
        type: "community",
      },
      {
        id: "task-4-2",
        title: "Create Content",
        description: "Create content about our project",
        type: "social",
      },
    ],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: "my-5",
    name: "Early Adopter Rewards",
    description: "Special NFT rewards for early adopters of our platform.",
    image: "/placeholder.svg?height=400&width=600&text=Early+Adopters",
    creator: "0x1234567890123456789012345678901234567890",
    contractAddress: "0xef1234567890abcdef1234567890abcdef123456",
    status: "active",
    participants: 320,
    maxParticipants: 1000,
    reward: 2,
    tasks: [
      {
        id: "task-5-1",
        title: "Create Account",
        description: "Create an account on our platform",
        type: "community",
      },
      {
        id: "task-5-2",
        title: "Complete Profile",
        description: "Complete your profile information",
        type: "community",
      },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },
]

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortOption, setSortOption] = useState<string>("newest")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null)

  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      // Simulate API call
      setTimeout(() => {
        setCampaigns(mockMyCampaigns)
        setIsLoading(false)
      }, 1000)
    }

    fetchCampaigns()
  }, [])

  // Filter and sort campaigns
  const filteredCampaigns = campaigns
    .filter((campaign) => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return campaign.name.toLowerCase().includes(query) || campaign.description.toLowerCase().includes(query)
      }
      return true
    })
    .filter((campaign) => {
      // Apply status filter
      if (statusFilter === "all") return true
      return campaign.status === statusFilter
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "ending-soon":
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        case "most-participants":
          return b.participants - a.participants
        default:
          return 0
      }
    })

  // Campaign stats
  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === "active").length,
    upcoming: campaigns.filter((c) => c.status === "upcoming").length,
    completed: campaigns.filter((c) => c.status === "completed").length,
    totalParticipants: campaigns.reduce((sum, campaign) => sum + campaign.participants, 0),
  }

  // Handle campaign deletion
  const handleDeleteClick = (campaignId: string) => {
    setCampaignToDelete(campaignId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (campaignToDelete) {
      // Filter out the campaign to delete
      setCampaigns(campaigns.filter((campaign) => campaign.id !== campaignToDelete))

      toast({
        title: "Campaign deleted",
        description: "The campaign has been successfully deleted",
      })

      setDeleteDialogOpen(false)
      setCampaignToDelete(null)
    }
  }

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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">My Campaigns</h1>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <SlidersHorizontal className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-3xl font-bold">{stats.active}</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Campaigns</p>
                <p className="text-3xl font-bold">{stats.upcoming}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-3xl font-bold">{stats.totalParticipants}</p>
              </div>
              <div className="h-12 w-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="ending-soon">Ending Soon</SelectItem>
              <SelectItem value="most-participants">Most Participants</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button asChild>
          <Link href="/campaigns/create">
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Link>
        </Button>
      </div>

      {/* Campaign List */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} onDeleteClick={() => handleDeleteClick(campaign.id)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No campaigns found</p>
          {searchQuery || statusFilter !== "all" ? (
            <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
          ) : (
            <p className="text-sm text-muted-foreground mb-4">You haven't created any campaigns yet</p>
          )}
          <Button asChild>
            <Link href="/campaigns/create">
              <Plus className="mr-2 h-4 w-4" /> Create Your First Campaign
            </Link>
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CampaignCardProps {
  campaign: Campaign
  onDeleteClick: () => void
}

function CampaignCard({ campaign, onDeleteClick }: CampaignCardProps) {
  const progress = Math.round((campaign.participants / campaign.maxParticipants) * 100)

  // Calculate days remaining or days since end
  const today = new Date()
  const endDate = new Date(campaign.endDate)
  const diffTime = Math.abs(endDate.getTime() - today.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const isEnded = today > endDate
  const timeText = isEnded
    ? `Ended ${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
    : `${diffDays} ${diffDays === 1 ? "day" : "days"} remaining`

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        <img src={campaign.image || "/placeholder.svg"} alt={campaign.name} className="h-full w-full object-cover" />
        <Badge
          variant={campaign.status === "active" ? "default" : campaign.status === "upcoming" ? "secondary" : "outline"}
          className="absolute top-3 right-3"
        >
          {campaign.status}
        </Badge>
        <div className="absolute top-3 left-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/campaigns/${campaign.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Campaign
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDeleteClick} className="text-destructive focus:text-destructive">
                <Trash className="mr-2 h-4 w-4" /> Delete Campaign
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{campaign.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(campaign.endDate)}
          <span className="text-xs ml-1">({timeText})</span>
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
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button asChild variant="outline">
          <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
        </Button>
        <Button asChild>
          <Link href={`/campaigns/${campaign.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

