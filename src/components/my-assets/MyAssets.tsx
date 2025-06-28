import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MyAssetsProps, UserPortfolio, NFTAsset, Asset, isNFTAsset, isGeneralAsset, createAssetFromData } from '@/types/myasset';
import { useStarknetIntegration } from '@/hooks/use-starknetIntegration';
import { AssetCard } from './MyAssetCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorMessage } from './ErrorMessage';
import { Pagination } from './Pagination';

// Type for sort fields
type SortField = 'title' | 'id' | 'registrationDate' | 'author';
type SortOrder = 'asc' | 'desc';

export const MyAssets: React.FC<MyAssetsProps> = ({
  userAddress,
  contractAddress,
  onAssetSelect,
  onPortfolioUpdate,
  className = '',
  itemsPerPage = 12,
  assetType = 'all',
  network = 'mainnet',
  rpcUrl
}) => {
  const [portfolio, setPortfolio] = useState<UserPortfolio>({
    address: userAddress,
    totalAssets: 0,
    assets: [],
    nftAssets: [],
    generalAssets: [],
    loading: true,
    error: null,
    lastUpdated: new Date()
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const { fetchUserAssets, isReady } = useStarknetIntegration(
    contractAddress, 
    { network, rpcUrl }
  );

  // Helper function to ensure proper asset typing
  const processAssetData = useCallback((rawAsset: any): Asset | NFTAsset | null => {
    try {
      // Use the factory function to create properly typed assets
      return createAssetFromData(rawAsset);
    } catch (error) {
      console.warn('Error processing asset data:', error);
      return null;
    }
  }, []);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchAssets = useCallback(async () => {
    if (!isReady || !userAddress) {
      console.warn('Not ready to fetch assets:', { isReady, userAddress });
      return;
    }

    setPortfolio(prev => ({ ...prev, loading: true, error: null }));

    try {
      const assets = await fetchUserAssets(userAddress);
      
      if (!Array.isArray(assets)) {
        throw new Error('Invalid assets data received');
      }
      
      // Process and categorize assets with improved type safety
      const nftAssets: NFTAsset[] = [];
      const generalAssets: Asset[] = [];
      
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
      
      const allAssets: (Asset | NFTAsset)[] = [...nftAssets, ...generalAssets];
      
      const updatedPortfolio: UserPortfolio = {
        address: userAddress,
        totalAssets: allAssets.length,
        assets: allAssets,
        nftAssets,
        generalAssets,
        loading: false,
        error: null,
        lastUpdated: new Date()
      };

      setPortfolio(updatedPortfolio);
      onPortfolioUpdate?.(updatedPortfolio);
    } catch (error) {
      console.error('Error fetching assets:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setPortfolio(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, [userAddress, contractAddress, isReady, fetchUserAssets, onPortfolioUpdate]);

  // Effect to fetch assets when dependencies change
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

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
    let filtered = [...filteredAssetsByType]; // Create a copy to avoid mutating original

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
            // NFT-specific fields
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
          case 'title':
            comparison = getAssetProperty(a, 'title').localeCompare(getAssetProperty(b, 'title'));
            break;
          case 'id':
            comparison = getAssetProperty(a, 'id').localeCompare(getAssetProperty(b, 'id'));
            break;
          case 'registrationDate':
            const dateA = new Date(getAssetProperty(a, 'registrationDate') || 0).getTime();
            const dateB = new Date(getAssetProperty(b, 'registrationDate') || 0).getTime();
            comparison = dateB - dateA; // Default to newest first
            break;
          case 'author':
            comparison = getAssetProperty(a, 'author').localeCompare(getAssetProperty(b, 'author'));
            break;
          default:
            comparison = 0;
        }
        
        return sortOrder === 'desc' ? -comparison : comparison;
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
    fetchAssets();
  }, [fetchAssets]);

  const handleSortChange = useCallback((newSortBy: SortField) => {
    if (newSortBy === sortBy) {
      // Toggle sort order if same field
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  }, [sortBy]);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Smooth scroll to top of component
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
  if (portfolio.loading) {
    return (
      <div className={`w-full ${className}`}>
        <LoadingSkeleton />
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          My Digital Assets
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {searchTerm ? `${filtered} of ${total}` : total} {label}{total !== 1 ? 's' : ''} 
          {searchTerm && ' found'}
          {assetType !== 'all' && (
            <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
              {assetType.toUpperCase()}
            </span>
          )}
        </p>
        {portfolio.lastUpdated && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Last updated: {portfolio.lastUpdated.toLocaleString()}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
            <option value="title">Sort by Title</option>
            <option value="id">Sort by ID</option>
            <option value="registrationDate">Sort by Date</option>
            <option value="author">Sort by Author</option>
          </select>
          
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
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
                key={`${asset.id}-${assetType}-${currentPage}`} // Enhanced key for better React rendering
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