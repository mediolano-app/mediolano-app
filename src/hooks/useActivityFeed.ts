import { useState, useEffect, useCallback, useMemo } from 'react';
import { ActivityFeedService } from '@/services/activityService';
import {
  ActivityType,
  ActivityFilter,
  ActivityFeedState,
  PaginationState
} from '@/types/activity';

const initialFilter: ActivityFilter = {
  activityTypes: Object.values(ActivityType),
  sortBy: 'timestamp',
  sortOrder: 'desc'
};

const initialPagination: PaginationState = {
  page: 1,
  limit: 20,
  total: 0,
  hasMore: false
};

const initialState: ActivityFeedState = {
  activities: [],
  loading: false,
  error: null,
  filter: initialFilter,
  pagination: initialPagination
};

export function useActivityFeed(walletAddress: string) {
  const [state, setState] = useState<ActivityFeedState>(initialState);
  const activityService = useMemo(() => new ActivityFeedService(), []);

  const fetchActivities = useCallback(async (
    page: number = 1,
    append: boolean = false
  ) => {
    if (!walletAddress) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await activityService.fetchUserActivity(
        walletAddress,
        state.filter,
        page,
        state.pagination.limit
      );

      setState(prev => ({
        ...prev,
        activities: append ? [...prev.activities, ...result.activities] : result.activities,
        loading: false,
        pagination: {
          ...prev.pagination,
          page,
          total: result.total,
          hasMore: result.hasMore
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch activities'
      }));
    }
  }, [walletAddress, state.filter, state.pagination.limit, activityService]);

  const loadMore = useCallback(() => {
    if (state.loading || !state.pagination.hasMore) return;
    fetchActivities(state.pagination.page + 1, true);
  }, [state.loading, state.pagination.hasMore, state.pagination.page, fetchActivities]);

  const updateFilter = useCallback((updates: Partial<ActivityFilter>) => {
    setState(prev => ({
      ...prev,
      filter: { ...prev.filter, ...updates },
      pagination: { ...prev.pagination, page: 1 }
    }));
  }, []);

  const toggleActivityType = useCallback((activityType: ActivityType) => {
    setState(prev => {
      const currentTypes = prev.filter.activityTypes;
      const newTypes = currentTypes.includes(activityType)
        ? currentTypes.filter(type => type !== activityType)
        : [...currentTypes, activityType];
      
      return {
        ...prev,
        filter: { ...prev.filter, activityTypes: newTypes },
        pagination: { ...prev.pagination, page: 1 }
      };
    });
  }, []);

  const setDateRange = useCallback((start: Date | null, end: Date | null) => {
    setState(prev => ({
      ...prev,
      filter: {
        ...prev.filter,
        dateRange: start && end ? { start, end } : undefined
      },
      pagination: { ...prev.pagination, page: 1 }
    }));
  }, []);

  const setSorting = useCallback((
    sortBy: ActivityFilter['sortBy'],
    sortOrder: ActivityFilter['sortOrder']
  ) => {
    setState(prev => ({
      ...prev,
      filter: { ...prev.filter, sortBy, sortOrder },
      pagination: { ...prev.pagination, page: 1 }
    }));
  }, []);

  const refresh = useCallback(() => {
    fetchActivities(1, false);
  }, [fetchActivities]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  
  useEffect(() => {
    if (walletAddress) {
      fetchActivities(1, false);
    }
  }, [walletAddress, state.filter]);

  const enhancedActivities = useMemo(() => 
    state.activities.map(activity => ({
      ...activity,
      explorerUrl: activityService.getExplorerUrl(activity.txHash),
      formattedTimestamp: new Date(activity.timestamp).toLocaleString(),
      formattedAmount: activity.amount ? parseFloat(activity.amount).toLocaleString() : undefined,
      formattedPrice: activity.price ? `${parseFloat(activity.price).toLocaleString()} ${activity.currency || 'ETH'}` : undefined
    }))
  , [state.activities, activityService]);


  const groupedActivities = useMemo(() => {
    const groups: { [date: string]: typeof enhancedActivities } = {};
    
    enhancedActivities.forEach(activity => {
      const date = new Date(activity.timestamp).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(activity);
    });
    
    return groups;
  }, [enhancedActivities]);

  
  const statistics = useMemo(() => {
    const stats = {
      totalActivities: state.activities.length,
      activityCounts: {} as Record<ActivityType, number>,
      totalValue: 0,
      uniqueAssets: new Set<string>()
    };

    state.activities.forEach(activity => {
      
      stats.activityCounts[activity.activityType] = 
        (stats.activityCounts[activity.activityType] || 0) + 1;
      
      
      if (activity.price) {
        stats.totalValue += parseFloat(activity.price);
      }
      
    
      if (activity.assetId) {
        stats.uniqueAssets.add(activity.assetId);
      }
    });

    return {
      ...stats,
      uniqueAssetsCount: stats.uniqueAssets.size
    };
  }, [state.activities]);

  return {
    activities: enhancedActivities,
    groupedActivities,
    statistics,
    loading: state.loading,
    error: state.error,
    filter: state.filter,
    pagination: state.pagination,
    

    fetchActivities,
    loadMore,
    updateFilter,
    toggleActivityType,
    setDateRange,
    setSorting,
    refresh,
    clearError,
    
    
    getExplorerUrl: activityService.getExplorerUrl,
    getAssetMetadata: activityService.getAssetMetadata
  };
}