export interface Asset {
  id: string
  title: string
  description: string
  imageUrl: string
  categories: string[]
  revenueShare: number
  ownerCount: number
  status: "Active" | "Pending" | "Inactive"
}

export interface MarketplaceListing {
  id: string
  title: string
  description: string
  imageUrl: string
  categories: string[]
  price: number
  revenueShare: number
  totalShares: number
  availableShares: number
  featured: boolean
}

export interface MonthlyRevenue {
  month: string
  amount: number
  revenue?: number
  claimed?: number
  marketplace?: number
  licensing?: number
  streaming?: number
  api?: number
}

export interface ClaimableRevenueItem {
  id: string
  nftContract: string
  assetName: string
  description: string
  amount: number
  source: string
  generatedAt?: string
  expiresAt?: string
}

export interface RevenueData {
  totalRevenue: number
  totalClaimed: number
  pendingRevenue: number
  claimableAmount: number
  monthlyData: MonthlyRevenue[]
  claimableBreakdown: ClaimableRevenueItem[]
}

export interface ClaimHistoryItem {
  id: string
  assetName: string
  amount: number
  date: string
  source: string
  status: "Completed" | "Processing" | "Failed"
  transactionHash: string
}

export interface DistributionHistoryItem {
  id: string
  assetName: string
  totalAmount: number
  date: string
  recipientCount: number
  status: "Completed" | "Processing" | "Failed"
  transactionHash: string
  recipients: {
    wallet: string
    amount: number
    claimed: boolean
  }[]
}

export interface ScheduledDistribution {
  id: string
  assetName: string
  scheduledDate: string
  estimatedAmount: number
  type: string
  frequency: string
}

export interface AssetRevenueSetting {
  id: string
  title: string
  imageUrl: string
  totalShares: number
  creatorShare: number
  pendingRevenue: number
  status: "Active" | "Pending" | "Inactive"
}

export interface AssetRevenueData {
  totalRevenue: number
  pendingClaims: number
  pendingClaimsCount: number
  claimRate: number
  revenueGrowth: number
  monthlyData: {
    month: string
    generated: number
    claimed: number
  }[]
  recentDistributions: {
    id: string
    amount: number
    date: string
    status: "Completed" | "Processing" | "Failed"
  }[]
  revenueSources: {
    name: string
    amount: number
    percentage: number
    color: string
  }[]
}

export interface AssetDistributionData {
  creatorShare: number
  totalShares: number
  owners: {
    wallet: string
    name?: string
    percentage: number
    shares: number
    totalReceived: number
    isCreator: boolean
  }[]
}
