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

// Starknet event types mapping
export const STARKNET_EVENT_SIGNATURES = {
  [ActivityType.MINT]: '0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9',
  [ActivityType.CREATE_OFFER]: '0x134692b230b9e1ffa39098904722134159652b09c5bc41d88d6698779d228ff',
  [ActivityType.BUY]: '0x2563683c757f3abe19c4b7237e2285d8993417ddffe0b54a19eb212ea574b08',
  [ActivityType.SELL]: '0x375c97164e7c9318cf0867b7e83ab6d3c80e2f8bb3e3d9fb1e8b2c4e3e1c6a9',
  [ActivityType.CREATE_IP_COIN]: '0x4e8b4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e',
  [ActivityType.POOL_LIQUIDITY]: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
  [ActivityType.DAO_VOTE]: '0x1f4f27de2d9d41e8d7ff8a0b7b8c7c8c7c8c7c8c7c8c7c8c7c8c7c8c7c8c7c'
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
  [ActivityType.MINT]: 'bg-green-100 text-green-800 border-green-200',
  [ActivityType.CREATE_OFFER]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ActivityType.BUY]: 'bg-purple-100 text-purple-800 border-purple-200',
  [ActivityType.SELL]: 'bg-orange-100 text-orange-800 border-orange-200',
  [ActivityType.CREATE_IP_COIN]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [ActivityType.POOL_LIQUIDITY]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  [ActivityType.DAO_VOTE]: 'bg-pink-100 text-pink-800 border-pink-200'
};

export const STARKNET_EXPLORER_URL = 'https://sepolia.voyager.online';