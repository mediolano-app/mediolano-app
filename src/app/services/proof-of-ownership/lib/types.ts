export interface Asset {
  id: string
  title: string
  description: string
  type: "artwork" | "music" | "video" | "literature" | "software" | "ai-model" | "nft" | "rwa"
  thumbnailUrl: string
  fileType: string
  fileSize: string
  creationDate: string
  registrationDate: string
  transactionHash: string
  blockNumber: string
  verificationHash: string
  smartContract: string
  owner: {
    name: string
    walletAddress: string
  }
  history: {
    action: string
    date: string
    details?: string
  }[]
}

export interface LicenseOption {
  id: string
  name: string
  description: string
  fullDescription: string
  price: string
  features: string[]
  terms: string[]
}

export interface User {
  id: string
  name: string
  walletAddress: string
  email: string
  assets: string[] // Asset IDs
}
