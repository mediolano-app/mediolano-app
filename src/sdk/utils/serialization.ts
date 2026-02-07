/**
 * Serialization Utilities
 * 
 * Functions for data serialization and deserialization
 */

/**
 * Safely stringify large numbers
 */
export function stringifyBigInt(value: bigint | string | number): string {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    return String(value);
}

/**
 * Parse u256 from contract response
 */
export function parseU256(value: unknown): bigint {
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number') return BigInt(value);
    if (typeof value === 'string') {
        // Handle hex strings
        if (value.startsWith('0x')) {
            return BigInt(value);
        }
        return BigInt(value);
    }

    // Handle object format { low, high }
    if (typeof value === 'object' && value !== null) {
        const obj = value as { low?: unknown; high?: unknown };
        if ('low' in obj && 'high' in obj) {
            const low = BigInt(String(obj.low || 0));
            const high = BigInt(String(obj.high || 0));
            return low + (high << 128n);
        }
    }

    return 0n;
}

/**
 * Format u256 to string
 */
export function formatU256(value: unknown): string {
    return parseU256(value).toString();
}

/**
 * Parse boolean from contract response
 */
export function parseBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'bigint') return value !== 0n;

    // Handle object format with True/False variants
    if (typeof value === 'object' && value !== null) {
        const obj = value as { variant?: unknown; activeVariant?: () => string };
        if ('activeVariant' in obj && typeof obj.activeVariant === 'function') {
            return obj.activeVariant() === 'True';
        }
        if ('variant' in obj) {
            return String(obj.variant).toLowerCase() === 'true';
        }
    }

    return false;
}

/**
 * Parse timestamp from contract (u64)
 */
export function parseTimestamp(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'string') return parseInt(value, 10) || 0;
    return 0;
}

/**
 * Format timestamp to ISO string
 */
export function formatTimestamp(timestamp: number): string {
    if (!timestamp || timestamp === 0) return '';

    try {
        // Contract timestamps are in seconds
        return new Date(timestamp * 1000).toISOString();
    } catch {
        return '';
    }
}

/**
 * Clean string by removing null bytes
 */
export function cleanString(value: unknown): string {
    if (typeof value !== 'string') return '';
    return value.replace(/\0/g, '').trim();
}

/**
 * Parse ByteArray from contract response
 */
export function parseByteArray(value: unknown): string {
    if (typeof value === 'string') return cleanString(value);

    // Handle ByteArray object format
    if (typeof value === 'object' && value !== null) {
        const obj = value as { data?: unknown[]; pending_word?: unknown; pending_word_len?: unknown };

        // For simple cases, starknet.js should handle this
        // but if we get the raw object, try to extract
        if ('data' in obj || 'pending_word' in obj) {
            // This is complex; normally starknet.js handles decoding
            // Return empty for now, rely on starknet.js
            return '';
        }
    }

    return '';
}

/**
 * Create a deterministic hash for cache keys
 */
export function hashArgs(...args: unknown[]): string {
    const str = args.map(arg => {
        if (arg === null || arg === undefined) return 'null';
        if (typeof arg === 'object') {
            try {
                return JSON.stringify(arg);
            } catch {
                return String(arg);
            }
        }
        return String(arg);
    }).join(':');

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return hash.toString(36);
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item)) as T;
    }

    const cloned: Record<string, unknown> = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
        }
    }

    return cloned as T;
}
