import { Provider, Contract } from 'starknet';
import { MIPAsset, AssetFilter, AssetQueryResult } from '../types/asset';

export class MIPAssetsService {
    private provider: Provider;
    private contractAddress: string;
    private contract: Contract | null = null;

    constructor(network: 'sepolia' | 'mainnet' = 'sepolia') {
        // Use the existing starknet configuration
        this.provider = new Provider({
            sequencer: {
                network: network === 'sepolia' ? 'SN_SEPOLIA' : 'SN_MAIN'
            }
        });

        this.contractAddress = network === 'sepolia'
            ? process.env.NEXT_PUBLIC_MIP_CONTRACT_SEPOLIA || ''
            : process.env.NEXT_PUBLIC_MIP_CONTRACT_MAINNET || '';
    }

    private async initContract() {
        if (!this.contract && this.contractAddress) {
            // Simplified ABI for testing - replace with actual MIP contract ABI
            const abi = [
                {
                    "name": "totalSupply",
                    "type": "function",
                    "inputs": [],
                    "outputs": [{ "name": "totalSupply", "type": "Uint256" }],
                    "stateMutability": "view"
                }
            ];
            this.contract = new Contract(abi, this.contractAddress, this.provider);
        }
    }

    async fetchAllAssets(
        page: number = 0,
        limit: number = 20,
        filters?: AssetFilter
    ): Promise<AssetQueryResult> {
        try {
            // For now, return mock data for testing
            // Replace this with actual contract calls once ABI is available
            const mockAssets = this.generateMockAssets(page, limit, filters);

            return {
                assets: mockAssets,
                totalCount: 1000, // Mock total
                hasMore: page < 10 // Mock pagination
            };

        } catch (error) {
            console.error('Error fetching assets:', error);
            return {
                assets: [],
                totalCount: 0,
                hasMore: false
            };
        }
    }

    private generateMockAssets(page: number, limit: number, filters?: AssetFilter): MIPAsset[] {
        const mockAssets: MIPAsset[] = [];
        const offset = page * limit;

        for (let i = 0; i < limit; i++) {
            const id = (offset + i + 1).toString();
            const asset: MIPAsset = {
                id,
                name: `Mock Asset #${id}`,
                creator: `0x${Math.random().toString(16).substr(2, 40)}`,
                collection: `Collection ${Math.floor(Math.random() * 5) + 1}`,
                timestamp: Date.now() - Math.random() * 10000000000,
                tags: [`tag${Math.floor(Math.random() * 10)}`, `category${Math.floor(Math.random() * 5)}`],
                metadata: {
                    description: `This is a mock description for asset ${id}`,
                    image: `https://picsum.photos/400/400?random=${id}`,
                    attributes: {
                        rarity: Math.random() > 0.5 ? 'common' : 'rare',
                        type: 'artwork'
                    }
                },
                contractAddress: this.contractAddress,
                tokenId: id
            };

            // Apply filters if provided
            if (this.matchesFilters(asset, filters)) {
                mockAssets.push(asset);
            }
        }

        return mockAssets;
    }

    private matchesFilters(asset: MIPAsset, filters?: AssetFilter): boolean {
        if (!filters) return true;

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
                asset.name.toLowerCase().includes(searchLower) ||
                asset.creator.toLowerCase().includes(searchLower) ||
                asset.metadata.description?.toLowerCase().includes(searchLower) ||
                asset.tags.some(tag => tag.toLowerCase().includes(searchLower));

            if (!matchesSearch) return false;
        }

        if (filters.creator && asset.creator !== filters.creator) return false;
        if (filters.collection && asset.collection !== filters.collection) return false;

        return true;
    }

    private applyFilters(assets: MIPAsset[], filters?: AssetFilter): MIPAsset[] {
        if (!filters) return assets;
        return assets.filter(asset => this.matchesFilters(asset, filters));
    }

    private sortAssets(
        assets: MIPAsset[],
        sortBy: string,
        sortOrder: 'asc' | 'desc' = 'desc'
    ): MIPAsset[] {
        return [...assets].sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'timestamp':
                    comparison = a.timestamp - b.timestamp;
                    break;
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'creator':
                    comparison = a.creator.localeCompare(b.creator);
                    break;
                default:
                    return 0;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }

    async searchAssets(query: string, limit: number = 10): Promise<MIPAsset[]> {
        const result = await this.fetchAllAssets(0, limit, { search: query });
        return result.assets;
    }
}

// Export singleton instance
export const mipAssetsService = new MIPAssetsService();