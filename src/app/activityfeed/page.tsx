'use client'

import React, { useState, useMemo } from 'react';
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
  Vote,
  Droplets,
  Zap
} from 'lucide-react';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { ActivityType } from '@/types/activity';

const ACTIVITY_TYPE_LABELS = {
  [ActivityType.MINT]: 'Mint IP',
  [ActivityType.CREATE_OFFER]: 'Create Offer',
  [ActivityType.BUY]: 'Purchase',
  [ActivityType.SELL]: 'Sale',
  [ActivityType.CREATE_IP_COIN]: 'Create IP Coin',
  [ActivityType.POOL_LIQUIDITY]: 'Pool Liquidity',
  [ActivityType.DAO_VOTE]: 'DAO Vote'
};

const ACTIVITY_TYPE_COLORS = {
  [ActivityType.MINT]: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
  [ActivityType.CREATE_OFFER]: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
  [ActivityType.BUY]: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
  [ActivityType.SELL]: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
  [ActivityType.CREATE_IP_COIN]: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800',
  [ActivityType.POOL_LIQUIDITY]: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800',
  [ActivityType.DAO_VOTE]: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800'
};

const ACTIVITY_TYPE_ICONS = {
  [ActivityType.MINT]: Zap,
  [ActivityType.CREATE_OFFER]: ShoppingCart,
  [ActivityType.BUY]: TrendingUp,
  [ActivityType.SELL]: TrendingUp,
  [ActivityType.CREATE_IP_COIN]: Coins,
  [ActivityType.POOL_LIQUIDITY]: Droplets,
  [ActivityType.DAO_VOTE]: Vote
};

interface ActivityFeedProps {
  walletAddress?: string;
  className?: string;
  compact?: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  walletAddress, 
  className = '',
  compact = false 
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
    loadMore,
    toggleActivityType,
    setSorting,
    refresh,
    clearError
  } = useActivityFeed(walletAddress);

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const displayAddress = walletAddress || connectedAddress;

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesType = filter.activityTypes.includes(activity.activityType);
      const matchesSearch = !searchTerm || 
        activity.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.assetId?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [activities, filter.activityTypes, searchTerm]);

  const ActivityIcon = ({ type }: { type: ActivityType }) => {
    const IconComponent = ACTIVITY_TYPE_ICONS[type];
    return <IconComponent className="w-4 h-4" />;
  };

  const ActivityItem = ({ activity }: { activity: typeof activities[number] }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-md p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {activity.assetImage ? (
            <img 
              src={activity.assetImage} 
              alt={activity.assetName}
              className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <ActivityIcon type={activity.activityType} />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${ACTIVITY_TYPE_COLORS[activity.activityType]}`}>
                <ActivityIcon type={activity.activityType} />
                <span className="ml-1">{ACTIVITY_TYPE_LABELS[activity.activityType]}</span>
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {activity.formattedTimestamp}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
              {activity.assetName || `Transaction ${activity.txHash.slice(0, 8)}...`}
            </h3>
            
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              {activity.formattedPrice && (
                <div className="flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  <span className="font-medium text-green-600 dark:text-green-400">{activity.formattedPrice}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  Block #{activity.blockNumber?.toLocaleString()}
                </span>
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {activity.txHash.slice(0, 8)}...{activity.txHash.slice(-6)}
                </span>
              </div>
            </div>

            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(activity.metadata).slice(0, 3).map(([key, value]) => (
                  <span key={key} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="ml-1 font-medium">{String(value).slice(0, 20)}{String(value).length > 20 ? '...' : ''}</span>
                  </span>
                ))}
              </div>
            )}

            {activity.voteChoice && (
              <div className="mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  activity.voteChoice === 'for' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                  activity.voteChoice === 'against' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                }`}>
                  Vote: {activity.voteChoice.charAt(0).toUpperCase() + activity.voteChoice.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={() => window.open(activity.explorerUrl, '_blank')}
          className="ml-4 p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex-shrink-0"
          title="View on Starknet Explorer"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
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
            {Object.values(ActivityType).map(type => (
              <button
                key={type}
                onClick={() => toggleActivityType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors flex items-center space-x-1 ${
                  filter.activityTypes.includes(type)
                    ? ACTIVITY_TYPE_COLORS[type]
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <ActivityIcon type={type} />
                <span>{ACTIVITY_TYPE_LABELS[type]}</span>
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
              onChange={(e) => setSorting(e.target.value as any, filter.sortOrder)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="timestamp">Date</option>
              <option value="amount">Amount</option>
              <option value="activityType">Type</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Order
            </label>
            <select
              value={filter.sortOrder}
              onChange={(e) => setSorting(filter.sortBy, e.target.value as any)}
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
                  {statistics.activityCounts[ActivityType.MINT] || 0}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">IPs Minted</div>
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

        {loading ? (
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
              {searchTerm ? 'Try adjusting your search terms or filters' : 'Start by minting your first IP or making an offer'}
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
            <ActivityItem key={activity.id} activity={activity} />
          ))
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length > 0 && pagination.hasMore && (
        <div className="text-center mt-8">
          <button 
            onClick={loadMore}
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
    </div>
  );
};

export default ActivityFeed;