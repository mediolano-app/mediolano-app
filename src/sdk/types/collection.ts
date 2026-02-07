/**
 * Collection type definitions for the Mediolano SDK
 */

import type { StarknetAddress, IPFSMetadata } from './common';

/**
 * Collection data structure matching the on-chain representation
 */
export interface Collection {
    /** Collection ID (numeric string) */
    id: string;
    /** Collection name */
    name: string;
    /** Collection symbol */
    symbol: string;
    /** Base URI for metadata (usually IPFS) */
    baseUri: string;
    /** Collection description (from IPFS metadata) */
    description: string;
    /** Collection cover image URL */
    image: string;
    /** Owner wallet address */
    owner: StarknetAddress;
    /** NFT contract address (deployed per collection) */
    nftAddress: StarknetAddress;
    /** Whether the collection is active */
    isActive: boolean;
    /** Total number of tokens minted */
    totalMinted: number;
    /** Total number of tokens burned */
    totalBurned: number;
    /** Total number of transfers */
    totalTransfers: number;
    /** Current item count (minted - burned) */
    itemCount: number;
    /** Total supply */
    totalSupply: number;
    /** Last mint timestamp */
    lastMintTime: string;
    /** Last burn timestamp */
    lastBurnTime: string;
    /** Last transfer timestamp */
    lastTransferTime: string;
    /** Collection type (from IPFS metadata) */
    type?: string;
    /** Visibility setting */
    visibility?: string;
    /** Whether versioning is enabled */
    enableVersioning?: boolean;
    /** Whether comments are allowed */
    allowComments?: boolean;
    /** Whether approval is required */
    requireApproval?: boolean;
}

/**
 * Collection statistics
 */
export interface CollectionStats {
    totalMinted: number;
    totalBurned: number;
    totalTransfers: number;
    lastMintTime: string;
    lastBurnTime: string;
    lastTransferTime: string;
}

/**
 * Raw collection data from contract
 */
export interface RawCollectionData {
    name: string;
    symbol: string;
    base_uri: string;
    owner: string;
    ip_nft: string;
    is_active: boolean;
}

/**
 * Raw collection stats from contract
 */
export interface RawCollectionStats {
    total_minted: string;
    total_burned: string;
    total_transfers: string;
    last_mint_time: string;
    last_burn_time: string;
    last_transfer_time: string;
}

/**
 * Parameters for creating a new collection
 */
export interface CreateCollectionParams {
    /** Collection name (required) */
    name: string;
    /** Collection symbol (optional, auto-generated if not provided) */
    symbol?: string;
    /** Base URI for metadata (required, should be IPFS CID) */
    baseUri: string;
}

/**
 * Parameters for minting a single token
 */
export interface MintParams {
    /** Collection ID to mint to */
    collectionId: string;
    /** Recipient wallet address */
    recipient: StarknetAddress;
    /** Token metadata URI */
    tokenUri: string;
}

/**
 * Parameters for batch minting
 */
export interface BatchMintParams {
    /** Collection ID to mint to */
    collectionId: string;
    /** Array of recipients */
    recipients: StarknetAddress[];
    /** Array of token URIs (must match recipients length) */
    tokenUris: string[];
}

/**
 * Collection IPFS metadata structure
 */
export interface CollectionIPFSMetadata extends IPFSMetadata {
    type?: string;
    visibility?: string;
    coverImage?: string;
    enableVersioning?: boolean;
    allowComments?: boolean;
    requireApproval?: boolean;
}

/**
 * Filter options for querying collections
 */
export interface CollectionFilter {
    /** Filter by owner address */
    owner?: StarknetAddress;
    /** Filter by active status */
    isActive?: boolean;
    /** Filter by type */
    type?: string;
    /** Search by name */
    search?: string;
}

/**
 * Sort options for collections
 */
export interface CollectionSort {
    field: 'id' | 'name' | 'totalMinted' | 'lastMintTime';
    direction: 'asc' | 'desc';
}

/**
 * Collection created event data
 */
export interface CollectionCreatedEvent {
    collectionId: string;
    owner: StarknetAddress;
    name: string;
    symbol: string;
    baseUri: string;
    blockNumber: number;
    transactionHash: string;
    timestamp?: number;
}
