// src/app/discover/discover-client.tsx
"use client";

import React from "react";
import { PublicAssetsComponent } from "../../components/public-assets/PublicAssetsComponent";

export function DiscoverPageClient() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                        Discover Intellectual Property Assets
                    </h1>
                    <p className="text-lg text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Explore the comprehensive catalog of registered intellectual property on the Starknet blockchain.
                        Search, filter, and interact with assets from creators worldwide.
                    </p>
                </div>

                {/* Public Assets Component */}
                <PublicAssetsComponent
                    network="sepolia"
                    showFilters={true}
                    showSearch={true}
                    pageSize={24}
                    className="mb-16"
                />
            </div>
        </div>
    );
}