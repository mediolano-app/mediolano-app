import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount } from '@starknet-react/core';
import { useEvents, useProvider } from '@starknet-react/core';
import { num } from 'starknet';
import {
  ActivityItem,
  ActivityType,
  ActivityStatus,
  ActivityFilter,
  PaginationState,
  createActivityMetadata,
  determineTransferDirection,
  formatActivityTimestamp
} from '@/types/activity';

// Constants
const IPFS_URL = process.env.NEXT_PUBLIC_PINATA_HOST!;
const MIP_CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP!;
const COLLECTION_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS!;
const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL;

const CONTRACTS = {
  MEDIOLANO: MIP_CONTRACT,
  COLLECTION_FACTORY: COLLECTION_CONTRACT_ADDRESS,
};

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

type StartBlock = { mip: number; collection: number };

export interface UseActivityFeedOptions {
  userAddress?: string;
  pageSize?: number;
  startBlock: StartBlock;
  autoFetch?: boolean;
}

export interface UseActivityFeedResult {
  // Data
  activities: ActivityItem[];
  groupedActivities: Record<string, ActivityItem[]>;
  statistics: {
    totalActivities: number;
    activityCounts: Partial<Record<ActivityType, number>>;
    statusCounts: Partial<Record<ActivityStatus, number>>;
    totalValue: number;
    uniqueAssetsCount: number;
    uniqueCollectionsCount: number;
  };
  loading: boolean;
  error: string | null;
  filter: ActivityFilter;
  pagination: PaginationState;
  walletAddress?: string;
  isConnected: boolean;
  isInitialized: boolean;

  // Actions
  onLoadMore: () => Promise<void>;
  updateFilter: (updates: Partial<ActivityFilter>) => void;
  toggleActivityType: (activityType: ActivityType) => void;
  setDateRange: (start: Date | null, end: Date | null) => void;
  setSorting: (sortBy: ActivityFilter['sortBy'], sortOrder: ActivityFilter['sortOrder']) => void;
  refresh: () => void;
  clearError: () => void;
}

const initialFilter: ActivityFilter = {
  activityTypes: [
    'mint',
    'mint_batch',
    'transfer_out',
    'transfer_in',
    'transfer_batch',
    'burn',
    'burn_batch',
    'collection_create',
    'update',
    'upgrade',
    'sale'
  ],
  sortBy: 'timestamp',
  sortOrder: 'desc'
};

const initialPagination: PaginationState = {
  page: 1,
  limit: 25,
  total: 0,
  hasMore: false
};

export function useActivityFeed(options: UseActivityFeedOptions): UseActivityFeedResult {
  const { userAddress: providedAddress, pageSize = 25, startBlock, autoFetch = true } = options;
  const { account } = useAccount();
  const { provider } = useProvider();
  
  const userAddress = providedAddress || account?.address;
  const [filter, setFilter] = useState<ActivityFilter>(initialFilter);
  const [pagination, setPagination] = useState<PaginationState>({
    ...initialPagination,
    limit: pageSize
  });
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Voyager cache state
  const [voyagerTimestamps, setVoyagerTimestamps] = useState<Record<string, string>>({});
  const [voyagerSenders, setVoyagerSenders] = useState<Record<string, string | undefined>>({});
  const [isBatchLoading, setIsBatchLoading] = useState(false);
  const [loggedTx, setLoggedTx] = useState<Record<string, boolean>>({});

  // Collection Factory Events
  const factoryCollectionCreated = useEvents({
    address: CONTRACTS.COLLECTION_FACTORY as `0x${string}`,
    eventName: 'CollectionCreated',
    fromBlock: startBlock.collection,
    toBlock: 'latest',
    pageSize,
  } as any);

  const factoryTokenMinted = useEvents({
    address: CONTRACTS.COLLECTION_FACTORY as `0x${string}`,
    eventName: 'TokenMinted',
    fromBlock: startBlock.collection,
    toBlock: 'latest',
    pageSize,
  } as any);

  const factoryTokenMintedBatch = useEvents({
    address: CONTRACTS.COLLECTION_FACTORY as `0x${string}`,
    eventName: 'TokenMintedBatch',
    fromBlock: startBlock.collection,
    toBlock: 'latest',
    pageSize,
  } as any);

  const factoryTokenBurned = useEvents({
    address: CONTRACTS.COLLECTION_FACTORY as `0x${string}`,
    eventName: 'TokenBurned',
    fromBlock: startBlock.collection,
    toBlock: 'latest',
    pageSize,
  } as any);

  const factoryTokenBurnedBatch = useEvents({
    address: CONTRACTS.COLLECTION_FACTORY as `0x${string}`,
    eventName: 'TokenBurnedBatch',
    fromBlock: startBlock.collection,
    toBlock: 'latest',
    pageSize,
  } as any);

  const factoryOwnershipTransferred = useEvents({
    address: CONTRACTS.COLLECTION_FACTORY as `0x${string}`,
    eventName: 'OwnershipTransferred',
    fromBlock: startBlock.collection,
    toBlock: 'latest',
    pageSize,
  } as any);

  // NFT Events
  const nftTransfer = useEvents({
    address: CONTRACTS.MEDIOLANO as `0x${string}`,
    eventName: 'Transfer',
    fromBlock: startBlock.mip,
    toBlock: 'latest',
    pageSize,
  } as any);

  const nftTransferBatch = useEvents({
    address: CONTRACTS.MEDIOLANO as `0x${string}`,
    eventName: 'TransferBatch',
    fromBlock: startBlock.mip,
    toBlock: 'latest',
    pageSize,
  } as any);

  const nftApproval = useEvents({
    address: CONTRACTS.MEDIOLANO as `0x${string}`,
    eventName: 'Approval',
    fromBlock: startBlock.mip,
    toBlock: 'latest',
    pageSize,
  } as any);

  const nftMetadataUpdate = useEvents({
    address: CONTRACTS.MEDIOLANO as `0x${string}`,
    eventName: 'MetadataUpdate',
    fromBlock: startBlock.mip,
    toBlock: 'latest',
    pageSize,
  } as any);

  const nftUpgrade = useEvents({
    address: CONTRACTS.MEDIOLANO as `0x${string}`,
    eventName: 'Upgraded',
    fromBlock: startBlock.mip,
    toBlock: 'latest',
    pageSize,
  } as any);

  // Utility functions
  const flatten = (d: any) => (d?.data?.pages ?? []).flatMap((p: any) => p?.events ?? []);
  const toHex = (v: any) => { 
    try { 
      return num.toHex(v); 
    } catch { 
      return String(v); 
    } 
  };

  const extractTokenId = (data: any[]) => 
    data?.length > 2 ? toHex(data[2]) : (data?.length > 0 ? toHex(data[0]) : undefined);

  const extractTokenIds = (data: any[]) => {
    // For batch operations, extract multiple token IDs
    if (data?.length > 3) {
      return data.slice(2).map(toHex);
    }
    return [extractTokenId(data)].filter(Boolean);
  };

  const extractAddrs = (data: any[]) => ({
    fromAddress: data && data.length > 0 ? toHex(data[0]) : undefined,
    toAddress: data && data.length > 1 ? toHex(data[1]) : undefined,
  });

  const extractNftTransferAddrs = (e: any) => {
    const keys = e?.keys || [];
    return {
      fromAddress: keys.length > 1 ? toHex(keys[1]) : undefined,
      toAddress: keys.length > 2 ? toHex(keys[2]) : undefined,
    };
  };

  // Flatten all events
  const rawEvents = useMemo(() => ({
    factoryCollectionCreated: flatten(factoryCollectionCreated),
    factoryTokenMinted: flatten(factoryTokenMinted),
    factoryTokenMintedBatch: flatten(factoryTokenMintedBatch),
    factoryTokenBurned: flatten(factoryTokenBurned),
    factoryTokenBurnedBatch: flatten(factoryTokenBurnedBatch),
    factoryOwnershipTransferred: flatten(factoryOwnershipTransferred),
    nftTransfer: flatten(nftTransfer),
    nftTransferBatch: flatten(nftTransferBatch),
    nftApproval: flatten(nftApproval),
    nftMetadataUpdate: flatten(nftMetadataUpdate),
    nftUpgrade: flatten(nftUpgrade),
  }), [
    factoryCollectionCreated,
    factoryTokenMinted,
    factoryTokenMintedBatch,
    factoryTokenBurned,
    factoryTokenBurnedBatch,
    factoryOwnershipTransferred,
    nftTransfer,
    nftTransferBatch,
    nftApproval,
    nftMetadataUpdate,
    nftUpgrade,
  ]);

  // Get unique transaction hashes ordered by newest block
  const sampleTxHashes = useMemo(() => {
    const allEvents = Object.values(rawEvents).flat();
    const all = allEvents
      .map((e: any) => ({ 
        hash: String(e?.transaction_hash), 
        block: Number(e?.block_number ?? 0) 
      }))
      .filter((e) => !!e.hash)
      .sort((a, b) => b.block - a.block);

    const seen = new Set<string>();
    const ordered: string[] = [];
    for (const { hash } of all) {
      if (!seen.has(hash)) {
        seen.add(hash);
        ordered.push(hash);
      }
    }
    return ordered;
  }, [rawEvents]);

  // Cache management for voyager data
  useEffect(() => {
    try {
      const cache = sessionStorage.getItem('voyagerTxCache');
      if (cache) {
        const now = Date.now();
        const parsed: Record<string, { timestampIso: string; sender?: string; cachedAt?: number }> = JSON.parse(cache);
        const freshEntries = Object.entries(parsed).filter(([, v]) => 
          typeof v?.cachedAt === 'number' ? (now - (v.cachedAt as number) <= CACHE_TTL_MS) : false
        );
        setVoyagerTimestamps(Object.fromEntries(freshEntries.map(([h, v]) => [h, v.timestampIso])));
        setVoyagerSenders(Object.fromEntries(freshEntries.map(([h, v]) => [h, v.sender?.toLowerCase()])));
      }
    } catch {
      // Ignore cache errors
    }
  }, []);

  // Batch fetch transaction data from Voyager
  useEffect(() => {
    const cache: Record<string, { timestampIso: string; sender?: string; cachedAt?: number }> = (() => {
      try { 
        return JSON.parse(sessionStorage.getItem('voyagerTxCache') || '{}'); 
      } catch { 
        return {}; 
      }
    })();

    const now = Date.now();
    const isFresh = (h: string) => {
      const v = cache[h];
      if (!v || typeof v.cachedAt !== 'number') return false;
      return now - v.cachedAt <= CACHE_TTL_MS;
    };

    const unknown = sampleTxHashes.filter((h) => 
      !isFresh(h) && (!voyagerTimestamps[h] || voyagerSenders[h] === undefined)
    );
    const toFetch = unknown.slice(0, 100);

    if (toFetch.length === 0) return;

    let alive = true;
    (async () => {
      try {
        setIsBatchLoading(true);
        const res = await fetch('/api/voyager/txn-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hashes: toFetch }),
        });

        if (!res.ok) throw new Error('Voyager batch fetch failed');
        const json: Record<string, { timestampIso: string; sender?: string }> = await res.json();

        if (!alive) return;

        setVoyagerTimestamps((prev) => {
          const next = { ...prev };
          for (const [h, info] of Object.entries(json)) {
            next[h] = info.timestampIso;
          }
          return next;
        });

        setVoyagerSenders((prev) => {
          const next = { ...prev };
          for (const [h, info] of Object.entries(json)) {
            next[h] = info.sender?.toLowerCase();
          }
          return next;
        });

        // Update cache
        try {
          const current: Record<string, { timestampIso: string; sender?: string; cachedAt?: number }> = 
            JSON.parse(sessionStorage.getItem('voyagerTxCache') || '{}');
          const nowTs = Date.now();
          const withTimestamps: Record<string, { timestampIso: string; sender?: string; cachedAt: number }> = {};
          
          for (const [h, info] of Object.entries(json)) {
            withTimestamps[h] = { ...info, cachedAt: nowTs };
          }
          
          const merged = { ...current, ...withTimestamps };
          sessionStorage.setItem('voyagerTxCache', JSON.stringify(merged));
        } catch {
          // Ignore cache write errors
        }
      } catch (e) {
        console.warn('Voyager batch fetch error', e);
        setError('Failed to fetch transaction details');
      } finally {
        if (alive) setIsBatchLoading(false);
      }
    })();

    return () => { 
      alive = false; 
    };
  }, [sampleTxHashes, voyagerTimestamps, voyagerSenders]);

  // Build activities from events
  const activities = useMemo(() => {
    if (!userAddress) return [];

    const items: ActivityItem[] = [];
    const normalizedUserAddress = userAddress.toLowerCase();

    // Helper function to create base activity
    const createBaseActivity = (e: any, contractAddress: string): Partial<ActivityItem> => {
      const timestamp = voyagerTimestamps[String(e.transaction_hash)] || new Date().toISOString();
      return {
        id: `${e.transaction_hash}_${e.block_number}`,
        network: 'Starknet',
        hash: String(e.transaction_hash),
        timestamp,
        status: 'completed' as ActivityStatus,
        metadata: {
          blockNumber: Number(e.block_number ?? 0),
          contractAddress
        }
      };
    };

    // Process NFT Transfer events
    for (const e of rawEvents.nftTransfer) {
      const { fromAddress, toAddress } = extractNftTransferAddrs(e);
      const base = createBaseActivity(e, CONTRACTS.MEDIOLANO);
      const assetId = extractTokenId(e.data || []);
      const activityType = determineTransferDirection('Transfer', fromAddress || '', toAddress || '', userAddress);
      
      if (activityType) {
        const metadata = createActivityMetadata({ 
          type: activityType, 
          assetId, 
          fromAddress, 
          toAddress 
        });
        
        items.push({
          ...base,
          type: activityType,
          title: metadata.title,
          description: metadata.description,
          assetId,
          fromAddress,
          toAddress
        } as ActivityItem);
      }
    }

    // Process NFT Transfer Batch events
    for (const e of rawEvents.nftTransferBatch) {
      const { fromAddress, toAddress } = extractAddrs(e.data || []);
      const base = createBaseActivity(e, CONTRACTS.MEDIOLANO);
      const assetIds = extractTokenIds(e.data || []);
      
      const isBurn = (toAddress || '').toLowerCase() === '0x0';
      const isMint = (fromAddress || '').toLowerCase() === '0x0';
      
      let activityType: ActivityType;
      if (isMint) {
        activityType = 'mint_batch';
      } else if (isBurn) {
        activityType = 'burn_batch';
      } else {
        activityType = 'transfer_batch';
      }

      const metadata = createActivityMetadata({ 
        type: activityType, 
        assetIds: assetIds.filter((id): id is string => typeof id === 'string'),
        fromAddress, 
        toAddress 
      });

      items.push({
        ...base,
        type: activityType,
        title: metadata.title,
        description: metadata.description,
        assetIds: assetIds.filter((id): id is string => typeof id === 'string'),
        fromAddress,
        toAddress
      } as ActivityItem);
    }

    // Process Collection Factory events
    for (const e of rawEvents.factoryCollectionCreated) {
      const { fromAddress, toAddress } = extractAddrs(e.data || []);
      const base = createBaseActivity(e, CONTRACTS.COLLECTION_FACTORY);
      const metadata = createActivityMetadata({ type: 'collection_create' });

      items.push({
        ...base,
        type: 'collection_create',
        title: metadata.title,
        description: metadata.description,
        fromAddress,
        toAddress,
        collectionId: extractTokenId(e.data || [])
      } as ActivityItem);
    }

    // Process Token Minted events
    for (const e of rawEvents.factoryTokenMinted) {
      const { fromAddress, toAddress } = extractAddrs(e.data || []);
      const base = createBaseActivity(e, CONTRACTS.COLLECTION_FACTORY);
      const assetId = extractTokenId(e.data || []);
      const metadata = createActivityMetadata({ type: 'mint', assetId });

      items.push({
        ...base,
        type: 'mint',
        title: metadata.title,
        description: metadata.description,
        assetId,
        fromAddress,
        toAddress
      } as ActivityItem);
    }

    // Process Token Minted Batch events
    for (const e of rawEvents.factoryTokenMintedBatch) {
      const { fromAddress, toAddress } = extractAddrs(e.data || []);
      const base = createBaseActivity(e, CONTRACTS.COLLECTION_FACTORY);
      const assetIds = extractTokenIds(e.data || []).filter((id): id is string => typeof id === 'string');
      const metadata = createActivityMetadata({ type: 'mint_batch', assetIds });

      items.push({
        ...base,
        type: 'mint_batch',
        title: metadata.title,
        description: metadata.description,
        assetIds: assetIds.filter((id): id is string => typeof id === 'string'),
        fromAddress,
        toAddress
      } as ActivityItem);
    }

    // Process Token Burned events
    for (const e of rawEvents.factoryTokenBurned) {
      const { fromAddress, toAddress } = extractAddrs(e.data || []);
      const base = createBaseActivity(e, CONTRACTS.COLLECTION_FACTORY);
      const assetId = extractTokenId(e.data || []);
      const metadata = createActivityMetadata({ type: 'burn', assetId });

      items.push({
        ...base,
        type: 'burn',
        title: metadata.title,
        description: metadata.description,
        assetId,
        fromAddress,
        toAddress
      } as ActivityItem);
    }

    // Process Token Burned Batch events
    for (const e of rawEvents.factoryTokenBurnedBatch) {
      const { fromAddress, toAddress } = extractAddrs(e.data || []);
      const base = createBaseActivity(e, CONTRACTS.COLLECTION_FACTORY);
      const assetIds = extractTokenIds(e.data || []).filter((id): id is string => typeof id === 'string');
      const metadata = createActivityMetadata({ type: 'burn_batch', assetIds });

      items.push({
        ...base,
        type: 'burn_batch',
        title: metadata.title,
        description: metadata.description,
        assetIds: assetIds.filter((id): id is string => typeof id === 'string'),
        fromAddress,
        toAddress
      } as ActivityItem);
    }

    // Process Metadata Update events
    for (const e of rawEvents.nftMetadataUpdate) {
      const base = createBaseActivity(e, CONTRACTS.MEDIOLANO);
      const assetId = extractTokenId(e.data || []);
      const metadata = createActivityMetadata({ type: 'update', assetId });

      items.push({
        ...base,
        type: 'update',
        title: metadata.title,
        description: metadata.description,
        assetId
      } as ActivityItem);
    }

    // Process Upgrade events
    for (const e of rawEvents.nftUpgrade) {
      const base = createBaseActivity(e, CONTRACTS.MEDIOLANO);
      const metadata = createActivityMetadata({ type: 'upgrade' });

      items.push({
        ...base,
        type: 'upgrade',
        title: metadata.title,
        description: metadata.description
      } as ActivityItem);
    }

    // Filter by current user address transactions
    const filtered = items.filter((item) => {
      const from = item.fromAddress?.toLowerCase();
      const to = item.toAddress?.toLowerCase();
      const sender = voyagerSenders[String(item.hash)];
      return (
        (from && from === normalizedUserAddress) ||
        (to && to === normalizedUserAddress) ||
        (sender && sender === normalizedUserAddress)
      );
    });

    // Apply filters
    let result = filtered;

    // Filter by activity types
    if (filter.activityTypes.length > 0 && filter.activityTypes.length < 11) {
      result = result.filter(item => filter.activityTypes.includes(item.type));
    }

    // Filter by date range
    if (filter.dateRange) {
      const startTime = filter.dateRange.start.getTime();
      const endTime = filter.dateRange.end.getTime();
      result = result.filter(item => {
        const itemTime = new Date(item.timestamp).getTime();
        return itemTime >= startTime && itemTime <= endTime;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (filter.sortBy === 'timestamp') {
        const ta = new Date(a.timestamp).getTime();
        const tb = new Date(b.timestamp).getTime();
        const diff = filter.sortOrder === 'asc' ? ta - tb : tb - ta;
        if (diff !== 0) return diff;
        return (filter.sortOrder === 'asc' ? 
          (a.metadata?.blockNumber ?? 0) - (b.metadata?.blockNumber ?? 0) :
          (b.metadata?.blockNumber ?? 0) - (a.metadata?.blockNumber ?? 0)
        );
      }
      // Add other sorting options as needed
      return 0;
    });

    return result;
  }, [rawEvents, userAddress, voyagerTimestamps, voyagerSenders, filter]);

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups: Record<string, ActivityItem[]> = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.timestamp).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(activity);
    });
    
    return groups;
  }, [activities]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const activityCounts: Partial<Record<ActivityType, number>> = {};
    const statusCounts: Partial<Record<ActivityStatus, number>> = {};
    const uniqueAssets = new Set<string>();
    const uniqueCollections = new Set<string>();
    let totalValue = 0;

    activities.forEach(activity => {
      // Count by type
      activityCounts[activity.type] = (activityCounts[activity.type] || 0) + 1;
      
      // Count by status
      statusCounts[activity.status] = (statusCounts[activity.status] || 0) + 1;
      
      // Track unique assets
      if (activity.assetId) {
        uniqueAssets.add(activity.assetId);
      }
      if (activity.assetIds) {
        activity.assetIds.forEach(id => uniqueAssets.add(id));
      }
      
      // Track unique collections
      if (activity.collectionId) {
        uniqueCollections.add(activity.collectionId);
      }
      
      // Sum total value (if available)
      if (activity.value) {
        totalValue += parseFloat(activity.value) || 0;
      }
    });

    return {
      totalActivities: activities.length,
      activityCounts,
      statusCounts,
      totalValue,
      uniqueAssetsCount: uniqueAssets.size,
      uniqueCollectionsCount: uniqueCollections.size
    };
  }, [activities]);

  // Loading state
  const loading = 
    nftTransfer.isPending || nftTransfer.isFetching ||
    nftTransferBatch.isPending || nftTransferBatch.isFetching ||
    nftApproval.isPending || nftApproval.isFetching ||
    nftMetadataUpdate.isPending || nftMetadataUpdate.isFetching ||
    nftUpgrade.isPending || nftUpgrade.isFetching ||
    factoryCollectionCreated.isPending || factoryCollectionCreated.isFetching ||
    factoryTokenMinted.isPending || factoryTokenMinted.isFetching ||
    factoryTokenMintedBatch.isPending || factoryTokenMintedBatch.isFetching ||
    factoryTokenBurned.isPending || factoryTokenBurned.isFetching ||
    factoryTokenBurnedBatch.isPending || factoryTokenBurnedBatch.isFetching ||
    factoryOwnershipTransferred.isPending || factoryOwnershipTransferred.isFetching ||
    isBatchLoading;

  // Error state
  const eventError = 
    (nftTransfer.error as any)?.message ||
    (nftTransferBatch.error as any)?.message ||
    (nftApproval.error as any)?.message ||
    (nftMetadataUpdate.error as any)?.message ||
    (nftUpgrade.error as any)?.message ||
    (factoryCollectionCreated.error as any)?.message ||
    (factoryTokenMinted.error as any)?.message ||
    (factoryTokenMintedBatch.error as any)?.message ||
    (factoryTokenBurned.error as any)?.message ||
    (factoryTokenBurnedBatch.error as any)?.message ||
    (factoryOwnershipTransferred.error as any)?.message ||
    null;

  const finalError = error || eventError;

  // Actions
  const onLoadMore = useCallback(async () => {
    const queries = [
      nftTransfer, nftTransferBatch, nftApproval, nftMetadataUpdate, nftUpgrade,
      factoryCollectionCreated, factoryTokenMinted, factoryTokenMintedBatch,
      factoryTokenBurned, factoryTokenBurnedBatch, factoryOwnershipTransferred
    ];

    await Promise.all(
      queries.map(query => query.hasNextPage ? query.fetchNextPage() : Promise.resolve())
    );
  }, [
    nftTransfer, nftTransferBatch, nftApproval, nftMetadataUpdate, nftUpgrade,
    factoryCollectionCreated, factoryTokenMinted, factoryTokenMintedBatch,
    factoryTokenBurned, factoryTokenBurnedBatch, factoryOwnershipTransferred
  ]);

  const updateFilter = useCallback((updates: Partial<ActivityFilter>) => {
    setFilter(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleActivityType = useCallback((activityType: ActivityType) => {
    setFilter(prev => {
      const currentTypes = prev.activityTypes;
      const newTypes = currentTypes.includes(activityType)
        ? currentTypes.filter(type => type !== activityType)
        : [...currentTypes, activityType];
      
      return { ...prev, activityTypes: newTypes };
    });
  }, []);

  const setDateRange = useCallback((start: Date | null, end: Date | null) => {
    setFilter(prev => ({
      ...prev,
      dateRange: start && end ? { start, end } : undefined
    }));
  }, []);

  const setSorting = useCallback((
    sortBy: ActivityFilter['sortBy'],
    sortOrder: ActivityFilter['sortOrder']
  ) => {
    setFilter(prev => ({ ...prev, sortBy, sortOrder }));
  }, []);

  const refresh = useCallback(() => {
    // Clear caches and refetch
    setVoyagerTimestamps({});
    setVoyagerSenders({});
    sessionStorage.removeItem('voyagerTxCache');
    
    const queries = [
      nftTransfer, nftTransferBatch, nftApproval, nftMetadataUpdate, nftUpgrade,
      factoryCollectionCreated, factoryTokenMinted, factoryTokenMintedBatch,
      factoryTokenBurned, factoryTokenBurnedBatch, factoryOwnershipTransferred
    ];

    queries.forEach(query => query.refetch?.());
  }, [
    nftTransfer, nftTransferBatch, nftApproval, nftMetadataUpdate, nftUpgrade,
    factoryCollectionCreated, factoryTokenMinted, factoryTokenMintedBatch,
    factoryTokenBurned, factoryTokenBurnedBatch, factoryOwnershipTransferred
  ]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize
  useEffect(() => {
    if (userAddress && autoFetch && activities.length > 0) {
      setIsInitialized(true);
    }
  }, [userAddress, autoFetch, activities.length]);

  return {
    // Data
    activities,
    groupedActivities,
    statistics,
    loading,
    error: finalError,
    filter,
    pagination: {
      ...pagination,
      total: activities.length,
      hasMore: [
        nftTransfer, nftTransferBatch, nftApproval, nftMetadataUpdate, nftUpgrade,
        factoryCollectionCreated, factoryTokenMinted, factoryTokenMintedBatch,
        factoryTokenBurned, factoryTokenBurnedBatch, factoryOwnershipTransferred
      ].some(query => query.hasNextPage)
    },
    walletAddress: userAddress,
    isConnected: !!account,
    isInitialized,

    // Actions
    onLoadMore,
    updateFilter,
    toggleActivityType,
    setDateRange,
    setSorting,
    refresh,
    clearError
  };
}