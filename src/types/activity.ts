import { hash } from 'starknet';

export enum ActivityType {
  MINT = 'mint',
  CREATE_OFFER = 'create_offer',
  BUY = 'buy',
  SELL = 'sell',
  CREATE_IP_COIN = 'create_ip_coin',
  POOL_LIQUIDITY = 'pool_liquidity',
  DAO_VOTE = 'dao_vote'
}

export interface ActivityEvent {
  id: string;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  activityType: ActivityType;
  userAddress: string;
  assetId?: string;
  assetName?: string;
  assetImage?: string;
  amount?: string;
  price?: string;
  currency?: string;
  proposalId?: string;
  voteChoice?: 'for' | 'against' | 'abstain';
  metadata?: Record<string, any>;
}

export interface ActivityFilter {
  activityTypes: ActivityType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy: 'timestamp' | 'amount' | 'activityType';
  sortOrder: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ActivityFeedState {
  activities: ActivityEvent[];
  loading: boolean;
  error: string | null;
  filter: ActivityFilter;
  pagination: PaginationState;
}


export const CONTRACT_ADDRESSES = {
  MIP: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP || '0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0',
  AGREEMENT_FACTORY: process.env.NEXT_PUBLIC_AGREEMENT_FACTORY_ADDRESS || '0x025a178bc9ace058ab1518392780610665857dfde111e1bed4d69742451bc61c',
  REVENUE_CONTRACT: process.env.NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS || '0x055f444b1ace8bec6d79ceb815a8733958e9ceaa598160af291a7429e0146a74',
  LICENSING_CONTRACT: process.env.NEXT_PUBLIC_LICENSING_CONTRACT_ADDRESS || '',
  USER_SETTINGS: process.env.NEXT_PUBLIC_USER_SETTINGS_CONTRACT_ADDRESS || '0x06398e87b9bae77238d75a3ff6c5a247de26d931d6ca66467b85087cf4f57bdf',
};


export const STARKNET_EVENT_SIGNATURES = {
  
  [ActivityType.MINT]: hash.getSelectorFromName("Transfer"),
  
  
  [ActivityType.CREATE_OFFER]: hash.getSelectorFromName("OfferCreated"),
  [ActivityType.BUY]: hash.getSelectorFromName("Purchase"),
  [ActivityType.SELL]: hash.getSelectorFromName("Sale"),
  
  
  [ActivityType.CREATE_IP_COIN]: hash.getSelectorFromName("IPCoinCreated"),
  [ActivityType.POOL_LIQUIDITY]: hash.getSelectorFromName("LiquidityAdded"),
  
 
  [ActivityType.DAO_VOTE]: hash.getSelectorFromName("VoteCast")
};


export const ALTERNATIVE_EVENT_SIGNATURES = {
 
  TRANSFER: hash.getSelectorFromName("Transfer"),
  APPROVAL: hash.getSelectorFromName("Approval"),
  MINT: hash.getSelectorFromName("Mint"),
  BURN: hash.getSelectorFromName("Burn"),
  
  
  OFFER_MADE: hash.getSelectorFromName("OfferMade"),
  OFFER_ACCEPTED: hash.getSelectorFromName("OfferAccepted"),
  LISTING_CREATED: hash.getSelectorFromName("ListingCreated"),
  ITEM_SOLD: hash.getSelectorFromName("ItemSold"),
  

  REVENUE_DISTRIBUTED: hash.getSelectorFromName("RevenueDistributed"),
  ROYALTY_PAID: hash.getSelectorFromName("RoyaltyPaid"),
  LICENSE_GRANTED: hash.getSelectorFromName("LicenseGranted"),
  

  PROPOSAL_CREATED: hash.getSelectorFromName("ProposalCreated"),
  VOTE_SUBMITTED: hash.getSelectorFromName("VoteSubmitted"),
  PROPOSAL_EXECUTED: hash.getSelectorFromName("ProposalExecuted")
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  [ActivityType.MINT]: 'Mint IP',
  [ActivityType.CREATE_OFFER]: 'Create Offer',
  [ActivityType.BUY]: 'Purchase',
  [ActivityType.SELL]: 'Sale',
  [ActivityType.CREATE_IP_COIN]: 'Create IP Coin',
  [ActivityType.POOL_LIQUIDITY]: 'Pool Liquidity',
  [ActivityType.DAO_VOTE]: 'DAO Vote'
};

export const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  [ActivityType.MINT]: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
  [ActivityType.CREATE_OFFER]: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
  [ActivityType.BUY]: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
  [ActivityType.SELL]: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
  [ActivityType.CREATE_IP_COIN]: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800',
  [ActivityType.POOL_LIQUIDITY]: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800',
  [ActivityType.DAO_VOTE]: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800'
};

// Network configuration
export const STARKNET_EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://sepolia.voyager.online';
export const STARKNET_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/iIgYbGyTort4ZYdxhT97aymG5j8_aYUk';

// Activity type to contract mapping
export const ACTIVITY_CONTRACT_MAPPING: Record<ActivityType, string[]> = {
  [ActivityType.MINT]: [CONTRACT_ADDRESSES.MIP].filter(Boolean),
  [ActivityType.CREATE_OFFER]: [CONTRACT_ADDRESSES.AGREEMENT_FACTORY].filter(Boolean),
  [ActivityType.BUY]: [CONTRACT_ADDRESSES.AGREEMENT_FACTORY].filter(Boolean),
  [ActivityType.SELL]: [CONTRACT_ADDRESSES.AGREEMENT_FACTORY].filter(Boolean),
  [ActivityType.CREATE_IP_COIN]: [CONTRACT_ADDRESSES.REVENUE_CONTRACT].filter(Boolean),
  [ActivityType.POOL_LIQUIDITY]: [CONTRACT_ADDRESSES.REVENUE_CONTRACT].filter(Boolean),
  [ActivityType.DAO_VOTE]: [CONTRACT_ADDRESSES.USER_SETTINGS].filter(Boolean)
};

// Event parsing configurations
export interface EventParsingConfig {
  activityType: ActivityType;
  contractAddress: string;
  eventSelector: string;
  keyIndices: {
    userAddress?: number;
    assetId?: number;
    amount?: number;
  };
  dataIndices: {
    price?: number;
    tokenId?: number;
    proposalId?: number;
    voteChoice?: number;
  };
}

export const EVENT_PARSING_CONFIGS: EventParsingConfig[] = [
  {
    activityType: ActivityType.MINT,
    contractAddress: CONTRACT_ADDRESSES.MIP,
    eventSelector: STARKNET_EVENT_SIGNATURES[ActivityType.MINT],
    keyIndices: {
      userAddress: 2 // 'to' address in Transfer event
    },
    dataIndices: {
      tokenId: 0 // token_id in event data
    }
  },
  {
    activityType: ActivityType.CREATE_OFFER,
    contractAddress: CONTRACT_ADDRESSES.AGREEMENT_FACTORY,
    eventSelector: STARKNET_EVENT_SIGNATURES[ActivityType.CREATE_OFFER],
    keyIndices: {
      userAddress: 1 // offerer address
    },
    dataIndices: {
      tokenId: 0,
      price: 1
    }
  },
  
];

// Statistics interface
export interface ActivityStatistics {
  totalActivities: number;
  activityCounts: Partial<Record<ActivityType, number>>;
  totalValue: number;
  uniqueAssetsCount: number;
  uniqueAssets: Set<string>;
}

// Utility functions
export function getActivityTypeFromEventName(eventName: string): ActivityType | null {
  const eventNameLower = eventName.toLowerCase();
  
  if (eventName === 'Transfer') {
    return ActivityType.MINT; // Will be determined by parsing logic
  }
  if (eventNameLower.includes('offer')) {
    return ActivityType.CREATE_OFFER;
  }
  if (eventNameLower.includes('purchase') || eventNameLower.includes('buy')) {
    return ActivityType.BUY;
  }
  if (eventNameLower.includes('sale') || eventNameLower.includes('sell')) {
    return ActivityType.SELL;
  }
  if (eventNameLower.includes('coin') || eventNameLower.includes('ip')) {
    return ActivityType.CREATE_IP_COIN;
  }
  if (eventNameLower.includes('liquidity')) {
    return ActivityType.POOL_LIQUIDITY;
  }
  if (eventNameLower.includes('vote')) {
    return ActivityType.DAO_VOTE;
  }
  
  return null;
}

export function formatActivityTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
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
    // Basic validation for Starknet address format
    return /^0x[a-fA-F0-9]{1,64}$/.test(address) && address.length >= 3;
  } catch {
    return false;
  }
}

// Default filter for activity feed
export const DEFAULT_ACTIVITY_FILTER: ActivityFilter = {
  activityTypes: Object.values(ActivityType),
  sortBy: 'timestamp',
  sortOrder: 'desc'
};

// Default pagination state
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