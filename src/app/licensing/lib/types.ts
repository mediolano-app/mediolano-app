import type React from "react"
export interface IPAsset {
  id: string
  name: string
  description: string
  type: "original" | "license"
  status: "active" | "inactive"
  createdAt: string
  creator: string
  contractAddress: string
  tokenId: string
  image?: string
  licenseCount: number
  revenueGenerated?: string
  lastLicenseDate?: string
  assetType?:
    | "Audio"
    | "Art"
    | "Documents"
    | "NFT"
    | "Video"
    | "Patents"
    | "Posts"
    | "Publications"
    | "RWA"
    | "Software"
    | "Custom"
  licenseInfo?: {
    type: string
    title?: string
    version?: string
  }
  terms?: {
    commercialUse?: string
    derivativeWorks?: string
    attribution?: string
    territory?: string
    royaltyPercentage?: string
    duration?: string
  }
}

export interface License {
  id: string
  name: string
  description: string
  status: "active" | "expired" | "revoked"
  originalAssetId: string
  createdAt: string
  expiryDate?: string
  licensee: string
  licenseeAvatar?: string
  licenseTerms: {
    commercialUse: boolean
    derivativeWorks: boolean
    attribution: boolean
    territory: string
    royaltyPercentage: number
    duration: string
  }
}

export interface Transaction {
  id: string
  type: "creation" | "transfer" | "license" | "royalty"
  status: "confirmed" | "pending" | "failed"
  timestamp: string
  from: string
  to?: string
  assetId: string
  value?: string
  transactionHash?: string
  blockNumber?: number
}

export interface ActivityEvent {
  user: string
  userAvatar?: string
  action: string
  assetName: string
  time: string
}

export interface HistoryEvent {
  event: string
  details: string
  user: string
  date: string
  transactionHash?: string
}

export interface WalletProvider {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
}
