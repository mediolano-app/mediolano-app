"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useMIP } from '@/hooks/contracts/use-mip';
import { LoadingSkeleton } from '@/components/my-assets/loading-skeleton';
import { ErrorMessage } from '@/components/my-assets/error-message';
import { Pagination } from '@/components/my-assets/pagination';
import AssetCardList from '@/components/asset-card-list';

interface MyAssetsListProps {
  userAddress?: string;
  onAssetSelect?: (tokenId: bigint) => void;
  className?: string;
  itemsPerPage?: number;
}

export const MyAssetsList: React.FC<MyAssetsListProps> = ({
  onAssetSelect,
  className = '',
  itemsPerPage = 12,
}) => {
  const {
    balance,
    balanceError,
    tokenIds,
    tokenIdsError,
    isLoading
  } = useMIP();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  
  const filteredTokenIds = useMemo(() => {
    if (!searchTerm.trim()) {
      return tokenIds;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    return tokenIds.filter(tokenId => 
      tokenId.toString().includes(searchLower) ||
      `programmable ip #${tokenId.toString()}`.toLowerCase().includes(searchLower)
    );
  }, [tokenIds, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTokenIds.length / itemsPerPage);
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);
  
  const paginatedTokenIds = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTokenIds.slice(startIndex, endIndex);
  }, [filteredTokenIds, validCurrentPage, itemsPerPage]);

  // Handlers
  const handleAssetSelect = useCallback((tokenId: bigint) => {
    try {
      onAssetSelect?.(tokenId);
    } catch (error) {
      console.error('Error selecting asset:', error);
    }
  }, [onAssetSelect]);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <LoadingSkeleton />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Loading your IP assets...
          </p>
          <p className="text-xs text-white dark:text-gray-400 mt-1">
            Programmable IP Collections
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (balanceError || tokenIdsError) {
    return (
      <div className={`w-full ${className}`}>
        <ErrorMessage 
          message={balanceError?.message || tokenIdsError?.message || 'An error occurred'} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 mt-5 mb-10'>
      {/* Header */}
      <div className="mb-6 ">
        <div className="flex items-center gap-3 mb-2 mx-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Digital IP Assets
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-300 mx-6">
          {searchTerm ? `${filteredTokenIds.length} of ${tokenIds.length}` : tokenIds.length} Asset{tokenIds.length !== 1 ? 's' : ''} 
          {searchTerm && ' found'}
          {balance > BigInt(0) && (
            <span className="ml-2 text-blue-600 dark:text-blue-400">
              (Balance: {balance.toString()})
            </span>
          )}
        </p>
        <p className="text-xs text-white dark:text-gray-400 mt-1 mx-6">
          Programmable IP Collections
        </p>
      </div>

      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 mx-6 w-3/4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by Token ID or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            aria-label="Search assets"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            aria-label="Refresh assets"
            title="Refresh assets"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Assets */}
      {paginatedTokenIds.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 mb-8 mx-6">
            {paginatedTokenIds.map((tokenId, index) => (
              <div
                key={`${tokenId.toString()}-${currentPage}`}
                onClick={() => handleAssetSelect(tokenId)}
                className="cursor-pointer transition-all duration-200 hover:scale-105"
              >
                <AssetCardList
                  tokenId={tokenId} 
                  status="active" 
                />
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mx-6">
              <Pagination
                currentPage={validCurrentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 mx-6">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Assets Found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : balance === BigInt(0)
              ? 'Your Programmable IP assets will appear here after creation'
              : 'No assets available'
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

export default MyAssetsList;