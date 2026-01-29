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
  id: string | bigint;
  name: string;
  description: string;
  image: string;
  nftAddress: string;
  owner: string;
  isActive: boolean;
  totalMinted: number;
  totalBurned: number;
  totalTransfers: number;
  lastMintTime: string;
  lastBurnTime: string;
  lastTransferTime: string;
  itemCount: number;
  nftBalance?: number;
  totalSupply: number;
  ownerBalance?: number;
  baseUri: string;
  floorPrice?: number;
  symbol?: string;
  type?: string;
  visibility?: string;
  enableVersioning?: boolean;
  allowComments?: boolean;
  requireApproval?: boolean;
}



/**
 * Data validation utilities for Collection objects
 */
export class CollectionValidator {
  /**
   * Validates if an object is a valid Collection
   */
  static isValid(collection: any): collection is Collection {
    if (!collection || typeof collection !== 'object') {
      return false;
    }

    const requiredFields = [
      'id', 'name', 'description', 'image', 'nftAddress',
      'owner', 'isActive', 'totalMinted', 'totalBurned',
      'totalTransfers', 'lastMintTime', 'lastBurnTime',
      'lastTransferTime', 'itemCount', 'totalSupply', 'baseUri'
    ];

    // Check required fields
    if (!requiredFields.every(field => field in collection)) {
      return false;
    }

    // Type and value validation rules
    const validations = [
      typeof collection.name === 'string' && collection.name.trim() !== '',
      typeof collection.description === 'string',
      typeof collection.image === 'string',
      typeof collection.isActive === 'boolean',
      typeof collection.totalMinted === 'number' && collection.totalMinted >= 0,
      typeof collection.totalBurned === 'number' && collection.totalBurned >= 0,
      typeof collection.itemCount === 'number' && collection.itemCount >= 0,
    ];

    return validations.every(Boolean);
  }

  /**
   * Normalizes a Collection object to ensure consistent data types
   */
  static normalize(collection: any): Collection {
    return {
      id: collection.id,
      name: String(collection.name || '').trim(),
      description: String(collection.description || ''),
      image: String(collection.image || '/placeholder.svg'),
      nftAddress: String(collection.nftAddress || ''),
      owner: String(collection.owner || ''),
      isActive: Boolean(collection.isActive),
      totalMinted: Number(collection.totalMinted) || 0,
      totalBurned: Number(collection.totalBurned) || 0,
      totalTransfers: Number(collection.totalTransfers) || 0,
      lastMintTime: String(collection.lastMintTime || ''),
      lastBurnTime: String(collection.lastBurnTime || ''),
      lastTransferTime: String(collection.lastTransferTime || ''),
      itemCount: Number(collection.itemCount) || 0,
      nftBalance: collection.nftBalance !== undefined ? Number(collection.nftBalance) : undefined,
      totalSupply: Number(collection.totalSupply) || 0,
      ownerBalance: collection.ownerBalance !== undefined ? Number(collection.ownerBalance) : undefined,
      baseUri: String(collection.baseUri || ''),
      floorPrice: collection.floorPrice !== undefined ? Number(collection.floorPrice) : undefined,
      symbol: collection.symbol ? String(collection.symbol) : undefined,
      type: collection.type ? String(collection.type) : undefined,
      visibility: collection.visibility ? String(collection.visibility) : undefined,
      enableVersioning: collection.enableVersioning !== undefined ? Boolean(collection.enableVersioning) : undefined,
      allowComments: collection.allowComments !== undefined ? Boolean(collection.allowComments) : undefined,
      requireApproval: collection.requireApproval !== undefined ? Boolean(collection.requireApproval) : undefined,
    };
  }

  /**
   * Validates and normalizes a collection, returning null if invalid
   */
  static validateAndNormalize(collection: any): Collection | null {
    if (!this.isValid(collection)) {
      return null;
    }
    return this.normalize(collection);
  }
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
  instagram: string;
  tiktok: string;
  facebook: string;
  discord: string;
  youtube: string;
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
  phone: string;
  location: string;
  org: string;
  socialMedia: SocialMediaLinks;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  preferences: UserPreferences;
  transactions: Transaction[];
  stats: UserStats;
}

// possible IP types
export type IPType =
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
  | "Generic";


export interface DisplayAsset {
  id: string;
  tags: string[];
  tokenId: number;
  name: string;
  author: {
    name: string;
    address: string;
    avatar: string;
    verified: boolean;
    bio: string;
    website: string;
  };
  creator: {
    name: string;
    address: string;
    avatar: string;
    verified: boolean;
    bio: string;
    website: string;
  };
  owner: {
    name: string;
    address: string;
    avatar: string;
    verified: boolean;
    acquired: string;
  };
  description: string;
  template: string;
  image: string;
  createdAt: string;
  collection: string;
  blockchain: string;
  tokenStandard: string;
  licenseType: string;
  licenseDetails: string;
  version: string;
  commercialUse: boolean;
  modifications: boolean;
  attribution: boolean;
  licenseTerms: string;
  contract: string;
  attributes: Array<{ trait_type: string; value: string }>;
  licenseInfo: {
    type: string;
    terms: string;
    allowCommercial: boolean;
    allowDerivatives: boolean;
    requireAttribution: boolean;
    royaltyPercentage: number;
  };
  ipfsCid?: string;
  type: string;
  collectionId?: string;
}