/**
 * Provider and SDK configuration type definitions
 */

import type { StarknetAddress, CacheOptions } from './common';

/**
 * SDK configuration options
 */
export interface SDKConfig {
    /** Starknet RPC URL */
    rpcUrl: string;
    /** Network: 'mainnet' or 'sepolia' */
    network: 'mainnet' | 'sepolia';
    /** IP Collection contract address */
    collectionContractAddress: StarknetAddress;
    /** Default cache options */
    cacheOptions?: CacheOptions;
    /** Request timeout in milliseconds */
    timeout?: number;
    /** Maximum retry attempts for failed requests */
    maxRetries?: number;
    /** Base delay for exponential backoff (ms) */
    retryDelayMs?: number;
    /** IPFS gateway URL */
    ipfsGateway?: string;
    /** Block explorer URL */
    explorerUrl?: string;
    /** Start block for event scanning */
    startBlock?: number;
}

/**
 * Provider configuration (internal)
 */
export interface ProviderConfig {
    rpcUrl: string;
    network: 'mainnet' | 'sepolia';
    timeout: number;
    maxRetries: number;
    retryDelayMs: number;
}

/**
 * Cache entry with metadata
 */
export interface CacheEntry<T> {
    value: T;
    timestamp: number;
    expiresAt: number;
    accessCount: number;
}

/**
 * Request options for SDK methods
 */
export interface RequestOptions {
    /** Bypass cache and fetch fresh data */
    bypassCache?: boolean;
    /** Custom timeout for this request */
    timeout?: number;
    /** Signal for request cancellation */
    signal?: AbortSignal;
}

/**
 * Provider status information
 */
export interface ProviderStatus {
    connected: boolean;
    chainId: string;
    blockNumber: number;
    latency: number;
}

/**
 * Indexer configuration for future Apibara integration
 */
export interface IndexerConfig {
    /** Indexer type */
    type: 'apibara' | 'alchemy' | 'direct';
    /** Indexer API URL */
    apiUrl?: string;
    /** API key for authentication */
    apiKey?: string;
    /** Whether to use indexer for reads */
    useForReads?: boolean;
    /** Whether to use indexer for events */
    useForEvents?: boolean;
}

/**
 * SDK singleton instance options
 */
export interface SDKInstanceOptions extends SDKConfig {
    /** Indexer configuration */
    indexer?: IndexerConfig;
    /** Enable debug logging */
    debug?: boolean;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<SDKConfig> = {
    timeout: 30000,
    maxRetries: 3,
    retryDelayMs: 1000,
    ipfsGateway: 'https://gateway.pinata.cloud',
    cacheOptions: {
        ttl: 30000, // 30 seconds
        maxEntries: 500,
    },
};

/**
 * Network-specific configuration
 */
export const NETWORK_CONFIG = {
    mainnet: {
        startBlock: 6204232,
        explorerUrl: 'https://voyager.online',
    },
    sepolia: {
        startBlock: 1861690,
        explorerUrl: 'https://sepolia.voyager.online',
    },
} as const;
