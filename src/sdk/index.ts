/**
 * Mediolano SDK
 * 
 * Main SDK entry point for the Mediolano Protocol (IP Collections)
 * 
 * @example
 * ```typescript
 * import { MediolanoSDK, createSDK } from '@/sdk';
 * 
 * // Create SDK with custom config
 * const sdk = createSDK({
 *   rpcUrl: 'https://starknet-mainnet.g.alchemy.com/v2/YOUR_KEY',
 *   network: 'mainnet',
 *   collectionContractAddress: '0x...',
 * });
 * 
 * // Or use environment variables
 * const sdk = createSDK();
 * 
 * // Use SDK services
 * const collections = await sdk.collections.getAllCollections();
 * const asset = await sdk.assets.getAsset('0x...', 1);
 * ```
 */

import { SdkProvider, validateConfig, mergeConfig, getEnvConfig } from './core';
import { CollectionService, AssetService } from './services';
import type { SDKConfig, SDKInstanceOptions } from './types/provider';

/**
 * Mediolano SDK Class
 * 
 * Main SDK class providing access to all Mediolano Protocol services
 */
export class MediolanoSDK {
    /** Collection operations service */
    public readonly collections: CollectionService;

    /** Asset (NFT) operations service */
    public readonly assets: AssetService;

    /** Internal provider instance */
    private readonly provider: SdkProvider;

    /** SDK configuration */
    private readonly config: SDKConfig;

    /**
     * Create a new SDK instance
     * 
     * @param config - SDK configuration options
     */
    constructor(config: Partial<SDKInstanceOptions> = {}) {
        // Merge with environment config and defaults
        this.config = mergeConfig(config, getEnvConfig());

        // Validate configuration
        validateConfig(this.config);

        // Create provider
        this.provider = new SdkProvider(this.config, config.debug);

        // Initialize services
        this.collections = new CollectionService(this.provider, this.config);
        this.assets = new AssetService(this.provider, this.config);
    }

    /**
     * Get the internal provider for advanced operations
     */
    getProvider(): SdkProvider {
        return this.provider;
    }

    /**
     * Get the current configuration
     */
    getConfig(): SDKConfig {
        return { ...this.config };
    }

    /**
     * Get provider status (connection, chain, block number)
     */
    async getStatus() {
        return this.provider.getStatus();
    }

    /**
     * Clear all cached data
     */
    clearCache(): void {
        this.provider.clearCache();
    }

    /**
     * Invalidate cache for a specific contract
     */
    invalidateContractCache(contractAddress: string): number {
        return this.provider.invalidateContract(contractAddress as `0x${string}`);
    }
}

// ========================
// Singleton Management
// ========================

let sdkInstance: MediolanoSDK | null = null;

/**
 * Create a new SDK instance
 * 
 * Use this when you need a fresh SDK instance with specific configuration.
 * For shared access across the application, use `getSDK()` instead.
 * 
 * @param config - Optional SDK configuration
 * @returns New MediolanoSDK instance
 */
export function createSDK(config: Partial<SDKInstanceOptions> = {}): MediolanoSDK {
    return new MediolanoSDK(config);
}

/**
 * Get or create the shared SDK instance
 * 
 * This returns a singleton SDK instance. Use this for shared access
 * across the application to benefit from caching.
 * 
 * @param config - Optional configuration (only used on first call)
 * @returns Shared MediolanoSDK instance
 */
export function getSDK(config?: Partial<SDKInstanceOptions>): MediolanoSDK {
    if (!sdkInstance) {
        sdkInstance = createSDK(config);
    }
    return sdkInstance;
}

/**
 * Reset the shared SDK instance
 * 
 * Useful for testing or when configuration needs to change.
 */
export function resetSDK(): void {
    sdkInstance?.clearCache();
    sdkInstance = null;
}

// ========================
// Re-exports
// ========================

// Types
export * from './types';

// Core
export { SdkProvider, CacheLayer, SDKErrorCodes, createSDKError } from './core';

// Services
export { CollectionService, AssetService } from './services';

// Utils
export * from './utils';
