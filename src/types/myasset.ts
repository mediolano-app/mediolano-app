export interface NFTAsset {
  tokenId: string;
  contractAddress: string;
  name: string;
  description: string;
  imageUrl: string;
  attributes: NFTAttribute[];
  owner: string;
  createdAt: number;
  lastTransferred: number;
  metadata: NFTMetadata;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  animation_url?: string;
  attributes: NFTAttribute[];
}

export interface UserPortfolio {
  address: string;
  totalAssets: number;
  assets: NFTAsset[];
  loading: boolean;
  error: string | null;
}

export interface MyAssetsProps {
  userAddress: string;
  contractAddress: string;
  onAssetSelect?: (asset: NFTAsset) => void;
  onPortfolioUpdate?: (portfolio: UserPortfolio) => void;
  className?: string;
  itemsPerPage?: number;
  network?: 'mainnet' | 'goerli' | 'sepolia';
  rpcUrl?: string;
}

export interface StarknetConfig {
  network: 'mainnet' | 'goerli' | 'sepolia';
  rpcUrl?: string;
}

// Network configuration
export const STARKNET_NETWORKS = {
  mainnet: 'https://starknet-mainnet.public.blastapi.io',
  goerli: 'https://starknet-goerli.public.blastapi.io', 
  sepolia: 'https://starknet-sepolia.public.blastapi.io'
} as const;