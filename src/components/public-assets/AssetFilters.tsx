'use client';

import React, { useState, useMemo } from 'react';
import { AssetFilter, MIPAsset } from '../../types/asset';

interface AssetFiltersProps {
    filters: AssetFilter;
    onFiltersChange: (filters: AssetFilter) => void;
    assets: MIPAsset[];
    className?: string;
}

export const AssetFilters: React.FC<AssetFiltersProps> = ({
    filters,
    onFiltersChange,
    assets,
    className = ""
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Extract unique values for filter options
    const filterOptions = useMemo(() => {
        const creators = [...new Set(assets.map(asset => asset.creator))];
        const collections = [...new Set(assets.map(asset => asset.collection))];
        const tags = [...new Set(assets.flatMap(asset => asset.tags))];

        return {
            creators: creators.slice(0, 10), // Limit for performance
            collections: collections.slice(0, 10),
            tags: tags.slice(0, 20)
        };
    }, [assets]);

    const updateFilter = (key: keyof AssetFilter, value: any) => {
        onFiltersChange({
            ...filters,
            [key]: value
        });
    };

    const clearFilters = () => {
        onFiltersChange({});
    };

    const hasActiveFilters = Object.values(filters).some(value =>
        value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)
    );

    return (
        <div className={`bg-gray-50 dark:bg-gray-900 rounded-lg p-4 ${className}`}>
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 font-medium"
                >
                    <span>Filters</span>
                    <svg
                        className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Filter Content */}
            {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Sort By */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Sort By
                        </label>
                        <select
                            value={filters.sortBy || ''}
                            onChange={(e) => updateFilter('sortBy', e.target.value || undefined)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            <option value="">Default</option>
                            <option value="timestamp">Date Created</option>
                            <option value="name">Name</option>
                            <option value="creator">Creator</option>
                        </select>
                    </div>

                    {/* Sort Order */}
                    {filters.sortBy && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Order
                            </label>
                            <select
                                value={filters.sortOrder || 'desc'}
                                onChange={(e) => updateFilter('sortOrder', e.target.value as 'asc' | 'desc')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                            </select>
                        </div>
                    )}

                    {/* Creator Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Creator
                        </label>
                        <select
                            value={filters.creator || ''}
                            onChange={(e) => updateFilter('creator', e.target.value || undefined)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            <option value="">All Creators</option>
                            {filterOptions.creators.map((creator) => (
                                <option key={creator} value={creator}>
                                    {creator.slice(0, 10)}...{creator.slice(-4)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Collection Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Collection
                        </label>
                        <select
                            value={filters.collection || ''}
                            onChange={(e) => updateFilter('collection', e.target.value || undefined)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            <option value="">All Collections</option>
                            {filterOptions.collections.map((collection) => (
                                <option key={collection} value={collection}>
                                    {collection}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {filters.search && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            Search: "{filters.search}"
                            <button
                                onClick={() => updateFilter('search', undefined)}
                                className="ml-1 text-blue-600 dark:text-blue-400"
                            >
                                ×
                            </button>
                        </span>
                    )}

                    {filters.creator && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                            Creator: {filters.creator.slice(0, 6)}...
                            <button
                                onClick={() => updateFilter('creator', undefined)}
                                className="ml-1 text-green-600 dark:text-green-400"
                            >
                                ×
                            </button>
                        </span>
                    )}

                    {filters.collection && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                            Collection: {filters.collection}
                            <button
                                onClick={() => updateFilter('collection', undefined)}
                                className="ml-1 text-purple-600 dark:text-purple-400"
                            >
                                ×
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};