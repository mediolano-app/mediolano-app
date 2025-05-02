export interface Asset {
  id: string
  name: string
  creator: string
  verified?: boolean
  image: string
  collection?: string
  licenseType: LicenseType
  description: string
  registrationDate: string
  value: string
  views: number
  type: IPType
  templateType?: string
  templateId?: string
  metadata?: Record<string, any>
  protectionLevel?: number
  ownershipHistory?: OwnershipRecord[]
  licensingTerms?: LicensingTerms
}

export interface IP {
  id: string;
  name: string;
  image: string;
  isVisible: boolean;
  category?: string;
  collection?: string;
  tokenId?: string;
  type?: string;
}

export interface NFT {
  id: string;
  name: string;
  imageUrl: string;
  isVisible: boolean;
  category?: string;
  collection?: string;
  tokenId?: string;
  openseaUrl?: string;
}



export type IPType = "Basic" | "Art" | "Audio" | "Video" | "Document" | "Patent" | "RWA" | "Trademark" | "Software" | "NFT" | "Custom"

export type LicenseType = "Creative Commons" | "Commercial Use" | "Personal Use" | "Exclusive Rights" | "Open Source"



export interface OwnershipRecord {
  owner: string
  acquiredDate: string
  transferType: "Creation" | "Purchase" | "License" | "Gift"
}

export interface LicensingTerms {
  commercialUse: boolean
  modifications: boolean
  attribution: boolean
  territoriesExcluded?: string[]
  duration?: string
  revenueSplit?: number
}

export interface Collection {
  id: string
  name: string
  description: string
  assetCount: number
  totalValue: string
  creator: string
  creationDate: string
  coverImage: string
  type: IPType
}

export interface ActivityRecord {
  id: string
  type: "view" | "license" | "transfer" | "creation" | "update"
  assetId: string
  assetName: string
  user: string
  timestamp: string
  details?: string
}

export interface PortfolioStats {
  totalAssets: number
  totalValue: string
  createdAssets: number
  licensedAssets: number
  recentViews: number
  protectionLevel: number
}

export interface Template {
  id: string
  name: string
  description: string
  type: IPType
  icon: string
  popularity: number
  features: string[]
  suitableFor: string[]
  metadataFields: string[]
}
