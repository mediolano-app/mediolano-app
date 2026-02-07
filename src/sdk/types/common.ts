/**
 * Common type definitions used across the SDK
 */

/**
 * Starknet contract address type
 */
export type StarknetAddress = `0x${string}`;

/**
 * Pagination parameters for list operations
 */
export interface PaginationParams {
    /** Page number (1-indexed) */
    page?: number;
    /** Number of items per page */
    pageSize?: number;
    /** Cursor for cursor-based pagination */
    cursor?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
    nextCursor?: string;
}

/**
 * SDK operation result with error handling
 */
export interface SDKResult<T> {
    success: boolean;
    data?: T;
    error?: SDKError;
}

/**
 * SDK error structure
 */
export interface SDKError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

/**
 * IPFS metadata base structure
 */
export interface IPFSMetadata {
    name?: string;
    description?: string;
    image?: string;
    external_url?: string;
    attributes?: Array<{
        trait_type: string;
        value: string | number | boolean;
    }>;
    properties?: Record<string, unknown>;
}

/**
 * Contract call for transaction building
 */
export interface ContractCall {
    contractAddress: StarknetAddress;
    entrypoint: string;
    calldata: string[];
}

/**
 * Transaction response from write operations
 */
export interface TransactionResponse {
    transactionHash: string;
    status: 'pending' | 'accepted' | 'rejected';
}

/**
 * Event filter for querying historical events
 */
export interface EventFilter {
    fromBlock?: number;
    toBlock?: number | 'latest';
    contractAddress?: StarknetAddress;
    keys?: string[];
}

/**
 * Cache configuration options
 */
export interface CacheOptions {
    /** Time-to-live in milliseconds */
    ttl?: number;
    /** Maximum number of cache entries */
    maxEntries?: number;
    /** Whether to bypass cache for this request */
    bypassCache?: boolean;
}
