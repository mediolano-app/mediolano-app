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

