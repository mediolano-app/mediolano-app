/**
 * SDK Provider
 * 
 * Abstraction over Starknet RpcProvider with caching, retry logic, and utilities
 */

import { RpcProvider, Contract, type Abi } from 'starknet';
import type { SDKConfig, ProviderConfig, RequestOptions } from '../types/provider';
import type { StarknetAddress, SDKError, ContractCall } from '../types/common';
import { CacheLayer } from './cache';

/**
 * SDK Provider class for Starknet interactions
 */
export class SdkProvider {
    private rpcProvider: RpcProvider;
    private cache: CacheLayer;
    private config: ProviderConfig;
    private debug: boolean;

    constructor(config: SDKConfig, debug: boolean = false) {
        this.config = {
            rpcUrl: config.rpcUrl,
            network: config.network,
            timeout: config.timeout ?? 30000,
            maxRetries: config.maxRetries ?? 3,
            retryDelayMs: config.retryDelayMs ?? 1000,
        };

        this.rpcProvider = new RpcProvider({
            nodeUrl: config.rpcUrl,
        });

        this.cache = new CacheLayer(config.cacheOptions);
        this.debug = debug;
    }

    /**
     * Get the underlying RPC provider
     */
    getRpcProvider(): RpcProvider {
        return this.rpcProvider;
    }

    /**
     * Get the cache instance
     */
    getCache(): CacheLayer {
        return this.cache;
    }

    /**
     * Call a contract method with caching and retry
     */
    async callContract<T>(
        contractAddress: StarknetAddress,
        abi: Abi,
        method: string,
        args: unknown[] = [],
        options: RequestOptions = {}
    ): Promise<T> {
        const cacheKey = CacheLayer.generateKey(
            `call:${contractAddress}:${method}`,
            ...args
        );

        // Check cache first
        if (!options.bypassCache) {
            const cached = this.cache.get<T>(cacheKey);
            if (cached !== undefined) {
                this.log(`Cache hit: ${cacheKey}`);
                return cached;
            }
        }

        // Execute with retry
        const result = await this.executeWithRetry<T>(async () => {
            const contract = new Contract(abi, contractAddress, this.rpcProvider);
            return await contract.call(method, args) as T;
        }, options);

        // Cache the result
        this.cache.set(cacheKey, result);

        return result;
    }

    /**
     * Execute an async operation with retry logic
     */
    async executeWithRetry<T>(
        operation: () => Promise<T>,
        options: RequestOptions = {}
    ): Promise<T> {
        let lastError: Error | null = null;
        const maxRetries = this.config.maxRetries;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                // Check for abort signal
                if (options.signal?.aborted) {
                    throw new Error('Request aborted');
                }

                return await operation();
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));

                // Don't retry on certain errors
                if (this.isNonRetryableError(lastError)) {
                    throw lastError;
                }

                if (attempt < maxRetries) {
                    const delay = this.calculateBackoff(attempt);
                    this.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms: ${lastError.message}`);
                    await this.sleep(delay);
                }
            }
        }

        throw lastError || new Error('Unknown error');
    }

    /**
     * Get the current block number
     */
    async getBlockNumber(): Promise<number> {
        const block = await this.rpcProvider.getBlockNumber();
        return block;
    }

    /**
     * Get provider status
     */
    async getStatus(): Promise<{
        connected: boolean;
        chainId: string;
        blockNumber: number;
        latency: number;
    }> {
        const start = Date.now();
        try {
            const [chainId, blockNumber] = await Promise.all([
                this.rpcProvider.getChainId(),
                this.rpcProvider.getBlockNumber(),
            ]);

            return {
                connected: true,
                chainId,
                blockNumber,
                latency: Date.now() - start,
            };
        } catch {
            return {
                connected: false,
                chainId: '',
                blockNumber: 0,
                latency: Date.now() - start,
            };
        }
    }

    /**
     * Build a contract call for transaction preparation
     */
    buildContractCall(
        contractAddress: StarknetAddress,
        entrypoint: string,
        calldata: string[]
    ): ContractCall {
        return {
            contractAddress,
            entrypoint,
            calldata,
        };
    }

    /**
     * Invalidate cache entries for a contract
     */
    invalidateContract(contractAddress: StarknetAddress): number {
        return this.cache.invalidatePattern(`call:${contractAddress}`);
    }

    /**
     * Clear all cache
     */
    clearCache(): void {
        this.cache.clear();
    }

    /**
     * Calculate exponential backoff delay
     */
    private calculateBackoff(attempt: number): number {
        const baseDelay = this.config.retryDelayMs;
        const maxDelay = 8000; // 8 seconds max
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        // Add jitter
        return delay + Math.random() * 200;
    }

    /**
     * Check if an error should not be retried
     */
    private isNonRetryableError(error: Error): boolean {
        const message = error.message.toLowerCase();
        return (
            message.includes('invalid') ||
            message.includes('not found') ||
            message.includes('does not exist') ||
            message.includes('aborted')
        );
    }

    /**
     * Sleep utility
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Debug logging
     */
    private log(message: string): void {
        if (this.debug) {
            console.log(`[MediolanoSDK] ${message}`);
        }
    }
}

/**
 * Create SDK error object
 */
export function createSDKError(
    code: string,
    message: string,
    details?: Record<string, unknown>
): SDKError {
    return { code, message, details };
}

/**
 * Common SDK error codes
 */
export const SDKErrorCodes = {
    PROVIDER_ERROR: 'PROVIDER_ERROR',
    CONTRACT_ERROR: 'CONTRACT_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
    NOT_FOUND: 'NOT_FOUND',
    NETWORK_ERROR: 'NETWORK_ERROR',
    CACHE_ERROR: 'CACHE_ERROR',
    TIMEOUT: 'TIMEOUT',
    ABORTED: 'ABORTED',
} as const;
