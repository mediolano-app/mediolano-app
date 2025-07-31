import { Contract, RpcProvider, num } from 'starknet';
import { 
  ActivityEvent, 
  ActivityFilter, 
  ActivityType, 
  STARKNET_EVENT_SIGNATURES,
  STARKNET_EXPLORER_URL 
} from '@/types/activity';

export interface ActivityFetchResult {
  activities: ActivityEvent[];
  total: number;
  hasMore: boolean;
}

export class ActivityFeedService {
  private provider: RpcProvider;
  private contracts: Map<string, Contract> = new Map();

  constructor(providerUrl?: string) {
    this.provider = new RpcProvider({
      nodeUrl: providerUrl || process.env.NEXT_PUBLIC_STARKNET_RPC_URL || 'https://starknet-sepolia.public.blastapi.io'
    });
  }

  /**
   * Fetch user activities from Starknet
   */
  async fetchUserActivity(
    walletAddress: string,
    filter: ActivityFilter,
    page: number = 1,
    limit: number = 20
  ): Promise<ActivityFetchResult> {
    try {
      const activities: ActivityEvent[] = [];
      
      // Get events for each activity type in the filter
      for (const activityType of filter.activityTypes) {
        const typeActivities = await this.fetchActivityByType(
          walletAddress,
          activityType,
          filter,
          page,
          limit
        );
        activities.push(...typeActivities);
      }

      // Sort activities
      const sortedActivities = this.sortActivities(activities, filter);
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedActivities = sortedActivities.slice(startIndex, endIndex);
      
      return {
        activities: paginatedActivities,
        total: sortedActivities.length,
        hasMore: endIndex < sortedActivities.length
      };
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw new Error('Failed to fetch activities from Starknet');
    }
  }

  /**
   * Fetch activities by specific type
   */
  private async fetchActivityByType(
    walletAddress: string,
    activityType: ActivityType,
    filter: ActivityFilter,
    page: number,
    limit: number
  ): Promise<ActivityEvent[]> {
    try {
      const eventSignature = STARKNET_EVENT_SIGNATURES[activityType];
      if (!eventSignature) {
        console.warn(`No event signature found for activity type: ${activityType}`);
        return [];
      }

      // Get recent blocks to search (last 1000 blocks as example)
      const latestBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 1000);

      // Fetch events from Starknet
      const eventFilter = {
        from_block: { block_number: fromBlock },
        to_block: { block_number: latestBlock },
        address: undefined, // We'll filter by all relevant contracts
        keys: [[eventSignature]], // Event signature as array of arrays
        chunk_size: limit // Add required chunk_size property
      };

      const events = await this.provider.getEvents(eventFilter);
      
      // Process and filter events
      const activities: ActivityEvent[] = [];
      
      for (const event of events.events) {
        try {
          const activity = await this.parseEventToActivity(event, activityType, walletAddress);
          if (activity && this.matchesDateFilter(activity, filter)) {
            activities.push(activity);
          }
        } catch (parseError) {
          console.warn('Error parsing event:', parseError);
          // Continue processing other events
        }
      }

      return activities;
    } catch (error) {
      console.error(`Error fetching ${activityType} activities:`, error);
      return [];
    }
  }

  /**
   * Parse a Starknet event into an ActivityEvent
   */
  private async parseEventToActivity(
    event: any,
    activityType: ActivityType,
    userAddress: string
  ): Promise<ActivityEvent | null> {
    try {
      // Basic event data
      const activity: ActivityEvent = {
        id: `${event.transaction_hash}_${event.event_index || 0}`,
        txHash: event.transaction_hash,
        blockNumber: event.block_number,
        timestamp: Date.now(), 
        activityType,
        userAddress,
        metadata: {}
      };

      // Get block details for timestamp
      try {
        const block = await this.provider.getBlockWithTxHashes(event.block_number);
        activity.timestamp = block.timestamp * 1000; // Convert to milliseconds
      } catch (blockError) {
        console.warn('Could not fetch block timestamp:', blockError);
        // Use current time as fallback
        activity.timestamp = Date.now();
      }

      // Parse event data based on activity type
      switch (activityType) {
        case ActivityType.MINT:
          return this.parseMintEvent(activity, event);
        case ActivityType.CREATE_OFFER:
          return this.parseCreateOfferEvent(activity, event);
        case ActivityType.BUY:
          return this.parseBuyEvent(activity, event);
        case ActivityType.SELL:
          return this.parseSellEvent(activity, event);
        case ActivityType.CREATE_IP_COIN:
          return this.parseCreateIPCoinEvent(activity, event);
        case ActivityType.POOL_LIQUIDITY:
          return this.parsePoolLiquidityEvent(activity, event);
        case ActivityType.DAO_VOTE:
          return this.parseDAOVoteEvent(activity, event);
        default:
          return activity;
      }
    } catch (error) {
      console.error('Error parsing event to activity:', error);
      return null;
    }
  }

  /**
   * Parse mint event
   */
  private parseMintEvent(activity: ActivityEvent, event: any): ActivityEvent {
    try {
      // Typical mint event: [to_address, token_id, ...]
      if (event.data && event.data.length >= 2) {
        const tokenId = num.toHex(event.data[1]);
        activity.assetId = tokenId;
        activity.assetName = `IP Asset #${tokenId}`;
        activity.metadata = {
          tokenId,
          contractAddress: event.from_address
        };
      }
      return activity;
    } catch (error) {
      console.warn('Error parsing mint event:', error);
      return activity;
    }
  }

  /**
   * Parse create offer event
   */
  private parseCreateOfferEvent(activity: ActivityEvent, event: any): ActivityEvent {
    try {
      // Typical offer event: [offerer, asset_id, price, ...]
      if (event.data && event.data.length >= 3) {
        activity.assetId = num.toHex(event.data[1]);
        activity.price = num.toHex(event.data[2]);
        activity.currency = 'ETH';
        activity.metadata = {
          offerer: num.toHex(event.data[0]),
          assetId: activity.assetId
        };
      }
      return activity;
    } catch (error) {
      console.warn('Error parsing create offer event:', error);
      return activity;
    }
  }

  /**
   * Parse buy event
   */
  private parseBuyEvent(activity: ActivityEvent, event: any): ActivityEvent {
    try {
      // Typical buy event: [buyer, seller, asset_id, price, ...]
      if (event.data && event.data.length >= 4) {
        activity.assetId = num.toHex(event.data[2]);
        activity.price = num.toHex(event.data[3]);
        activity.currency = 'ETH';
        activity.metadata = {
          buyer: num.toHex(event.data[0]),
          seller: num.toHex(event.data[1]),
          assetId: activity.assetId
        };
      }
      return activity;
    } catch (error) {
      console.warn('Error parsing buy event:', error);
      return activity;
    }
  }

  /**
   * Parse sell event
   */
  private parseSellEvent(activity: ActivityEvent, event: any): ActivityEvent {
    try {
      // Similar to buy event but from seller perspective
      if (event.data && event.data.length >= 4) {
        activity.assetId = num.toHex(event.data[2]);
        activity.price = num.toHex(event.data[3]);
        activity.currency = 'ETH';
        activity.metadata = {
          seller: num.toHex(event.data[0]),
          buyer: num.toHex(event.data[1]),
          assetId: activity.assetId
        };
      }
      return activity;
    } catch (error) {
      console.warn('Error parsing sell event:', error);
      return activity;
    }
  }

  /**
   * Parse create IP coin event
   */
  private parseCreateIPCoinEvent(activity: ActivityEvent, event: any): ActivityEvent {
    try {
      if (event.data && event.data.length >= 2) {
        activity.assetId = num.toHex(event.data[0]);
        activity.assetName = `IP Coin for Asset #${activity.assetId}`;
        activity.metadata = {
          ipAssetId: activity.assetId,
          coinAddress: num.toHex(event.data[1])
        };
      }
      return activity;
    } catch (error) {
      console.warn('Error parsing create IP coin event:', error);
      return activity;
    }
  }

  /**
   * Parse pool liquidity event
   */
  private parsePoolLiquidityEvent(activity: ActivityEvent, event: any): ActivityEvent {
    try {
      if (event.data && event.data.length >= 3) {
        activity.amount = num.toHex(event.data[1]);
        activity.price = num.toHex(event.data[2]);
        activity.currency = 'ETH';
        activity.metadata = {
          poolAddress: event.from_address,
          liquidityProvider: num.toHex(event.data[0])
        };
      }
      return activity;
    } catch (error) {
      console.warn('Error parsing pool liquidity event:', error);
      return activity;
    }
  }

  /**
   * Parse DAO vote event
   */
  private parseDAOVoteEvent(activity: ActivityEvent, event: any): ActivityEvent {
    try {
      if (event.data && event.data.length >= 3) {
        activity.proposalId = num.toHex(event.data[0]);
        const voteValue = num.toBigInt(event.data[2]);
        activity.voteChoice = voteValue === 1n ? 'for' : voteValue === 2n ? 'against' : 'abstain';
        activity.metadata = {
          proposalId: activity.proposalId,
          voter: num.toHex(event.data[1]),
          voteChoice: activity.voteChoice
        };
      }
      return activity;
    } catch (error) {
      console.warn('Error parsing DAO vote event:', error);
      return activity;
    }
  }

  /**
   * Check if activity matches date filter
   */
  private matchesDateFilter(activity: ActivityEvent, filter: ActivityFilter): boolean {
    if (!filter.dateRange) return true;
    
    const activityDate = new Date(activity.timestamp);
    return activityDate >= filter.dateRange.start && activityDate <= filter.dateRange.end;
  }

  /**
   * Sort activities based on filter
   */
  private sortActivities(activities: ActivityEvent[], filter: ActivityFilter): ActivityEvent[] {
    return activities.sort((a, b) => {
      let comparison = 0;
      
      switch (filter.sortBy) {
        case 'timestamp':
          comparison = a.timestamp - b.timestamp;
          break;
        case 'amount':
          const amountA = parseFloat(a.amount || '0');
          const amountB = parseFloat(b.amount || '0');
          comparison = amountA - amountB;
          break;
        case 'activityType':
          comparison = a.activityType.localeCompare(b.activityType);
          break;
        default:
          comparison = a.timestamp - b.timestamp;
      }
      
      return filter.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  /**
   * Get Starknet explorer URL for transaction
   */
  getExplorerUrl(txHash: string): string {
    return `${STARKNET_EXPLORER_URL}/tx/${txHash}`;
  }

  /**
   * Get asset metadata (placeholder - implement based on your metadata service)
   */
  async getAssetMetadata(assetId: string): Promise<any> {
    try {
      // This would typically call your metadata service or IPFS
      // For now, return a placeholder
      return {
        name: `Asset #${assetId}`,
        image: '/placeholder.svg',
        description: `Blockchain asset with ID ${assetId}`
      };
    } catch (error) {
      console.error('Error fetching asset metadata:', error);
      return null;
    }
  }

  /**
   * Add contract for specific interactions
   */
  addContract(address: string, abi: any): void {
    try {
      const contract = new Contract(abi, address, this.provider);
      this.contracts.set(address, contract);
    } catch (error) {
      console.error('Error adding contract:', error);
    }
  }

  /**
   * Get contract by address
   */
  getContract(address: string): Contract | undefined {
    return this.contracts.get(address);
  }
}