import type { Asset, ActivityRecord, PortfolioStats, Collection, Template, IPType } from "@/types/asset"

// Enhanced mock assets with more comprehensive data
export const assets: Asset[] = [
  {
    id: "1",
    name: "Abstract Dimension #312",
    creator: "0xArtist",
    verified: true,
    image: "/placeholder.svg?height=500&width=400&text=Abstract+Art",
    collection: "Dimensions",
    licenseType: "Creative Commons",
    description:
      "An abstract digital artwork exploring dimensional concepts with vibrant colors and geometric patterns.",
    registrationDate: "January 15, 2025",
    value: "0.85 ETH",
    type: "Art",
    templateType: "Digital Artwork",
    templateId: "template-art-1",
    protectionLevel: 95,
    metadata: {
      dimensions: "3000x3000px",
      medium: "Digital",
      style: "Abstract",
      colorPalette: "Vibrant",
    },
    owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    createdAt: "2025-01-15T10:30:00Z",
    numericValue: 850,
  },
  {
    id: "2",
    name: "Cosmic Voyager #89",
    creator: "CryptoCreator",
    verified: true,
    image: "/placeholder.svg?height=400&width=400&text=Cosmic+Space",
    collection: "Cosmic Series",
    licenseType: "Commercial Use",
    description: "A journey through cosmic landscapes with ethereal elements and celestial bodies.",
    registrationDate: "February 3, 2025",
    value: "1.2 ETH",
    type: "Art",
    templateType: "Digital Artwork",
    templateId: "template-art-1",
    protectionLevel: 90,
    metadata: {
      dimensions: "4000x2500px",
      medium: "Digital",
      style: "Sci-Fi",
      colorPalette: "Cosmic",
    },
    owner: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    createdAt: "2025-02-03T14:20:00Z",
    numericValue: 1200,
  },
  {
    id: "3",
    name: "Digital Dreams #567",
    creator: "NFTMaster",
    verified: false,
    image: "/placeholder.svg?height=600&width=400&text=Digital+Dreams",
    collection: "Dreamscape",
    licenseType: "Personal Use",
    description: "Surreal dreamscapes created through digital manipulation and AI enhancement.",
    registrationDate: "February 18, 2025",
    value: "0.5 ETH",
    type: "Art",
    templateType: "Digital Artwork",
    templateId: "template-art-1",
    protectionLevel: 85,
    metadata: {
      dimensions: "3500x3500px",
      medium: "Digital/AI",
      style: "Surrealism",
      colorPalette: "Dreamy",
    },
    owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    createdAt: "2025-02-18T09:15:00Z",
    numericValue: 500,
  },
  {
    id: "4",
    name: "Pixel Paradise #42",
    creator: "DigitalArtist",
    verified: true,
    image: "/placeholder.svg?height=450&width=400&text=Pixel+Art",
    collection: "Pixel Art",
    licenseType: "Creative Commons",
    description: "Nostalgic pixel art scene depicting a tropical paradise with retro aesthetics.",
    registrationDate: "December 12, 2024",
    value: "0.3 ETH",
    type: "Art",
    templateType: "Digital Artwork",
    templateId: "template-art-1",
    protectionLevel: 92,
    metadata: {
      dimensions: "128x128px",
      medium: "Pixel Art",
      style: "Retro",
      colorPalette: "Tropical",
    },
    owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    createdAt: "2024-12-12T16:45:00Z",
    numericValue: 300,
  },
  {
    id: "5",
    name: "Neon Genesis #78",
    creator: "0xArtist",
    verified: true,
    image: "/placeholder.svg?height=380&width=400&text=Neon+Cyberpunk",
    collection: "Neon Collection",
    licenseType: "Commercial Use",
    description: "Cyberpunk-inspired artwork with neon elements and futuristic cityscapes.",
    registrationDate: "March 5, 2025",
    value: "1.5 ETH",
    type: "Art",
    templateType: "Digital Artwork",
    templateId: "template-art-1",
    protectionLevel: 98,
    metadata: {
      dimensions: "4500x2500px",
      medium: "Digital",
      style: "Cyberpunk",
      colorPalette: "Neon",
    },
    owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    createdAt: "2025-03-05T11:30:00Z",
    numericValue: 1500,
  },
  {
    id: "6",
    name: "Quantum Realm #23",
    creator: "QuantumCreator",
    verified: false,
    image: "/placeholder.svg?height=520&width=400&text=Quantum+Physics",
    collection: "Quantum Series",
    licenseType: "Personal Use",
    description: "Visualization of quantum physics concepts through abstract digital art.",
    registrationDate: "January 30, 2025",
    value: "0.75 ETH",
    type: "Art",
    templateType: "Digital Artwork",
    templateId: "template-art-1",
    protectionLevel: 80,
    metadata: {
      dimensions: "3000x3000px",
      medium: "Digital",
      style: "Scientific",
      colorPalette: "Quantum",
    },
    owner: "0x9876543210abcdef0123456789abcdef01234567",
    createdAt: "2025-01-30T13:20:00Z",
    numericValue: 750,
  },
  {
    id: "7",
    name: "Cyberpunk City #112",
    creator: "CyberArtist",
    verified: true,
    image: "/placeholder.svg?height=480&width=400&text=Cyberpunk+City",
    collection: "Cyberpunk",
    licenseType: "Creative Commons",
    description: "Dystopian urban landscape with high-tech elements and neon-lit streets.",
    registrationDate: "February 25, 2025",
    value: "0.95 ETH",
    type: "Art",
    templateType: "Digital Artwork",
    templateId: "template-art-1",
    protectionLevel: 94,
    metadata: {
      dimensions: "5000x3000px",
      medium: "Digital",
      style: "Cyberpunk",
      colorPalette: "Neon/Dark",
    },
    owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    createdAt: "2025-02-25T08:45:00Z",
    numericValue: 950,
  },
  {
    id: "8",
    name: "Ethereal Landscape #45",
    creator: "LandscapeArtist",
    verified: true,
    image: "/placeholder.svg?height=420&width=400&text=Ethereal+Landscape",
    collection: "Ethereal",
    licenseType: "Commercial Use",
    description: "Dreamlike natural landscapes with otherworldly lighting and atmospheric effects.",
    registrationDate: "March 10, 2025",
    value: "0.65 ETH",
    type: "Art",
    templateType: "Digital Artwork",
    templateId: "template-art-1",
    protectionLevel: 91,
    metadata: {
      dimensions: "4000x2250px",
      medium: "Digital",
      style: "Landscape",
      colorPalette: "Ethereal",
    },
    owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    createdAt: "2025-03-10T15:10:00Z",
    numericValue: 650,
  },
  {
    id: "9",
    name: "Synthwave Beats Vol. 1",
    creator: "AudioProducer",
    verified: true,
    image: "/placeholder.svg?height=400&width=400&text=Synthwave+Music",
    collection: "Audio Collection",
    licenseType: "Commercial Use",
    description: "A collection of synthwave tracks with retro-futuristic vibes and electronic beats.",
    registrationDate: "March 15, 2025",
    value: "0.4 ETH",
    type: "Audio",
    templateType: "Music Track",
    templateId: "template-audio-1",
    protectionLevel: 88,
    metadata: {
      duration: "32:45",
      bpm: "120",
      key: "F Minor",
      genre: "Synthwave",
      instruments: "Synthesizers, Drum Machine",
    },
    owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    createdAt: "2025-03-15T12:00:00Z",
    numericValue: 400,
  },
  {
    id: "10",
    name: "Epic Orchestral Suite",
    creator: "ComposerMaster",
    verified: true,
    image: "/placeholder.svg?height=400&width=400&text=Orchestral+Music",
    collection: "Audio Collection",
    licenseType: "Commercial Use",
    description: "Cinematic orchestral composition perfect for film scores and dramatic presentations.",
    registrationDate: "March 20, 2025",
    value: "0.8 ETH",
    type: "Audio",
    templateType: "Music Track",
    templateId: "template-audio-1",
    protectionLevel: 96,
    metadata: {
      duration: "8:32",
      bpm: "80",
      key: "C Major",
      genre: "Orchestral",
      instruments: "Full Orchestra, Choir",
    },
    owner: "0x456789abcdef0123456789abcdef0123456789ab",
    createdAt: "2025-03-20T10:30:00Z",
    numericValue: 800,
  },
  {
    id: "11",
    name: "Documentary: Future Cities",
    creator: "FilmmakerPro",
    verified: true,
    image: "/placeholder.svg?height=400&width=400&text=Documentary+Film",
    collection: "Video Content",
    licenseType: "Educational Use",
    description: "Award-winning documentary exploring sustainable urban development and smart city technologies.",
    registrationDate: "February 28, 2025",
    value: "2.1 ETH",
    type: "Video",
    templateType: "Video Content",
    templateId: "template-video-1",
    protectionLevel: 99,
    metadata: {
      duration: "87:23",
      resolution: "4K",
      format: "MP4",
      frameRate: "24fps",
    },
    owner: "0x789abcdef0123456789abcdef0123456789abcdef",
    createdAt: "2025-02-28T14:15:00Z",
    numericValue: 2100,
  },
  {
    id: "12",
    name: "Legal Contract Template",
    creator: "LegalEagle",
    verified: true,
    image: "/placeholder.svg?height=400&width=400&text=Legal+Document",
    collection: "Legal Documents",
    licenseType: "Commercial Use",
    description: "Professionally drafted legal contract template for business agreements and partnerships.",
    registrationDate: "March 8, 2025",
    value: "0.25 ETH",
    type: "Document",
    templateType: "Legal Document",
    templateId: "template-document-1",
    protectionLevel: 96,
    metadata: {
      documentType: "Contract Template",
      jurisdiction: "International",
      parties: "Multi-party",
      effectiveDate: "Upon Execution",
    },
    owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    createdAt: "2025-03-08T09:30:00Z",
    numericValue: 250,
  },
  {
    id: "13",
    name: "Blockchain Patent #42",
    creator: "TechInnovator",
    verified: true,
    image: "/placeholder.svg?height=400&width=400&text=Patent+Document",
    collection: "Tech Patents",
    licenseType: "Commercial Use",
    description: "Patent for a novel blockchain consensus mechanism with improved scalability and energy efficiency.",
    registrationDate: "February 28, 2025",
    value: "2.5 ETH",
    type: "Patent",
    templateType: "Technical Patent",
    templateId: "template-patent-1",
    protectionLevel: 99,
    metadata: {
      claims: "17",
      filingDate: "January 15, 2025",
      patentClass: "G06F 21/64",
      inventors: "Dr. Sarah Chen, Alex Rodriguez",
    },
    owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    createdAt: "2025-02-28T11:45:00Z",
    numericValue: 2500,
  },
  {
    id: "14",
    name: "Crypto Trading Algorithm",
    creator: "FinTechDev",
    verified: false,
    image: "/placeholder.svg?height=400&width=400&text=Trading+Software",
    collection: "Software Assets",
    licenseType: "Commercial Use",
    description: "Algorithmic trading system for cryptocurrency markets with machine learning optimization.",
    registrationDate: "March 12, 2025",
    value: "1.8 ETH",
    type: "Software",
    templateType: "Software Application",
    templateId: "template-software-1",
    protectionLevel: 93,
    metadata: {
      language: "Python",
      platform: "Cross-platform",
      dependencies: "TensorFlow, NumPy, Pandas",
      version: "2.1.4",
    },
    owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    createdAt: "2025-03-12T16:20:00Z",
    numericValue: 1800,
  },
  {
    id: "15",
    name: "TechBrand™ Logo",
    creator: "BrandDesigner",
    verified: true,
    image: "/placeholder.svg?height=400&width=400&text=Brand+Logo",
    collection: "Brand Assets",
    licenseType: "Trademark",
    description: "Registered trademark for innovative technology brand with comprehensive usage guidelines.",
    registrationDate: "January 20, 2025",
    value: "1.2 ETH",
    type: "Trademark",
    templateType: "Brand Trademark",
    templateId: "template-trademark-1",
    protectionLevel: 98,
    metadata: {
      brandName: "TechBrand",
      category: "Technology Services",
      jurisdiction: "Global",
      registrationNumber: "TM-2025-001",
    },
    owner: "0xabcdef0123456789abcdef0123456789abcdef01",
    createdAt: "2025-01-20T13:30:00Z",
    numericValue: 1200,
  },
  {
    id: "16",
    name: "Rare Genesis NFT #001",
    creator: "NFTArtist",
    verified: true,
    image: "/placeholder.svg?height=400&width=400&text=Genesis+NFT",
    collection: "Genesis Collection",
    licenseType: "NFT License",
    description: "First-ever minted NFT in the Genesis Collection with unique provenance and rarity attributes.",
    registrationDate: "December 1, 2024",
    value: "5.0 ETH",
    type: "NFT",
    templateType: "Collectible NFT",
    templateId: "template-nft-1",
    protectionLevel: 100,
    metadata: {
      blockchain: "Ethereum",
      tokenId: "1",
      edition: "1/1",
      rarity: "Legendary",
    },
    owner: "0xdef0123456789abcdef0123456789abcdef012345",
    createdAt: "2024-12-01T00:00:00Z",
    numericValue: 5000,
  },
]

// Enhanced provenance data with comprehensive event tracking
interface ProvenanceData {
  assetId: string
  events: Array<{
    id: string
    type: "creation" | "transfer" | "license" | "modification" | "verification" | "dispute"
    title: string
    description: string
    from?: string
    to?: string
    date: string
    timestamp: string
    transactionHash?: string
    blockNumber?: number
    gasUsed?: number
    memo?: string
    verified: boolean
    location?: string
    ipAddress?: string
    userAgent?: string
    metadata?: Record<string, any>
  }>
}

export const mockProvenanceData: ProvenanceData[] = [
  {
    assetId: "1",
    events: [
      {
        id: "prov-1-1",
        type: "creation",
        title: "Asset Created",
        description: "Abstract Dimension #312 was originally created and registered on the blockchain",
        to: "0xArtist",
        date: "January 15, 2025",
        timestamp: "2025-01-15T10:30:00Z",
        transactionHash: "0xabc123def456789abc123def456789abc123def456789abc123def456789abc123",
        blockNumber: 19234567,
        gasUsed: 125000,
        verified: true,
        location: "San Francisco, CA",
        metadata: {
          creationTool: "Adobe Creative Suite",
          originalFormat: "PSD",
          colorSpace: "sRGB",
          dpi: 300,
        },
      },
      {
        id: "prov-1-2",
        type: "verification",
        title: "Community Verification",
        description: "Asset authenticity verified by community validators",
        date: "January 16, 2025",
        timestamp: "2025-01-16T14:20:00Z",
        verified: true,
        metadata: {
          validators: 15,
          consensus: "unanimous",
          verificationScore: 98.5,
        },
      },
      {
        id: "prov-1-3",
        type: "license",
        title: "License Agreement",
        description: "Creative Commons license applied with commercial usage rights",
        date: "January 18, 2025",
        timestamp: "2025-01-18T09:15:00Z",
        verified: true,
        memo: "Commercial usage permitted with attribution",
        metadata: {
          licenseType: "CC BY-SA 4.0",
          royaltyRate: "5%",
          territory: "Worldwide",
        },
      },
      {
        id: "prov-1-4",
        type: "transfer",
        title: "Ownership Transfer",
        description: "Asset transferred to new owner through marketplace transaction",
        from: "0xArtist",
        to: "CollectorDAO",
        date: "February 10, 2025",
        timestamp: "2025-02-10T16:45:00Z",
        transactionHash: "0xdef456789abc123def456789abc123def456789abc123def456789abc123def456",
        blockNumber: 19245678,
        gasUsed: 85000,
        verified: true,
        memo: "Purchased through Mediolano marketplace",
        metadata: {
          salePrice: "0.85 ETH",
          marketplace: "Mediolano",
          paymentMethod: "ETH",
        },
      },
    ],
  },
]

// Templates data
export const templates: Template[] = [
  {
    id: "template-art-1",
    name: "Digital Artwork",
    description: "Template for digital art, illustrations, and graphic design works",
    type: "Art",
    icon: "palette",
    popularity: 95,
    features: ["High-resolution image support", "Attribution tracking", "Derivative works control"],
    suitableFor: ["Digital artists", "Illustrators", "Graphic designers"],
    metadataFields: ["dimensions", "medium", "style", "colorPalette"],
  },
  {
    id: "template-audio-1",
    name: "Music Track",
    description: "Template for music tracks, songs, and audio compositions",
    type: "Audio",
    icon: "music",
    popularity: 87,
    features: ["Streaming rights management", "Sampling permissions", "Performance tracking"],
    suitableFor: ["Musicians", "Composers", "Sound designers"],
    metadataFields: ["duration", "bpm", "key", "genre", "instruments"],
  },
  {
    id: "template-video-1",
    name: "Video Content",
    description: "Template for video content, films, and multimedia productions",
    type: "Video",
    icon: "video",
    popularity: 83,
    features: ["Distribution rights", "Streaming permissions", "Content ID protection"],
    suitableFor: ["Filmmakers", "Content creators", "Production studios"],
    metadataFields: ["duration", "resolution", "format", "frameRate"],
  },
  {
    id: "template-software-1",
    name: "Software Application",
    description: "Template for software applications, code libraries, and algorithms",
    type: "Software",
    icon: "code",
    popularity: 82,
    features: ["Version control integration", "License enforcement", "API usage tracking"],
    suitableFor: ["Developers", "Software companies", "Open source projects"],
    metadataFields: ["language", "platform", "dependencies", "version"],
  },
  {
    id: "template-nft-1",
    name: "Collectible NFT",
    description: "Template for collectible NFTs with provenance tracking",
    type: "NFT",
    icon: "hexagon",
    popularity: 90,
    features: ["Blockchain verification", "Royalty enforcement", "Provenance tracking"],
    suitableFor: ["Digital artists", "Collectors", "NFT creators"],
    metadataFields: ["blockchain", "tokenId", "edition", "rarity"],
  },
  {
    id: "template-patent-1",
    name: "Technical Patent",
    description: "Template for technical patents and inventions",
    type: "Patent",
    icon: "lightbulb",
    popularity: 75,
    features: ["Prior art analysis", "Claim tracking", "Licensing management"],
    suitableFor: ["Inventors", "R&D departments", "Research institutions"],
    metadataFields: ["claims", "filingDate", "patentClass", "inventors"],
  },
  {
    id: "template-trademark-1",
    name: "Brand Trademark",
    description: "Template for brand trademarks and commercial identifiers",
    type: "Trademark",
    icon: "badge",
    popularity: 78,
    features: ["Brand protection", "Usage monitoring", "Infringement detection"],
    suitableFor: ["Brand owners", "Marketing agencies", "Legal firms"],
    metadataFields: ["brandName", "category", "jurisdiction", "registrationNumber"],
  },
  {
    id: "template-document-1",
    name: "Legal Document",
    description: "Template for legal documents, contracts, and agreements",
    type: "Document",
    icon: "file-text",
    popularity: 70,
    features: ["Version control", "Digital signatures", "Access control"],
    suitableFor: ["Legal professionals", "Business owners", "Consultants"],
    metadataFields: ["documentType", "jurisdiction", "parties", "effectiveDate"],
  },
]

// Collections data
export const collections: Collection[] = [
  {
    id: "col-1",
    name: "Dimensions",
    description: "A collection of abstract digital artworks exploring dimensional concepts and geometric patterns",
    assetCount: 3,
    totalValue: "2.55 ETH",
    creator: "0xArtist",
    creationDate: "December 10, 2024",
    coverImage: "/placeholder.svg?height=500&width=400&text=Dimensions+Collection",
    type: "Art",
  },
  {
    id: "col-2",
    name: "Cosmic Series",
    description: "Artworks depicting cosmic landscapes, celestial phenomena, and space exploration themes",
    assetCount: 2,
    totalValue: "1.95 ETH",
    creator: "CryptoCreator",
    creationDate: "January 15, 2025",
    coverImage: "/placeholder.svg?height=400&width=400&text=Cosmic+Collection",
    type: "Art",
  },
  {
    id: "col-3",
    name: "Neon Collection",
    description: "Cyberpunk-inspired artworks with neon aesthetics and futuristic urban landscapes",
    assetCount: 4,
    totalValue: "3.2 ETH",
    creator: "0xArtist",
    creationDate: "February 5, 2025",
    coverImage: "/placeholder.svg?height=380&width=400&text=Neon+Collection",
    type: "Art",
  },
  {
    id: "col-4",
    name: "Audio Collection",
    description: "Professional music tracks, sound compositions, and audio content for various media",
    assetCount: 2,
    totalValue: "1.2 ETH",
    creator: "AudioProducer",
    creationDate: "March 1, 2025",
    coverImage: "/placeholder.svg?height=400&width=400&text=Audio+Collection",
    type: "Audio",
  },
  {
    id: "col-5",
    name: "Tech Patents",
    description: "Technical patents for blockchain, AI, and emerging technology innovations",
    assetCount: 3,
    totalValue: "5.8 ETH",
    creator: "TechInnovator",
    creationDate: "January 20, 2025",
    coverImage: "/placeholder.svg?height=400&width=400&text=Tech+Patents",
    type: "Patent",
  },
  {
    id: "col-6",
    name: "Video Content",
    description: "Professional video productions, documentaries, and multimedia content",
    assetCount: 1,
    totalValue: "2.1 ETH",
    creator: "FilmmakerPro",
    creationDate: "February 15, 2025",
    coverImage: "/placeholder.svg?height=400&width=400&text=Video+Content",
    type: "Video",
  },
  {
    id: "col-7",
    name: "Software Assets",
    description: "Software applications, algorithms, and code libraries for various platforms",
    assetCount: 1,
    totalValue: "1.8 ETH",
    creator: "FinTechDev",
    creationDate: "March 10, 2025",
    coverImage: "/placeholder.svg?height=400&width=400&text=Software+Assets",
    type: "Software",
  },
  {
    id: "col-8",
    name: "Brand Assets",
    description: "Trademark registrations, brand identities, and commercial design assets",
    assetCount: 1,
    totalValue: "1.2 ETH",
    creator: "BrandDesigner",
    creationDate: "January 15, 2025",
    coverImage: "/placeholder.svg?height=400&width=400&text=Brand+Assets",
    type: "Trademark",
  },
  {
    id: "col-9",
    name: "Genesis Collection",
    description: "Rare and unique NFTs with historical significance and proven provenance",
    assetCount: 1,
    totalValue: "5.0 ETH",
    creator: "NFTArtist",
    creationDate: "December 1, 2024",
    coverImage: "/placeholder.svg?height=400&width=400&text=Genesis+Collection",
    type: "NFT",
  },
  {
    id: "col-10",
    name: "Legal Documents",
    description: "Professional legal templates, contracts, and business documentation",
    assetCount: 1,
    totalValue: "0.25 ETH",
    creator: "LegalEagle",
    creationDate: "March 5, 2025",
    coverImage: "/placeholder.svg?height=400&width=400&text=Legal+Documents",
    type: "Document",
  },
]

// Activity data
export const recentActivity: ActivityRecord[] = [
  {
    id: "act-1",
    type: "creation",
    assetId: "5",
    assetName: "Neon Genesis #78",
    user: "0xArtist",
    timestamp: "2 hours ago",
    details: "Created new digital artwork",
  },
  {
    id: "act-2",
    type: "license",
    assetId: "1",
    assetName: "Abstract Dimension #312",
    user: "Studio XYZ",
    timestamp: "1 day ago",
    details: "Purchased commercial license",
  },
  {
    id: "act-3",
    type: "transfer",
    assetId: "2",
    assetName: "Cosmic Voyager #89",
    user: "GalleryDAO",
    timestamp: "3 days ago",
    details: "Full ownership transfer",
  },
  {
    id: "act-4",
    type: "creation",
    assetId: "11",
    assetName: "Documentary: Future Cities",
    user: "FilmmakerPro",
    timestamp: "4 days ago",
    details: "Registered video content",
  },
  {
    id: "act-5",
    type: "license",
    assetId: "9",
    assetName: "Synthwave Beats Vol. 1",
    user: "MediaCompany",
    timestamp: "5 days ago",
    details: "Licensed for commercial use",
  },
  {
    id: "act-6",
    type: "creation",
    assetId: "15",
    assetName: "TechBrand™ Logo",
    user: "BrandDesigner",
    timestamp: "1 week ago",
    details: "Registered trademark",
  },
  {
    id: "act-7",
    type: "transfer",
    assetId: "16",
    assetName: "Rare Genesis NFT #001",
    user: "CollectorPro",
    timestamp: "2 weeks ago",
    details: "High-value NFT acquisition",
  },
]

// Helper functions with enhanced functionality
export const getAssetsByType = (type: IPType): Asset[] => {
  return assets.filter((asset) => asset.type === type)
}

export const getAssetsByTemplate = (templateId: string): Asset[] => {
  return assets.filter((asset) => asset.templateId === templateId)
}

export const getAssetsByCollection = (collectionName: string): Asset[] => {
  return assets.filter((asset) => asset.collection === collectionName)
}

export const getTemplateById = (templateId: string): Template | undefined => {
  return templates.find((template) => template.id === templateId)
}

export const getAssetById = (assetId: string): Asset | undefined => {
  return assets.find((asset) => asset.id === assetId)
}

export const getCollectionById = (collectionId: string): Collection | undefined => {
  return collections.find((collection) => collection.id === collectionId)
}

export const getCollectionByName = (name: string): Collection | undefined => {
  return collections.find((collection) => collection.name === name)
}

// Enhanced search functionality
export const searchAssets = (query: string, type?: IPType): Asset[] => {
  const filtered = assets.filter((asset) => {
    const matchesQuery =
      asset.name.toLowerCase().includes(query.toLowerCase()) ||
      asset.description.toLowerCase().includes(query.toLowerCase()) ||
      asset.creator.toLowerCase().includes(query.toLowerCase()) ||
      (asset.collection && asset.collection.toLowerCase().includes(query.toLowerCase()))

    const matchesType = !type || asset.type === type

    return matchesQuery && matchesType
  })

  return filtered
}

// Get trending assets (by recent activity and value)
export const getTrendingAssets = (limit = 6): Asset[] => {
  return assets
    .sort((a, b) => {
      // Sort by creation date (newer first) and value (higher first)
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      if (dateB !== dateA) return dateB - dateA
      return b.numericValue - a.numericValue
    })
    .slice(0, limit)
}

// Get featured collections
export const getFeaturedCollections = (limit = 4): Collection[] => {
  return collections
    .sort((a, b) => {
      // Sort by asset count and total value
      const valueA = Number.parseFloat(a.totalValue.split(" ")[0])
      const valueB = Number.parseFloat(b.totalValue.split(" ")[0])
      if (b.assetCount !== a.assetCount) return b.assetCount - a.assetCount
      return valueB - valueA
    })
    .slice(0, limit)
}

// Get user's assets
export const getUserAssets = (userAddress: string): Asset[] => {
  return assets.filter((asset) => asset.owner === userAddress)
}

// Get user's created assets
export const getUserCreatedAssets = (creatorName: string): Asset[] => {
  return assets.filter((asset) => asset.creator === creatorName)
}

// Asset statistics
export const getAssetStats = () => {
  const totalAssets = assets.length
  const totalValue = assets.reduce((sum, asset) => sum + asset.numericValue, 0)
  const avgValue = totalValue / totalAssets
  const verifiedAssets = assets.filter((asset) => asset.verified).length
  const verificationRate = (verifiedAssets / totalAssets) * 100

  const typeDistribution = assets.reduce(
    (acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + 1
      return acc
    },
    {} as Record<IPType, number>,
  )

  return {
    totalAssets,
    totalValue,
    avgValue,
    verifiedAssets,
    verificationRate,
    typeDistribution,
  }
}

export const getIconForType = (type: IPType): string => {
  const iconMap: Record<IPType, string> = {
    Art: "palette",
    Audio: "music",
    Video: "video",
    Document: "file-text",
    Patent: "lightbulb",
    Trademark: "badge",
    Software: "code",
    NFT: "hexagon",
    Other: "box",
  }

  return iconMap[type] || "box"
}

// Mock blockchain data for proof of ownership
export const getBlockchainData = (assetId: string) => {
  const asset = getAssetById(assetId)
  if (!asset) return null

  return {
    blockchain: "Ethereum",
    network: "Mainnet",
    tokenStandard: asset.type === "NFT" ? "ERC-721" : "ERC-1155",
    contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
    tokenId: assetId,
    blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
    transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    gasUsed: Math.floor(Math.random() * 100000) + 21000,
    timestamp: asset.createdAt,
  }
}

// Mock ownership history for provenance
export const getOwnershipHistory = (assetId: string) => {
  const asset = getAssetById(assetId)
  if (!asset) return []

  const history = [
    {
      event: "Asset Created",
      from: null,
      to: asset.creator,
      date: asset.registrationDate,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      verified: true,
      type: "creation" as const,
    },
  ]

  // Add some random ownership transfers for demonstration
  if (asset.owner !== asset.creator) {
    history.push({
      event: "Ownership Transfer",
      from: asset.creator,
      to: asset.owner,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      verified: true,
      type: "transfer" as const,
    })
  }

  return history.reverse() // Most recent first
}

// Get asset provenance data
export const getAssetProvenance = (assetId: string) => {
  return mockProvenanceData.find((data) => data.assetId === assetId)
}

// Calculate portfolio statistics with enhanced logic
export const calculatePortfolioStats = (assets: Asset[]): PortfolioStats => {
  const userAssets = assets.filter((a) => a.owner === "0x742d35Cc6634C0532925a3b844Bc454e4438f44e")
  const createdAssets = assets.filter((a) => a.creator === "0xArtist").length
  const totalValue = assets.reduce((sum, asset) => sum + asset.numericValue, 0)
  const avgProtectionLevel = Math.round(
    assets.reduce((sum, asset) => sum + (asset.protectionLevel || 0), 0) / assets.length,
  )

  // Count licensed assets (assets with commercial or educational licenses)
  const licensedAssets = assets.filter(
    (a) => a.licenseType.includes("Commercial") || a.licenseType.includes("Educational"),
  ).length

  return {
    totalAssets: assets.length,
    totalValue: `${(totalValue / 1000).toFixed(1)}k ETH`,
    createdAssets,
    licensedAssets,
    protectionLevel: avgProtectionLevel,
  }
}
