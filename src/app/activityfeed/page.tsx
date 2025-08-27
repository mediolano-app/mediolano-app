'use client'

import React, { useState, useMemo, useCallback } from 'react';
import { 
  Calendar, 
  Filter, 
  ExternalLink, 
  RefreshCw, 
  TrendingUp, 
  Clock,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Wallet,
  AlertCircle,
  Activity,
  Coins,
  ShoppingCart,
  Layers,
  Zap,
  Flame,
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Settings,
  Upload,
  Copy,
  Check
} from 'lucide-react';

// Transaction Details Component (integrated from the first document)
interface TransactionDetailsProps {
  hash?: string;
  network: string;
  timestamp?: string;
  blockNumber?: number;
  status?: 'completed' | 'pending' | 'failed';
  explorerUrl?: string;
  onCopy?: (text: string) => void;
  className?: string;
}

function TransactionDetails({ 
  hash, 
  network, 
  timestamp,
  blockNumber,
  status = 'completed',
  explorerUrl,
  onCopy,
  className = ""
}: TransactionDetailsProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleCopy = useCallback(async (text: string) => {
    try {
      if (onCopy) {
        onCopy(text);
      } else {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('Failed to copy to clipboard:', error);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  }, [onCopy]);

  const handleExternalLink = useCallback(() => {
    const baseUrl = explorerUrl || "https://starkscan.co";
    const url = `${baseUrl}/tx/${hash}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [hash, explorerUrl]);

  if (!hash) {
    return (
      <div className={`flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400 ${className}`}>
        <AlertCircle className="w-4 h-4" />
        <span>Transaction hash not available</span>
      </div>
    );
  }

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      default:
        return 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main transaction row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Network badge */}
        <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border backdrop-blur-sm ${getStatusColor()}`}>
          <span>{network}</span>
        </div>

        {/* Transaction hash with copy button */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleCopy(hash)}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-mono bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200"
            title={copied ? 'Copied!' : copyError ? 'Failed to copy' : 'Click to copy'}
          >
            <span className="mr-1">
              {`${hash.slice(0, 6)}...${hash.slice(-4)}`}
            </span>
            {copied ? (
              <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
            ) : copyError ? (
              <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
            ) : (
              <Copy className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
            )}
          </button>

          {/* External link button */}
          <button
            onClick={handleExternalLink}
            className="inline-flex items-center justify-center p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200"
            title="View on explorer"
          >
            <ExternalLink className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
          </button>
        </div>
      </div>

      {/* Additional details */}
      {(timestamp || blockNumber) && (
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          {blockNumber && (
            <span>
              Block: {blockNumber.toLocaleString()}
            </span>
          )}
        </div>
      )}

      {/* Status indicator for non-completed transactions */}
      {status !== 'completed' && (
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${
            status === 'pending' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
          }`} />
          <span className="capitalize text-gray-500 dark:text-gray-400">{status}</span>
        </div>
      )}
    </div>
  );
}


const ACTIVITY_TYPE_ICONS: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  'mint': Zap,
  'mint_batch': Zap,
  'transfer_out': ArrowUpRight,
  'transfer_in': ArrowDownLeft,
  'transfer_batch': Repeat,
  'burn': Flame,
  'burn_batch': Flame,
  'collection_create': Layers,
  'update': Settings,
  'upgrade': Upload,
  'sale': ShoppingCart
};


import { useActivityFeed, UseActivityFeedResult } from '@/hooks/useActivityFeed';
import { 
  ActivityType, 
  ActivityItem,
  typeLabels, 
  activityColors,
} from '@/types/activity';

interface ActivityFeedProps {
  walletAddress?: string;
  className?: string;
  compact?: boolean;
  startBlock?: { mip: number; collection: number };
  pageSize?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  walletAddress, 
  className = '',
  compact = false,
  startBlock = { mip: 0, collection: 0 },
  pageSize = 25
}) => {
  const {
    activities,
    statistics,
    loading,
    error,
    filter,
    pagination,
    isConnected,
    walletAddress: connectedAddress,
    onLoadMore,
    toggleActivityType,
    setSorting,
    refresh,
    clearError
  }: UseActivityFeedResult = useActivityFeed({
    userAddress: walletAddress,
    pageSize,
    startBlock,
    autoFetch: true
  });

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedText, setCopiedText] = useState<string>('');

  const displayAddress = walletAddress || connectedAddress;

  const handleCopy = (text: string) => {
    setCopiedText(text);
    console.log('Copied:', text);
  };

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesHash = activity.hash?.toLowerCase().includes(searchLower);
      const matchesAssetId = activity.assetId?.toLowerCase().includes(searchLower);
      const matchesCollectionId = activity.collectionId?.toLowerCase().includes(searchLower);
      const matchesTitle = activity.title?.toLowerCase().includes(searchLower);
      const matchesType = typeLabels[activity.type]?.toLowerCase().includes(searchLower);
      
      return matchesHash || matchesAssetId || matchesCollectionId || matchesTitle || matchesType;
    });
  }, [activities, searchTerm]);

  const ActivityIcon = ({ type }: { type: ActivityType }) => {
    const IconComponent = ACTIVITY_TYPE_ICONS[type];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <Activity className="w-4 h-4" />;
  };

  const formatPrice = (value: string, currency: string) => {
    return `${value} ${currency}`;
  };

  const formatActivityTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const ActivityItemComponent = ({ activity }: { activity: ActivityItem }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-md p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Activity Icon */}
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <ActivityIcon type={activity.type} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2 flex-wrap">
              {/* Activity Type Badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${activityColors[activity.type]}`}>
                <ActivityIcon type={activity.type} />
                <span className="ml-1">{typeLabels[activity.type]}</span>
              </span>
              
              {/* Timestamp */}
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatActivityTimestamp(activity.timestamp)}
              </span>
            </div>
            
            {/* Activity Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {activity.title}
            </h3>
            
            {/* Activity Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {activity.description}
            </p>
            
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              {/* Value/Price */}
              {activity.value && (
                <div className="flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatPrice(activity.value, 'ETH')}
                  </span>
                </div>
              )}
              
              {/* Transaction Details Integration */}
              {activity.hash && (
                <div className="mt-2">
                  <TransactionDetails
                    hash={activity.hash}
                    network="Starknet"
                    blockNumber={activity.metadata?.blockNumber}
                    status={activity.metadata?.status}
                    onCopy={handleCopy}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Asset/Collection IDs */}
            {(activity.assetId || activity.assetIds?.length || activity.collectionId) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {activity.assetId && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 dark:bg-blue-800/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-600">
                    Asset #{activity.assetId}
                  </span>
                )}
                {activity.assetIds?.slice(0, 3).map((assetId, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 dark:bg-blue-800/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-600">
                    Asset #{assetId}
                  </span>
                ))}
                {activity.assetIds && activity.assetIds.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    +{activity.assetIds.length - 3} more
                  </span>
                )}
                {activity.collectionId && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-50 dark:bg-purple-800/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-600">
                    Collection #{activity.collectionId}
                  </span>
                )}
              </div>
            )}

            {/* From/To Addresses */}
            {(activity.fromAddress || activity.toAddress) && (
              <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                {activity.fromAddress && (
                  <div>From: <span className="font-mono">{activity.fromAddress.slice(0, 10)}...{activity.fromAddress.slice(-8)}</span></div>
                )}
                {activity.toAddress && (
                  <div>To: <span className="font-mono">{activity.toAddress.slice(0, 10)}...{activity.toAddress.slice(-8)}</span></div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const FilterPanel = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
        <button
          onClick={() => setShowFilters(false)}
          className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Activity Types
          </label>
          <div className="flex flex-wrap gap-2">
            {(['mint', 'mint_batch', 'transfer_out', 'transfer_in', 'transfer_batch', 'burn', 'burn_batch', 'collection_create', 'update', 'upgrade', 'sale'] as ActivityType[]).map(type => (
              <button
                key={type}
                onClick={() => toggleActivityType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors flex items-center space-x-1 ${
                  filter.activityTypes.includes(type)
                    ? activityColors[type]
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <ActivityIcon type={type} />
                <span>{typeLabels[type]}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <select
              value={filter.sortBy}
              onChange={(e) => setSorting(e.target.value as 'timestamp' | 'type' | 'value', filter.sortOrder)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="timestamp">Date</option>
              <option value="value">Value</option>
              <option value="type">Type</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Order
            </label>
            <select
              value={filter.sortOrder}
              onChange={(e) => setSorting(filter.sortBy, e.target.value as 'desc' | 'asc')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const WalletStatus = () => (
    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
      <Wallet className="w-4 h-4" />
      <span>
        {displayAddress ? (
          <>
            <span className="font-medium">Wallet:</span>{' '}
            <span className="font-mono">{displayAddress.slice(0, 6)}...{displayAddress.slice(-4)}</span>
          </>
        ) : (
          <span className="text-orange-600 dark:text-orange-400">No wallet connected</span>
        )}
      </span>
      {isConnected && (
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      )}
    </div>
  );

  if (!displayAddress && !loading) {
    return (
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <Wallet className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please connect your wallet to view your activity feed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {compact ? 'Activity' : 'Activity Feed'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track your onchain activities and transactions
            </p>
          </div>
          <WalletStatus />
        </div>
      </div>

      {/* Controls */}
      {!compact && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search activities, assets, or transaction hashes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg border transition-colors flex items-center space-x-2 ${
                showFilters 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' 
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <button
              onClick={refresh}
              disabled={loading}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              aria-label="Refresh activities"
              title="Refresh activities"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && !compact && <FilterPanel />}

      {/* Statistics */}
      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{statistics.totalActivities}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Activities</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {statistics.uniqueAssetsCount}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">Unique Assets</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {(statistics.activityCounts.mint || 0) + (statistics.activityCounts.mint_batch || 0)}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Assets Minted</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-800 dark:text-red-300">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {loading && activities.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No activities found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchTerm ? 'Try adjusting your search terms or filters' : 'Start by minting your first asset or creating a collection'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredActivities.map(activity => (
            <ActivityItemComponent key={activity.id} activity={activity} />
          ))
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length > 0 && pagination.hasMore && (
        <div className="text-center mt-8">
          <button 
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              'Load More Activities'
            )}
          </button>
        </div>
      )}

      {/* Copy feedback */}
      {copiedText && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm">
            Copied: <code className="font-mono">{copiedText.slice(0, 20)}...</code>
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;