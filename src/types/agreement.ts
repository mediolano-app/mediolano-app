export interface Agreement {
    id: string
    title: string
    type: string
    description: string
    status: "draft" | "pending" | "completed"
    createdAt: string
    createdBy: string
    completedAt?: string
    transactionHash?: string
    blockNumber?: number
    parties: Party[]
    signatures: Signature[]
    terms: Terms
  }
  
  export interface Party {
    id: string
    name: string
    walletAddress: string
    role: string
    email?: string
  }
  
  export interface Signature {
    id: string
    name: string
    walletAddress: string
    timestamp: string
    signatureHash: string
  }
  
  export interface Terms {
    duration: string
    territory: string
    rights: string
    royalties: string
    termination: string
  }
  
  