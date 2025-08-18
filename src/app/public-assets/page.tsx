'use client';

import React from 'react';
import { PublicAssetsComponent } from '../../components/public-assets/PublicAssetsComponent';

export default function PublicAssetsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <PublicAssetsComponent
                network="sepolia"
                showFilters={true}
                showSearch={true}
                pageSize={20}
            />
        </div>
    );
}