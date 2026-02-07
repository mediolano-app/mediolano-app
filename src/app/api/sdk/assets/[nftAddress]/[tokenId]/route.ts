/**
 * Asset Detail API Route
 * 
 * GET /api/sdk/assets/[nftAddress]/[tokenId] - Get a single asset
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSDK } from '@/sdk';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ nftAddress: string; tokenId: string }> }
) {
    try {
        const { nftAddress, tokenId } = await params;

        if (!nftAddress || !tokenId) {
            return NextResponse.json(
                { error: 'NFT address and token ID are required' },
                { status: 400 }
            );
        }

        const tokenIdNum = parseInt(tokenId);
        if (isNaN(tokenIdNum)) {
            return NextResponse.json(
                { error: 'Invalid token ID' },
                { status: 400 }
            );
        }

        const sdk = getSDK();

        // Get asset
        const asset = await sdk.assets.getAsset(
            nftAddress as `0x${string}`,
            tokenIdNum
        );

        return NextResponse.json(asset);
    } catch (error) {
        console.error('Asset API error:', error);

        const message = error instanceof Error ? error.message : 'Unknown error';
        const status = message.includes('not found') ? 404 : 500;

        return NextResponse.json(
            {
                error: 'Failed to fetch asset',
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
