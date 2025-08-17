'use client';

import React, { useState, useCallback } from 'react';
import { MIPAsset, AssetFilter } from '../../types/asset';
import { usePublicAssets } from '../../hooks/usePublicAssets';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import { AssetCard } from './AssetCard';
import { AssetFilters } from './AssetFilters';
import { AssetSearch } from './AssetSearch';
import { AssetDetailModal } from './AssetDetailModal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { SkeletonLoader } from '../ui/SkeletonLoader';

interface PublicAssetsComponentProps {
    network?: 'sepolia' | 'mainnet';
    className?: string;
    showFilters?: boolean;
    showSearch?: boolean;
    pageSize?: number;
}

const PublicAssetsComponentInner: React.FC<PublicAssetsComponentProps> = ({
    network = 'sepolia',
    className = '',
    showFilters = true,
    showSearch = true,
    pageSize = 20
}) => {
    const [filters, setFilters] = useState<AssetFilter>({});
    const [selectedAsset, setSelectedAsset] = useState<MIPAsset | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { measureSearch } = usePerformanceMonitor('PublicAssetsComponent');

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isLoading,
        refetch
    } = usePublicAssets(filters, pageSize, network);

    // Flatten all pages of assets
    const allAssets = data?.pages.flatMap(page => page.assets) ?? [];
    const totalCount = data?.pages[0]?.totalCount ?? 0;

    // Handle filter changes with performance monitoring
    const handleFiltersChange = useCallback(measureSearch(async (newFilters: AssetFilter) => {
        setFilters(newFilters);
    }), [measureSearch]);

    // Handle search
    const handleSearch = useCallback((searchQuery: string) => {
        const newFilters = { ...filters, search: searchQuery };
        handleFiltersChange(newFilters);
    }, [filters, handleFiltersChange]);

    // Handle asset click
    const handleAssetClick = useCallback((asset: MIPAsset) => {
        setSelectedAsset(asset);
        setIsModalOpen(true);
    }, []);

    // Handle modal close
    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
        setSelectedAsset(null);
    }, []);

    // Load more assets
    const loadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Infinite scroll effect
    React.useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 1000
            ) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore]);

    if (error) {
        return (
            <div className={`public-assets-component ${className}`}>
                <ErrorMessage
                    message={error.message || 'Failed to load assets'}
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    return (
        <div className={`public-assets-component ${className}`}>
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Public IP Assets
                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                        ({network})
                    </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Explore {totalCount.toLocaleString()} registered intellectual property assets on Starknet
                </p>
            </div>

            {/* Search */}
            {showSearch && (
                <div className="mb-6">
                    <AssetSearch
                        onSearch={handleSearch}
                        placeholder="Search assets by name, creator, or description..."
                    />
                </div>
            )}

            {/* Filters */}
            {showFilters && (
                <div className="mb-6">
                    <AssetFilters
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        assets={allAssets}
                    />
                </div>
            )}

            {/* Results count */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {isLoading ? (
                    'Loading assets...'
                ) : (
                    `Showing ${allAssets.length} of ${totalCount.toLocaleString()} assets`
                )}
            </div>

            {/* Assets Grid */}
            {isLoading ? (
                <SkeletonLoader count={pageSize} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allAssets.map((asset) => (
                        <AssetCard
                            key={`${asset.contractAddress}-${asset.tokenId}`}
                            asset={asset}
                            onClick={handleAssetClick}
                        />
                    ))}
                </div>
            )}

            {/* Loading more state */}
            {isFetchingNextPage && (
                <div className="flex justify-center py-8">
                    <LoadingSpinner />
                </div>
            )}

            {/* Load more button */}
            {!isLoading && hasNextPage && allAssets.length > 0 && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={loadMore}
                        disabled={isFetchingNextPage}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isFetchingNextPage ? 'Loading...' : 'Load More Assets'}
                    </button>
                </div>
            )}

            {/* No results */}
            {!isLoading && allAssets.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No assets found matching your criteria
                    </p>
                </div>
            )}

            {/* Asset Detail Modal */}
            <AssetDetailModal
                asset={selectedAsset}
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
        </div>
    );
};

export const PublicAssetsComponent: React.FC<PublicAssetsComponentProps> = (props) => (
    <ErrorBoundary>
        <PublicAssetsComponentInner {...props} />
    </ErrorBoundary>
);