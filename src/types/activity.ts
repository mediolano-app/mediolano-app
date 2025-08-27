import { hash } from 'starknet';


export type ActivityType = 
  | 'mint' 
  | 'mint_batch'
  | 'transfer_out' 
  | 'transfer_in' 
  | 'transfer_batch'
  | 'burn'
  | 'burn_batch'
  | 'collection_create'
  | 'update'
  | 'upgrade'
  | 'sale';

export type ActivityStatus = 'completed' | 'pending' | 'failed';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  status: ActivityStatus;
  timestamp: string;
  hash?: string;
  network: string;
  value?: string;
  fromAddress?: string;
  toAddress?: string;
  assetId?: string;
  assetIds?: string[];
  collectionId?: string;
  metadata?: {
    blockNumber?: number;
    contractAddress?: string;
    status?: 'completed' | 'pending' | 'failed';
  };
}

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  status: ActivityStatus;
  timestamp: string;
  network: string;
  fromAddress?: string;
  toAddress?: string;
  assetId?: string;
  assetIds?: string[];
  collectionId?: string;
  value?: string;
  metadata?: Record<string, any>;
}

export interface ActivityEvent extends Omit<ActivityItem, 'title' | 'description' | 'status' | 'network' | 'timestamp'> {
  txHash: string;
  blockNumber: number;
  timestamp: string;
  activityType: ActivityType;
  userAddress: string;
  assetName?: string;
  assetImage?: string;
  collectionName?: string;
  amount?: string;
  price?: string;
  currency?: string;
  proposalId?: string;
  voteChoice?: 'for' | 'against' | 'abstain';
  metadata?: Record<string, any>;
}

export interface ActivityFilter {
  activityTypes: ActivityType[];
  statuses?: ActivityStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy: 'timestamp' | 'value' | 'type';
  sortOrder: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ActivityFeedState {
  activities: ActivityItem[];
  loading: boolean;
  error: string | null;
  filter: ActivityFilter;
  pagination: PaginationState;
}

// Visual styling configurations
export const activityGradients = {
  mint: "from-green-500 to-emerald-500",
  mint_batch: "from-green-500 to-emerald-500",
  transfer_out: "from-blue-500 to-cyan-500",
  transfer_in: "from-purple-500 to-violet-500",
  transfer_batch: "from-blue-500 to-cyan-500",
  burn: "from-red-500 to-pink-500",
  burn_batch: "from-red-500 to-pink-500",
  collection_create: "from-indigo-500 to-purple-500",
  update: "from-yellow-500 to-orange-500",
  upgrade: "from-teal-500 to-cyan-500",
  sale: "from-orange-500 to-red-500",
} as const;

export const activityColors = {
  mint: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
  mint_batch: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
  transfer_out: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  transfer_in: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  transfer_batch: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  burn: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20",
  burn_batch: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20",
  collection_create: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
  update: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20",
  upgrade: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",
  sale: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
} as const;

export const statusColors = {
  completed: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
  pending: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
  failed: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20",
} as const;

export const typeLabels = {
  mint: "Minted",
  mint_batch: "Minted Batch",
  transfer_out: "Sent",
  transfer_in: "Received",
  transfer_batch: "Transferred Batch",
  burn: "Burned",
  burn_batch: "Burned Batch",
  collection_create: "Collection Created",
  update: "Updated",
  upgrade: "Upgraded",
  sale: "Sales",
} as const;


export const CONTRACT_ADDRESSES = {
  MIP: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP || '0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0',
  AGREEMENT_FACTORY: process.env.NEXT_PUBLIC_AGREEMENT_FACTORY_ADDRESS || '0x025a178bc9ace058ab1518392780610665857dfde111e1bed4d69742451bc61c',
  REVENUE_CONTRACT: process.env.NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS || '0x055f444b1ace8bec6d79ceb815a8733958e9ceaa598160af291a7429e0146a74',
  LICENSING_CONTRACT: process.env.NEXT_PUBLIC_LICENSING_CONTRACT_ADDRESS || '',
  USER_SETTINGS: process.env.NEXT_PUBLIC_USER_SETTINGS_CONTRACT_ADDRESS || '0x06398e87b9bae77238d75a3ff6c5a247de26d931d6ca66467b85087cf4f57bdf',
  ASSET_REGISTRY: process.env.NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS || '',
  COLLECTION_FACTORY: process.env.NEXT_PUBLIC_COLLECTION_FACTORY_ADDRESS || '',
};


export const STARKNET_EVENT_SIGNATURES = {
  mint: hash.getSelectorFromName("Transfer"),
  mint_batch: hash.getSelectorFromName("TransferBatch"),
  transfer_out: hash.getSelectorFromName("Transfer"),
  transfer_in: hash.getSelectorFromName("Transfer"),
  transfer_batch: hash.getSelectorFromName("TransferBatch"),
  burn: hash.getSelectorFromName("Burn"),
  burn_batch: hash.getSelectorFromName("BurnBatch"),
  collection_create: hash.getSelectorFromName("CollectionCreated"),
  update: hash.getSelectorFromName("MetadataUpdate"),
  upgrade: hash.getSelectorFromName("Upgraded"),
  sale: hash.getSelectorFromName("Sale")
};


export const ALTERNATIVE_EVENT_SIGNATURES = {
  // Core transfer events
  TRANSFER: hash.getSelectorFromName("Transfer"),
  TRANSFER_SINGLE: hash.getSelectorFromName("TransferSingle"),
  TRANSFER_BATCH: hash.getSelectorFromName("TransferBatch"),
  
  // Mint events
  MINT: hash.getSelectorFromName("Mint"),
  MINT_BATCH: hash.getSelectorFromName("MintBatch"),
  
  // Burn events
  BURN: hash.getSelectorFromName("Burn"),
  BURN_BATCH: hash.getSelectorFromName("BurnBatch"),
  
  // Collection events
  COLLECTION_CREATED: hash.getSelectorFromName("CollectionCreated"),
  COLLECTION_INITIALIZED: hash.getSelectorFromName("CollectionInitialized"),
  
  // Update events
  METADATA_UPDATE: hash.getSelectorFromName("MetadataUpdate"),
  ASSET_UPDATED: hash.getSelectorFromName("AssetUpdated"),
  
  // Upgrade events
  UPGRADED: hash.getSelectorFromName("Upgraded"),
  CONTRACT_UPGRADED: hash.getSelectorFromName("ContractUpgraded"),
  
  // Sale events
  SALE: hash.getSelectorFromName("Sale"),
  ITEM_SOLD: hash.getSelectorFromName("ItemSold"),
  PURCHASE: hash.getSelectorFromName("Purchase")
};

// Updated activity to contract mapping
export const ACTIVITY_CONTRACT_MAPPING: Record<ActivityType, string[]> = {
  mint: [CONTRACT_ADDRESSES.MIP].filter(Boolean),
  mint_batch: [CONTRACT_ADDRESSES.MIP].filter(Boolean),
  transfer_out: [CONTRACT_ADDRESSES.MIP].filter(Boolean),
  transfer_in: [CONTRACT_ADDRESSES.MIP].filter(Boolean),
  transfer_batch: [CONTRACT_ADDRESSES.MIP].filter(Boolean),
  burn: [CONTRACT_ADDRESSES.MIP].filter(Boolean),
  burn_batch: [CONTRACT_ADDRESSES.MIP].filter(Boolean),
  collection_create: [CONTRACT_ADDRESSES.COLLECTION_FACTORY].filter(Boolean),
  update: [CONTRACT_ADDRESSES.MIP, CONTRACT_ADDRESSES.ASSET_REGISTRY].filter(Boolean),
  upgrade: [CONTRACT_ADDRESSES.MIP].filter(Boolean),
  sale: [CONTRACT_ADDRESSES.AGREEMENT_FACTORY].filter(Boolean)
};

// Updated event parsing configurations
export interface EventParsingConfig {
  activityType: ActivityType;
  contractAddress: string;
  eventSelector: string;
  keyIndices: {
    userAddress?: number;
    fromAddress?: number;
    toAddress?: number;
    assetId?: number;
    collectionId?: number;
    amount?: number;
  };
  dataIndices: {
    price?: number;
    tokenId?: number;
    tokenIds?: number;
    value?: number;
    metadata?: number;
  };
}

export const EVENT_PARSING_CONFIGS: EventParsingConfig[] = [
  {
    activityType: 'mint',
    contractAddress: CONTRACT_ADDRESSES.MIP,
    eventSelector: STARKNET_EVENT_SIGNATURES['mint'],
    keyIndices: {
      toAddress: 2,
      fromAddress: 1
    },
    dataIndices: {
      tokenId: 0
    }
  },
  {
    activityType: 'transfer_out',
    contractAddress: CONTRACT_ADDRESSES.MIP,
    eventSelector: STARKNET_EVENT_SIGNATURES['transfer_out'],
    keyIndices: {
      fromAddress: 1,
      toAddress: 2
    },
    dataIndices: {
      tokenId: 0
    }
  },
  {
    activityType: 'collection_create',
    contractAddress: CONTRACT_ADDRESSES.COLLECTION_FACTORY,
    eventSelector: STARKNET_EVENT_SIGNATURES['collection_create'],
    keyIndices: {
      userAddress: 1
    },
    dataIndices: {
      metadata: 1
    }
  },
  {
    activityType: 'sale',
    contractAddress: CONTRACT_ADDRESSES.AGREEMENT_FACTORY,
    eventSelector: STARKNET_EVENT_SIGNATURES['sale'],
    keyIndices: {
      fromAddress: 1,
      toAddress: 2
    },
    dataIndices: {
      tokenId: 0,
      price: 1
    }
  }
];


export const STARKNET_EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL;
export const STARKNET_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;


export interface ActivityStatistics {
  totalActivities: number;
  activityCounts: Partial<Record<ActivityType, number>>;
  statusCounts: Partial<Record<ActivityStatus, number>>;
  totalValue: number;
  uniqueAssetsCount: number;
  uniqueAssets: Set<string>;
  uniqueCollectionsCount: number;
  uniqueCollections: Set<string>;
}

// Utility functions (updated)
export function getActivityTypeFromEventName(eventName: string): ActivityType | null {
  const eventNameLower = eventName.toLowerCase();
  
  if (eventName === 'Transfer' || eventName === 'TransferSingle') {
    // Will be determined by parsing logic (mint vs transfer)
    return null;
  }
  if (eventName === 'TransferBatch') {
    return 'transfer_batch';
  }
  if (eventNameLower.includes('mint')) {
    return eventNameLower.includes('batch') ? 'mint_batch' : 'mint';
  }
  if (eventNameLower.includes('burn')) {
    return eventNameLower.includes('batch') ? 'burn_batch' : 'burn';
  }
  if (eventNameLower.includes('collection') && eventNameLower.includes('created')) {
    return 'collection_create';
  }
  if (eventNameLower.includes('update') || eventNameLower.includes('metadata')) {
    return 'update';
  }
  if (eventNameLower.includes('upgrade')) {
    return 'upgrade';
  }
  if (eventNameLower.includes('sale') || eventNameLower.includes('purchase') || eventNameLower.includes('sold')) {
    return 'sale';
  }
  
  return null;
}

export function determineTransferDirection(
  eventName: string, 
  fromAddress: string, 
  toAddress: string, 
  userAddress: string
): ActivityType | null {
  if (eventName !== 'Transfer' && eventName !== 'TransferSingle') {
    return null;
  }
  
  const isFromZero = fromAddress === '0x0' || fromAddress === '0x00';
  const isToZero = toAddress === '0x0' || toAddress === '0x00';
  
  // Mint: from zero address to user
  if (isFromZero && toAddress.toLowerCase() === userAddress.toLowerCase()) {
    return 'mint';
  }
  
  // Burn: from user to zero address
  if (fromAddress.toLowerCase() === userAddress.toLowerCase() && isToZero) {
    return 'burn';
  }
  
  // Transfer out: from user to someone else
  if (fromAddress.toLowerCase() === userAddress.toLowerCase() && !isToZero) {
    return 'transfer_out';
  }
  
  // Transfer in: from someone else to user
  if (!isFromZero && toAddress.toLowerCase() === userAddress.toLowerCase()) {
    return 'transfer_in';
  }
  
  return null;
}

// Legacy utility function (for backward compatibility)
export function convertLegacyActivityType(legacyType: string): ActivityType {
  const mapping: Record<string, ActivityType> = {
    'MINT': 'mint',
    'CREATE_OFFER': 'sale',
    'BUY': 'sale',
    'SELL': 'sale',
    'CREATE_IP_COIN': 'mint',
    'POOL_LIQUIDITY': 'update',
    'DAO_VOTE': 'update',
    'ASSET_CREATED': 'mint',
    'COLLECTION_CREATED': 'collection_create'
  };
  
  return mapping[legacyType] || 'update';
}

export function formatActivityTimestamp(timestamp: string | number): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return `${minutes}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInHours < 168) { // 7 days
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export function formatPrice(price: string, currency: string = 'ETH'): string {
  try {
    const numPrice = parseFloat(price);
    if (numPrice === 0) return '0';
    
    // Convert from wei if needed (assuming 18 decimals for ETH)
    const formattedPrice = numPrice / Math.pow(10, 18);
    
    if (formattedPrice < 0.001) {
      return `< 0.001 ${currency}`;
    } else if (formattedPrice < 1) {
      return `${formattedPrice.toFixed(6)} ${currency}`;
    } else {
      return `${formattedPrice.toFixed(4)} ${currency}`;
    }
  } catch (error) {
    return `${price} ${currency}`;
  }
}

export function isValidStarknetAddress(address: string): boolean {
  try {
    return /^0x[a-fA-F0-9]{1,64}$/.test(address) && address.length >= 3;
  } catch {
    return false;
  }
}

// Helper function to create activity title and description
export function createActivityMetadata(item: Partial<ActivityItem>): { title: string; description: string } {
  const { type, value, assetId, assetIds, collectionId, fromAddress, toAddress } = item;
  
  switch (type) {
    case 'mint':
      return {
        title: `Minted ${assetId ? `#${assetId}` : 'Asset'}`,
        description: `Successfully minted new asset${value ? ` for ${value}` : ''}`
      };
    case 'mint_batch':
      return {
        title: `Batch Minted ${assetIds?.length || 0} Assets`,
        description: `Successfully minted ${assetIds?.length || 0} assets in batch`
      };
    case 'transfer_out':
      return {
        title: `Sent ${assetId ? `#${assetId}` : 'Asset'}`,
        description: `Transferred to ${toAddress ? `${toAddress.slice(0, 6)}...${toAddress.slice(-4)}` : 'recipient'}`
      };
    case 'transfer_in':
      return {
        title: `Received ${assetId ? `#${assetId}` : 'Asset'}`,
        description: `Received from ${fromAddress ? `${fromAddress.slice(0, 6)}...${fromAddress.slice(-4)}` : 'sender'}`
      };
    case 'sale':
      return {
        title: `Sold ${assetId ? `#${assetId}` : 'Asset'}`,
        description: `Successfully sold${value ? ` for ${value}` : ''}`
      };
    case 'collection_create':
      return {
        title: 'Created Collection',
        description: `Successfully created new collection${collectionId ? ` #${collectionId}` : ''}`
      };
    default:
      return {
        title: type ? typeLabels[type as ActivityType] ?? 'Activity' : 'Activity',
        description: `${type ? typeLabels[type as ActivityType] ?? 'Activity' : 'Activity'} completed successfully`
      };
  }
}

// Default configurations 
export const DEFAULT_ACTIVITY_FILTER: ActivityFilter = {
  activityTypes: [
    'mint',
    'mint_batch',
    'transfer_out',
    'transfer_in',
    'transfer_batch',
    'burn',
    'burn_batch',
    'collection_create',
    'update',
    'upgrade',
    'sale'
  ],
  sortBy: 'timestamp',
  sortOrder: 'desc'
};

export const DEFAULT_PAGINATION_STATE: PaginationState = {
  page: 1,
  limit: 20,
  total: 0,
  hasMore: false
};

// Error messages 
export const ERROR_MESSAGES = {
  NO_WALLET: 'No wallet address available',
  FETCH_FAILED: 'Failed to fetch activities from Starknet',
  INVALID_ADDRESS: 'Invalid wallet address format',
  NETWORK_ERROR: 'Network error occurred while fetching data',
  PARSING_ERROR: 'Error parsing blockchain data',
  CONTRACT_ERROR: 'Error interacting with smart contract'
};

// Rate limiting configuration 
export const RATE_LIMIT_CONFIG = {
  MAX_REQUESTS_PER_MINUTE: 60,
  MAX_BLOCKS_PER_QUERY: 10000,
  DEFAULT_BLOCK_RANGE: 1000
};