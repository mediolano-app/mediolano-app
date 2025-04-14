import type { Asset, LicenseOption, User } from "./types"
import { FileText, Music, Video, Code, Brain, ImageIcon, Layers, Building } from "lucide-react"

// Mock user data
const mockUser: User = {
  id: "user1",
  name: "John Creator",
  walletAddress: "0x1234...5678",
  email: "john@example.com",
  assets: ["asset1", "asset2", "asset3", "asset4", "asset5"],
}

// Mock assets data
const mockAssets: Asset[] = [
  {
    id: "asset1",
    title: "Digital Mona Lisa",
    description: "A digital recreation of the famous Mona Lisa painting with a modern twist.",
    type: "artwork",
    thumbnailUrl: "/placeholder.svg?height=400&width=600",
    fileType: "PNG",
    fileSize: "12.5 MB",
    creationDate: "2023-10-15",
    registrationDate: "2023-10-20",
    transactionHash: "0x7f9e8d7c6b5a4321fedcba9876543210abcdef0123456789",
    blockNumber: "12345678",
    verificationHash: "0x7f9e8d7c6b5a43210987654321fedcba9876543210abcdef0123456789abcdef",
    smartContract: "0x1234567890abcdef1234567890abcdef12345678",
    owner: {
      name: "John Creator",
      walletAddress: "0x1234...5678",
    },
    history: [
      {
        action: "Asset Created",
        date: "2023-10-15",
        details: "Original artwork created",
      },
      {
        action: "Asset Registered",
        date: "2023-10-20",
        details: "Registered on Mediolano",
      },
      {
        action: "Blockchain Verification",
        date: "2023-10-20",
        details: "Proof of ownership recorded on Starknet blockchain",
      },
      {
        action: "Ethereum Settlement",
        date: "2023-10-21",
        details: "Ownership proof settled on Ethereum L1",
      },
      {
        action: "License Granted",
        date: "2023-11-05",
        details: "Non-commercial license granted to Art Gallery XYZ",
      },
    ],
  },
  {
    id: "asset2",
    title: "Blockchain Symphony",
    description: "A musical composition inspired by the rhythmic patterns of blockchain transactions.",
    type: "music",
    thumbnailUrl: "/placeholder.svg?height=400&width=600",
    fileType: "MP3",
    fileSize: "8.2 MB",
    creationDate: "2023-09-10",
    registrationDate: "2023-09-15",
    transactionHash: "0x8a7b6c5d4e3f2g1h",
    blockNumber: "12345679",
    verificationHash: "0x8a7b6c5d4e3f2g1h0i9j8k7l6m5n4o3p2q1r",
    smartContract: "0x1234567890abcdef1234567890abcdef12345679",
    owner: {
      name: "John Creator",
      walletAddress: "0x1234...5678",
    },
    history: [
      {
        action: "Asset Created",
        date: "2023-09-10",
        details: "Original music composed",
      },
      {
        action: "Asset Registered",
        date: "2023-09-15",
        details: "Registered on Mediolano",
      },
    ],
  },
  {
    id: "asset3",
    title: "Crypto Revolution",
    description: "A short documentary about the rise of cryptocurrency and its impact on global finance.",
    type: "video",
    thumbnailUrl: "/placeholder.svg?height=400&width=600",
    fileType: "MP4",
    fileSize: "256 MB",
    creationDate: "2023-08-05",
    registrationDate: "2023-08-10",
    transactionHash: "0x9b8c7d6e5f4g3h2i",
    blockNumber: "12345680",
    verificationHash: "0x9b8c7d6e5f4g3h2i1j0k9l8m7n6o5p4q3r2s1t",
    smartContract: "0x1234567890abcdef1234567890abcdef12345680",
    owner: {
      name: "John Creator",
      walletAddress: "0x1234...5678",
    },
    history: [
      {
        action: "Asset Created",
        date: "2023-08-05",
        details: "Video production completed",
      },
      {
        action: "Asset Registered",
        date: "2023-08-10",
        details: "Registered on Mediolano",
      },
      {
        action: "License Granted",
        date: "2023-12-01",
        details: "Educational license granted to Blockchain University",
      },
    ],
  },
  {
    id: "asset4",
    title: "The Future of Web3",
    description: "An in-depth analysis of Web3 technologies and their potential impact on society.",
    type: "literature",
    thumbnailUrl: "/placeholder.svg?height=400&width=600",
    fileType: "PDF",
    fileSize: "4.7 MB",
    creationDate: "2023-07-20",
    registrationDate: "2023-07-25",
    transactionHash: "0xa1b2c3d4e5f6g7h8",
    blockNumber: "12345681",
    verificationHash: "0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t",
    smartContract: "0x1234567890abcdef1234567890abcdef12345681",
    owner: {
      name: "John Creator",
      walletAddress: "0x1234...5678",
    },
    history: [
      {
        action: "Asset Created",
        date: "2023-07-20",
        details: "Book manuscript completed",
      },
      {
        action: "Asset Registered",
        date: "2023-07-25",
        details: "Registered on Mediolano",
      },
    ],
  },
  {
    id: "asset5",
    title: "Code Repository Alpha",
    description: "A revolutionary software library for blockchain development.",
    type: "software",
    thumbnailUrl: "/placeholder.svg?height=400&width=600",
    fileType: "ZIP",
    fileSize: "32.1 MB",
    creationDate: "2023-06-15",
    registrationDate: "2023-06-20",
    transactionHash: "0xb2c3d4e5f6g7h8i9",
    blockNumber: "12345682",
    verificationHash: "0xb2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u",
    smartContract: "0x1234567890abcdef1234567890abcdef12345682",
    owner: {
      name: "John Creator",
      walletAddress: "0x1234...5678",
    },
    history: [
      {
        action: "Asset Created",
        date: "2023-06-15",
        details: "Software development completed",
      },
      {
        action: "Asset Registered",
        date: "2023-06-20",
        details: "Registered on Mediolano",
      },
      {
        action: "License Granted",
        date: "2023-11-15",
        details: "Commercial license granted to Tech Corp",
      },
    ],
  },
  {
    id: "asset6",
    title: "Neural Network Model X",
    description: "An advanced AI model for natural language processing.",
    type: "ai-model",
    thumbnailUrl: "/placeholder.svg?height=400&width=600",
    fileType: "H5",
    fileSize: "1.2 GB",
    creationDate: "2023-05-10",
    registrationDate: "2023-05-15",
    transactionHash: "0xc3d4e5f6g7h8i9j0",
    blockNumber: "12345683",
    verificationHash: "0xc3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v",
    smartContract: "0x1234567890abcdef1234567890abcdef12345683",
    owner: {
      name: "AI Research Lab",
      walletAddress: "0x9876...5432",
    },
    history: [
      {
        action: "Asset Created",
        date: "2023-05-10",
        details: "AI model training completed",
      },
      {
        action: "Asset Registered",
        date: "2023-05-15",
        details: "Registered on Mediolano",
      },
    ],
  },
  {
    id: "asset7",
    title: "Cosmic Landscape",
    description: "A digital artwork depicting an otherworldly cosmic landscape.",
    type: "artwork",
    thumbnailUrl: "/placeholder.svg?height=400&width=600",
    fileType: "JPEG",
    fileSize: "18.5 MB",
    creationDate: "2023-04-05",
    registrationDate: "2023-04-10",
    transactionHash: "0xd4e5f6g7h8i9j0k1",
    blockNumber: "12345684",
    verificationHash: "0xd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w",
    smartContract: "0x1234567890abcdef1234567890abcdef12345684",
    owner: {
      name: "Digital Artist Collective",
      walletAddress: "0x5678...9012",
    },
    history: [
      {
        action: "Asset Created",
        date: "2023-04-05",
        details: "Artwork created",
      },
      {
        action: "Asset Registered",
        date: "2023-04-10",
        details: "Registered on Mediolano",
      },
    ],
  },
  {
    id: "asset8",
    title: "Quantum Beats",
    description: "An experimental electronic music album inspired by quantum physics.",
    type: "music",
    thumbnailUrl: "/placeholder.svg?height=400&width=600",
    fileType: "WAV",
    fileSize: "320 MB",
    creationDate: "2023-03-15",
    registrationDate: "2023-03-20",
    transactionHash: "0xe5f6g7h8i9j0k1l2",
    blockNumber: "12345685",
    verificationHash: "0xe5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x",
    smartContract: "0x1234567890abcdef1234567890abcdef12345685",
    owner: {
      name: "Electronic Music Studio",
      walletAddress: "0x3456...7890",
    },
    history: [
      {
        action: "Asset Created",
        date: "2023-03-15",
        details: "Album production completed",
      },
      {
        action: "Asset Registered",
        date: "2023-03-20",
        details: "Registered on Mediolano",
      },
    ],
  },
  {
    id: "asset9",
    title: "Blockchain Governance Framework",
    description: "A comprehensive framework for implementing governance in blockchain projects.",
    type: "literature",
    thumbnailUrl: "/placeholder.svg?height=400&width=600",
    fileType: "PDF",
    fileSize: "6.8 MB",
    creationDate: "2023-02-10",
    registrationDate: "2023-02-15",
    transactionHash: "0xf6g7h8i9j0k1l2m3",
    blockNumber: "12345686",
    verificationHash: "0xf6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y",
    smartContract: "0x1234567890abcdef1234567890abcdef12345686",
    owner: {
      name: "Blockchain Research Institute",
      walletAddress: "0x7890...1234",
    },
    history: [
      {
        action: "Asset Created",
        date: "2023-02-10",
        details: "Research paper completed",
      },
      {
        action: "Asset Registered",
        date: "2023-02-15",
        details: "Registered on Mediolano",
      },
    ],
  },
  {
    id: "asset10",
    title: "Virtual Reality Experience",
    description: "An immersive VR experience exploring the future of digital ownership.",
    type: "software",
    thumbnailUrl: "/placeholder.svg?height=400&width=600",
    fileType: "ZIP",
    fileSize: "2.1 GB",
    creationDate: "2023-01-05",
    registrationDate: "2023-01-10",
    transactionHash: "0xg7h8i9j0k1l2m3n4",
    blockNumber: "12345687",
    verificationHash: "0xg7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z",
    smartContract: "0x1234567890abcdef1234567890abcdef12345687",
    owner: {
      name: "VR Innovations",
      walletAddress: "0x2345...6789",
    },
    history: [
      {
        action: "Asset Created",
        date: "2023-01-05",
        details: "VR experience development completed",
      },
      {
        action: "Asset Registered",
        date: "2023-01-10",
        details: "Registered on Mediolano",
      },
    ],
  },
  {
    id: "asset11",
    title: "Decentralized Finance Whitepaper",
    description: "A comprehensive analysis of DeFi protocols and their future implications.",
    type: "literature",
    thumbnailUrl: "/placeholder.svg?height=400&width=600",
    fileType: "PDF",
    fileSize: "3.5 MB",
    creationDate: "2022-12-10",
    registrationDate: "2022-12-15",
    transactionHash: "0xh8i9j0k1l2m3n4o5",
    blockNumber: "12345688",
    verificationHash: "0xh8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a",
    smartContract: "0x1234567890abcdef1234567890abcdef12345688",
    owner: {
      name: "DeFi Research Collective",
      walletAddress: "0x8901...2345",
    },
    history: [
      {
        action: "Asset Created",
        date: "2022-12-10",
        details: "Whitepaper completed",
      },
      {
        action: "Asset Registered",
        date: "2022-12-15",
        details: "Registered on Mediolano",
      },
    ],
  },
  {
    id: "asset12",
    title: "Tokenized Real Estate Contract",
    description: "A legal framework for tokenizing real estate assets on the blockchain.",
    type: "rwa",
    thumbnailUrl: "/placeholder.svg?height=400&width=600",
    fileType: "PDF",
    fileSize: "2.8 MB",
    creationDate: "2022-11-05",
    registrationDate: "2022-11-10",
    transactionHash: "0xi9j0k1l2m3n4o5p6",
    blockNumber: "12345689",
    verificationHash: "0xi9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b",
    smartContract: "0x1234567890abcdef1234567890abcdef12345689",
    owner: {
      name: "Blockchain Real Estate Group",
      walletAddress: "0x6789...0123",
    },
    history: [
      {
        action: "Asset Created",
        date: "2022-11-05",
        details: "Legal framework completed",
      },
      {
        action: "Asset Registered",
        date: "2022-11-10",
        details: "Registered on Mediolano",
      },
    ],
  },
]

// Mock license options
const mockLicenseOptions: LicenseOption[] = [
  {
    id: "license1",
    name: "Standard Commercial License",
    description: "For business and commercial use of the asset",
    fullDescription:
      "This license grants the right to use the asset in commercial projects, marketing materials, and business applications. It includes the right to modify the asset for your specific needs.",
    price: "$250",
    features: ["Commercial use", "Modification rights", "Use in multiple projects", "Worldwide usage"],
    terms: [
      "License is non-transferable",
      "Credit to original creator required",
      "Cannot be resold or redistributed",
      "No sublicensing allowed",
      "Valid for 1 year, renewable",
    ],
  },
  {
    id: "license2",
    name: "Educational License",
    description: "For use in educational and academic settings",
    fullDescription:
      "This license is specifically designed for educational institutions, teachers, and students. It allows the use of the asset in educational materials, presentations, and academic research.",
    price: "$100",
    features: ["Use in educational materials", "Academic research", "Student projects", "Classroom presentations"],
    terms: [
      "For educational purposes only",
      "Credit to original creator required",
      "Cannot be used commercially",
      "Valid for educational institutions only",
      "Perpetual license",
    ],
  },
  {
    id: "license3",
    name: "Personal Use License",
    description: "For non-commercial personal projects",
    fullDescription:
      "This license allows you to use the asset for personal, non-commercial projects. It's perfect for hobbyists, personal websites, or personal creative projects that will not generate revenue.",
    price: "Free",
    features: ["Personal projects", "Non-commercial use", "Modification rights", "Unlimited personal use"],
    terms: [
      "Non-commercial use only",
      "Credit to original creator required",
      "Cannot be used in commercial projects",
      "Cannot be redistributed",
      "Perpetual license",
    ],
  },
  {
    id: "license4",
    name: "Enterprise License",
    description: "Comprehensive rights for large organizations",
    fullDescription:
      "Our enterprise license provides extensive rights for large organizations. It includes usage across multiple projects, departments, and commercial applications with minimal restrictions.",
    price: "$1,000",
    features: [
      "Unlimited commercial use",
      "Use across entire organization",
      "Multiple project usage",
      "Extended modification rights",
    ],
    terms: [
      "Valid for entire organization",
      "Credit to original creator optional",
      "Cannot be resold as-is",
      "Includes priority support",
      "Valid for 3 years, renewable",
    ],
  },
]

// Export functions to access mock data
export function getUserAssets(): Asset[] {
  return mockAssets.filter((asset) => mockUser.assets.includes(asset.id))
}

export function getAllAssets(): Asset[] {
  return mockAssets
}

export function getAssetById(id: string): Asset | undefined {
  return mockAssets.find((asset) => asset.id === id)
}

export function getLicenseOptions(assetId: string): LicenseOption[] {
  // In a real app, you might filter license options based on the asset type
  return mockLicenseOptions
}

export function getUser(): User {
  return mockUser
}

// Helper function to get icon by asset type
export function getAssetIcon(type: string) {
  switch (type) {
    case "artwork":
      return ImageIcon
    case "music":
      return Music
    case "video":
      return Video
    case "literature":
      return FileText
    case "software":
      return Code
    case "ai-model":
      return Brain
    case "nft":
      return Layers
    case "rwa":
      return Building
    default:
      return FileText
  }
}
