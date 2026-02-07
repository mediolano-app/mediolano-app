/**
 * SDK Status API Route
 * 
 * GET /api/sdk/status - Get SDK and provider status
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSDK } from '@/sdk';

export async function GET(request: NextRequest) {
    try {
        const sdk = getSDK();
        const status = await sdk.getStatus();
        const config = sdk.getConfig();

        return NextResponse.json({
            status,
            config: {
                network: config.network,
                collectionContractAddress: config.collectionContractAddress,
                ipfsGateway: config.ipfsGateway,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('SDK Status API error:', error);

        return NextResponse.json(
            {
                error: 'Failed to get SDK status',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// Edge runtime for better performance
export const runtime = 'edge';

// No caching for status
export const revalidate = 0;
