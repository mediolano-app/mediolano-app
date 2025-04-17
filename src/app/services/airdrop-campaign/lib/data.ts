import type { Campaign } from "./types"

// Mock data for campaigns
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Genesis NFT Collection Launch",
    description:
      "Join our Genesis NFT collection launch and be among the first to receive our exclusive NFTs. Complete social tasks to qualify.",
    image: "/background.jpg",
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
      {
        id: "task-1-3",
        title: "Share Announcement",
        description: "Share our announcement post on Twitter",
        type: "social",
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    name: "Artistic Pioneers Program",
    description:
      "Exclusive NFTs for early supporters of our artistic platform. Complete tasks to join our pioneers program.",
    image: "/background.jpg",
    creator: "0x2345678901234567890123456789012345678901",
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
    id: "3",
    name: "DeFi Integration Celebration",
    description: "Celebrating our DeFi integration with an exclusive NFT drop. Complete tasks to qualify.",
    image: "/background.jpg",
    creator: "0x3456789012345678901234567890123456789012",
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
      {
        id: "task-3-3",
        title: "Join Telegram",
        description: "Join our Telegram group",
        type: "community",
        verificationUrl: "https://t.me/example",
      },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    name: "Community Champions",
    description: "Rewarding our most active community members with exclusive NFTs. Show your support to qualify.",
    image: "/background.jpg",
    creator: "0x4567890123456789012345678901234567890123",
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
    id: "5",
    name: "Early Adopter Rewards",
    description: "Special NFT rewards for early adopters of our platform. Complete tasks to claim your reward.",
    image: "/background.jpg",
    creator: "0x5678901234567890123456789012345678901234",
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
      {
        id: "task-5-3",
        title: "Make First Transaction",
        description: "Make your first transaction on our platform",
        type: "transaction",
      },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    name: "Metaverse Launch Party",
    description:
      "Join our metaverse launch party and receive commemorative NFTs. Complete tasks to get your invitation.",
    image: "/background.jpg",
    creator: "0x6789012345678901234567890123456789012345",
    contractAddress: "0xf1234567890abcdef1234567890abcdef1234567",
    status: "upcoming",
    participants: 0,
    maxParticipants: 500,
    reward: 1,
    tasks: [
      {
        id: "task-6-1",
        title: "RSVP to Event",
        description: "RSVP to our metaverse launch party",
        type: "community",
      },
      {
        id: "task-6-2",
        title: "Share Event",
        description: "Share our event on social media",
        type: "social",
      },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  },
]

// Mock user campaigns
const mockUserCampaigns = {
  created: [mockCampaigns[2], mockCampaigns[5]],
  participating: [mockCampaigns[0], mockCampaigns[1]],
  completed: [mockCampaigns[3]],
}

// Get all campaigns
export function getCampaigns() {
  try {
    const activeCampaigns = mockCampaigns.filter((campaign) => campaign.status === "active")
    const popularCampaigns = [...mockCampaigns].sort((a, b) => b.participants - a.participants)
    const myCampaigns = [...mockUserCampaigns.created, ...mockUserCampaigns.participating]

    return {
      activeCampaigns,
      popularCampaigns,
      myCampaigns,
    }
  } catch (error) {
    console.error("Error getting campaigns:", error)
    // Return empty arrays as fallback
    return {
      activeCampaigns: [],
      popularCampaigns: [],
      myCampaigns: [],
    }
  }
}

// Get campaign by ID
export function getCampaignById(id: string): Promise<Campaign> {
  return new Promise((resolve, reject) => {
    try {
      if (!id) {
        reject(new Error("Invalid campaign ID"))
        return
      }

      setTimeout(() => {
        // Try to find the campaign by exact ID match
        let campaign = mockCampaigns.find((c) => c.id === id)

        // If not found, try to match by string conversion (in case of numeric IDs)
        if (!campaign) {
          campaign = mockCampaigns.find((c) => c.id === String(id))
        }

        if (campaign) {
          resolve(campaign)
        } else {
          // For demo purposes, return the first campaign if ID not found
          // This prevents the "Campaign not found" error in the demo
          resolve(mockCampaigns[0])

          // In a real app, you might want to reject instead:
          // reject(new Error("Campaign not found"))
        }
      }, 500)
    } catch (error) {
      reject(new Error(`Error fetching campaign: ${error}`))
    }
  })
}

// Get user campaigns
export function getUserCampaigns() {
  return new Promise<typeof mockUserCampaigns>((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(mockUserCampaigns)
      }, 1000)
    } catch (error) {
      reject(new Error(`Error fetching user campaigns: ${error}`))
    }
  })
}

// Mock function to participate in a campaign
export function mockParticipateInCampaign(campaignId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (!campaignId) {
        reject(new Error("Invalid campaign ID"))
        return
      }

      setTimeout(() => {
        const campaign = mockCampaigns.find((c) => c.id === campaignId)
        if (campaign) {
          campaign.participants += 1
          resolve()
        } else {
          reject(new Error("Campaign not found"))
        }
      }, 1000)
    } catch (error) {
      reject(new Error(`Error participating in campaign: ${error}`))
    }
  })
}

