/**
 * SDK Configuration
 * 
 * Centralized configuration management for the Mediolano SDK
 */

import type { SDKConfig, SDKInstanceOptions } from '../types/provider';
import { DEFAULT_CONFIG, NETWORK_CONFIG } from '../types/provider';
import type { StarknetAddress } from '../types/common';

/**
 * Get configuration from environment variables
 */
export function getEnvConfig(): Partial<SDKConfig> {
    const network = (process.env.NEXT_PUBLIC_STARKNET_NETWORK || 'mainnet') as 'mainnet' | 'sepolia';

    return {
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || '',
        network,
        collectionContractAddress: (process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS || '') as StarknetAddress,
        ipfsGateway: process.env.NEXT_PUBLIC_GATEWAY_URL || DEFAULT_CONFIG.ipfsGateway,
        explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || NETWORK_CONFIG[network].explorerUrl,
        startBlock: process.env.NEXT_PUBLIC_START_BLOCK
            ? parseInt(process.env.NEXT_PUBLIC_START_BLOCK)
            : NETWORK_CONFIG[network].startBlock,
    };
}

/**
 * Merge configurations with proper precedence
 */
export function mergeConfig(
    userConfig: Partial<SDKConfig>,
    envConfig: Partial<SDKConfig> = getEnvConfig()
): SDKConfig {
    const network = userConfig.network || envConfig.network || 'mainnet';

    return {
        rpcUrl: userConfig.rpcUrl || envConfig.rpcUrl || '',
        network,
        collectionContractAddress: userConfig.collectionContractAddress ||
            envConfig.collectionContractAddress ||
            '' as StarknetAddress,
        timeout: userConfig.timeout || envConfig.timeout || DEFAULT_CONFIG.timeout!,
        maxRetries: userConfig.maxRetries ?? envConfig.maxRetries ?? DEFAULT_CONFIG.maxRetries!,
        retryDelayMs: userConfig.retryDelayMs ?? envConfig.retryDelayMs ?? DEFAULT_CONFIG.retryDelayMs!,
        ipfsGateway: userConfig.ipfsGateway || envConfig.ipfsGateway || DEFAULT_CONFIG.ipfsGateway!,
        explorerUrl: userConfig.explorerUrl || envConfig.explorerUrl || NETWORK_CONFIG[network].explorerUrl,
        startBlock: userConfig.startBlock ?? envConfig.startBlock ?? NETWORK_CONFIG[network].startBlock,
        cacheOptions: {
            ...DEFAULT_CONFIG.cacheOptions,
            ...envConfig.cacheOptions,
            ...userConfig.cacheOptions,
        },
    };
}

/**
 * Validate SDK configuration
 */
export function validateConfig(config: SDKConfig): void {
    if (!config.rpcUrl) {
        throw new Error('SDK Error: rpcUrl is required. Set NEXT_PUBLIC_RPC_URL environment variable or pass in config.');
    }

    if (!config.collectionContractAddress) {
        throw new Error('SDK Error: collectionContractAddress is required. Set NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS environment variable or pass in config.');
    }

    if (!config.collectionContractAddress.startsWith('0x')) {
        throw new Error('SDK Error: collectionContractAddress must be a valid hex address starting with 0x');
    }
}

/**
 * Create a complete SDK instance options from partial config
 */
export function createInstanceOptions(config: Partial<SDKInstanceOptions> = {}): SDKInstanceOptions {
    const envConfig = getEnvConfig();
    const mergedConfig = mergeConfig(config, envConfig);

    return {
        ...mergedConfig,
        indexer: config.indexer,
        debug: config.debug ?? false,
    };
}
