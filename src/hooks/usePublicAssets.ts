import { useInfiniteQuery } from '@tanstack/react-query';
import { mipAssetsService } from '../services/mipAssetsService';
import { AssetFilter } from '../types/asset';

export const usePublicAssets = (
    filters: AssetFilter = {},
    pageSize: number = 20,
    network: 'sepolia' | 'mainnet' = 'sepolia'
) => {
    return useInfiniteQuery({
        queryKey: ['public-assets', filters, pageSize, network],
        queryFn: ({ pageParam = 0 }) =>
            mipAssetsService.fetchAllAssets(pageParam, pageSize, filters),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.hasMore ? allPages.length : undefined,
        initialPageParam: 0, // Required in v5
        staleTime: 2 * 60 * 1000, // 2 minutes for asset data
        gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
    });
};