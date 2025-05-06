import type { Agreement } from "./types"

// Mock data for agreements
export const mockAgreements: Agreement[] = [
  {
    id: "0x023c754a8937658fcad3d7db3d4332faf3c22b23d3791f321fb800379236f78d",
    title: "Software Development License Agreement",
    type: "Software License",
    description:
      "This agreement grants the licensee the right to use and modify the software codebase for the development of a mobile application. The licensor retains ownership of the intellectual property while allowing the licensee to create derivative works under specific conditions.",
      status: "completed",
      createdAt: "2023-11-15T10:30:00Z",
      createdBy: "0x1234567890abcdef1234567890abcdef12345678",
    completedAt: "2023-11-20T14:45:00Z",
    transactionHash: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
    blockNumber: 123456,
    parties: [
      {
        id: "party-001",
        name: "TechCorp Inc.",
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        role: "licensor",
        email: "legal@techcorp.com",
      },
      {
        id: "party-002",
        name: "AppDev Solutions",
        walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        role: "licensee",
        email: "contracts@appdev.com",
      },
    ],
    signatures: [
      {
        id: "sig-001",
        name: "TechCorp Inc.",
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        timestamp: "2023-11-16T09:15:00Z",
        signatureHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      },
      {
        id: "sig-002",
        name: "AppDev Solutions",
        walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        timestamp: "2023-11-18T11:30:00Z",
        signatureHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3",
      },
    ],
    terms: {
      duration: "2_years",
      territory: "worldwide",
      rights:
      "The licensee is granted the non-exclusive right to use, modify, and create derivative works from the licensed software for the purpose of developing a mobile application. The licensee may not sublicense or distribute the original source code.",
      royalties:
      "The licensee agrees to pay 5% of net revenue generated from the mobile application to the licensor on a quarterly basis. Minimum annual payment of $10,000 is required regardless of revenue.",
      termination:
      "This agreement may be terminated by either party with 90 days written notice. Upon termination, the licensee must cease all use of the licensed software and destroy all copies in their possession.",
    },
  },
  {
    id: "0x061f74157975bbf800653165b3be4ccf7a7fb367488af7c04ad5a5e06c884454",
    title: "Software Development License Agreement",
    type: "Software License",
    description:
      "This agreement grants the licensee the right to use and modify the software codebase for the development of a mobile application. The licensor retains ownership of the intellectual property while allowing the licensee to create derivative works under specific conditions.",
      status: "completed",
      createdAt: "2023-11-15T10:30:00Z",
      createdBy: "0x1234567890abcdef1234567890abcdef12345678",
    completedAt: "2023-11-20T14:45:00Z",
    transactionHash: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
    blockNumber: 123456,
    parties: [
      {
        id: "party-001",
        name: "TechCorp Inc.",
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        role: "licensor",
        email: "legal@techcorp.com",
      },
      {
        id: "party-002",
        name: "AppDev Solutions",
        walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        role: "licensee",
        email: "contracts@appdev.com",
      },
    ],
    signatures: [
      {
        id: "sig-001",
        name: "TechCorp Inc.",
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        timestamp: "2023-11-16T09:15:00Z",
        signatureHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      },
      {
        id: "sig-002",
        name: "AppDev Solutions",
        walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        timestamp: "2023-11-18T11:30:00Z",
        signatureHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3",
      },
    ],
    terms: {
      duration: "2_years",
      territory: "worldwide",
      rights:
      "The licensee is granted the non-exclusive right to use, modify, and create derivative works from the licensed software for the purpose of developing a mobile application. The licensee may not sublicense or distribute the original source code.",
      royalties:
      "The licensee agrees to pay 5% of net revenue generated from the mobile application to the licensor on a quarterly basis. Minimum annual payment of $10,000 is required regardless of revenue.",
      termination:
      "This agreement may be terminated by either party with 90 days written notice. Upon termination, the licensee must cease all use of the licensed software and destroy all copies in their possession.",
    },
  },
  {
    id: "0x0319add86ecf6d25c850fdb2110f4f68971868224ebf25dd3c5e9166105cd72f",
    title: "Digital Content Licensing Agreement",
    type: "Content License",
    description:
    "This agreement covers the licensing of digital content including images, videos, and audio files for use in an online educational platform. The content will be used for educational purposes only and cannot be resold or redistributed.",
    status: "pending",
    createdAt: "2023-12-05T08:45:00Z",
    createdBy: "0x1234567890abcdef1234567890abcdef12345678",
    parties: [
      {
        id: "party-003",
        name: "Creative Media Ltd.",
        walletAddress: "0x2345678901abcdef2345678901abcdef23456789",
        role: "licensor",
        email: "rights@creativemedia.com",
      },
      {
        id: "party-004",
        name: "EduLearn Platform",
        walletAddress: "0xbcdef2345678901abcdef2345678901abcdef234",
        role: "licensee",
        email: "content@edulearn.com",
      },
    ],
    signatures: [
      {
        id: "sig-003",
        name: "Creative Media Ltd.",
        walletAddress: "0x2345678901abcdef2345678901abcdef23456789",
        timestamp: "2023-12-06T10:20:00Z",
        signatureHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4",
      },
    ],
    terms: {
      duration: "1_year",
      territory: "north_america",
      rights:
        "The licensee is granted the non-exclusive right to use the licensed content within their educational platform for the purpose of education and training. The content may not be resold, redistributed, or used for any other purpose.",
      royalties:
        "The licensee agrees to pay a one-time fee of $25,000 for the use of the licensed content for the duration of the agreement. No additional royalties will be due.",
      termination:
      "This agreement will automatically terminate at the end of the license period unless renewed by both parties in writing. Upon termination, the licensee must remove all licensed content from their platform within 30 days.",
    },
  },
  {
    id: "0x03093faeb5c584a6285977b444ebf3894a8bd457712b03d647c4e2efdf9bd668",
    title: "Patent Licensing Agreement for Medical Device",
    type: "Patent License",
    description:
    "This agreement grants the licensee the right to manufacture and sell medical devices based on the licensor's patented technology. The license is exclusive for the specified territory and includes technical support and knowledge transfer.",
    status: "draft",
    createdAt: "2024-01-10T14:20:00Z",
    createdBy: "0x1234567890abcdef1234567890abcdef12345678",
    parties: [
      {
        id: "party-005",
        name: "MedTech Innovations",
        walletAddress: "0x3456789012abcdef3456789012abcdef34567890",
        role: "licensor",
        email: "patents@medtech.com",
      },
      {
        id: "party-006",
        name: "Global Health Devices",
        walletAddress: "0xcdef3456789012abcdef3456789012abcdef3456",
        role: "licensee",
        email: "licensing@ghdevices.com",
      },
    ],
    signatures: [],
    terms: {
      duration: "10_years",
      territory: "europe",
      rights:
      "The licensee is granted the exclusive right to manufacture, use, and sell medical devices incorporating the licensed patents within the specified territory. The licensee may not sublicense these rights without written consent from the licensor.",
      royalties:
      "The licensee agrees to pay an initial license fee of €500,000 plus a royalty of 8% on net sales of licensed products. Minimum annual royalties of €100,000 are required beginning in the second year of the agreement.",
      termination:
      "This agreement may be terminated by the licensor if the licensee fails to meet minimum royalty requirements for two consecutive years or breaches any material term of the agreement. The licensee may terminate with 6 months written notice.",
    },
  },
]

// Mock function to simulate wallet connection
export async function mockConnectWallet() {
  // Simulate connection delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  
  // Return a mock wallet address
  return {
    address: "0x" + Math.random().toString(16).substring(2, 42),
  }
}

// Mock function to simulate wallet disconnection
export function mockDisconnectWallet() {
  // Nothing to do in the mock implementation
  return true
}

// Mock function to get agreement statistics
export function getMockAgreementStats() {
  return {
    totalAgreements: 42,
    totalSignatures: 78,
    completedAgreements: 35,
    publicViews: 156,
  }
}

