/**
 * Address Utilities
 * 
 * Functions for handling Starknet addresses
 */

import type { StarknetAddress } from '../types/common';

/**
 * Normalize a Starknet address to lowercase with 0x prefix
 */
export function normalizeAddress(address: string): StarknetAddress {
    if (!address || address === '0' || address === '0x0') {
        return '0x0' as StarknetAddress;
    }

    // Remove leading zeros after 0x and convert to lowercase
    let normalized = address.toLowerCase();

    // Ensure 0x prefix
    if (!normalized.startsWith('0x')) {
        // Try to parse as decimal and convert to hex
        try {
            normalized = `0x${BigInt(normalized).toString(16)}`;
        } catch {
            normalized = `0x${normalized}`;
        }
    }

    return normalized as StarknetAddress;
}

/**
 * Convert a decimal string to hex address
 */
export function decimalToHex(decimal: string): StarknetAddress {
    if (!decimal || decimal === '0') {
        return '0x0' as StarknetAddress;
    }

    try {
        return `0x${BigInt(decimal).toString(16)}` as StarknetAddress;
    } catch {
        return '0x0' as StarknetAddress;
    }
}

/**
 * Shorten an address for display
 */
export function shortenAddress(address: string, chars: number = 4): string {
    if (!address || address.length < chars * 2 + 2) {
        return address;
    }

    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Validate if a string is a valid Starknet address
 */
export function isValidAddress(address: string): boolean {
    if (!address) return false;

    // Check format
    if (!address.startsWith('0x')) return false;

    // Check if it's a valid hex string
    const hexPart = address.slice(2);
    if (!/^[0-9a-fA-F]+$/.test(hexPart)) return false;

    // Starknet addresses are typically 64 characters (256 bits) or less
    if (hexPart.length > 64) return false;

    return true;
}

/**
 * Compare two addresses for equality (case-insensitive, normalized)
 */
export function addressEquals(a: string, b: string): boolean {
    return normalizeAddress(a).toLowerCase() === normalizeAddress(b).toLowerCase();
}

/**
 * Pad address to full length (66 characters including 0x)
 */
export function padAddress(address: string): StarknetAddress {
    const normalized = normalizeAddress(address);
    const hexPart = normalized.slice(2);
    const padded = hexPart.padStart(64, '0');
    return `0x${padded}` as StarknetAddress;
}

/**
 * Check if address is zero address
 */
export function isZeroAddress(address: string): boolean {
    if (!address) return true;
    const normalized = normalizeAddress(address);
    return normalized === '0x0' || /^0x0+$/.test(normalized);
}
