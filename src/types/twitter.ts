/**
 * Twitter User types
 */

export interface TwitterUserPublicMetrics {
  followers_count: number
  following_count: number
  tweet_count: number
}

export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  profile_image_url: string;
  verified: boolean;
    public_metrics: TwitterUserPublicMetrics;
}

/**
 * Twitter Post types
 */

export interface TwitterPostMetrics {
  retweet_count: number
  reply_count: number
  like_count: number
  quote_count: number
}

export interface TwitterPost {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: TwitterPostMetrics;
  attachments?: {
    media_keys: string[];
  };
  entities?: {
    hashtags?: { tag: string }[];
    urls?: { url: string; expanded_url: string }[];
    mentions?: { username: string }[];
  };
}

export interface TwitterMedia {
  media_key: string;
  type: 'photo' | 'video' | 'animated_gif';
  url?: string;
  preview_image_url?: string;
  width?: number;
  height?: number;
}

/**
 * Twitter API Responses
 */

export interface TwitterAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: TwitterUser;
}

export interface TwitterPostsResponse {
  data: TwitterPost[];
  includes?: {
    users: TwitterUser[];
    media: TwitterMedia[];
  };
  meta: {
    result_count: number;
    newest_id?: string;
    oldest_id?: string;
    next_token?: string;
  };
}

/**
 * Tokenized Post types for NFTs
 */

export interface TokenizedPost {
  postId: string;
  tokenId: string;
  transactionHash: string;
  ipfsHash: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'failed';
  ipfsUrl?: string;
  pinataUrl?: string;
  starknetUrl?: string;
  // Add fields for real blockchain integration
  contractAddress?: string;
  network?: 'mainnet' | 'sepolia';
  blockNumber?: number;
  // Internal minting data (not persisted)
  _mintingData?: {
    contractAddress: string;
    recipientAddress: string;
    metadata: any;
    ipfsHash: string;
    ipfsUrl: string;
  };
}

/**
 * Twitter Connection State
 */

export type TwitterConnectionState = "idle" 
  | "connecting" 
  | "connected" 
  | "verifying" 
  | "verified" 
  | "error"

/**
 * Twitter Integration State
 */

export interface TwitterIntegrationState {
  isConnected: boolean;
  user: TwitterUser | null;
  posts: TwitterPost[];
  selectedPost: TwitterPost | null;
  isLoading: boolean;
  error: string | null;
  tokenizedPosts: TokenizedPost[];
}
