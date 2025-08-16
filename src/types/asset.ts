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

// asset type definitions

export interface AssetDetails {
  id: string;
  title: string;
  author: string;
  description: string;
  type: string;
  mediaUrl: string;
  externalUrl: string;
  licenseType: string;
  licenseDetails: string;
  licenseDuration: string;
  licenseTerritory: string;
  version: string;
  commercialUse: boolean;
  modifications: boolean;
  attribution: boolean;
  registrationDate: string;
  collection: string;
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


export interface assetIP  {
  title: string;
  author: string;
  description: string;
  type: string;
  template: string;
  collection: string;
  tags: string;
  mediaUrl: string;
  externalUrl: string;
  licenseType: string;
  licenseDetails: string;
  version: string;
  commercialUse: boolean;
  modifications: boolean;
  attribution: boolean;
  registrationDate: string;
  protectionStatus: string;
  protectionScope: string;
  protectionDuration: string;
}


export interface artworkIP  {
  title: string;
  author: string;
  description: string;
  type: string;
  template: string;
  format: string;
  dimensions: string;
  created: string;
  language: string;
  collection: string;
  tags: string;
  mediaUrl: string;
  externalUrl: string;
  licenseType: string;
  licenseDetails: string;
  version: string;
  commercialUse: boolean;
  modifications: boolean;
  attribution: boolean;
  registrationDate: string;
  protectionStatus: string;
  protectionScope: string;
  protectionDuration: string;
}


export interface audioIP  {
  title: string;
  author: string;
  description: string;
  type: string;
  template: string;
  artist: string;
  album: string;
  genre: string;
  composer: string;
  band: string; 
  publisher: string;
  collection: string;
  tags: string;
  mediaUrl: string;
  externalUrl: string;
  licenseType: string;
  licenseDetails: string;
  version: string;
  commercialUse: boolean;
  modifications: boolean;
  attribution: boolean;
  registrationDate: string;
  protectionStatus: string;
  protectionScope: string;
  protectionDuration: string;
}

export interface documentIP  {
  title: string;
  description: string;
  type: string;
  template: string;
  author: string;
  format: string;
  categories: string;
  publisher: string;
  date: string;
  expiration: string;
  language: string;
  collection: string;
  tags: string;
  mediaUrl: string;
  externalUrl: string;
  licenseType: string;
  licenseDetails: string;
  version: string;
  commercialUse: boolean;
  modifications: boolean;
  attribution: boolean;
  filesCount: string;
  transaction: string;
  registrationDate: string;
  protectionStatus: string;
  protectionScope: string;
  protectionDuration: string;
}

export interface patentIP  {
      title: string;
      description: string;
      type: string;
      template: string;
      author: string;
      inventor: string;
      patentType: string;
      filingDate: string;
      patentNumber: string;
      status: string;
      collection: string;
      tags: string;
      mediaUrl: string;
      externalUrl: string;
      licenseType: string;
      licenseDetails: string;
      version: string;
      commercialUse: boolean;
      modifications: boolean;
      attribution: boolean;
      filesCount: string;
      transaction: string;
      registrationDate: string;
      protectionStatus: string;
      protectionScope: string;
      protectionDuration: string;
}

export interface publicationIP  {
      title: string;
      description: string;
      type: string;
      template: string;
      author: string;
      format: string;
      categories: string;
      isbn: string;
      publisher: string;
      date: string;
      collection: string;
      tags: string;
      mediaUrl: string;
      externalUrl: string;
      licenseType: string;
      licenseDetails: string;
      version: string;
      commercialUse: boolean;
      modifications: boolean;
      attribution: boolean;
      filesCount: string;
      transaction: string;
      registrationDate: string;
      protectionStatus: string;
      protectionScope: string;
      protectionDuration: string;
}

export interface rwaIP  {
  title: string;
  description: string;
  type: string;
  template: string;
      rwa: string;
      location: string;
      valuation: string;
      insurance: string;
      structure: string;
      documentation: string;
      collection: string;
      tags: string;
      mediaUrl: string;
      externalUrl: string;
      licenseType: string;
      licenseDetails: string;
      version: string;
      commercialUse: boolean;
      modifications: boolean;
      attribution: boolean;
      filesCount: string;
      transaction: string;
      registrationDate: string;
      protectionStatus: string;
      protectionScope: string;
      protectionDuration: string;
}


export interface softwareIP  {
      title: string;
      description: string;
      type: string;
      template: string;
      developer: string;
      versionCode: string;
      releaseDate: string;
      progammingLanguage: string;
      sourceCode: string;
      documentation: string;
      repository: string;
      collection: string;
      tags: string;
      mediaUrl: string;
      externalUrl: string;
      licenseType: string;
      licenseDetails: string;
      version: string;
      commercialUse: boolean;
      modifications: boolean;
      attribution: boolean;
      filesCount: string;
      transaction: string;
      registrationDate: string;
      protectionStatus: string;
      protectionScope: string;
      protectionDuration: string;
}

export interface trademarkIP  {
      title: string;
      description: string;
      type: string;
      template: string;
      movieType: string;
      director: string;
      duration: string;
      studio: string;
      genre: string;
      collection: string;
      tags: string;
      mediaUrl: string;
      externalUrl: string;
      licenseType: string;
      licenseDetails: string;
      version: string;
      commercialUse: boolean;
      modifications: boolean;
      attribution: boolean;
      filesCount: string;
      transaction: string;
      registrationDate: string;
      protectionStatus: string;
      protectionScope: string;
      protectionDuration: string;
}



export type IPType = "Art" | "Audio" | "Video" | "Document" | "Patent" | "RWA" | "Software" | "NFT" | "Custom"

export type LicenseType = "Creative Commons" | "Commercial Use" | "Personal Use" | "Exclusive Rights" | "Open Source"



export interface Creator {
  id: string
  username: string
  name: string
  avatar: string
  banner?: string
  verified: boolean
  wallet: string
  bio: string
  location?: string
  website?: string
  twitter?: string
  instagram?: string
  followers: number
  following: number
  assets: number
  collections?: number
  joined: string
  specialties?: string[]
  achievements?: string[]
}


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
  slug: string
  name: string
  type: string
  description: string
  coverImage: string
  bannerImage?: string
  creator: {
    id: string
    username: string
    name: string
    avatar: string
    verified: boolean
    wallet: string
  }
  assets: number
  floorPrice?: string
  totalVolume?: string
  createdAt: string
  updatedAt: string
  category: string
  tags: string
  isPublic: boolean
  isFeatured: boolean
  blockchain: string
  contractAddress?: string
}





export interface Activity {
  id: string
  type: "mint" | "transfer_in" | "transfer_out" | "sale" | "license" | "update" | "collection_create" | "collection_add"
  title: string
  description: string
  timestamp: string
  network: string
  status: "completed" | "pending" | "failed"
  value?: string
  txHash?: string
  assetId?: string
  collectionId?: string
  fromAddress?: string
  toAddress?: string
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
