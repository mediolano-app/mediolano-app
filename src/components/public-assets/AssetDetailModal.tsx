'use client';

import React from 'react';
import Image from 'next/image';
import { MIPAsset } from '../../types/asset';

interface AssetDetailModalProps {
    asset: MIPAsset | null;
    isOpen: boolean;
    onClose: () => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
    asset,
    isOpen,
    onClose,
}) => {
    if (!isOpen || !asset) return null;

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white" id="modal-title">
                                Asset Details
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                aria-label="Close modal"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Asset Image */}
                        {asset.metadata.image && (
                            <div className="mb-6">
                                <div className="aspect-square relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden max-w-md mx-auto">
                                    <Image
                                        src={asset.metadata.image}
                                        alt={asset.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Asset Information */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Name
                                </label>
                                <p className="text-gray-900 dark:text-white">{asset.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                    {asset.metadata.description || 'No description available'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Creator
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                            {asset.creator}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(asset.creator)}
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                            title="Copy address"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Collection
                                    </label>
                                    <p className="text-gray-900 dark:text-white">{asset.collection}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Token ID
                                    </label>
                                    <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                        {asset.tokenId}
                                    </code>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Registered
                                    </label>
                                    <p className="text-gray-900 dark:text-white">
                                        {formatTimestamp(asset.timestamp)}
                                    </p>
                                </div>
                            </div>

                            {/* Tags */}
                            {asset.tags.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tags
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {asset.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-block px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Attributes */}
                            {asset.metadata.attributes && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Attributes
                                    </label>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                        <pre className="text-sm text-gray-900 dark:text-white overflow-x-auto">
                                            {JSON.stringify(asset.metadata.attributes, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};