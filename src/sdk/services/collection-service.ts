/**
 * Collection Service
 * 
 * Service layer for IP Collection operations
 */

import type { Abi } from 'starknet';
import type { SdkProvider } from '../core/provider';
import type { SDKConfig, RequestOptions } from '../types/provider';
import type { StarknetAddress, PaginationParams, PaginatedResponse } from '../types/common';
import type {
    Collection,
    CollectionStats,
    RawCollectionData,
    RawCollectionStats,
    CreateCollectionParams,
    MintParams,
    BatchMintParams,
    CollectionFilter,
    CollectionIPFSMetadata,
} from '../types/collection';
import { ipCollectionAbi } from '@/abis/ip_collection';
import { normalizeAddress, decimalToHex, isZeroAddress } from '../utils/address';
import { fetchIPFSMetadata, processIPFSUrl, extractCID, processMetadataImage } from '../utils/ipfs';
import { parseU256, parseBoolean, cleanString, formatU256 } from '../utils/serialization';

const COLLECTION_ABI = ipCollectionAbi as Abi;

/**
 * Collection Service
 * 
 * Provides methods for reading and writing to IP Collection contracts
 */
export class CollectionService {
    private provider: SdkProvider;
    private contractAddress: StarknetAddress;
    private ipfsGateway: string;

    constructor(provider: SdkProvider, config: SDKConfig) {
        this.provider = provider;
        this.contractAddress = config.collectionContractAddress;
        this.ipfsGateway = config.ipfsGateway || 'https://gateway.pinata.cloud';
    }

    // ==================
    // Read Operations
    // ==================

    /**
     * Get a single collection by ID
     */
    async getCollection(id: string, options?: RequestOptions): Promise<Collection> {
        // Validate collection exists
        const isValid = await this.isValidCollection(id, options);
        if (!isValid) {
            throw new Error(`Collection ${id} does not exist`);
        }

        // Fetch collection data and stats in parallel
        const [rawCollection, rawStats] = await Promise.all([
            this.provider.callContract<RawCollectionData>(
                this.contractAddress,
                COLLECTION_ABI,
                'get_collection',
                [id],
                options
            ),
            this.provider.callContract<RawCollectionStats>(
                this.contractAddress,
                COLLECTION_ABI,
                'get_collection_stats',
                [id],
                options
            ),
        ]);

        return this.processCollectionData(id, rawCollection, rawStats);
    }

    /**
     * Get all valid collections
     */
    async getAllCollections(options?: RequestOptions): Promise<Collection[]> {
        const maxId = await this.findMaxCollectionId(options);

        if (maxId < 0) {
            return [];
        }

        // Build list of all potential IDs
        const allIds = Array.from({ length: maxId + 1 }, (_, i) => i);

        // Check validity in batches
        const BATCH_SIZE = 50;
        const validIds: number[] = [];

        for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
            const batch = allIds.slice(i, i + BATCH_SIZE);
            const results = await Promise.all(
                batch.map(id =>
                    this.isValidCollection(id.toString(), options).catch(() => false)
                )
            );

            results.forEach((isValid, index) => {
                if (isValid) {
                    validIds.push(batch[index]);
                }
            });
        }

        // Fetch collection data for valid IDs
        const collections = await Promise.all(
            validIds.map(id =>
                this.getCollection(id.toString(), options).catch(() => null)
            )
        );

        return collections.filter((c): c is Collection => c !== null);
    }

    /**
     * Get collections with pagination
     */
    async getCollectionsPaginated(
        params: PaginationParams = {},
        filter?: CollectionFilter,
        options?: RequestOptions
    ): Promise<PaginatedResponse<Collection>> {
        const { page = 1, pageSize = 12 } = params;

        // Get all collections first (could be optimized with proper indexing)
        let collections = await this.getAllCollections(options);

        // Apply filters
        if (filter) {
            collections = this.applyFilters(collections, filter);
        }

        // Calculate pagination
        const total = collections.length;
        const start = (page - 1) * pageSize;
        const items = collections.slice(start, start + pageSize);

        return {
            items,
            total,
            page,
            pageSize,
            hasMore: start + pageSize < total,
        };
    }

    /**
     * Get collections owned by a specific user
     */
    async getUserCollections(
        userAddress: StarknetAddress,
        options?: RequestOptions
    ): Promise<Collection[]> {
        const normalizedAddress = normalizeAddress(userAddress);

        const collectionIds = await this.provider.callContract<string[]>(
            this.contractAddress,
            COLLECTION_ABI,
            'list_user_collections',
            [normalizedAddress],
            options
        );

        if (!collectionIds || collectionIds.length === 0) {
            return [];
        }

        const collections = await Promise.all(
            collectionIds.map(id =>
                this.getCollection(formatU256(id), options).catch(() => null)
            )
        );

        return collections.filter((c): c is Collection => c !== null);
    }

    /**
     * Get collection statistics
     */
    async getCollectionStats(id: string, options?: RequestOptions): Promise<CollectionStats> {
        const rawStats = await this.provider.callContract<RawCollectionStats>(
            this.contractAddress,
            COLLECTION_ABI,
            'get_collection_stats',
            [id],
            options
        );

        return {
            totalMinted: parseInt(formatU256(rawStats.total_minted)) || 0,
            totalBurned: parseInt(formatU256(rawStats.total_burned)) || 0,
            totalTransfers: parseInt(formatU256(rawStats.total_transfers)) || 0,
            lastMintTime: formatU256(rawStats.last_mint_time),
            lastBurnTime: formatU256(rawStats.last_burn_time),
            lastTransferTime: formatU256(rawStats.last_transfer_time),
        };
    }

    /**
     * Check if a collection is valid
     */
    async isValidCollection(id: string, options?: RequestOptions): Promise<boolean> {
        const result = await this.provider.callContract<unknown>(
            this.contractAddress,
            COLLECTION_ABI,
            'is_valid_collection',
            [id],
            options
        );

        return parseBoolean(result);
    }

    /**
     * Check if an address is the owner of a collection
     */
    async isCollectionOwner(
        id: string,
        owner: StarknetAddress,
        options?: RequestOptions
    ): Promise<boolean> {
        const result = await this.provider.callContract<unknown>(
            this.contractAddress,
            COLLECTION_ABI,
            'is_collection_owner',
            [id, normalizeAddress(owner)],
            options
        );

        return parseBoolean(result);
    }

    // ==================
    // Write Operations (Transaction Builders)
    // ==================

    /**
     * Build a create collection transaction call
     */
    buildCreateCollectionCall(params: CreateCollectionParams): {
        contractAddress: StarknetAddress;
        entrypoint: string;
        calldata: (string | number)[];
    } {
        const { name, symbol, baseUri } = params;

        if (!name || !name.trim()) {
            throw new Error('Collection name is required');
        }

        if (!baseUri || !baseUri.trim()) {
            throw new Error('Base URI is required');
        }

        // Clean and uppercase the symbol
        const cleanSymbol = (symbol || '')
            .replace(/[^a-zA-Z0-9]/g, '')
            .toUpperCase() || 'COLL';

        return {
            contractAddress: this.contractAddress,
            entrypoint: 'create_collection',
            calldata: [name, cleanSymbol, baseUri],
        };
    }

    /**
     * Build a mint transaction call
     */
    buildMintCall(params: MintParams): {
        contractAddress: StarknetAddress;
        entrypoint: string;
        calldata: (string | number)[];
    } {
        const { collectionId, recipient, tokenUri } = params;

        if (!collectionId) {
            throw new Error('Collection ID is required');
        }

        if (!recipient) {
            throw new Error('Recipient address is required');
        }

        if (!tokenUri) {
            throw new Error('Token URI is required');
        }

        return {
            contractAddress: this.contractAddress,
            entrypoint: 'mint',
            calldata: [collectionId, normalizeAddress(recipient), tokenUri],
        };
    }

    /**
     * Build a batch mint transaction call
     */
    buildBatchMintCall(params: BatchMintParams): {
        contractAddress: StarknetAddress;
        entrypoint: string;
        calldata: (string | number)[];
    } {
        const { collectionId, recipients, tokenUris } = params;

        if (!collectionId) {
            throw new Error('Collection ID is required');
        }

        if (!recipients || recipients.length === 0) {
            throw new Error('At least one recipient is required');
        }

        if (!tokenUris || tokenUris.length !== recipients.length) {
            throw new Error('Token URIs must match recipients count');
        }

        const normalizedRecipients = recipients.map(r => normalizeAddress(r));

        return {
            contractAddress: this.contractAddress,
            entrypoint: 'batch_mint',
            calldata: [collectionId, normalizedRecipients, tokenUris],
        };
    }

    // ==================
    // Helper Methods
    // ==================

    /**
     * Find the maximum valid collection ID
     */
    private async findMaxCollectionId(options?: RequestOptions): Promise<number> {
        let highestFound = -1;
        let startFound = false;

        // Initial scan: check 0-20
        const initialBatch = Array.from({ length: 21 }, (_, i) => i);
        const initialResults = await Promise.all(
            initialBatch.map(id =>
                this.isValidCollection(id.toString(), options).catch(() => false)
            )
        );

        for (let i = 0; i < initialResults.length; i++) {
            if (initialResults[i]) {
                highestFound = Math.max(highestFound, initialBatch[i]);
                startFound = true;
            }
        }

        if (!startFound) {
            // Try larger probes
            const probes = [50, 100, 1000];
            const probeResults = await Promise.all(
                probes.map(id => this.isValidCollection(id.toString(), options).catch(() => false))
            );
            for (let i = 0; i < probes.length; i++) {
                if (probeResults[i]) {
                    highestFound = probes[i];
                    startFound = true;
                }
            }
            if (!startFound) return -1;
        }

        // Probe forward to find the maximum
        let keepProbing = true;
        while (keepProbing) {
            const offsets = [1, 2, 3, 4, 5, 10, 20, 50, 100, 500, 1000];
            const probes = offsets.map(o => highestFound + o);
            const results = await Promise.all(
                probes.map(id => this.isValidCollection(id.toString(), options).catch(() => false))
            );

            let foundHigher = false;
            for (let i = 0; i < probes.length; i++) {
                if (results[i] && probes[i] > highestFound) {
                    highestFound = probes[i];
                    foundHigher = true;
                }
            }

            keepProbing = foundHigher;
        }

        return highestFound;
    }

    /**
     * Process raw collection data into Collection type
     */
    private async processCollectionData(
        id: string,
        raw: RawCollectionData,
        stats: RawCollectionStats
    ): Promise<Collection> {
        // Process addresses
        let nftAddress = raw.ip_nft;
        if (nftAddress && !isZeroAddress(nftAddress)) {
            nftAddress = decimalToHex(nftAddress);
        } else {
            nftAddress = '0x0' as StarknetAddress;
        }

        let owner = raw.owner;
        if (owner && !isZeroAddress(owner)) {
            owner = decimalToHex(owner);
        } else {
            owner = '0x0' as StarknetAddress;
        }

        // Process base URI and fetch IPFS metadata
        const baseUri = processIPFSUrl(raw.base_uri, this.ipfsGateway, '');
        let ipfsMetadata: CollectionIPFSMetadata | null = null;

        const cid = extractCID(raw.base_uri);
        if (cid) {
            try {
                ipfsMetadata = await fetchIPFSMetadata(cid, this.ipfsGateway) as CollectionIPFSMetadata;
            } catch {
                // Ignore IPFS errors
            }
        }

        // Process stats
        const totalMinted = parseInt(formatU256(stats.total_minted)) || 0;
        const totalBurned = parseInt(formatU256(stats.total_burned)) || 0;

        // Build collection object
        return {
            id,
            name: cleanString(raw.name) || 'MIP Collection',
            symbol: cleanString(raw.symbol) || '',
            baseUri,
            description: ipfsMetadata?.description || 'Programmable Intellectual Property Collection',
            image: processMetadataImage(ipfsMetadata, this.ipfsGateway, '/placeholder.svg'),
            owner: owner as StarknetAddress,
            nftAddress: nftAddress as StarknetAddress,
            isActive: parseBoolean(raw.is_active),
            totalMinted,
            totalBurned,
            totalTransfers: parseInt(formatU256(stats.total_transfers)) || 0,
            itemCount: totalMinted - totalBurned,
            totalSupply: totalMinted,
            lastMintTime: formatU256(stats.last_mint_time),
            lastBurnTime: formatU256(stats.last_burn_time),
            lastTransferTime: formatU256(stats.last_transfer_time),
            type: ipfsMetadata?.type,
            visibility: ipfsMetadata?.visibility,
            enableVersioning: ipfsMetadata?.enableVersioning,
            allowComments: ipfsMetadata?.allowComments,
            requireApproval: ipfsMetadata?.requireApproval,
        };
    }

    /**
     * Apply filters to a list of collections
     */
    private applyFilters(collections: Collection[], filter: CollectionFilter): Collection[] {
        return collections.filter(collection => {
            if (filter.owner && normalizeAddress(filter.owner) !== normalizeAddress(collection.owner)) {
                return false;
            }
            if (filter.isActive !== undefined && collection.isActive !== filter.isActive) {
                return false;
            }
            if (filter.type && collection.type !== filter.type) {
                return false;
            }
            if (filter.search) {
                const searchLower = filter.search.toLowerCase();
                const nameMatch = collection.name.toLowerCase().includes(searchLower);
                const descMatch = collection.description?.toLowerCase().includes(searchLower);
                if (!nameMatch && !descMatch) {
                    return false;
                }
            }
            return true;
        });
    }
}
