/**
 * Assets API Route
 * 
 * GET /api/sdk/assets - List assets with filtering
 * 
 * Query Parameters:
 * - collection: NFT contract address to fetch assets from
 * - owner: Filter by owner address
 * - page: Page number (default: 1)
 * - pageSize: Items per page (default: 12)
 * - search: Search by name/description
 * - type: Filter by asset type
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSDK } from '@/sdk';
import type { AssetFilter } from '@/sdk/types/asset';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Parse query parameters
        const collection = searchParams.get('collection') as `0x${string}` | null;
        const owner = searchParams.get('owner') as `0x${string}` | null;
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '12');
        const search = searchParams.get('search') || undefined;
        const type = searchParams.get('type') || undefined;

        if (!collection) {
            return NextResponse.json(
                { error: 'Collection address is required' },
                { status: 400 }
            );
        }

        const sdk = getSDK();

        // Build filter
        const filter: AssetFilter = {};
        if (owner) filter.owner = owner;
        if (search) filter.search = search;
        if (type) filter.type = type;

        // If owner specified, get user assets
        if (owner) {
            const assets = await sdk.assets.getUserAssets(collection, owner);

            // Apply additional filters
            let filteredAssets = assets;
            if (search) {
                const searchLower = search.toLowerCase();
                filteredAssets = assets.filter(a =>
                    a.name.toLowerCase().includes(searchLower) ||
                    a.description?.toLowerCase().includes(searchLower)
                );
            }
            if (type) {
                filteredAssets = filteredAssets.filter(a => a.type === type);
            }

            // Apply pagination
            const start = (page - 1) * pageSize;
            const paginatedItems = filteredAssets.slice(start, start + pageSize);

            return NextResponse.json({
                items: paginatedItems,
                total: filteredAssets.length,
                page,
                pageSize,
                hasMore: start + pageSize < filteredAssets.length,
            });
        }

        // Get paginated assets with filters
        const result = await sdk.assets.getCollectionAssetsPaginated(
            collection,
            { page, pageSize },
            Object.keys(filter).length > 0 ? filter : undefined
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error('Assets API error:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch assets',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// Edge runtime for better performance
export const runtime = 'edge';

// Cache for 30 seconds
export const revalidate = 30;
