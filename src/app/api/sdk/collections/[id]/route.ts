/**
 * Collection Detail API Route
 * 
 * GET /api/sdk/collections/[id] - Get a single collection by ID
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

        // Get collection
        const collection = await sdk.collections.getCollection(id);

        return NextResponse.json(collection);
    } catch (error) {
        console.error('Collection API error:', error);

        const message = error instanceof Error ? error.message : 'Unknown error';
        const status = message.includes('does not exist') ? 404 : 500;

        return NextResponse.json(
            {
                error: 'Failed to fetch collection',
                message,
            },
            { status }
        );
    }
}

// Edge runtime for better performance
export const runtime = 'edge';

// Cache for 30 seconds
export const revalidate = 30;
