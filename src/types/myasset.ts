
export enum AssetType {
  GENERAL = 'general',
  NFT = 'nft',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  MODEL_3D = '3d-model',
  TEXT = 'text',
  CODE = 'code',
  GAME = 'game',
  ANIMATION = 'animation',
  FONT = 'font',
  TEMPLATE = 'template'
}

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
  APACHE = 'Apache',
  BSD = 'BSD',
  COMMERCIAL = 'Commercial'
}

export enum Blockchain {
  STARKNET = 'starknet',
}

export enum TokenStandard {
  ERC721 = 'ERC-721',
  ERC1155 = 'ERC-1155',
  SRC5 = 'SRC-5' // Starknet standard
}

export enum AssetStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export enum SortField {
  TITLE = 'title',
  ID = 'id',
  REGISTRATION_DATE = 'registrationDate',
  AUTHOR = 'author',
  TYPE = 'type',
  CREATED_AT = 'createdAt',
  LAST_UPDATED = 'lastUpdated',
  TOKEN_ID = 'tokenId'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DateLike = string | Date | number;
export type Address = string; // Ethereum/Starknet address
export type TokenId = string | number;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ============================================================================
// NFT-SPECIFIC INTERFACES
// ============================================================================

export interface NFTAttribute {
  trait_type: string;
  value: string | number | boolean;
  display_type?: 'boost_number' | 'boost_percentage' | 'number' | 'date' | 'string';
  max_value?: number;
  rarity_score?: number;
  rarity_rank?: number;
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
  // Additional metadata fields
  artist?: string;
  collection_name?: string;
  edition?: number;
  total_editions?: number;
  created_date?: DateLike;
  [key: string]: unknown; // Allow additional properties
}

export interface CollectionInfo {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  external_url?: string;
  banner_image?: string;
  featured_image?: string;
  large_image?: string;
  total_supply?: number;
  floor_price?: number;
  volume_traded?: number;
  verified?: boolean;
}

export interface TokenOwnership {
  owner: Address;
  quantity?: number; // For ERC1155
  acquired_date?: DateLike;
  acquisition_price?: number;
  acquisition_currency?: string;
}

export interface TokenTransaction {
  hash: string;
  type: 'mint' | 'transfer' | 'sale' | 'burn';
  from_address?: Address;
  to_address?: Address;
  price?: number;
  currency?: string;
  timestamp: DateLike;
  block_number?: number;
}

// ============================================================================
// STARKNET-SPECIFIC INTERFACES
// ============================================================================

export interface StarknetConfig {
  contractAddress: Address;
  providerUrl: string;
  networkId?: string;
  chainId?: string;
}

export interface StarknetContractInfo {
  address: Address;
  class_hash?: string;
  implementation?: Address;
  proxy_type?: 'transparent' | 'uups' | 'beacon';
  verified?: boolean;
  abi?: any[];
}

export interface ByteArrayData {
  data: string[];
  pending_word: string;
  pending_word_len: number;
}

// ============================================================================
// BASE ASSET INTERFACE (ENHANCED)
// ============================================================================

export interface Asset {
  // Core identification
  id: string;
  title: string;
  author: string;
  description: string;
  type: AssetType;
  
  // Media and URLs
  mediaUrl: string;
  externalUrl?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  
  // License information
  licenseType: LicenseType;
  licenseDetails?: string;
  licenseDuration?: string;
  licenseTerritory?: string;
  licenseUrl?: string;
  
  // Permissions
  commercialUse: boolean;
  modifications: boolean;
  attribution: boolean;
  redistribution?: boolean;
  
  // Versioning and metadata
  version: string;
  tags?: string[];
  categories?: string[];
  keywords?: string[];
  
  // Timestamps
  registrationDate: DateLike;
  createdAt?: DateLike;
  updatedAt?: DateLike;
  
  // Organization
  collection: string;
  status?: AssetStatus;
  
  // File information
  fileSize?: number;
  fileName?: string;
  mimeType?: string;
  checksum?: string;
  
  // Additional metadata
  metadata?: Record<string, unknown>;
  customFields?: Record<string, unknown>;
}

// ============================================================================
// NFT ASSET INTERFACE (ENHANCED)
// ============================================================================

export interface NFTAsset extends Asset {
  // NFT-specific core fields
  tokenId: TokenId;
  contractAddress: Address;
  blockchain: Blockchain;
  tokenStandard: TokenStandard;
  
  // Ownership
  owner: Address;
  ownershipHistory?: TokenOwnership[];
  
  // NFT metadata
  name: string;
  imageUrl: string;
  metadata?: NFTMetadata;
  attributes?: NFTAttribute[];
  
  // Collection information
  collectionInfo?: CollectionInfo;
  
  // Timestamps (NFT-specific)
  mintedAt?: DateLike;
  lastTransferredAt?: DateLike;
  
  // Transaction history
  transactionHistory?: TokenTransaction[];
  
  // Market data
  currentPrice?: number;
  currency?: string;
  lastSalePrice?: number;
  floorPrice?: number;
  
  // Verification and trust
  verified?: boolean;
  suspicious?: boolean;
  
  // Starknet-specific
  starknetInfo?: {
    classHash?: string;
    tokenUri?: string;
    contractVersion?: string;
  };
  
  // Rarity and traits
  rarityScore?: number;
  rarityRank?: number;
  totalSupply?: number;
  
  // IPFS and storage
  ipfsHash?: string;
  arweaveId?: string;
  storageType?: 'ipfs' | 'arweave' | 'centralized' | 'hybrid';
}

// ============================================================================
// PORTFOLIO AND USER INTERFACES
// ============================================================================

export interface UserPortfolio {
  address: Address;
  totalAssets: number;
  assets: (Asset | NFTAsset)[];
  nftAssets: NFTAsset[];
  generalAssets: Asset[];
  
  // State management
  loading: boolean;
  error: string | null;
  lastUpdated?: Date;
  
  // Statistics
  totalValue?: number;
  currency?: string;
  assetsByType?: Record<AssetType, number>;
  assetsByCollection?: Record<string, number>;
  
  // Configuration
  config?: {
    autoRefresh?: boolean;
    refreshInterval?: number;
    includeHidden?: boolean;
    sortPreference?: {
      field: SortField;
      order: SortOrder;
    };
  };
}

export interface AssetFilter {
  assetType?: AssetType | 'all';
  blockchain?: Blockchain[];
  collection?: string[];
  author?: string[];
  licenseType?: LicenseType[];
  status?: AssetStatus[];
  verified?: boolean;
  dateRange?: {
    from?: DateLike;
    to?: DateLike;
  };
  priceRange?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  hasAttributes?: boolean;
  searchTerm?: string;
}

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export interface PaginationConfig {
  page: number;
  itemsPerPage: number;
  totalItems?: number;
  totalPages?: number;
}

// ============================================================================
// COMPONENT PROPS INTERFACES
// ============================================================================

export interface MyAssetsProps {
  userAddress: Address;
  onAssetSelect?: (asset: Asset | NFTAsset) => void;
  onPortfolioUpdate?: (portfolio: UserPortfolio) => void;
  className?: string;
  
  // Configuration
  itemsPerPage?: number;
  assetType?: AssetType | 'all';
  assets?: (Asset | NFTAsset)[];
  
  // Starknet integration
  starknetConfig?: StarknetConfig;
  enableStarknetFetch?: boolean;
  
  // UI customization
  showFilters?: boolean;
  showSearch?: boolean;
  showSorting?: boolean;
  showPagination?: boolean;
  gridColumns?: 1 | 2 | 3 | 4 | 5 | 6;
  
  // Event handlers
  onError?: (error: AssetError) => void;
  onLoadingChange?: (loading: boolean) => void;
  
  // Feature flags
  enableLazyLoading?: boolean;
  enableVirtualization?: boolean;
  enableInfiniteScroll?: boolean;
}

export interface EnhancedMyAssetsProps extends MyAssetsProps {
  // Advanced filtering
  filters?: AssetFilter;
  onFiltersChange?: (filters: AssetFilter) => void;
  
  // Advanced sorting
  sortConfig?: SortConfig;
  onSortChange?: (sort: SortConfig) => void;
  
  // Advanced pagination
  paginationConfig?: PaginationConfig;
  onPaginationChange?: (pagination: PaginationConfig) => void;
  
  // Bulk operations
  enableBulkSelect?: boolean;
  selectedAssets?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  
  // View options
  viewMode?: 'grid' | 'list' | 'table';
  density?: 'compact' | 'comfortable' | 'spacious';
}

// ============================================================================
// RAW DATA INTERFACES FOR CREATION
// ============================================================================

export interface RawAssetData {
  id?: string;
  title: string;
  author: string;
  description: string;
  type: AssetType | string;
  mediaUrl: string;
  externalUrl?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  
  // License
  licenseType?: LicenseType | string;
  licenseDetails?: string;
  licenseDuration?: string;
  licenseTerritory?: string;
  licenseUrl?: string;
  
  // Permissions
  commercialUse?: boolean;
  modifications?: boolean;
  attribution?: boolean;
  redistribution?: boolean;
  
  // Metadata
  version?: string;
  tags?: string[];
  categories?: string[];
  keywords?: string[];
  registrationDate?: DateLike;
  createdAt?: DateLike;
  collection?: string;
  status?: AssetStatus;
  
  // File info
  fileSize?: number;
  fileName?: string;
  mimeType?: string;
  checksum?: string;
  
  // Custom fields
  metadata?: Record<string, unknown>;
  customFields?: Record<string, unknown>;
}

export interface RawNFTData extends RawAssetData {
  // Required NFT fields
  tokenId: TokenId;
  contractAddress: Address;
  owner: Address;
  
  // NFT-specific optional fields
  blockchain?: Blockchain | string;
  tokenStandard?: TokenStandard | string;
  name?: string;
  imageUrl?: string;
  mintedAt?: DateLike;
  lastTransferredAt?: DateLike;
  
  // Metadata
  nftMetadata?: NFTMetadata;
  attributes?: NFTAttribute[];
  collectionInfo?: Partial<CollectionInfo>;
  
  // Market data
  currentPrice?: number;
  currency?: string;
  lastSalePrice?: number;
  
  // Verification
  verified?: boolean;
  suspicious?: boolean;
  
  // Rarity
  rarityScore?: number;
  rarityRank?: number;
  totalSupply?: number;
  
  // Storage
  ipfsHash?: string;
  arweaveId?: string;
  storageType?: string;
  
  // Starknet-specific
  starknetInfo?: {
    classHash?: string;
    tokenUri?: string;
    contractVersion?: string;
  };
}

// ============================================================================
// ERROR HANDLING INTERFACES
// ============================================================================

export interface AssetError {
  code: string;
  message: string;
  details?: unknown;
  timestamp?: Date;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface PortfolioError extends AssetError {
  address: Address;
  portfolioContext?: {
    totalAssets?: number;
    lastSuccessfulUpdate?: Date;
    failedOperations?: string[];
  };
}

export interface ValidationError extends AssetError {
  field?: string;
  value?: unknown;
  expectedType?: string;
  constraints?: Record<string, unknown>;
}

export interface NetworkError extends AssetError {
  network?: Blockchain;
  endpoint?: string;
  statusCode?: number;
  retryAfter?: number;
}

// ============================================================================
// TYPE GUARDS (ENHANCED)
// ============================================================================

export const isNFTAsset = (asset: unknown): asset is NFTAsset => {
  if (!asset || typeof asset !== 'object') return false;
  
  const obj = asset as Record<string, unknown>;
  
  // Check for required NFT-specific properties
  const requiredNFTFields = [
    'tokenId', 'contractAddress', 'owner', 'blockchain', 
    'tokenStandard', 'name', 'imageUrl'
  ];
  
  return requiredNFTFields.every(field => 
    field in obj && obj[field] !== undefined && obj[field] !== null
  );
};

export const isGeneralAsset = (asset: unknown): asset is Asset => {
  if (!asset || typeof asset !== 'object') return false;
  
  const obj = asset as Record<string, unknown>;
  
  // Check that it has basic Asset properties but NOT NFT-specific ones
  const hasAssetProperties = [
    'id', 'title', 'author', 'description', 'type', 'mediaUrl'
  ].every(field => field in obj && obj[field] !== undefined);
  
  const isNotNFT = !('tokenId' in obj) || !('contractAddress' in obj) || !('owner' in obj);
  
  return hasAssetProperties && isNotNFT;
};

export const isValidAssetType = (type: unknown): type is AssetType => {
  return typeof type === 'string' && Object.values(AssetType).includes(type as AssetType);
};

export const isValidBlockchain = (blockchain: unknown): blockchain is Blockchain => {
  return typeof blockchain === 'string' && Object.values(Blockchain).includes(blockchain as Blockchain);
};

export const isValidTokenStandard = (standard: unknown): standard is TokenStandard => {
  return typeof standard === 'string' && Object.values(TokenStandard).includes(standard as TokenStandard);
};

export const isValidLicenseType = (license: unknown): license is LicenseType => {
  return typeof license === 'string' && Object.values(LicenseType).includes(license as LicenseType);
};

export const isValidAddress = (address: unknown): address is Address => {
  if (typeof address !== 'string') return false;
  
  // Basic validation for Ethereum/Starknet addresses
  const ethPattern = /^0x[a-fA-F0-9]{40}$/;
  const starknetPattern = /^0x[a-fA-F0-9]{1,64}$/;
  
  return ethPattern.test(address) || starknetPattern.test(address);
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export const validateAssetData = (data: unknown): data is RawAssetData => {
  if (!data || typeof data !== 'object') return false;
  
  const obj = data as unknown as Record<string, unknown>;
  
  // Check required fields
  const requiredFields = ['title', 'author', 'description', 'type', 'mediaUrl'];
  const hasRequiredFields = requiredFields.every(field => 
    field in obj && typeof obj[field] === 'string' && obj[field] !== ''
  );
  
  // Validate type if provided
  const hasValidType = !obj.type || isValidAssetType(obj.type);
  
  return hasRequiredFields && hasValidType;
};

export const validateNFTData = (data: unknown): data is RawNFTData => {
  if (!validateAssetData(data)) return false;
  
  const obj = data as unknown as Record<string, unknown>;
  
  // Check additional NFT-specific required fields
  const nftRequiredFields = ['tokenId', 'contractAddress', 'owner'];
  const hasNFTFields = nftRequiredFields.every(field => 
    field in obj && obj[field] !== undefined && obj[field] !== null
  );
  
  // Validate blockchain and standard if provided
  const hasValidBlockchain = !obj.blockchain || isValidBlockchain(obj.blockchain);
  const hasValidStandard = !obj.tokenStandard || isValidTokenStandard(obj.tokenStandard);
  const hasValidOwner = !obj.owner || isValidAddress(obj.owner);
  const hasValidContract = !obj.contractAddress || isValidAddress(obj.contractAddress);
  
  return hasNFTFields && hasValidBlockchain && hasValidStandard && hasValidOwner && hasValidContract;
};

// ============================================================================
// FACTORY FUNCTIONS (ENHANCED)
// ============================================================================

const generateAssetId = (): string => {
  return `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const normalizeDate = (date: DateLike): string => {
  if (date instanceof Date) return date.toISOString();
  if (typeof date === 'number') return new Date(date).toISOString();
  if (typeof date === 'string') {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  }
  return new Date().toISOString();
};

export const createAssetFromData = (data: RawAssetData): Asset => {
  if (!validateAssetData(data)) {
    throw new ValidationError({
      code: 'INVALID_ASSET_DATA',
      message: 'Invalid asset data provided',
      details: data
    });
  }

  const currentDate = new Date().toISOString();

  return {
    id: data.id || generateAssetId(),
    title: data.title.trim(),
    author: data.author.trim(),
    description: data.description.trim(),
    type: isValidAssetType(data.type) ? data.type : AssetType.GENERAL,
    
    // URLs
    mediaUrl: data.mediaUrl.trim(),
    externalUrl: data.externalUrl?.trim() || '',
    thumbnailUrl: data.thumbnailUrl?.trim(),
    previewUrl: data.previewUrl?.trim(),
    
    // License
    licenseType: isValidLicenseType(data.licenseType) ? data.licenseType : LicenseType.CC_BY,
    licenseDetails: data.licenseDetails?.trim() || '',
    licenseDuration: data.licenseDuration || 'perpetual',
    licenseTerritory: data.licenseTerritory || 'worldwide',
    licenseUrl: data.licenseUrl?.trim(),
    
    // Permissions
    commercialUse: data.commercialUse ?? true,
    modifications: data.modifications ?? true,
    attribution: data.attribution ?? true,
    redistribution: data.redistribution ?? true,
    
    // Metadata
    version: data.version || '1.0',
    tags: data.tags || [],
    categories: data.categories || [],
    keywords: data.keywords || [],
    
    // Timestamps
    registrationDate: normalizeDate(data.registrationDate || currentDate),
    createdAt: data.createdAt ? normalizeDate(data.createdAt) : undefined,
    updatedAt: currentDate,
    
    // Organization
    collection: data.collection || 'default',
    status: data.status || AssetStatus.ACTIVE,
    
    // File info
    fileSize: data.fileSize,
    fileName: data.fileName,
    mimeType: data.mimeType,
    checksum: data.checksum,
    
    // Custom fields
    metadata: data.metadata || {},
    customFields: data.customFields || {}
  };
};

export const createNFTAssetFromData = (data: RawNFTData): NFTAsset => {
  if (!validateNFTData(data)) {
    throw new ValidationError({
      code: 'INVALID_NFT_DATA',
      message: 'Invalid NFT data provided',
      details: data
    });
  }

  const baseAsset = createAssetFromData(data);
  const currentDate = new Date().toISOString();

  return {
    ...baseAsset,
    
    // NFT core
    tokenId: String(data.tokenId),
    contractAddress: data.contractAddress.trim(),
    blockchain: isValidBlockchain(data.blockchain) ? data.blockchain : Blockchain.STARKNET,
    tokenStandard: isValidTokenStandard(data.tokenStandard) ? data.tokenStandard : TokenStandard.ERC721,
    
    // Ownership
    owner: data.owner.trim(),
    ownershipHistory: [],
    
    // NFT metadata
    name: data.name || data.title,
    imageUrl: data.imageUrl || data.mediaUrl,
    metadata: data.nftMetadata,
    attributes: data.attributes || [],
    
    // Collection
    collectionInfo: data.collectionInfo && typeof data.collectionInfo.name === 'string'
      ? { 
          name: data.collectionInfo.name,
          slug: data.collectionInfo.slug,
          description: data.collectionInfo.description,
          image: data.collectionInfo.image,
          external_url: data.collectionInfo.external_url,
          banner_image: data.collectionInfo.banner_image,
          featured_image: data.collectionInfo.featured_image,
          large_image: data.collectionInfo.large_image,
          total_supply: data.collectionInfo.total_supply,
          floor_price: data.collectionInfo.floor_price,
          volume_traded: data.collectionInfo.volume_traded,
          verified: data.collectionInfo.verified
        }
      : undefined,
    
    // Timestamps
    mintedAt: data.mintedAt ? normalizeDate(data.mintedAt) : undefined,
    lastTransferredAt: data.lastTransferredAt ? normalizeDate(data.lastTransferredAt) : currentDate,
    
    // Transaction history
    transactionHistory: [],
    
    // Market data
    currentPrice: data.currentPrice,
    currency: data.currency || 'STRK',
    lastSalePrice: data.lastSalePrice,
    
    // Verification
    verified: data.verified ?? false,
    suspicious: data.suspicious ?? false,
    
    // Rarity
    rarityScore: data.rarityScore,
    rarityRank: data.rarityRank,
    totalSupply: data.totalSupply,
    
    // Storage
    ipfsHash: data.ipfsHash,
    arweaveId: data.arweaveId,
    storageType: data.storageType as any,
    
    // Starknet-specific
    starknetInfo: data.starknetInfo
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const mapToNFTAsset = (
  asset: Asset, 
  nftData: Partial<Pick<NFTAsset, 'tokenId' | 'contractAddress' | 'owner' | 'blockchain' | 'tokenStandard' | 'name' | 'imageUrl'>>
): NFTAsset => {
  const requiredFields = ['tokenId', 'contractAddress', 'owner'];
  const missingFields = requiredFields.filter(field => !nftData[field as keyof typeof nftData]);
  
  if (missingFields.length > 0) {
    throw new ValidationError({
      code: 'MISSING_NFT_FIELDS',
      message: `Missing required NFT fields: ${missingFields.join(', ')}`,
      details: { missingFields, providedData: nftData }
    });
  }

  const currentDate = new Date().toISOString();

  return {
    ...asset,
    tokenId: String(nftData.tokenId!),
    contractAddress: nftData.contractAddress!,
    owner: nftData.owner!,
    blockchain: nftData.blockchain || Blockchain.STARKNET,
    tokenStandard: nftData.tokenStandard || TokenStandard.ERC721,
    name: nftData.name || asset.title,
    imageUrl: nftData.imageUrl || asset.mediaUrl,
    mintedAt: asset.createdAt || asset.registrationDate,
    lastTransferredAt: currentDate,
    ownershipHistory: [],
    transactionHistory: [],
    verified: false,
    suspicious: false,
    // Ensure metadata is undefined or of type NFTMetadata
    metadata: undefined
  };
};

export const createEmptyPortfolio = (address: Address): UserPortfolio => ({
  address,
  totalAssets: 0,
  assets: [],
  nftAssets: [],
  generalAssets: [],
  loading: false,
  error: null,
  lastUpdated: new Date(),
  totalValue: 0,
  currency: 'USD',
  assetsByType: Object.values(AssetType).reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {} as Record<AssetType, number>),
  assetsByCollection: {}
});

// Custom error classes
export class ValidationError extends Error implements AssetError {
  code: string;
  details?: unknown;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';

  constructor(error: Partial<AssetError> & { message: string }) {
    super(error.message);
    this.name = 'ValidationError';
    this.code = error.code || 'VALIDATION_ERROR';
    this.details = error.details;
    this.timestamp = new Date();
    this.severity = error.severity || 'medium';
  }
}

export class NetworkError extends Error implements AssetError {
  code: string;
  details?: unknown;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  network?: Blockchain;
  endpoint?: string;
  statusCode?: number;
  retryAfter?: number;

  constructor(error: Partial<NetworkError> & { message: string }) {
    super(error.message);
    this.name = 'NetworkError';
    this.code = error.code || 'NETWORK_ERROR';
    this.details = error.details;
    this.timestamp = new Date();
    this.severity = error.severity || 'high';
    this.network = error.network;
    this.endpoint = error.endpoint;
    this.statusCode = error.statusCode;
    this.retryAfter = error.retryAfter;
  }
}