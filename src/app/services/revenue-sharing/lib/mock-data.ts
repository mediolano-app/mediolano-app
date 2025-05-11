import type {
  Asset,
  MarketplaceListing,
  RevenueData,
  ClaimHistoryItem,
  DistributionHistoryItem,
  ScheduledDistribution,
  AssetRevenueSetting,
  AssetRevenueData,
  AssetDistributionData,
} from "./types"

// Get asset by ID
export function getAssetById(id: string): Asset | undefined {
  return getUserAssets().find((asset) => asset.id === id)
}

// Mock data for recent assets
export function getRecentAssets() {
  return [
    {
      id: "asset-001",
      title: "Digital Artwork Collection",
      description: "A collection of digital artwork pieces with revenue sharing enabled.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      category: "Artwork",
      ownerCount: 12,
      totalRevenue: 2.5,
    },
    {
      id: "asset-002",
      title: "Music Album Rights",
      description: "Revenue sharing for a newly released music album.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      category: "Music",
      ownerCount: 24,
      totalRevenue: 4.2,
    },
    {
      id: "asset-003",
      title: "E-Book Publication",
      description: "Rights for a bestselling e-book with ongoing royalties.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      category: "Literature",
      ownerCount: 8,
      totalRevenue: 1.8,
    },
  ]
}

// Mock data for user revenue
export function getUserRevenue(): RevenueData {
  return {
    totalRevenue: 12.45,
    totalClaimed: 9.25,
    pendingRevenue: 1.8,
    claimableAmount: 3.2,
    monthlyData: [
      { month: "Jan", amount: 0.8, revenue: 0.8, claimed: 0.7 },
      { month: "Feb", amount: 1.2, revenue: 1.2, claimed: 1.0 },
      { month: "Mar", amount: 0.9, revenue: 0.9, claimed: 0.8 },
      { month: "Apr", amount: 1.5, revenue: 1.5, claimed: 1.3 },
      { month: "May", amount: 2.1, revenue: 2.1, claimed: 1.8 },
      { month: "Jun", amount: 1.8, revenue: 1.8, claimed: 1.5 },
      { month: "Jul", amount: 2.4, revenue: 2.4, claimed: 1.9 },
      { month: "Aug", amount: 1.7, revenue: 1.7, claimed: 0.2 },
    ],
    claimableBreakdown: [
      {
        id: "001",
        assetName: "Digital Art Series: Future Cities",
        description: "Revenue from NFT marketplace sales",
        amount: 1.2,
        source: "OpenSea",
        generatedAt: "2023-08-15T10:30:00Z",
        expiresAt: "2023-09-15T10:30:00Z",
        nftContract: "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0",
      },
      {
        id: "002",
        assetName: "Electronic Music Album",
        description: "Streaming royalties",
        amount: 0.8,
        source: "Spotify",
        generatedAt: "2023-08-10T14:45:00Z",
        expiresAt: "2023-09-10T14:45:00Z",
        nftContract: "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0",
      },
      {
        id: "003",
        assetName: "AI Model: Text Generator",
        description: "Usage fees",
        amount: 1.2,
        source: "API Access",
        generatedAt: "2023-08-05T09:15:00Z",
        expiresAt: "2023-09-05T09:15:00Z",
        nftContract: "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0",
      },
    ],
  }
}

// Mock data for user assets
export function getUserAssets(): Array<Asset & { metadataHash: string; licenseHash: string; nftContract: string }> {
  return [
      {
        id: "65",
        title: "Digital Art Series: Future Cities",
        description: "A collection of digital artwork depicting futuristic cityscapes.",
        imageUrl: "/placeholder.svg?height=100&width=100",
        categories: ["artwork", "digital"],
        revenueShare: 70,
        ownerCount: 5,
        status: "Active",
        metadataHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
        licenseHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
        nftContract: "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0", 
      },
      {
        id: "102",
        title: "Electronic Music Album",
        description: "A full-length electronic music album with 12 tracks.",
        imageUrl: "/placeholder.svg?height=100&width=100",
        categories: ["music", "electronic"],
        revenueShare: 85,
        ownerCount: 3,
        status: "Active",
        metadataHash: "0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
        licenseHash: "0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789",
        nftContract: "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0", 
      },
      {
        id: "103",
        title: "AI Model: Text Generator",
        description: "An AI model trained for creative text generation.",
        imageUrl: "/placeholder.svg?height=100&width=100",
        categories: ["ai-model", "software"],
        revenueShare: 60,
        ownerCount: 8,
        status: "Active",
        metadataHash: "0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcde",
        licenseHash: "0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        nftContract: "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0", 
      },
      {
        id: "104",
        title: "Short Story Collection",
        description: "A collection of science fiction short stories.",
        imageUrl: "/placeholder.svg?height=100&width=100",
        categories: ["literature", "fiction"],
        revenueShare: 75,
        ownerCount: 2,
        status: "Pending",
        metadataHash: "0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        licenseHash: "0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890a",
        nftContract: "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0", 
      },
    ];
}

// Mock data for claim history
export function getClaimHistory(): ClaimHistoryItem[] {
  return [
    {
      id: "claim-history-001",
      assetName: "Digital Art Series: Future Cities",
      amount: 0.75,
      date: "2023-08-01T14:30:00Z",
      source: "OpenSea",
      status: "Completed",
      transactionHash: "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0",
    },
    {
      id: "claim-history-002",
      assetName: "Electronic Music Album",
      amount: 0.45,
      date: "2023-07-25T10:15:00Z",
      source: "Spotify",
      status: "Completed",
      transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
    {
      id: "claim-history-003",
      assetName: "AI Model: Text Generator",
      amount: 0.9,
      date: "2023-07-20T16:45:00Z",
      source: "API Access",
      status: "Completed",
      transactionHash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    },
    {
      id: "claim-history-004",
      assetName: "Digital Art Series: Future Cities",
      amount: 0.6,
      date: "2023-07-15T09:30:00Z",
      source: "Foundation",
      status: "Completed",
      transactionHash: "0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
    },
    {
      id: "claim-history-005",
      assetName: "Short Story Collection",
      amount: 0.3,
      date: "2023-07-10T11:20:00Z",
      source: "Amazon",
      status: "Completed",
      transactionHash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
    },
    {
      id: "claim-history-006",
      assetName: "Electronic Music Album",
      amount: 0.55,
      date: "2023-07-05T13:10:00Z",
      source: "Apple Music",
      status: "Completed",
      transactionHash: "0x90abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
    },
  ]
}

// Mock data for distribution history
export function getDistributionHistory(): DistributionHistoryItem[] {
  return [
    {
      id: "dist-001",
      assetName: "Digital Art Series: Future Cities",
      totalAmount: 2.5,
      date: "2023-08-01T12:00:00Z",
      recipientCount: 5,
      status: "Completed",
      transactionHash: "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0",
      recipients: [
        {
          wallet: "0x1234567890abcdef1234567890abcdef12345678",
          amount: 1.75,
          claimed: true,
        },
        {
          wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
          amount: 0.25,
          claimed: true,
        },
        {
          wallet: "0x7890abcdef1234567890abcdef1234567890abcd",
          amount: 0.15,
          claimed: true,
        },
        {
          wallet: "0xdef1234567890abcdef1234567890abcdef123456",
          amount: 0.2,
          claimed: false,
        },
        {
          wallet: "0x567890abcdef1234567890abcdef1234567890ab",
          amount: 0.15,
          claimed: false,
        },
      ],
    },
    {
      id: "dist-002",
      assetName: "Electronic Music Album",
      totalAmount: 1.8,
      date: "2023-07-15T12:00:00Z",
      recipientCount: 3,
      status: "Completed",
      transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      recipients: [
        {
          wallet: "0x1234567890abcdef1234567890abcdef12345678",
          amount: 1.53,
          claimed: true,
        },
        {
          wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
          amount: 0.15,
          claimed: true,
        },
        {
          wallet: "0x7890abcdef1234567890abcdef1234567890abcd",
          amount: 0.12,
          claimed: false,
        },
      ],
    },
    {
      id: "dist-003",
      assetName: "AI Model: Text Generator",
      totalAmount: 3.2,
      date: "2023-07-01T12:00:00Z",
      recipientCount: 8,
      status: "Completed",
      transactionHash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
      recipients: [
        {
          wallet: "0x1234567890abcdef1234567890abcdef12345678",
          amount: 1.92,
          claimed: true,
        },
        {
          wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
          amount: 0.32,
          claimed: true,
        },
        {
          wallet: "0x7890abcdef1234567890abcdef1234567890abcd",
          amount: 0.16,
          claimed: true,
        },
        {
          wallet: "0xdef1234567890abcdef1234567890abcdef123456",
          amount: 0.16,
          claimed: true,
        },
        {
          wallet: "0x567890abcdef1234567890abcdef1234567890ab",
          amount: 0.16,
          claimed: false,
        },
        {
          wallet: "0x90abcdef1234567890abcdef1234567890abcdef",
          amount: 0.16,
          claimed: false,
        },
        {
          wallet: "0x34567890abcdef1234567890abcdef1234567890",
          amount: 0.16,
          claimed: false,
        },
        {
          wallet: "0xcdef1234567890abcdef1234567890abcdef12345",
          amount: 0.16,
          claimed: false,
        },
      ],
    },
    {
      id: "dist-004",
      assetName: "Digital Art Series: Future Cities",
      totalAmount: 1.5,
      date: "2023-06-15T12:00:00Z",
      recipientCount: 5,
      status: "Completed",
      transactionHash: "0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
      recipients: [
        {
          wallet: "0x1234567890abcdef1234567890abcdef12345678",
          amount: 1.05,
          claimed: true,
        },
        {
          wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
          amount: 0.15,
          claimed: true,
        },
        {
          wallet: "0x7890abcdef1234567890abcdef1234567890abcd",
          amount: 0.1,
          claimed: true,
        },
        {
          wallet: "0xdef1234567890abcdef1234567890abcdef123456",
          amount: 0.1,
          claimed: true,
        },
        {
          wallet: "0x567890abcdef1234567890abcdef1234567890ab",
          amount: 0.1,
          claimed: true,
        },
      ],
    },
    {
      id: "dist-005",
      assetName: "Short Story Collection",
      totalAmount: 0.9,
      date: "2023-08-05T12:00:00Z",
      recipientCount: 2,
      status: "Processing",
      transactionHash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
      recipients: [
        {
          wallet: "0x1234567890abcdef1234567890abcdef12345678",
          amount: 0.675,
          claimed: false,
        },
        {
          wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
          amount: 0.225,
          claimed: false,
        },
      ],
    },
  ]
}

// Mock data for scheduled distributions
export function getScheduledDistributions(): ScheduledDistribution[] {
  return [
    {
      id: "sched-001",
      assetName: "Digital Art Series: Future Cities",
      scheduledDate: "2023-09-01T12:00:00Z",
      estimatedAmount: 2.0,
      type: "Marketplace",
      frequency: "Monthly",
    },
    {
      id: "sched-002",
      assetName: "Electronic Music Album",
      scheduledDate: "2023-09-15T12:00:00Z",
      estimatedAmount: 1.5,
      type: "Streaming",
      frequency: "Monthly",
    },
    {
      id: "sched-003",
      assetName: "AI Model: Text Generator",
      scheduledDate: "2023-09-01T12:00:00Z",
      estimatedAmount: 2.8,
      type: "API",
      frequency: "Monthly",
    },
    {
      id: "sched-004",
      assetName: "Short Story Collection",
      scheduledDate: "2023-09-10T12:00:00Z",
      estimatedAmount: 0.7,
      type: "Licensing",
      frequency: "Monthly",
    },
    {
      id: "sched-005",
      assetName: "Digital Art Series: Future Cities",
      scheduledDate: "2023-10-01T12:00:00Z",
      estimatedAmount: 2.2,
      type: "Marketplace",
      frequency: "Monthly",
    },
  ]
}

// Mock data for asset revenue settings
export function getAssetRevenueSettings(): AssetRevenueSetting[] {
  return [
    {
      id: "asset-101",
      title: "Digital Art Series: Future Cities",
      imageUrl: "/placeholder.svg?height=100&width=100",
      totalShares: 100,
      creatorShare: 70,
      pendingRevenue: 1.2,
      status: "Active",
    },
    {
      id: "asset-102",
      title: "Electronic Music Album",
      imageUrl: "/placeholder.svg?height=100&width=100",
      totalShares: 200,
      creatorShare: 85,
      pendingRevenue: 0.8,
      status: "Active",
    },
    {
      id: "asset-103",
      title: "AI Model: Text Generator",
      imageUrl: "/placeholder.svg?height=100&width=100",
      totalShares: 150,
      creatorShare: 60,
      pendingRevenue: 1.5,
      status: "Active",
    },
    {
      id: "asset-104",
      title: "Short Story Collection",
      imageUrl: "/placeholder.svg?height=100&width=100",
      totalShares: 80,
      creatorShare: 75,
      pendingRevenue: 0.4,
      status: "Pending",
    },
  ]
}

// Mock data for revenue analytics
export function getRevenueAnalytics() {
  return {
    totalRevenue: 12.45,
    pendingClaims: 3.2,
    pendingClaimsCount: 8,
    activeAssets: 4,
    revenueGrowth: 15,
    monthly: [
      { month: "Jan", revenue: 0.8, claimed: 0.7, marketplace: 0.5, licensing: 0.2, streaming: 0.1, api: 0.0 },
      { month: "Feb", revenue: 1.2, claimed: 1.0, marketplace: 0.6, licensing: 0.3, streaming: 0.2, api: 0.1 },
      { month: "Mar", revenue: 0.9, claimed: 0.8, marketplace: 0.4, licensing: 0.2, streaming: 0.2, api: 0.1 },
      { month: "Apr", revenue: 1.5, claimed: 1.3, marketplace: 0.7, licensing: 0.4, streaming: 0.3, api: 0.1 },
      { month: "May", revenue: 2.1, claimed: 1.8, marketplace: 1.0, licensing: 0.5, streaming: 0.4, api: 0.2 },
      { month: "Jun", revenue: 1.8, claimed: 1.5, marketplace: 0.8, licensing: 0.4, streaming: 0.4, api: 0.2 },
      { month: "Jul", revenue: 2.4, claimed: 1.9, marketplace: 1.1, licensing: 0.6, streaming: 0.5, api: 0.2 },
      { month: "Aug", revenue: 1.7, claimed: 0.2, marketplace: 0.8, licensing: 0.4, streaming: 0.3, api: 0.2 },
    ],
    bySource: [
      { name: "Marketplace", value: 5.9 },
      { name: "Licensing", value: 3.0 },
      { name: "Streaming", value: 2.4 },
      { name: "API", value: 1.1 },
    ],
    byAsset: [
      { name: "Digital Art Series", value: 4.5 },
      { name: "Music Album", value: 3.2 },
      { name: "AI Model", value: 3.8 },
      { name: "Short Story Collection", value: 0.9 },
    ],
    assetComparison: [
      { month: "Jan", asset1: 0.4, asset2: 0.3, asset3: 0.1 },
      { month: "Feb", asset1: 0.5, asset2: 0.4, asset3: 0.3 },
      { month: "Mar", asset1: 0.3, asset2: 0.3, asset3: 0.3 },
      { month: "Apr", asset1: 0.6, asset2: 0.5, asset3: 0.4 },
      { month: "May", asset1: 0.8, asset2: 0.7, asset3: 0.6 },
      { month: "Jun", asset1: 0.7, asset2: 0.6, asset3: 0.5 },
      { month: "Jul", asset1: 0.9, asset2: 0.8, asset3: 0.7 },
      { month: "Aug", asset1: 0.6, asset2: 0.5, asset3: 0.6 },
    ],
  }
}

// Mock data for asset revenue data
export function getAssetRevenueData(assetId: string): AssetRevenueData | null {
  const assets: Record<string, AssetRevenueData> = {
    "asset-101": {
      totalRevenue: 4.5,
      pendingClaims: 1.2,
      pendingClaimsCount: 3,
      claimRate: 85,
      revenueGrowth: 12,
      monthlyData: [
        { month: "Jan", generated: 0.4, claimed: 0.35 },
        { month: "Feb", generated: 0.5, claimed: 0.45 },
        { month: "Mar", generated: 0.3, claimed: 0.25 },
        { month: "Apr", generated: 0.6, claimed: 0.5 },
        { month: "May", generated: 0.8, claimed: 0.7 },
        { month: "Jun", generated: 0.7, claimed: 0.6 },
        { month: "Jul", generated: 0.9, claimed: 0.7 },
        { month: "Aug", generated: 0.6, claimed: 0.1 },
      ],
      recentDistributions: [
        {
          id: "dist-001",
          amount: 2.5,
          date: "2023-08-01T12:00:00Z",
          status: "Completed",
        },
        {
          id: "dist-004",
          amount: 1.5,
          date: "2023-06-15T12:00:00Z",
          status: "Completed",
        },
      ],
      revenueSources: [
        { name: "OpenSea", amount: 2.8, percentage: 62, color: "#10b981" },
        { name: "Foundation", amount: 1.2, percentage: 27, color: "#3b82f6" },
        { name: "Rarible", amount: 0.5, percentage: 11, color: "#f59e0b" },
      ],
    },
    "asset-102": {
      totalRevenue: 3.2,
      pendingClaims: 0.8,
      pendingClaimsCount: 2,
      claimRate: 90,
      revenueGrowth: 8,
      monthlyData: [
        { month: "Jan", generated: 0.3, claimed: 0.28 },
        { month: "Feb", generated: 0.4, claimed: 0.38 },
        { month: "Mar", generated: 0.3, claimed: 0.28 },
        { month: "Apr", generated: 0.5, claimed: 0.45 },
        { month: "May", generated: 0.7, claimed: 0.65 },
        { month: "Jun", generated: 0.6, claimed: 0.55 },
        { month: "Jul", generated: 0.8, claimed: 0.7 },
        { month: "Aug", generated: 0.5, claimed: 0.1 },
      ],
      recentDistributions: [
        {
          id: "dist-002",
          amount: 1.8,
          date: "2023-07-15T12:00:00Z",
          status: "Completed",
        },
      ],
      revenueSources: [
        { name: "Spotify", amount: 1.5, percentage: 47, color: "#10b981" },
        { name: "Apple Music", amount: 1.0, percentage: 31, color: "#3b82f6" },
        { name: "YouTube", amount: 0.7, percentage: 22, color: "#f59e0b" },
      ],
    },
    "asset-103": {
      totalRevenue: 3.8,
      pendingClaims: 1.5,
      pendingClaimsCount: 4,
      claimRate: 75,
      revenueGrowth: 20,
      monthlyData: [
        { month: "Jan", generated: 0.1, claimed: 0.08 },
        { month: "Feb", generated: 0.3, claimed: 0.25 },
        { month: "Mar", generated: 0.3, claimed: 0.22 },
        { month: "Apr", generated: 0.4, claimed: 0.3 },
        { month: "May", generated: 0.6, claimed: 0.45 },
        { month: "Jun", generated: 0.5, claimed: 0.38 },
        { month: "Jul", generated: 0.7, claimed: 0.5 },
        { month: "Aug", generated: 0.6, claimed: 0.1 },
      ],
      recentDistributions: [
        {
          id: "dist-003",
          amount: 3.2,
          date: "2023-07-01T12:00:00Z",
          status: "Completed",
        },
      ],
      revenueSources: [
        { name: "API Usage", amount: 2.5, percentage: 66, color: "#10b981" },
        { name: "Licensing", amount: 1.0, percentage: 26, color: "#3b82f6" },
        { name: "Marketplace", amount: 0.3, percentage: 8, color: "#f59e0b" },
      ],
    },
    "asset-104": {
      totalRevenue: 0.9,
      pendingClaims: 0.4,
      pendingClaimsCount: 1,
      claimRate: 95,
      revenueGrowth: 5,
      monthlyData: [
        { month: "Jan", generated: 0.0, claimed: 0.0 },
        { month: "Feb", generated: 0.0, claimed: 0.0 },
        { month: "Mar", generated: 0.0, claimed: 0.0 },
        { month: "Apr", generated: 0.0, claimed: 0.0 },
        { month: "May", generated: 0.0, claimed: 0.0 },
        { month: "Jun", generated: 0.0, claimed: 0.0 },
        { month: "Jul", generated: 0.3, claimed: 0.28 },
        { month: "Aug", generated: 0.6, claimed: 0.1 },
      ],
      recentDistributions: [
        {
          id: "dist-005",
          amount: 0.9,
          date: "2023-08-05T12:00:00Z",
          status: "Processing",
        },
      ],
      revenueSources: [
        { name: "Amazon", amount: 0.5, percentage: 56, color: "#10b981" },
        { name: "Apple Books", amount: 0.3, percentage: 33, color: "#3b82f6" },
        { name: "Google Play", amount: 0.1, percentage: 11, color: "#f59e0b" },
      ],
    },
  }

  return assets[assetId] || null
}

// Mock data for asset distribution data
export function getAssetDistributionData(assetId: string): AssetDistributionData | null {
  const distributions: Record<string, AssetDistributionData> = {
    "asset-101": {
      creatorShare: 70,
      totalShares: 100,
      owners: [
        {
          wallet: "0x1234567890abcdef1234567890abcdef12345678",
          name: "Creator",
          percentage: 70,
          shares: 70,
          totalReceived: 3.15,
          isCreator: true,
        },
        {
          wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
          percentage: 10,
          shares: 10,
          totalReceived: 0.45,
          isCreator: false,
        },
        {
          wallet: "0x7890abcdef1234567890abcdef1234567890abcd",
          percentage: 8,
          shares: 8,
          totalReceived: 0.36,
          isCreator: false,
        },
        {
          wallet: "0xdef1234567890abcdef1234567890abcdef123456",
          percentage: 7,
          shares: 7,
          totalReceived: 0.32,
          isCreator: false,
        },
        {
          wallet: "0x567890abcdef1234567890abcdef1234567890ab",
          percentage: 5,
          shares: 5,
          totalReceived: 0.23,
          isCreator: false,
        },
      ],
    },
    "asset-102": {
      creatorShare: 85,
      totalShares: 200,
      owners: [
        {
          wallet: "0x1234567890abcdef1234567890abcdef12345678",
          name: "Creator",
          percentage: 85,
          shares: 170,
          totalReceived: 2.72,
          isCreator: true,
        },
        {
          wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
          percentage: 8,
          shares: 16,
          totalReceived: 0.26,
          isCreator: false,
        },
        {
          wallet: "0x7890abcdef1234567890abcdef1234567890abcd",
          percentage: 7,
          shares: 14,
          totalReceived: 0.22,
          isCreator: false,
        },
      ],
    },
    "asset-103": {
      creatorShare: 60,
      totalShares: 150,
      owners: [
        {
          wallet: "0x1234567890abcdef1234567890abcdef12345678",
          name: "Creator",
          percentage: 60,
          shares: 90,
          totalReceived: 2.28,
          isCreator: true,
        },
        {
          wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
          percentage: 10,
          shares: 15,
          totalReceived: 0.38,
          isCreator: false,
        },
        {
          wallet: "0x7890abcdef1234567890abcdef1234567890abcd",
          percentage: 5,
          shares: 7.5,
          totalReceived: 0.19,
          isCreator: false,
        },
        {
          wallet: "0xdef1234567890abcdef1234567890abcdef123456",
          percentage: 5,
          shares: 7.5,
          totalReceived: 0.19,
          isCreator: false,
        },
        {
          wallet: "0x567890abcdef1234567890abcdef1234567890ab",
          percentage: 5,
          shares: 7.5,
          totalReceived: 0.19,
          isCreator: false,
        },
        {
          wallet: "0x90abcdef1234567890abcdef1234567890abcdef",
          percentage: 5,
          shares: 7.5,
          totalReceived: 0.19,
          isCreator: false,
        },
        {
          wallet: "0x34567890abcdef1234567890abcdef1234567890",
          percentage: 5,
          shares: 7.5,
          totalReceived: 0.19,
          isCreator: false,
        },
        {
          wallet: "0xcdef1234567890abcdef1234567890abcdef12345",
          percentage: 5,
          shares: 7.5,
          totalReceived: 0.19,
          isCreator: false,
        },
      ],
    },
    "asset-104": {
      creatorShare: 75,
      totalShares: 80,
      owners: [
        {
          wallet: "0x1234567890abcdef1234567890abcdef12345678",
          name: "Creator",
          percentage: 75,
          shares: 60,
          totalReceived: 0.675,
          isCreator: true,
        },
        {
          wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
          percentage: 25,
          shares: 20,
          totalReceived: 0.225,
          isCreator: false,
        },
      ],
    },
  }

  return distributions[assetId] || null
}
