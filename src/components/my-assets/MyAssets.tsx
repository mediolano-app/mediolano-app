import React, { useState, useEffect, useMemo } from 'react';
import { MyAssetsProps, UserPortfolio, NFTAsset } from '@/types/myasset';
import { useStarknetIntegration } from '@/hooks/use-starknetIntegration';
import { AssetCard } from './MyAssetCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorMessage } from './ErrorMessage';
import { Pagination } from './Pagination';

export const MyAssets: React.FC<MyAssetsProps> = ({
  userAddress,
  contractAddress,
  onAssetSelect,
  onPortfolioUpdate,
  className = '',
  itemsPerPage = 12
}) => {
  const [portfolio, setPortfolio] = useState<UserPortfolio>({
    address: userAddress,
    totalAssets: 0,
    assets: [],
    loading: true,
    error: null
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'tokenId' | 'created'>('name');

  const { fetchUserAssets, isReady } = useStarknetIntegration(contractAddress);

  // Fetch user assets
  const fetchAssets = async () => {
    if (!isReady || !userAddress) return;

    setPortfolio(prev => ({ ...prev, loading: true, error: null }));

    try {
      const assets = await fetchUserAssets(userAddress);
      const updatedPortfolio: UserPortfolio = {
        address: userAddress,
        totalAssets: assets.length,
        assets,
        loading: false,
        error: null
      };

      setPortfolio(updatedPortfolio);
      onPortfolioUpdate?.(updatedPortfolio);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setPortfolio(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [userAddress, contractAddress, isReady]);

  // Filter and sort assets
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = portfolio.assets;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.tokenId.includes(searchTerm)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'tokenId':
          return parseInt(a.tokenId) - parseInt(b.tokenId);
        case 'created':
          return b.createdAt - a.createdAt;
        default:
          return 0;
      }
    });

    return filtered;
  }, [portfolio.assets, searchTerm, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedAssets.length / itemsPerPage);
  const paginatedAssets = filteredAndSortedAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAssetSelect = (asset: NFTAsset) => {
    onAssetSelect?.(asset);
  };

  const handleRetry = () => {
    fetchAssets();
  };

  if (portfolio.loading) {
    return (
      <div className={`w-full ${className}`}>
        <LoadingSkeleton />
      </div>
    );
  }

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          My Digital Assets
        </h2>
        <p className="text-gray-600">
          {portfolio.totalAssets} NFT{portfolio.totalAssets !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="name">Sort by Name</option>
          <option value="tokenId">Sort by Token ID</option>
          <option value="created">Sort by Created Date</option>
        </select>
      </div>

      {/* Assets Grid */}
      {paginatedAssets.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedAssets.map((asset) => (
              <AssetCard
                key={`${asset.contractAddress}-${asset.tokenId}`}
                asset={asset}
                onSelect={handleAssetSelect}
              />
            ))}
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Assets Found
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'You don\'t have any NFT assets yet'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default MyAssets;