import type {
  Asset,
  Collection,
  Creator,
  Template,
  ActivityRecord,
  PortfolioStats,
  OwnershipRecord,
  User,
} from "@/types/asset"

// Enhanced  creators data with more comprehensive profiles
export const creators: Creator[] = [

]

// Enhanced collections data with more variety
export const collections: Collection[] = [

]

// Enhanced assets data with more variety and better distribution
export const assets: Asset[] = [
]

// Templates data
export const templates: Template[] = [
  {
    id: "digital-art",
    name: "Digital Art",
    description: "Perfect for digital artwork, illustrations, and creative visual content",
    type: "Art",
    icon: "🎨",
    popularity: 95,
    features: ["High-resolution support", "Color palette analysis", "Style categorization"],
    suitableFor: ["Digital artists", "Illustrators", "Graphic designers"],
    metadataFields: ["style", "medium", "dimensions", "colorPalette"],
  },
  {
    id: "audio-art",
    name: "Audio Art",
    description: "Designed for music, sound effects, and audio compositions",
    type: "Audio",
    icon: "🎵",
    popularity: 78,
    features: ["Waveform analysis", "Audio fingerprinting", "Format conversion"],
    suitableFor: ["Musicians", "Sound designers", "Audio engineers"],
    metadataFields: ["duration", "sampleRate", "format", "genre"],
  },
  {
    id: "patent",
    name: "Technical Patent",
    description: "Comprehensive protection for technical innovations and inventions",
    type: "Patent",
    icon: "⚗️",
    popularity: 65,
    features: ["Prior art search", "Claims validation", "International filing"],
    suitableFor: ["Inventors", "Research institutions", "Tech companies"],
    metadataFields: ["patentNumber", "filingDate", "inventors", "claims"],
  },
  {
    id: "software",
    name: "Software License",
    description: "Protect your software code, algorithms, and digital solutions",
    type: "Software",
    icon: "💻",
    popularity: 82,
    features: ["Code analysis", "License compatibility", "Version tracking"],
    suitableFor: ["Developers", "Software companies", "Open source projects"],
    metadataFields: ["version", "language", "framework", "license"],
  },
  {
    id: "3d-design",
    name: "3D Design",
    description: "For 3D models, architectural designs, and virtual environments",
    type: "Art",
    icon: "🏗️",
    popularity: 71,
    features: ["3D model validation", "Texture analysis", "Polygon optimization"],
    suitableFor: ["3D artists", "Architects", "Game developers"],
    metadataFields: ["software", "polyCount", "textures", "format"],
  },
  {
    id: "nft",
    name: "NFT Collection",
    description: "For non-fungible tokens and digital collectibles",
    type: "NFT",
    icon: "💎",
    popularity: 88,
    features: ["Blockchain verification", "Rarity analysis", "Metadata validation"],
    suitableFor: ["NFT creators", "Digital artists", "Collectors"],
    metadataFields: ["blockchain", "tokenId", "rarity", "edition"],
  },
  {
    id: "remix-art",
    name: "Remix Art",
    description: "For derivative works and creative remixes of existing assets",
    type: "Art",
    icon: "🔄",
    popularity: 43,
    features: ["Original asset linking", "Attribution tracking", "Remix analytics"],
    suitableFor: ["Remix artists", "Collaborators", "Creative communities"],
    metadataFields: ["originalAsset", "remixType", "techniques", "inspiration"],
  },
]

// Activity records
export const activityRecords: ActivityRecord[] = [

]

// Portfolio stats
export const portfolioStats: PortfolioStats = {
  totalAssets: 0,
  totalValue: "0 STRK",
  createdAssets: 0,
  licensedAssets: 0,
  protectionLevel: 0,
}

//  provenance data
export const ProvenanceData = {

}

// Users data
export const users: User[] = [

]

// Helper functions
export function getAssetById(id: string): Asset | undefined {
  return assets.find((asset) => asset.id === id)
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug)
}

export function getCollectionById(id: string): Collection | undefined {
  return collections.find((collection) => collection.id === id)
}

export function getCreatorBySlug(slug: string): Creator | undefined {
  return creators.find((creator) => creator.slug === slug)
}

export function getCreatorByName(name: string): Creator | undefined {
  return creators.find((creator) => creator.name === name)
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((template) => template.id === id)
}

export function getAssetsByCollection(collectionSlug: string): Asset[] {
  const collection = getCollectionBySlug(collectionSlug)
  if (!collection) return []

  return assets.filter((asset) => {
    const assetCollectionSlug = asset.collection?.toLowerCase().replace(/\s+/g, "-")
    return assetCollectionSlug === collectionSlug
  })
}

export function getAssetsByCreator(creatorName: string): Asset[] {
  return assets.filter((asset) => asset.creator === creatorName)
}

export function getCollectionsByCreator(creatorName: string): Collection[] {
  return collections.filter((collection) => collection.creator === creatorName)
}

export function getAssetProvenance(assetId: string) {
  return ProvenanceData[assetId as keyof typeof ProvenanceData]
}

export function getUserByAddress(address: string): User | undefined {
  return users.find((user) => user.address === address)
}

export function getRemixAssetsByCreator(creatorName: string): Asset[] {
  return assets.filter(
    (asset) => asset.creator === creatorName && (asset.templateType === "Remix Art" || asset.metadata?.originalAsset),
  )
}



// Export all data as default
export default {
  assets,
  collections,
  creators,
  templates,
  activityRecords,
  portfolioStats,
  users,
  ProvenanceData,
}
