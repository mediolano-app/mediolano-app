/**
 * SDK Cache Layer
 * 
 * In-memory cache with TTL, LRU eviction, and configurable options
 */

import type { CacheOptions, CacheEntry } from '../types';

/**
 * Simple in-memory cache with TTL and LRU eviction
 */
export class CacheLayer {
    private cache: Map<string, CacheEntry<unknown>> = new Map();
    private defaultTtl: number;
    private maxEntries: number;

    constructor(options: CacheOptions = {}) {
        this.defaultTtl = options.ttl ?? 30000; // 30 seconds default
        this.maxEntries = options.maxEntries ?? 500;
    }

    /**
     * Get a cached value
     */
    get<T>(key: string): T | undefined {
        const entry = this.cache.get(key) as CacheEntry<T> | undefined;

        if (!entry) {
            return undefined;
        }

        // Check if expired
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return undefined;
        }

        // Update access count for LRU
        entry.accessCount++;

        return entry.value;
    }

    /**
     * Set a cached value
     */
    set<T>(key: string, value: T, ttl?: number): void {
        // Evict if at capacity
        if (this.cache.size >= this.maxEntries) {
            this.evictLRU();
        }

        const now = Date.now();
        const entry: CacheEntry<T> = {
            value,
            timestamp: now,
            expiresAt: now + (ttl ?? this.defaultTtl),
            accessCount: 0,
        };

        this.cache.set(key, entry);
    }

    /**
     * Check if a key exists and is not expired
     */
    has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    /**
     * Delete a specific key
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Clear all cached entries
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get cache size
     */
    get size(): number {
        return this.cache.size;
    }

    /**
     * Get cache statistics
     */
    getStats(): { size: number; maxEntries: number; hitRate: number } {
        return {
            size: this.cache.size,
            maxEntries: this.maxEntries,
            hitRate: 0, // Would need to track hits/misses for this
        };
    }

    /**
     * Invalidate all entries matching a pattern
     */
    invalidatePattern(pattern: string | RegExp): number {
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        let count = 0;

        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
                count++;
            }
        }

        return count;
    }

    /**
     * Prune expired entries
     */
    prune(): number {
        const now = Date.now();
        let count = 0;

        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
                count++;
            }
        }

        return count;
    }

    /**
     * Evict least recently used entry
     */
    private evictLRU(): void {
        let lruKey: string | null = null;
        let lruScore = Infinity;

        for (const [key, entry] of this.cache.entries()) {
            // Score based on access count and age
            const age = Date.now() - entry.timestamp;
            const score = entry.accessCount * 1000 - age;

            if (score < lruScore) {
                lruScore = score;
                lruKey = key;
            }
        }

        if (lruKey) {
            this.cache.delete(lruKey);
        }
    }

    /**
     * Generate a cache key from method and arguments
     */
    static generateKey(method: string, ...args: unknown[]): string {
        const argsString = args.map(arg => {
            if (arg === null || arg === undefined) return 'null';
            if (typeof arg === 'object') return JSON.stringify(arg);
            return String(arg);
        }).join(':');

        return `${method}:${argsString}`;
    }
}

// Singleton cache instance for shared use
let sharedCache: CacheLayer | null = null;

/**
 * Get shared cache instance
 */
export function getSharedCache(options?: CacheOptions): CacheLayer {
    if (!sharedCache) {
        sharedCache = new CacheLayer(options);
    }
    return sharedCache;
}

/**
 * Reset shared cache (useful for testing)
 */
export function resetSharedCache(): void {
    sharedCache?.clear();
    sharedCache = null;
}
