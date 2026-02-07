/**
 * IPFS Utilities
 * 
 * Functions for handling IPFS content and metadata
 */

import type { IPFSMetadata } from '../types/common';

// Default IPFS gateway
const DEFAULT_GATEWAY = 'https://gateway.pinata.cloud';

/**
 * Process an IPFS hash or URL to a full gateway URL
 */
export function processIPFSUrl(
    input: string,
    gateway: string = DEFAULT_GATEWAY,
    fallback: string = '/placeholder.svg'
): string {
    if (!input || input === 'undefined' || input === 'null') {
        return fallback;
    }

    // Already a full URL
    if (input.startsWith('http://') || input.startsWith('https://')) {
        // Check if it's an IPFS gateway URL with undefined prefix
        if (input.startsWith('undefined/')) {
            const cid = input.replace('undefined/', '');
            return `${gateway}/ipfs/${cid}`;
        }
        return input;
    }

    // IPFS protocol URL
    if (input.startsWith('ipfs://')) {
        const cid = input.replace('ipfs://', '');
        return `${gateway}/ipfs/${cid}`;
    }

    // Direct CID
    if (isValidCID(input)) {
        return `${gateway}/ipfs/${input}`;
    }

    // Path starting with /ipfs/
    if (input.startsWith('/ipfs/')) {
        return `${gateway}${input}`;
    }

    return fallback;
}

/**
 * Extract CID from various IPFS URL formats
 */
export function extractCID(input: string): string | null {
    if (!input) return null;

    // Direct CID
    if (isValidCID(input)) {
        return input;
    }

    // ipfs:// protocol
    if (input.startsWith('ipfs://')) {
        const cid = input.replace('ipfs://', '').split('/')[0];
        return isValidCID(cid) ? cid : null;
    }

    // Gateway URL
    const ipfsMatch = input.match(/\/ipfs\/([a-zA-Z0-9]{46,})/);
    if (ipfsMatch) {
        return ipfsMatch[1];
    }

    return null;
}

/**
 * Check if a string is a valid IPFS CID
 */
export function isValidCID(cid: string): boolean {
    if (!cid) return false;

    // CIDv0 (base58btc, starts with Qm)
    if (cid.startsWith('Qm') && cid.length === 46) {
        return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(cid);
    }

    // CIDv1 (commonly base32 or base58btc)
    if (cid.startsWith('bafy') || cid.startsWith('bafk')) {
        return cid.length >= 46;
    }

    // Generic check for base58/base32 encoded content
    return /^[a-zA-Z0-9]{46,}$/.test(cid);
}

/**
 * Fetch metadata from IPFS
 */
export async function fetchIPFSMetadata(
    cid: string,
    gateway: string = DEFAULT_GATEWAY,
    timeout: number = 10000
): Promise<IPFSMetadata | null> {
    if (!cid || !isValidCID(cid)) {
        return null;
    }

    const url = `${gateway}/ipfs/${cid}`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.warn(`Failed to fetch IPFS metadata: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data as IPFSMetadata;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.warn(`IPFS fetch timeout for CID: ${cid}`);
        } else {
            console.warn(`Error fetching IPFS metadata for ${cid}:`, error);
        }
        return null;
    }
}

/**
 * Process image URL from metadata, handling various formats
 */
export function processMetadataImage(
    metadata: IPFSMetadata | null,
    gateway: string = DEFAULT_GATEWAY,
    fallback: string = '/placeholder.svg'
): string {
    if (!metadata) return fallback;

    // Check various image fields
    const imageField =
        (metadata as Record<string, unknown>).coverImage as string ||
        metadata.image ||
        (metadata as Record<string, unknown>).image_url as string ||
        (metadata as Record<string, unknown>).animation_url as string;

    if (!imageField) return fallback;

    return processIPFSUrl(imageField, gateway, fallback);
}

/**
 * Create an IPFS URL from a CID
 */
export function createIPFSUrl(cid: string, gateway: string = DEFAULT_GATEWAY): string {
    return `${gateway}/ipfs/${cid}`;
}

/**
 * Create an ipfs:// protocol URL from a CID
 */
export function createIPFSProtocolUrl(cid: string): string {
    return `ipfs://${cid}`;
}
