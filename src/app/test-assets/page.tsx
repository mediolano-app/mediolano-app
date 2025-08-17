// src/app/test-assets/page.tsx
'use client';

import React from 'react';
import { PublicAssetsComponent } from '../../components/public-assets/PublicAssetsComponent';

export default function TestAssetsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Test Public Assets Component</h1>
            <PublicAssetsComponent
                network="sepolia"
                showFilters={true}
                showSearch={true}
                pageSize={12}
            />
        </div>
    );
}