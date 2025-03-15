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
  image: string
  itemCount: number
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

export interface Collection {
  id: string
  name: string
  description?: string
  floorPrice?: number
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
  description: string;
  author: string;
  type: string;
  image: string;
  version: string;
  external_url: string;
}


export interface Asset {
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
