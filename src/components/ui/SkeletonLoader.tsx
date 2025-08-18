'use client';

import React from 'react';

interface SkeletonLoaderProps {
    count?: number;
    className?: string;
}

export const AssetCardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="aspect-square bg-gray-300 dark:bg-gray-600 rounded-t-lg" />
        <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
            <div className="flex space-x-2">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16" />
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-12" />
            </div>
        </div>
    </div>
);

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    count = 8,
    className = ''
}) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
            <AssetCardSkeleton key={index} />
        ))}
    </div>
);