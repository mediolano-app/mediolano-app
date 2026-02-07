/**
 * Collections API Route
 * 
 * GET /api/sdk/collections - List all collections or filter by owner
 * 
 * Query Parameters:
 * - owner: Filter by owner address
 * - page: Page number (default: 1)
 * - pageSize: Items per page (default: 12)
 * - search: Search by name/description
 * - type: Filter by collection type
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSDK } from '@/sdk';
import type { CollectionFilter } from '@/sdk/types/collection';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Parse query parameters
        const owner = searchParams.get('owner') as `0x${string}` | null;
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '12');
        const search = searchParams.get('search') || undefined;
        const type = searchParams.get('type') || undefined;
        const isActiveParam = searchParams.get('isActive');
        const isActive = isActiveParam !== null ? isActiveParam === 'true' : undefined;

        // Get SDK instance
        const sdk = getSDK();

        // Build filter
        const filter: CollectionFilter = {};
        if (owner) filter.owner = owner;
        if (search) filter.search = search;
        if (type) filter.type = type;
        if (isActive !== undefined) filter.isActive = isActive;

        // If owner specified, get user collections
        if (owner && !search && !type) {
            const collections = await sdk.collections.getUserCollections(owner);

            // Apply pagination manually
            const start = (page - 1) * pageSize;
            const paginatedItems = collections.slice(start, start + pageSize);

            return NextResponse.json({
                items: paginatedItems,
                total: collections.length,
                page,
                pageSize,
                hasMore: start + pageSize < collections.length,
            });
        }

        // Get paginated collections with filters
        const result = await sdk.collections.getCollectionsPaginated(
            { page, pageSize },
            Object.keys(filter).length > 0 ? filter : undefined
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error('Collections API error:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch collections',
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
