'use client';

import React from 'react';
import Image from 'next/image';
import { MIPAsset } from '../../types/asset';

interface AssetCardProps {
    asset: MIPAsset;
    onClick?: (asset: MIPAsset) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick }) => {
    const handleClick = () => {
        onClick?.(asset);
    };

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
            onClick={handleClick}
        >
            {/* Asset Image */}
            <div className="aspect-square relative bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                {asset.metadata.image ? (
                    <Image
                        src={asset.metadata.image}
                        alt={asset.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-400 dark:text-gray-500">
                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {/* Asset Info */}
            <div className="p-4">
                {/* Asset Name */}
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                    {asset.name}
                </h3>

                {/* Creator */}
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Creator: {truncateAddress(asset.creator)}
                </div>

                {/* Collection */}
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Collection: {asset.collection}
                </div>

                {/* Description */}
                {asset.metadata.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                        {asset.metadata.description}
                    </p>
                )}

                {/* Tags */}
                {asset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {asset.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                            >
                                {tag}
                            </span>
                        ))}
                        {asset.tags.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                +{asset.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Timestamp */}
                <div className="text-xs text-gray-500 dark:text-gray-500">
                    Registered: {formatTimestamp(asset.timestamp)}
                </div>
            </div>
        </div>
    );
};