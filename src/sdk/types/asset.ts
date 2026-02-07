/**
 * Asset type definitions for the Mediolano SDK
 */

import type { StarknetAddress, IPFSMetadata } from './common';

/**
 * Asset (NFT) data structure
 */
export interface Asset {
    /** Token ID within the collection */
    tokenId: number;
    /** NFT contract address */
    nftAddress: StarknetAddress;
    /** Collection ID this asset belongs to */
    collectionId: string;
    /** Asset name */
    name: string;
    /** Asset description */
    description?: string;
    /** Asset image URL */
    image?: string;
    /** Current owner address */
    owner: StarknetAddress;
    /** Token URI (usually IPFS) */
    tokenUri: string;
    /** IPFS CID if available */
    ipfsCid?: string;
    /** Asset type */
    type?: string;
    /** Registration date */
    registrationDate?: string;
    /** License type */
    licenseType?: string;
    /** External URL */
    externalUrl?: string;
    /** Tags for categorization */
    tags?: string[];
    /** Attributes/traits */
    attributes?: AssetAttribute[];
    /** Additional properties */
    properties?: Record<string, unknown>;
}

/**
 * Asset attribute structure (NFT metadata standard)
 */
export interface AssetAttribute {
    trait_type: string;
    value: string | number | boolean;
    display_type?: string;
}

/**
 * Raw token data from contract
 */
export interface RawTokenData {
    collection_id: string;
    token_id: string;
    owner: string;
    metadata_uri: string;
}

/**
 * Asset metadata from IPFS
 */
export interface AssetMetadata extends IPFSMetadata {
    type?: string;
    registrationDate?: string;
    licenseType?: string;
    tags?: string[];
}

/**
 * Parameters for transferring an asset
 */
export interface TransferParams {
    /** Source address (current owner) */
    from: StarknetAddress;
    /** Destination address */
    to: StarknetAddress;
    /** Token identifier (format: "collectionId:tokenId" or NFT address + tokenId) */
    token: string;
}

/**
 * Parameters for batch transfer
 */
export interface BatchTransferParams {
    /** Source address */
    from: StarknetAddress;
    /** Destination address */
    to: StarknetAddress;
    /** Array of token identifiers */
    tokens: string[];
}

/**
 * Parameters for burning an asset
 */
export interface BurnParams {
    /** Token identifier to burn */
    token: string;
}

/**
 * Parameters for batch burn
 */
export interface BatchBurnParams {
    /** Array of token identifiers to burn */
    tokens: string[];
}

/**
 * Remix parameters for creating derivative works
 */
export interface RemixParams {
    /** Original asset NFT address */
    originalNftAddress: StarknetAddress;
    /** Original asset token ID */
    originalTokenId: number;
    /** New remix metadata URI */
    remixUri: string;
    /** Recipient of the remix */
    recipient: StarknetAddress;
    /** Target collection for the remix */
    targetCollectionId: string;
}

/**
 * Filter options for querying assets
 */
export interface AssetFilter {
    /** Filter by collection ID */
    collectionId?: string;
    /** Filter by NFT address */
    nftAddress?: StarknetAddress;
    /** Filter by owner address */
    owner?: StarknetAddress;
    /** Filter by type */
    type?: string;
    /** Search by name */
    search?: string;
}

/**
 * Sort options for assets
 */
export interface AssetSort {
    field: 'tokenId' | 'name' | 'registrationDate';
    direction: 'asc' | 'desc';
}

/**
 * Token minted event data
 */
export interface TokenMintedEvent {
    collectionId: string;
    tokenId: string;
    owner: StarknetAddress;
    metadataUri: string;
    blockNumber: number;
    transactionHash: string;
    timestamp?: number;
}

/**
 * Token transferred event data
 */
export interface TokenTransferredEvent {
    collectionId: string;
    tokenId: string;
    from: StarknetAddress;
    to: StarknetAddress;
    operator: StarknetAddress;
    blockNumber: number;
    transactionHash: string;
    timestamp?: number;
}

/**
 * Provenance record for an asset
 */
export interface ProvenanceRecord {
    eventType: 'mint' | 'transfer' | 'burn' | 'remix';
    from?: StarknetAddress;
    to?: StarknetAddress;
    operator?: StarknetAddress;
    transactionHash: string;
    blockNumber: number;
    timestamp?: number;
}

/**
 * Display-ready asset with all metadata resolved
 */
export interface DisplayAsset extends Asset {
    /** Collection name */
    collectionName?: string;
    /** Formatted owner address */
    formattedOwner?: string;
    /** Resolved image URL (processed from IPFS) */
    resolvedImage?: string;
}
