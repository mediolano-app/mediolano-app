import type { LucideIcon } from "lucide-react"

export interface User {
  id: string
  username: string
  avatar: string
  banner: string
  bio: string
  registrationDate: string
  followers: number
  following: number
  socialLinks: SocialLink[]
}

export interface Item {
  id: string
  name: string
  image: string
  price: number
}

export interface Collection {
  id: string
  name: string
  description?: string
  image: string
  itemCount: number
  floorPrice?: number
  owner?: string
  assets?: string[]
}

export interface Offer {
  id: string
  item: string
  price: number
  from: string
  expires: string
}

export interface Deal {
  id: string
  item: string
  price: number
  buyer: string
  date: string
}

export interface Activity {
  id: string
  type: string
  item: string
  price: number
  from: string
  to: string
  date: string
}

export interface SocialLink {
  icon: LucideIcon
  url: string
}


export interface NFT {
  id: string
  name: string
  description: string
  image: string
  tokenId: string
  collection: Collection
  price: number
  rarity?: string
  attributes?: {
    trait_type: string
    value: string
  }[]
  createdAt: string
  lastSale?: {
    price: number
    date: string
  }
  licensing?: Licensing[]
}

export interface Licensing {
  id: string
  type: "Commercial" | "Personal" | "Exclusive"
  licensee: string
  startDate: string
  endDate: string
  terms: string
}

export interface NFTMetadata {
  name: string;
  author: string;
  description: string;
  type: string;
  template: string;
  collection: string;
  tags: string;
  image: string;
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


export interface Asset {
  name: string;
  author: string;
  description: string;
  type: string;
  template: string;
  collection: string;
  tags: string;
  image: string;
  externalUrl: string;
  licenseType: string;
  licenseDetails: string;
  licenseDuration: string;
  licenseTerritory: string;
  commercialUse: boolean;
  modifications: boolean;
  attribution: boolean;
  registrationDate: string;
  protectionStatus: string;
  protectionScope: string;
  protectionDuration: string;
  version: string;
}

// User Profile Types
export interface SocialMediaLinks {
  twitter: string;
  linkedin: string;
  github: string;
}

export interface UserPreferences {
  marketProfile: boolean;
  emailNotifications: boolean;
  publicProfile: boolean;
  dataSharing: string;
}

export interface Transaction {
  id: string;
  type: string;
  asset: string;
  date: string;
  status: string;
}

export interface UserStats {
  nftAssets: number;
  transactions: number;
  listingItems: number;
  nftCollections: number;
  rewards: number;
  badges: number;
}

export interface UserProfile {
  address: string;
  name: string;
  username: string;
  website: string;
  email: string;
  socialMedia: SocialMediaLinks;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  preferences: UserPreferences;
  transactions: Transaction[];
  stats: UserStats;
}
