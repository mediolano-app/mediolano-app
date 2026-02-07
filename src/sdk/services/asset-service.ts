/**
 * Asset Service
 * 
 * Service layer for IP Asset (NFT) operations
 */

import type { Abi } from 'starknet';
import type { SdkProvider } from '../core/provider';
import type { SDKConfig, RequestOptions } from '../types/provider';
import type { StarknetAddress, PaginationParams, PaginatedResponse } from '../types/common';
import type {
    Asset,
    RawTokenData,
    AssetMetadata,
    TransferParams,
    BatchTransferParams,
    BurnParams,
    BatchBurnParams,
    AssetFilter,
    DisplayAsset,
} from '../types/asset';
import { COLLECTION_NFT_ABI } from '@/abis/ip_nft';
import { ipCollectionAbi } from '@/abis/ip_collection';
import { normalizeAddress, decimalToHex, isZeroAddress } from '../utils/address';
import { fetchIPFSMetadata, processIPFSUrl, extractCID, processMetadataImage } from '../utils/ipfs';
import { parseU256, cleanString, formatU256, parseBoolean } from '../utils/serialization';

const NFT_ABI = COLLECTION_NFT_ABI as Abi;
const COLLECTION_ABI = ipCollectionAbi as Abi;

/**
 * Asset Service
 * 
 * Provides methods for reading and writing to IP NFT contracts
 */
export class AssetService {
    private provider: SdkProvider;
    private collectionContractAddress: StarknetAddress;
    private ipfsGateway: string;

    constructor(provider: SdkProvider, config: SDKConfig) {
        this.provider = provider;
        this.collectionContractAddress = config.collectionContractAddress;
        this.ipfsGateway = config.ipfsGateway || 'https://gateway.pinata.cloud';
    }

    // ==================
    // Read Operations
    // ==================

    /**
     * Get a single asset by NFT address and token ID
     */
    async getAsset(
        nftAddress: StarknetAddress,
        tokenId: number,
        options?: RequestOptions
    ): Promise<Asset> {
        const normalizedAddress = normalizeAddress(nftAddress);

        // Fetch token data from the NFT contract
        const [owner, tokenUri] = await Promise.all([
            this.getTokenOwner(normalizedAddress, tokenId, options),
            this.getTokenUri(normalizedAddress, tokenId, options),
        ]);

        // Fetch metadata from IPFS
        const metadata = await this.fetchAssetMetadata(tokenUri);

        // Get collection ID from token if possible
        let collectionId = '';
        try {
            const token = `${formatU256(tokenId)}`;
            const tokenData = await this.getTokenData(token, options);
            collectionId = formatU256(tokenData.collection_id);
        } catch {
            // Collection ID lookup failed, continue without it
        }

        return this.buildAsset({
            nftAddress: normalizedAddress,
            tokenId,
            owner,
            tokenUri,
            collectionId,
            metadata,
        });
    }

    /**
     * Get token data from the registry contract
     */
    async getTokenData(token: string, options?: RequestOptions): Promise<RawTokenData> {
        return this.provider.callContract<RawTokenData>(
            this.collectionContractAddress,
            COLLECTION_ABI,
            'get_token',
            [token],
            options
        );
    }

    /**
     * Get all assets for a collection
     */
    async getCollectionAssets(
        nftAddress: StarknetAddress,
        options?: RequestOptions
    ): Promise<Asset[]> {
        const normalizedAddress = normalizeAddress(nftAddress);

        // Get total supply
        const totalSupply = await this.getTotalSupply(normalizedAddress, options);

        if (totalSupply === 0) {
            return [];
        }

        // Fetch assets in batches
        const BATCH_SIZE = 20;
        const assets: Asset[] = [];

        for (let i = 0; i < totalSupply; i += BATCH_SIZE) {
            const batch: number[] = [];
            for (let j = i; j < Math.min(i + BATCH_SIZE, totalSupply); j++) {
                batch.push(j);
            }

            const batchAssets = await Promise.all(
                batch.map(async (tokenId) => {
                    try {
                        return await this.getAsset(normalizedAddress, tokenId, options);
                    } catch {
                        return null;
                    }
                })
            );

            assets.push(...batchAssets.filter((a): a is Asset => a !== null));
        }

        return assets;
    }

    /**
     * Get assets with pagination
     */
    async getCollectionAssetsPaginated(
        nftAddress: StarknetAddress,
        params: PaginationParams = {},
        filter?: AssetFilter,
        options?: RequestOptions
    ): Promise<PaginatedResponse<Asset>> {
        const { page = 1, pageSize = 12 } = params;

        // Get all assets (could be optimized with indexing)
        let assets = await this.getCollectionAssets(nftAddress, options);

        // Apply filters
        if (filter) {
            assets = this.applyFilters(assets, filter);
        }

        // Calculate pagination
        const total = assets.length;
        const start = (page - 1) * pageSize;
        const items = assets.slice(start, start + pageSize);

        return {
            items,
            total,
            page,
            pageSize,
            hasMore: start + pageSize < total,
        };
    }

    /**
     * Get assets owned by a user within a collection
     */
    async getUserAssets(
        nftAddress: StarknetAddress,
        userAddress: StarknetAddress,
        options?: RequestOptions
    ): Promise<Asset[]> {
        const normalizedNftAddress = normalizeAddress(nftAddress);
        const normalizedUserAddress = normalizeAddress(userAddress);

        // Get user's balance
        const balance = await this.getBalance(normalizedNftAddress, normalizedUserAddress, options);

        if (balance === 0) {
            return [];
        }

        // Get token IDs owned by user
        const tokenIds: number[] = [];
        for (let i = 0; i < balance; i++) {
            try {
                const tokenId = await this.getTokenOfOwnerByIndex(
                    normalizedNftAddress,
                    normalizedUserAddress,
                    i,
                    options
                );
                tokenIds.push(tokenId);
            } catch {
                break;
            }
        }

        // Fetch assets
        const assets = await Promise.all(
            tokenIds.map(id =>
                this.getAsset(normalizedNftAddress, id, options).catch(() => null)
            )
        );

        return assets.filter((a): a is Asset => a !== null);
    }

    /**
     * Get user tokens per collection from the registry
     */
    async getUserTokensPerCollection(
        collectionId: string,
        userAddress: StarknetAddress,
        options?: RequestOptions
    ): Promise<string[]> {
        const result = await this.provider.callContract<unknown[]>(
            this.collectionContractAddress,
            COLLECTION_ABI,
            'list_user_tokens_per_collection',
            [collectionId, normalizeAddress(userAddress)],
            options
        );

        return Array.isArray(result) ? result.map(id => formatU256(id)) : [];
    }

    /**
     * Check if a token is valid
     */
    async isValidToken(token: string, options?: RequestOptions): Promise<boolean> {
        const result = await this.provider.callContract<unknown>(
            this.collectionContractAddress,
            COLLECTION_ABI,
            'is_valid_token',
            [token],
            options
        );

        return parseBoolean(result);
    }

    // ==================
    // NFT Standard Read Operations
    // ==================

    /**
     * Get token owner
     */
    async getTokenOwner(
        nftAddress: StarknetAddress,
        tokenId: number,
        options?: RequestOptions
    ): Promise<StarknetAddress> {
        const result = await this.provider.callContract<string>(
            nftAddress,
            NFT_ABI,
            'owner_of',
            [tokenId],
            options
        );

        return decimalToHex(result);
    }

    /**
     * Get token URI
     */
    async getTokenUri(
        nftAddress: StarknetAddress,
        tokenId: number,
        options?: RequestOptions
    ): Promise<string> {
        const result = await this.provider.callContract<string>(
            nftAddress,
            NFT_ABI,
            'token_uri',
            [tokenId],
            options
        );

        return cleanString(result);
    }

    /**
     * Get total supply of a collection
     */
    async getTotalSupply(
        nftAddress: StarknetAddress,
        options?: RequestOptions
    ): Promise<number> {
        const result = await this.provider.callContract<unknown>(
            nftAddress,
            NFT_ABI,
            'total_supply',
            [],
            options
        );

        return Number(parseU256(result));
    }

    /**
     * Get balance of an address
     */
    async getBalance(
        nftAddress: StarknetAddress,
        ownerAddress: StarknetAddress,
        options?: RequestOptions
    ): Promise<number> {
        const result = await this.provider.callContract<unknown>(
            nftAddress,
            NFT_ABI,
            'balance_of',
            [normalizeAddress(ownerAddress)],
            options
        );

        return Number(parseU256(result));
    }

    /**
     * Get token by index for an owner
     */
    async getTokenOfOwnerByIndex(
        nftAddress: StarknetAddress,
        ownerAddress: StarknetAddress,
        index: number,
        options?: RequestOptions
    ): Promise<number> {
        const result = await this.provider.callContract<unknown>(
            nftAddress,
            NFT_ABI,
            'token_of_owner_by_index',
            [normalizeAddress(ownerAddress), index],
            options
        );

        return Number(parseU256(result));
    }

    // ==================
    // Write Operations (Transaction Builders)
    // ==================

    /**
     * Build a transfer transaction call
     */
    buildTransferCall(params: TransferParams): {
        contractAddress: StarknetAddress;
        entrypoint: string;
        calldata: (string | number)[];
    } {
        const { from, to, token } = params;

        if (!from) throw new Error('From address is required');
        if (!to) throw new Error('To address is required');
        if (!token) throw new Error('Token is required');

        return {
            contractAddress: this.collectionContractAddress,
            entrypoint: 'transfer_token',
            calldata: [normalizeAddress(from), normalizeAddress(to), token],
        };
    }

    /**
     * Build a batch transfer transaction call
     */
    buildBatchTransferCall(params: BatchTransferParams): {
        contractAddress: StarknetAddress;
        entrypoint: string;
        calldata: (string | number | string[])[];
    } {
        const { from, to, tokens } = params;

        if (!from) throw new Error('From address is required');
        if (!to) throw new Error('To address is required');
        if (!tokens || tokens.length === 0) throw new Error('At least one token is required');

        return {
            contractAddress: this.collectionContractAddress,
            entrypoint: 'batch_transfer',
            calldata: [normalizeAddress(from), normalizeAddress(to), tokens],
        };
    }

    /**
     * Build a burn transaction call
     */
    buildBurnCall(params: BurnParams): {
        contractAddress: StarknetAddress;
        entrypoint: string;
        calldata: string[];
    } {
        const { token } = params;

        if (!token) throw new Error('Token is required');

        return {
            contractAddress: this.collectionContractAddress,
            entrypoint: 'burn',
            calldata: [token],
        };
    }

    /**
     * Build a batch burn transaction call
     */
    buildBatchBurnCall(params: BatchBurnParams): {
        contractAddress: StarknetAddress;
        entrypoint: string;
        calldata: (string | string[])[];
    } {
        const { tokens } = params;

        if (!tokens || tokens.length === 0) throw new Error('At least one token is required');

        return {
            contractAddress: this.collectionContractAddress,
            entrypoint: 'batch_burn',
            calldata: [tokens],
        };
    }

    // ==================
    // Helper Methods
    // ==================

    /**
     * Fetch asset metadata from IPFS
     */
    private async fetchAssetMetadata(tokenUri: string): Promise<AssetMetadata | null> {
        if (!tokenUri) return null;

        const cid = extractCID(tokenUri);
        if (!cid) return null;

        try {
            return await fetchIPFSMetadata(cid, this.ipfsGateway) as AssetMetadata;
        } catch {
            return null;
        }
    }

    /**
     * Build Asset object from raw data
     */
    private buildAsset(params: {
        nftAddress: StarknetAddress;
        tokenId: number;
        owner: StarknetAddress;
        tokenUri: string;
        collectionId: string;
        metadata: AssetMetadata | null;
    }): Asset {
        const { nftAddress, tokenId, owner, tokenUri, collectionId, metadata } = params;

        return {
            tokenId,
            nftAddress,
            collectionId,
            name: metadata?.name || `Token #${tokenId}`,
            description: metadata?.description,
            image: processMetadataImage(metadata, this.ipfsGateway, '/placeholder.svg'),
            owner,
            tokenUri,
            ipfsCid: extractCID(tokenUri) || undefined,
            type: metadata?.type,
            registrationDate: metadata?.registrationDate,
            licenseType: metadata?.licenseType,
            externalUrl: metadata?.external_url,
            tags: metadata?.tags,
            attributes: metadata?.attributes?.map(attr => ({
                trait_type: String(attr.trait_type),
                value: attr.value,
            })),
            properties: metadata?.properties,
        };
    }

    /**
     * Apply filters to a list of assets
     */
    private applyFilters(assets: Asset[], filter: AssetFilter): Asset[] {
        return assets.filter(asset => {
            if (filter.owner && normalizeAddress(filter.owner) !== normalizeAddress(asset.owner)) {
                return false;
            }
            if (filter.type && asset.type !== filter.type) {
                return false;
            }
            if (filter.search) {
                const searchLower = filter.search.toLowerCase();
                const nameMatch = asset.name.toLowerCase().includes(searchLower);
                const descMatch = asset.description?.toLowerCase().includes(searchLower);
                if (!nameMatch && !descMatch) {
                    return false;
                }
            }
            return true;
        });
    }

    /**
     * Enrich asset with additional display data
     */
    async enrichAsset(
        asset: Asset,
        collectionName?: string
    ): Promise<DisplayAsset> {
        return {
            ...asset,
            collectionName,
            formattedOwner: asset.owner ? `${asset.owner.slice(0, 6)}...${asset.owner.slice(-4)}` : '',
            resolvedImage: processIPFSUrl(asset.image || '', this.ipfsGateway, '/placeholder.svg'),
        };
    }
}
