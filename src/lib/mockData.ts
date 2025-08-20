import { IPTypeDataType } from "@/components/ip-type-info";

export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  type: 'patent' | 'trademark' | 'copyright';
  status: 'pending' | 'registered' | 'licensed';
  creationDate: string;
  registrationDate?: string;
  owner: string;
  licenses: License[];
  views: number;
  likes: number;
}

export interface License {
  id: string;
  assetId: string;
  licensee: string;
  startDate: string;
  endDate: string;
  terms: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  owner: string;
  assets: string[]; // Array of asset IDs
  creationDate: string;
  lastUpdated: string;
}

export const mockUser: User = {
  id: '1',
  name: 'Alice Johnson',
  email: 'alice@example.com',
  walletAddress: '0x1234...5678'
};

export const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Revolutionary AI Algorithm',
    description: 'A groundbreaking AI algorithm for natural language processing',
    type: 'patent',
    status: 'registered',
    creationDate: '2023-01-15',
    registrationDate: '2023-03-01',
    owner: '0x1234...5678',
    licenses: [
      {
        id: 'L1',
        assetId: '1',
        licensee: '0xabcd...efgh',
        startDate: '2023-04-01',
        endDate: '2024-03-31',
        terms: 'Non-exclusive license for commercial use'
      }
    ],
    views: 1200,
    likes: 450
  },
  {
    id: '2',
    name: 'Mediolano Logo',
    description: 'Official logo of Mediolano platform',
    type: 'trademark',
    status: 'registered',
    creationDate: '2023-02-01',
    registrationDate: '2023-04-15',
    owner: '0x1234...5678',
    licenses: [],
    views: 980,
    likes: 320
  },
  {
    id: '3',
    name: 'Decentralized Storage Whitepaper',
    description: 'Technical whitepaper for a new decentralized storage solution',
    type: 'copyright',
    status: 'pending',
    creationDate: '2023-05-10',
    owner: '0x1234...5678',
    licenses: [],
    views: 1500,
    likes: 600
  },
  {
    id: '4',
    name: 'Blockchain-Based Supply Chain',
    description: 'A novel approach to supply chain management using blockchain technology',
    type: 'patent',
    status: 'registered',
    creationDate: '2023-03-20',
    registrationDate: '2023-06-01',
    owner: '0x9876...5432',
    licenses: [],
    views: 850,
    likes: 280
  }
];







export const mockCollections: Collection[] = [
  {
    id: '1',
    name: 'TechPatents2023',
    description: 'A collection of cutting-edge technology patents',
    owner: '0x1234...5678',
    assets: ['1', '4'],
    creationDate: '2023-01-01',
    lastUpdated: '2023-06-15'
  },
  {
    id: '2',
    name: 'ArtisticWorks',
    description: 'Various artistic creations and their associated copyrights',
    owner: '0xabcd...efgh',
    assets: ['2'],
    creationDate: '2023-02-15',
    lastUpdated: '2023-06-10'
  },
  {
    id: '3',
    name: 'MusicCatalog',
    description: 'A comprehensive collection of music copyrights',
    owner: '0x9876...5432',
    assets: ['3'],
    creationDate: '2023-03-01',
    lastUpdated: '2023-06-20'
  }
];


// Mock data for each IP type
export const mockIPTypeData: Record<string, IPTypeDataType> = {
  Audio: {
    duration: "3:45",
    genre: "Electronic",
    bpm: 128,
    key: "C Minor",
    releaseDate: "2025-01-15",
    audioFormat: "WAV",
    sampleRate: "48kHz",
    channels: 2,
    composer: "John Doe",
    publisher: "Electronic Music Ltd",
    isrc: "USRC17607839",
    lyrics: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    previewUrl: "/placeholder.mp3",
  },
  Art: {
    medium: "Digital",
    dimensions: "3000x2000 px",
    style: "Abstract",
    colorPalette: ["#FF5733", "#33FF57", "#3357FF", "#F3FF33"],
    creationDate: "2024-12-10",
    software: "Adobe Photoshop",
    printEditions: 10,
    exhibition: "Digital Art Expo 2025",
    materials: ["Digital Canvas", "Procedural Textures"],
    technique: "Digital Painting",
  },
  Documents: {
    documentType: "Legal Agreement",
    pageCount: 24,
    wordCount: 5432,
    language: "English",
    creationDate: "2025-02-20",
    lastModified: "2025-03-05",
    signatories: ["Alice Corp", "Bob LLC"],
    jurisdiction: "Delaware, USA",
    fileFormat: "PDF",
    keywords: ["contract", "agreement", "terms", "conditions"],
  },
  NFT: {
    blockchain: "Ethereum",
    tokenStandard: "ERC-721",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    tokenId: "42",
    mintDate: "2025-01-30",
    editions: 1,
    rarity: "Legendary",
    traits: [
      { trait_type: "Background", value: "Cosmic" },
      { trait_type: "Character", value: "Robot" },
      { trait_type: "Accessory", value: "Laser Sword" },
    ],
    marketplace: "OpenSea",
    previousOwners: 3,
  },
  Video: {
    duration: "12:34",
    resolution: "4K (3840x2160)",
    frameRate: "60 fps",
    codec: "H.265/HEVC",
    director: "Jane Smith",
    releaseDate: "2025-02-15",
    genre: "Sci-Fi",
    cast: ["Actor One", "Actor Two", "Actor Three"],
    aspectRatio: "16:9",
    language: "English",
    subtitles: ["English", "Spanish", "French"],
    previewUrl: "/placeholder.mp4",
  },
  Patents: {
    patentType: "Utility",
    filingDate: "2024-11-05",
    publicationDate: "2025-05-10",
    grantDate: "2025-08-15",
    patentNumber: "US 12,345,678",
    inventors: ["Inventor One", "Inventor Two"],
    assignee: "Tech Innovations Inc.",
    jurisdiction: "United States",
    classification: "G06F 21/00",
    status: "Granted",
    expirationDate: "2045-11-05",
    claims: 15,
  },
  Posts: {
    platform: "Medium",
    publicationDate: "2025-03-01",
    wordCount: 1250,
    readTime: "5 min",
    category: "Technology",
    tags: ["blockchain", "crypto", "web3", "nft"],
    views: 12500,
    likes: 843,
    comments: 56,
    url: "https://medium.com/@author/article-title",
    lastUpdated: "2025-03-02",
  },
  Publications: {
    publicationType: "Book",
    publisher: "Tech Publishing House",
    publicationDate: "2025-01-20",
    isbn: "978-3-16-148410-0",
    edition: "First Edition",
    pageCount: 320,
    language: "English",
    genre: "Non-fiction",
    format: ["Hardcover", "eBook", "Audiobook"],
    contributors: ["Editor: Jane Editor", "Illustrator: John Artist"],
    reviews: 4.8,
  },
  RWA: {
    assetType: "Real Estate",
    location: "123 Main St, New York, NY",
    acquisitionDate: "2024-12-15",
    value: "$1,250,000",
    tokenizationDate: "2025-01-10",
    fractionalized: true,
    totalShares: 1000,
    regulatoryCompliance: ["SEC", "FINRA"],
    insurancePolicy: "POL-12345-XYZ",
    custodian: "Digital Asset Trust",
    lastValuation: "2025-03-01",
    appreciationRate: "5.2% annually",
  },
  Software: {
    softwareType: "Mobile Application",
    version: "2.1.0",
    releaseDate: "2025-02-10",
    programmingLanguages: ["Swift", "Kotlin"],
    platforms: ["iOS", "Android"],
    license: "Proprietary",
    dependencies: ["React Native", "Firebase", "Redux"],
    apiDocumentation: "https://api.example.com/docs",
    sourceCodeRepository: "https://github.com/example/app",
    buildInstructions: "See README.md in repository",
    features: ["Authentication", "Push Notifications", "Offline Mode"],
  },
  Custom: {
    customType: "Mixed Media Installation",
    dimensions: "3m x 4m x 2.5m",
    materials: ["Digital Displays", "Sculptural Elements", "Interactive Sensors"],
    creationDate: "2025-01-25",
    exhibition: "Future Art Biennale 2025",
    interactivity: true,
    powerRequirements: "220V, 15A",
    installationGuide: "Available upon request",
    maintenanceSchedule: "Quarterly",
    components: ["Visual Display", "Audio System", "Motion Sensors", "Custom Software"],
  },
  Generic: {
    type: "Generic IP",
    registrationDate: "2025-01-01",
    createdAt: "2024-12-25",
    creator: "Unknown Creator",
    format: "Digital",
    license: "Standard",
    notes: "Generic metadata for fallback purposes",
  },
};