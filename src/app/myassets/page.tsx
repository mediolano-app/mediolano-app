"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Contract, RpcProvider, cairo, shortString } from 'starknet';
import { 
  MyAssetsProps, 
  UserPortfolio, 
  NFTAsset, 
  Asset, 
  AssetType,
  SortField,
  SortOrder,
  Blockchain,
  TokenStandard,
  isNFTAsset, 
  isGeneralAsset, 
  createAssetFromData,
  createNFTAssetFromData
} from '@/types/myasset';
import { AssetCard } from '@/components/my-assets/MyAssetCard';
import { LoadingSkeleton } from '@/components/my-assets/LoadingSkeleton';
import { ErrorMessage } from '@/components/my-assets/ErrorMessage';
import { Pagination } from '@/components/my-assets/Pagination';

// Starknet configuration
const STARKNET_PROVIDER = new RpcProvider({
  nodeUrl: process.env.NEXT_PUBLIC_STARKNET_RPC_URL || 'https://starknet-mainnet.public.blastapi.io'
});


const MIP_CONTRACT_ABI = [
  {
    "type": "function",
    "name": "balance_of",
    "inputs": [{"name": "account", "type": "core::starknet::contract_address::ContractAddress"}],
    "outputs": [{"type": "core::integer::u256"}],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "owner_of",
    "inputs": [{"name": "token_id", "type": "core::integer::u256"}],
    "outputs": [{"type": "core::starknet::contract_address::ContractAddress"}],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "token_uri",
    "inputs": [{"name": "token_id", "type": "core::integer::u256"}],
    "outputs": [{"type": "core::byte_array::ByteArray"}],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "total_supply",
    "inputs": [],
    "outputs": [{"type": "core::integer::u256"}],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "token_of_owner_by_index",
    "inputs": [
      {"name": "owner", "type": "core::starknet::contract_address::ContractAddress"},
      {"name": "index", "type": "core::integer::u256"}
    ],
    "outputs": [{"type": "core::integer::u256"}],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [{"type": "core::byte_array::ByteArray"}],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [{"type": "core::byte_array::ByteArray"}],
    "state_mutability": "view"
  }
];

// Contract address
const MIP_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MIP_CONTRACT_ADDRESS || "0x...";

// Types for Starknet integration
interface StarknetConfig {
  contractAddress: string;
  providerUrl: string;
}

interface TokenMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
  animation_url?: string;
}

// Enhanced props to include Starknet configuration
interface EnhancedMyAssetsProps extends MyAssetsProps {
  starknetConfig?: StarknetConfig;
  enableStarknetFetch?: boolean;
}

export const MyAssets: React.FC<EnhancedMyAssetsProps> = ({
  userAddress,
  onAssetSelect,
  onPortfolioUpdate,
  className = '',
  itemsPerPage = 12,
  assetType = 'all',
  assets = [],
  starknetConfig,
  enableStarknetFetch = true
}) => {
  const [portfolio, setPortfolio] = useState<UserPortfolio>({
    address: userAddress,
    totalAssets: 0,
    assets: [],
    nftAssets: [],
    generalAssets: [],
    loading: false,
    error: null,
    lastUpdated: new Date()
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortField>(SortField.TITLE);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [isLoadingFromStarknet, setIsLoadingFromStarknet] = useState(false);
  const [starknetError, setStarknetError] = useState<string | null>(null);

  // Initialize Starknet contract
  const contract = useMemo(() => {
    if (!enableStarknetFetch) return null;
    
    try {
      const contractAddress = starknetConfig?.contractAddress || MIP_CONTRACT_ADDRESS;
      const provider = starknetConfig?.providerUrl ? 
        new RpcProvider({ nodeUrl: starknetConfig.providerUrl }) : 
        STARKNET_PROVIDER;
      
      return new Contract(MIP_CONTRACT_ABI, contractAddress, provider);
    } catch (error) {
      console.error('Error initializing Starknet contract:', error);
      return null;
    }
  }, [starknetConfig, enableStarknetFetch]);

  // Helper function to convert ByteArray to string
  const byteArrayToString = useCallback((byteArray: any): string => {
    try {
      if (!byteArray || typeof byteArray !== 'object') return '';
      
      // Handle Cairo ByteArray structure
      if (byteArray.data && Array.isArray(byteArray.data)) {
        let result = '';
        
        // Process data array
        for (const item of byteArray.data) {
          result += shortString.decodeShortString(item);
        }
        
        // Process pending word if exists
        if (byteArray.pending_word && byteArray.pending_word_len > 0) {
          const pendingStr = shortString.decodeShortString(byteArray.pending_word);
          result += pendingStr.substring(0, Number(byteArray.pending_word_len));
        }
        
        return result;
      }
      
      return String(byteArray);
    } catch (error) {
      console.warn('Error converting ByteArray to string:', error);
      return '';
    }
  }, []);

  // Fetch metadata from URI
  const fetchMetadata = useCallback(async (uri: string): Promise<TokenMetadata | null> => {
    try {
      if (!uri) return null;
      
      
      const metadataUrl = uri.startsWith('ipfs://') 
        ? `https://ipfs.io/ipfs/${uri.slice(7)}`
        : uri;
      
      const response = await fetch(metadataUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const metadata = await response.json();
      return metadata;
    } catch (error) {
      console.warn('Error fetching metadata:', error);
      return null;
    }
  }, []);

  // Convert Starknet NFT data to NFTAsset using the enhanced factory function
  const convertToNFTAsset = useCallback(async (tokenId: string, tokenUri: string, ownerAddress: string): Promise<NFTAsset | null> => {
    try {
      const metadata = await fetchMetadata(tokenUri);
      
      // Create NFT asset using the factory function
      const nftData = {
        id: `${contract?.address || ''}_${tokenId}`,
        title: metadata?.name || `Token #${tokenId}`,
        description: metadata?.description || '',
        author: ownerAddress,
        registrationDate: new Date().toISOString(),
        type: AssetType.NFT,
        mediaUrl: metadata?.image || '',
        externalUrl: metadata?.external_url || '',
        tokenId: tokenId,
        contractAddress: contract?.address || '',
        owner: ownerAddress,
        blockchain: Blockchain.STARKNET,
        tokenStandard: TokenStandard.SRC5,
        name: metadata?.name || `Token #${tokenId}`,
        imageUrl: metadata?.image || '',
        nftMetadata: {
          name: metadata?.name || '',
          description: metadata?.description || '',
          image: metadata?.image || '',
          attributes: metadata?.attributes || [],
          external_url: metadata?.external_url || '',
          animation_url: metadata?.animation_url || ''
        },
        attributes: metadata?.attributes || [],
        verified: true,
        collection: 'Mediolano IP'
      };
      
      return createNFTAssetFromData(nftData);
    } catch (error) {
      console.error('Error converting to NFTAsset:', error);
      return null;
    }
  }, [contract?.address, fetchMetadata]);

  // Fetch user's NFTs from Starknet
  const fetchUserNFTs = useCallback(async (): Promise<NFTAsset[]> => {
    if (!contract || !userAddress || !enableStarknetFetch) return [];
    
    try {
      setIsLoadingFromStarknet(true);
      setStarknetError(null);
      
      // Get user's NFT balance
      const balanceResult = await contract.call('balance_of', [userAddress]);
      // Use the correct property name as returned by the Starknet SDK, e.g., 'balance' or the first property
      const balanceRaw = (balanceResult as any).balance ?? Object.values(balanceResult)[0];
      const balanceUint256 = cairo.uint256(balanceRaw);
      const balance = BigInt(balanceUint256.toString());
      
      if (balance === 0n) return [];
      
      const nfts: NFTAsset[] = [];
      
      // Fetch each NFT owned by the user
      for (let i = 0; i < Number(balance); i++) {
        try {
          // Get token ID by index
          const tokenIdResult = await contract.call('token_of_owner_by_index', [userAddress, cairo.uint256(i)]);
          
          const tokenIdRaw = (tokenIdResult as any).token_id ?? Object.values(tokenIdResult)[0];
          const tokenId = cairo.uint256(tokenIdRaw).toString();
          
          // Get token URI
          const tokenUriResult = await contract.call('token_uri', [cairo.uint256(tokenId)]);
          const tokenUriRaw = (tokenUriResult as any).token_uri ?? Object.values(tokenUriResult)[0];
          const tokenUri = byteArrayToString(tokenUriRaw);
          
          // Convert to NFTAsset
          const nftAsset = await convertToNFTAsset(tokenId, tokenUri, userAddress);
          if (nftAsset) {
            nfts.push(nftAsset);
          }
        } catch (error) {
          console.warn(`Error fetching NFT at index ${i}:`, error);
          continue;
        }
      }
      
      return nfts;
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch NFTs from Starknet';
      setStarknetError(errorMessage);
      return [];
    } finally {
      setIsLoadingFromStarknet(false);
    }
  }, [contract, userAddress, enableStarknetFetch, byteArrayToString, convertToNFTAsset]);

  // Helper function to ensure proper asset typing
  const processAssetData = useCallback((rawAsset: any): Asset | NFTAsset | null => {
    try {
      // Check if it's NFT data
      if (rawAsset.tokenId && rawAsset.contractAddress && rawAsset.owner) {
        return createNFTAssetFromData(rawAsset);
      } else {
        return createAssetFromData(rawAsset);
      }
    } catch (error) {
      console.warn('Error processing asset data:', error);
      return null;
    }
  }, []);

  // Process assets from both props and Starknet
  const processAssets = useCallback(async () => {
    try {
      setPortfolio(prev => ({ ...prev, loading: true, error: null }));
      
      // Process assets from props
      const nftAssets: NFTAsset[] = [];
      const generalAssets: Asset[] = [];
      
      if (Array.isArray(assets)) {
        assets.forEach(rawAsset => {
          try {
            const processedAsset = processAssetData(rawAsset);
            if (processedAsset) {
              if (isNFTAsset(processedAsset)) {
                nftAssets.push(processedAsset);
              } else if (isGeneralAsset(processedAsset)) {
                generalAssets.push(processedAsset);
              }
            }
          } catch (error) {
            console.warn('Error processing asset:', error);
          }
        });
      }
      
      // Fetch NFTs from Starknet if enabled
      let starknetNFTs: NFTAsset[] = [];
      if (enableStarknetFetch && userAddress) {
        starknetNFTs = await fetchUserNFTs();
      }
      
      // Combine all NFTs (avoid duplicates by token ID)
      const allNFTs = [...nftAssets];
      starknetNFTs.forEach(starknetNFT => {
        const exists = allNFTs.some(nft => 
          nft.tokenId === starknetNFT.tokenId && 
          nft.contractAddress === starknetNFT.contractAddress
        );
        if (!exists) {
          allNFTs.push(starknetNFT);
        }
      });
      
      const allAssets: (Asset | NFTAsset)[] = [...allNFTs, ...generalAssets];
      
      const updatedPortfolio: UserPortfolio = {
        address: userAddress,
        totalAssets: allAssets.length,
        assets: allAssets,
        nftAssets: allNFTs,
        generalAssets,
        loading: false,
        error: starknetError,
        lastUpdated: new Date()
      };

      setPortfolio(updatedPortfolio);
      onPortfolioUpdate?.(updatedPortfolio);
    } catch (error) {
      console.error('Error processing assets:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setPortfolio(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, [assets, userAddress, processAssetData, onPortfolioUpdate, enableStarknetFetch, fetchUserNFTs, starknetError]);

  // Effect to process assets when they change
  useEffect(() => {
    processAssets();
  }, [processAssets]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [assetType, searchTerm, sortBy, sortOrder]);

  // Filter assets based on assetType prop
  const filteredAssetsByType = useMemo(() => {
    switch (assetType) {
      case 'nft':
        return portfolio.nftAssets;
      case 'general':
        return portfolio.generalAssets;
      case 'all':
      default:
        return portfolio.assets;
    }
  }, [portfolio.assets, portfolio.nftAssets, portfolio.generalAssets, assetType]);

  // Safe property access helper
  const getAssetProperty = (asset: Asset | NFTAsset, property: keyof Asset): string => {
    try {
      const value = asset[property as keyof typeof asset];
      return typeof value === 'string' ? value : String(value || '');
    } catch (error) {
      console.warn(`Error accessing property ${String(property)}:`, error);
      return '';
    }
  };

  // Enhanced property getter for NFT-specific properties
  const getAssetPropertySafe = (asset: Asset | NFTAsset, property: string): string => {
    try {
      if (property in asset) {
        const value = (asset as any)[property];
        return typeof value === 'string' ? value : String(value || '');
      }
      return '';
    } catch (error) {
      console.warn(`Error accessing property ${property}:`, error);
      return '';
    }
  };

  // Filter and sort assets
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = [...filteredAssetsByType];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(asset => {
        try {
          const searchableFields = [
            getAssetProperty(asset, 'title'),
            getAssetProperty(asset, 'description'),
            getAssetProperty(asset, 'author'),
            getAssetProperty(asset, 'id'),
            getAssetPropertySafe(asset, 'type'),
            getAssetPropertySafe(asset, 'collection'),
            getAssetPropertySafe(asset, 'name'),
            getAssetPropertySafe(asset, 'tokenId'),
          ];
          
          return searchableFields.some(field => 
            field.toLowerCase().includes(searchLower)
          );
        } catch (error) {
          console.warn('Error filtering asset:', error);
          return false;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      try {
        let comparison = 0;
        
        switch (sortBy) {
          case SortField.TITLE:
            comparison = getAssetProperty(a, 'title').localeCompare(getAssetProperty(b, 'title'));
            break;
          case SortField.ID:
            comparison = getAssetProperty(a, 'id').localeCompare(getAssetProperty(b, 'id'));
            break;
          case SortField.REGISTRATION_DATE:
            const dateA = new Date(getAssetProperty(a, 'registrationDate') || 0).getTime();
            const dateB = new Date(getAssetProperty(b, 'registrationDate') || 0).getTime();
            comparison = dateB - dateA;
            break;
          case SortField.AUTHOR:
            comparison = getAssetProperty(a, 'author').localeCompare(getAssetProperty(b, 'author'));
            break;
          default:
            comparison = 0;
        }
        
        return sortOrder === SortOrder.DESC ? -comparison : comparison;
      } catch (error) {
        console.warn('Error sorting assets:', error);
        return 0;
      }
    });

    return filtered;
  }, [filteredAssetsByType, searchTerm, sortBy, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedAssets.length / itemsPerPage);
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);
  
  const paginatedAssets = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedAssets.slice(startIndex, endIndex);
  }, [filteredAndSortedAssets, validCurrentPage, itemsPerPage]);

  // Handlers
  const handleAssetSelect = useCallback((asset: Asset | NFTAsset) => {
    try {
      onAssetSelect?.(asset);
    } catch (error) {
      console.error('Error selecting asset:', error);
    }
  }, [onAssetSelect]);

  const handleRetry = useCallback(() => {
    processAssets();
  }, [processAssets]);

  const handleSortChange = useCallback((newSortBy: SortField) => {
    if (newSortBy === sortBy) {
      setSortOrder(prev => prev === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC);
    } else {
      setSortBy(newSortBy);
      setSortOrder(SortOrder.ASC);
    }
  }, [sortBy]);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  // Get display counts based on current filter
  const getDisplayCounts = useCallback(() => {
    switch (assetType) {
      case 'nft':
        return {
          total: portfolio.nftAssets.length,
          filtered: filteredAndSortedAssets.length,
          label: 'NFT Asset'
        };
      case 'general':
        return {
          total: portfolio.generalAssets.length,
          filtered: filteredAndSortedAssets.length,
          label: 'Digital Asset'
        };
      case 'all':
      default:
        return {
          total: portfolio.totalAssets,
          filtered: filteredAndSortedAssets.length,
          label: 'Asset'
        };
    }
  }, [assetType, portfolio, filteredAndSortedAssets.length]);

  const { total, filtered, label } = getDisplayCounts();

  // Loading state
  if (portfolio.loading || isLoadingFromStarknet) {
    return (
      <div className={`w-full ${className}`}>
        <LoadingSkeleton />
        {isLoadingFromStarknet && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Fetching NFTs from Starknet...
            </p>
          </div>
        )}
      </div>
    );
  }

  // Error state
  if (portfolio.error) {
    return (
      <div className={`w-full ${className}`}>
        <ErrorMessage message={portfolio.error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="mb-6 mt-4">
        <div className="flex items-center gap-3 mb-2 mx-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 ">
            My Digital Assets
          </h2>
          {enableStarknetFetch && (
            <span className="px-2 py-1 ml-bg-blue dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs rounded-full">
              Starknet
            </span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mx-6">
          {searchTerm ? `${filtered} of ${total}` : total} {label}{total !== 1 ? 's' : ''} 
          {searchTerm && ' found'}
          {assetType !== 'all' && (
            <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
              {assetType.toUpperCase()}
            </span>
          )}
        </p>
        {portfolio.lastUpdated && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mx-6 font-medium">
            Last updated: {portfolio.lastUpdated.toLocaleString()}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 mx-6 w-3/4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by title, description, author, ID, type, or collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            aria-label="Search assets"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortField)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            aria-label="Sort by"
          >
            <option value={SortField.TITLE}>Sort by Title</option>
            <option value={SortField.ID}>Sort by ID</option>
            <option value={SortField.REGISTRATION_DATE}>Sort by Date</option>
            <option value={SortField.AUTHOR}>Sort by Author</option>
          </select>
          
          <button
            onClick={() => setSortOrder(prev => prev === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            aria-label={`Sort ${sortOrder === SortOrder.ASC ? 'descending' : 'ascending'}`}
            title={`Sort ${sortOrder === SortOrder.ASC ? 'descending' : 'ascending'}`}
          >
            {sortOrder === SortOrder.ASC ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Asset Type Filter Pills */}
      {assetType === 'all' && total > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm text-gray-600 dark:text-gray-300">Filter by type:</span>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-full">
              NFTs: {portfolio.nftAssets.length}
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-full">
              General: {portfolio.generalAssets.length}
            </span>
          </div>
        </div>
      )}

      {/* Assets Grid */}
      {paginatedAssets.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedAssets.map((asset) => (
              <AssetCard
                key={`${asset.id}-${assetType}-${currentPage}`}
                asset={asset}
                onSelect={handleAssetSelect}
                className="transition-all duration-200 hover:scale-105"
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={validCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Assets Found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms or clearing filters' 
              : `You don't have any ${assetType === 'all' ? '' : assetType + ' '}assets yet`
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyAssets;