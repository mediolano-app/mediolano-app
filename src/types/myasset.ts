// Base Asset interface
export interface Asset {
  id: string;
  title: string;
  author: string;
  description: string;
  type: string;
  mediaUrl: string;
  externalUrl: string;
  licenseType: string;
  licenseDetails: string;
  licenseDuration: string;
  licenseTerritory: string;
  version: string;
  commercialUse: boolean;
  modifications: boolean;
  attribution: boolean;
  registrationDate: string;
  collection: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'boost_number' | 'boost_percentage' | 'number' | 'date';
  max_value?: number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  external_url?: string;
  image: string;
  animation_url?: string;
  attributes: NFTAttribute[];
  background_color?: string;
  youtube_url?: string;
}

export interface NFTAsset extends Asset {
  tokenId: string;
  contractAddress: string;
  owner: string;
  blockchain: 'ethereum' | 'starknet' | 'polygon';
  standard: 'ERC721' | 'ERC1155';
  metadata?: NFTMetadata;
  attributes?: NFTAttribute[];
  name: string;
  imageUrl: string;
  createdAt: string | Date;
  lastTransferredts: string | Date;
}

export interface UserPortfolio {
  address: string;
  totalAssets: number;
  assets: (Asset | NFTAsset)[];
  nftAssets: NFTAsset[];
  generalAssets: Asset[];
  loading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

export interface MyAssetsProps {
  userAddress: string;
  contractAddress: string;
  onAssetSelect?: (asset: Asset | NFTAsset) => void;
  onPortfolioUpdate?: (portfolio: UserPortfolio) => void;
  className?: string;
  itemsPerPage?: number;
  network?: 'mainnet' | 'goerli' | 'sepolia';
  rpcUrl?: string;
  assetType?: 'all' | 'nft' | 'general';
}

export interface StarknetConfig {
  network: 'mainnet' | 'goerli' | 'sepolia';
  rpcUrl?: string;
  providerUrl?: string;
  chainId?: string;
}

// Raw data interface for creating assets
export interface RawAssetData {
  id?: string;
  title: string;
  author: string;
  description: string;
  type: string;
  mediaUrl: string;
  externalUrl?: string;
  licenseType?: string;
  licenseDetails?: string;
  licenseDuration?: string;
  licenseTerritory?: string;
  version?: string;
  commercialUse?: boolean;
  modifications?: boolean;
  attribution?: boolean;
  registrationDate?: string;
  collection?: string;
}

// Raw NFT data interface
export interface RawNFTData extends RawAssetData {
  tokenId: string;
  contractAddress: string;
  owner: string;
  blockchain?: 'ethereum' | 'starknet' | 'polygon';
  standard?: 'ERC721' | 'ERC1155';
  metadata?: NFTMetadata;
  attributes?: NFTAttribute[];
  name?: string;
  imageUrl?: string;
  createdAt?: string | Date;
  lastTransferredts?: string | Date;
}

// Network configuration
export const STARKNET_NETWORKS = {
  mainnet: {
    rpcUrl: 'https://starknet-mainnet.public.blastapi.io',
    chainId: '0x534e5f4d41494e',
    name: 'Starknet Mainnet'
  },
  goerli: {
    rpcUrl: 'https://starknet-goerli.public.blastapi.io', 
    chainId: '0x534e5f474f45524c49',
    name: 'Starknet Goerli'
  },
  sepolia: {
    rpcUrl: 'https://starknet-sepolia.public.blastapi.io',
    chainId: '0x534e5f5345504f4c4941',
    name: 'Starknet Sepolia'
  }
} as const;

// Improved type guards with proper type checking
export const isNFTAsset = (asset: Asset | NFTAsset): asset is NFTAsset => {
  if (!asset || typeof asset !== 'object') return false;
  
  // Check for NFT-specific properties
  const hasNFTProperties = 'tokenId' in asset && 
                          'contractAddress' in asset && 
                          'owner' in asset &&
                          'name' in asset &&
                          'imageUrl' in asset &&
                          'createdAt' in asset &&
                          'lastTransferredts' in asset;
  
  return hasNFTProperties;
};

export const isGeneralAsset = (asset: Asset | NFTAsset): asset is Asset => {
  if (!asset || typeof asset !== 'object') return false;
  
  // Check that it's NOT an NFT asset
  const isNotNFT = !('tokenId' in asset) || 
                   !('contractAddress' in asset) ||
                   !('owner' in asset);
  
  // Ensure it has the basic Asset properties
  const hasAssetProperties = 'id' in asset && 
                            'title' in asset && 
                            'author' in asset && 
                            'description' in asset;
  
  return isNotNFT && hasAssetProperties;
};

// Helper function to validate asset type
export const validateAssetType = (asset: unknown): asset is Asset | NFTAsset => {
  if (!asset || typeof asset !== 'object') return false;
  
  const requiredFields = ['id', 'title', 'author', 'description', 'type', 'mediaUrl'];
  return requiredFields.every(field => field in asset);
};

// Helper function to convert general asset properties to NFT asset
export const mapToNFTAsset = (asset: Asset, nftData: Partial<Pick<NFTAsset, 'tokenId' | 'contractAddress' | 'owner' | 'blockchain' | 'standard' | 'name' | 'imageUrl' | 'createdAt' | 'lastTransferredts'>>): NFTAsset => {
  return {
    ...asset,
    tokenId: nftData.tokenId || '',
    contractAddress: nftData.contractAddress || '',
    owner: nftData.owner || '',
    blockchain: nftData.blockchain || 'starknet',
    standard: nftData.standard || 'ERC721',
    name: nftData.name || asset.title,
    imageUrl: nftData.imageUrl || asset.mediaUrl,
    createdAt: nftData.createdAt || asset.registrationDate,
    lastTransferredts: nftData.lastTransferredts || asset.registrationDate,
  };
};

// Generate unique ID for assets
const generateAssetId = (): string => {
  return `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create Asset from raw data with defaults and validation
export const createAssetFromData = (data: RawAssetData): Asset => {
  // Validate required fields
  if (!data.title || !data.author || !data.description || !data.type || !data.mediaUrl) {
    throw new Error('Missing required fields: title, author, description, type, and mediaUrl are required');
  }

  const currentDate = new Date().toISOString();

  return {
    id: data.id || generateAssetId(),
    title: data.title.trim(),
    author: data.author.trim(),
    description: data.description.trim(),
    type: data.type.toLowerCase(),
    mediaUrl: data.mediaUrl.trim(),
    externalUrl: data.externalUrl?.trim() || '',
    licenseType: data.licenseType || LicenseType.CC_BY,
    licenseDetails: data.licenseDetails || '',
    licenseDuration: data.licenseDuration || 'perpetual',
    licenseTerritory: data.licenseTerritory || 'worldwide',
    version: data.version || '1.0',
    commercialUse: data.commercialUse ?? true,
    modifications: data.modifications ?? true,
    attribution: data.attribution ?? true,
    registrationDate: data.registrationDate || currentDate,
    collection: data.collection || 'default'
  };
};

// Create NFTAsset from raw data with defaults and validation
export const createNFTAssetFromData = (data: RawNFTData): NFTAsset => {
  // Validate NFT-specific required fields
  if (!data.tokenId || !data.contractAddress || !data.owner) {
    throw new Error('Missing required NFT fields: tokenId, contractAddress, and owner are required');
  }

  // Create base asset first
  const baseAsset = createAssetFromData(data);
  const currentDate = new Date().toISOString();

  return {
    ...baseAsset,
    tokenId: data.tokenId.trim(),
    contractAddress: data.contractAddress.trim(),
    owner: data.owner.trim(),
    blockchain: data.blockchain || 'starknet',
    standard: data.standard || 'ERC721',
    metadata: data.metadata,
    attributes: data.attributes || [],
    name: data.name || data.title,
    imageUrl: data.imageUrl || data.mediaUrl,
    createdAt: data.createdAt || currentDate,
    lastTransferredts: data.lastTransferredts || currentDate
  };
};

// Validate raw asset data
export const validateRawAssetData = (data: unknown): data is RawAssetData => {
  if (!data || typeof data !== 'object') return false;
  
  const obj = data as unknown as Record<string, unknown>;
  
  // Check required fields
  const requiredFields = ['title', 'author', 'description', 'type', 'mediaUrl'];
  const hasRequiredFields = requiredFields.every(field => 
    field in obj && typeof obj[field] === 'string' && obj[field] !== ''
  );
  
  return hasRequiredFields;
};

// Validate raw NFT data
export const validateRawNFTData = (data: unknown): data is RawNFTData => {
  if (!validateRawAssetData(data)) return false;
  
  const obj = data as unknown as Record<string, unknown>;
  
  // Check additional NFT-specific required fields
  const nftRequiredFields = ['tokenId', 'contractAddress', 'owner'];
  const hasNFTFields = nftRequiredFields.every(field => 
    field in obj && typeof obj[field] === 'string' && obj[field] !== ''
  );
  
  return hasNFTFields;
};

// Asset type enumeration
export enum AssetType {
  GENERAL = 'general',
  NFT = 'nft',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  MODEL_3D = '3d-model',
  TEXT = 'text',
  CODE = 'code'
}

// License type enumeration
export enum LicenseType {
  CC0 = 'CC0',
  CC_BY = 'CC BY',
  CC_BY_SA = 'CC BY-SA',
  CC_BY_NC = 'CC BY-NC',
  CC_BY_ND = 'CC BY-ND',
  CC_BY_NC_SA = 'CC BY-NC-SA',
  CC_BY_NC_ND = 'CC BY-NC-ND',
  PROPRIETARY = 'Proprietary',
  CUSTOM = 'Custom',
  MIT = 'MIT',
  GPL = 'GPL',
  APACHE = 'Apache'
}

// Network type for better type safety
export type StarknetNetwork = keyof typeof STARKNET_NETWORKS;

// Utility function to get network config
export const getNetworkConfig = (network: StarknetNetwork) => {
  return STARKNET_NETWORKS[network];
};

// Error types for better error handling
export interface AssetError {
  code: string;
  message: string;
  details?: unknown;
}

export interface PortfolioError extends AssetError {
  address: string;
  timestamp: Date;
}