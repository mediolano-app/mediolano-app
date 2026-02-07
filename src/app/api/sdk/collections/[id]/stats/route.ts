/**
 * Collection Stats API Route
 * 
 * GET /api/sdk/collections/[id]/stats - Get collection statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSDK } from '@/sdk';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'Collection ID is required' },
                { status: 400 }
            );
        }

        const sdk = getSDK();

        // Get collection stats
        const stats = await sdk.collections.getCollectionStats(id);

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Collection Stats API error:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch collection stats',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// Edge runtime for better performance
export const runtime = 'edge';

// Cache for 60 seconds (stats change less frequently)
export const revalidate = 60;
