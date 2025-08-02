import { Contract, RpcProvider, num, hash } from 'starknet';
import { 
  ActivityEvent, 
  ActivityFilter, 
  ActivityType, 
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
   * Get proper Starknet event selector for activity type
   */
  private getEventSelector(activityType: ActivityType): string {
    // These should be actual Starknet event selectors (use starknet_keccak)
    const eventSelectors: Record<ActivityType, string> = {
      [ActivityType.MINT]: hash.getSelectorFromName("Transfer"), // Common NFT transfer event
      [ActivityType.CREATE_OFFER]: hash.getSelectorFromName("OfferCreated"),
      [ActivityType.BUY]: hash.getSelectorFromName("Purchase"),
      [ActivityType.SELL]: hash.getSelectorFromName("Sale"),
      [ActivityType.CREATE_IP_COIN]: hash.getSelectorFromName("IPCoinCreated"),
      [ActivityType.POOL_LIQUIDITY]: hash.getSelectorFromName("LiquidityAdded"),
      [ActivityType.DAO_VOTE]: hash.getSelectorFromName("VoteCast"),
    };

    return eventSelectors[activityType];
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
      const eventSelector = this.getEventSelector(activityType);
      if (!eventSelector) {
        console.warn(`No event selector found for activity type: ${activityType}`);
        return [];
      }

      // Get recent blocks to search (last 1000 blocks as example)
      const latestBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 1000);

      // Fetch events from Starknet with proper event filter
      const eventFilter = {
        from_block: { block_number: fromBlock },
        to_block: { block_number: latestBlock },
        address: undefined, // Filter by all contracts
        keys: [
          [eventSelector] // First key is the event selector
        ],
        chunk_size: limit
      };

      const events = await this.provider.getEvents(eventFilter);
      
      // Process and filter events
      const activities: ActivityEvent[] = [];
      
      for (const event of events.events) {
        try {
          const activity = await this.parseEventToActivity(event, activityType, walletAddress);
          if (activity && this.matchesDateFilter(activity, filter) && this.isUserRelated(activity, walletAddress)) {
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
   * Check if activity is related to the user
   */
  private isUserRelated(activity: ActivityEvent, userAddress: string): boolean {
    const normalizedUserAddress = userAddress.toLowerCase();
    
    // Check if user is involved in the activity
    if (activity.userAddress?.toLowerCase() === normalizedUserAddress) {
      return true;
    }

    // Check metadata for user involvement
    if (activity.metadata) {
      const metadataValues = Object.values(activity.metadata);
      return metadataValues.some(value => 
        typeof value === 'string' && value.toLowerCase() === normalizedUserAddress
      );
    }

    return false;
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
   * Parse mint event (Transfer with from_address = 0)
   */
  private parseMintEvent(activity: ActivityEvent, event: any): ActivityEvent {
    try {
      // Transfer event structure: keys=[selector, from, to], data=[token_id_low, token_id_high]
      if (event.keys && event.keys.length >= 3) {
        const from = event.keys[1];
        const to = event.keys[2];
        
        // Check if it's a mint (from address is 0)
        if (from === '0x0' || from === '0') {
          activity.userAddress = to;
          
          if (event.data && event.data.length >= 1) {
            // Handle U256 token ID (low, high parts)
            const tokenIdLow = event.data[0];
            const tokenIdHigh = event.data.length > 1 ? event.data[1] : '0x0';
            
            activity.assetId = tokenIdLow; // Use low part for simplicity
            activity.assetName = `NFT #${num.toHex(tokenIdLow)}`;
            activity.metadata = {
              tokenId: tokenIdLow,
              tokenIdHigh: tokenIdHigh,
              contractAddress: event.from_address,
              recipient: to
            };
          }
        }
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
      // Custom event structure depends on your contract implementation
      if (event.data && event.data.length >= 3) {
        const offerer = event.data[0];
        const assetId = event.data[1];
        const priceLow = event.data[2];
        const priceHigh = event.data.length > 3 ? event.data[3] : '0x0';
        
        activity.userAddress = offerer;
        activity.assetId = num.toHex(assetId);
        activity.price = num.toHex(priceLow); // Use low part
        activity.currency = 'ETH';
        activity.metadata = {
          offerer,
          assetId: activity.assetId,
          priceLow,
          priceHigh
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
      if (event.data && event.data.length >= 4) {
        const buyer = event.data[0];
        const seller = event.data[1];
        const assetId = event.data[2];
        const priceLow = event.data[3];
        const priceHigh = event.data.length > 4 ? event.data[4] : '0x0';
        
        activity.userAddress = buyer;
        activity.assetId = num.toHex(assetId);
        activity.price = num.toHex(priceLow);
        activity.currency = 'ETH';
        activity.metadata = {
          buyer,
          seller,
          assetId: activity.assetId,
          priceLow,
          priceHigh
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
      if (event.data && event.data.length >= 4) {
        const seller = event.data[0];
        const buyer = event.data[1];
        const assetId = event.data[2];
        const priceLow = event.data[3];
        const priceHigh = event.data.length > 4 ? event.data[4] : '0x0';
        
        activity.userAddress = seller;
        activity.assetId = num.toHex(assetId);
        activity.price = num.toHex(priceLow);
        activity.currency = 'ETH';
        activity.metadata = {
          seller,
          buyer,
          assetId: activity.assetId,
          priceLow,
          priceHigh
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
        const creator = event.data[0];
        const ipAssetId = event.data[1];
        const coinAddress = event.data.length > 2 ? event.data[2] : event.from_address;
        
        activity.userAddress = creator;
        activity.assetId = num.toHex(ipAssetId);
        activity.assetName = `IP Coin for Asset #${activity.assetId}`;
        activity.metadata = {
          creator,
          ipAssetId: activity.assetId,
          coinAddress
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
        const provider = event.data[0];
        const amountLow = event.data[1];
        const amountHigh = event.data.length > 2 ? event.data[2] : '0x0';
        
        activity.userAddress = provider;
        activity.amount = num.toHex(amountLow);
        activity.currency = 'ETH';
        activity.metadata = {
          poolAddress: event.from_address,
          liquidityProvider: provider,
          amountLow,
          amountHigh
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
        const voter = event.data[0];
        const proposalId = event.data[1];
        const voteValue = num.toBigInt(event.data[2]);
        
        activity.userAddress = voter;
        activity.proposalId = num.toHex(proposalId);
        activity.voteChoice = voteValue === 1n ? 'for' : voteValue === 2n ? 'against' : 'abstain';
        activity.metadata = {
          proposalId: activity.proposalId,
          voter,
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
   * Get asset metadata
   */
  async getAssetMetadata(assetId: string): Promise<any> {
    try {
      // This would typically call your metadata service or IPFS
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

  /**
   * Alternative method: Fetch events by contract address
   */
  async fetchEventsByContract(
    contractAddress: string,
    eventName: string,
    walletAddress: string,
    limit: number = 20
  ): Promise<ActivityEvent[]> {
    try {
      const eventSelector = hash.getSelectorFromName(eventName);
      const latestBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 1000);

      const eventFilter = {
        from_block: { block_number: fromBlock },
        to_block: { block_number: latestBlock },
        address: contractAddress, // Specific contract
        keys: [[eventSelector]],
        chunk_size: limit
      };

      const events = await this.provider.getEvents(eventFilter);
      const activities: ActivityEvent[] = [];

      for (const event of events.events) {
        
        const activity = await this.parseGenericEvent(event, eventName, walletAddress);
        if (activity) {
          activities.push(activity);
        }
      }

      return activities;
    } catch (error) {
      console.error('Error fetching events by contract:', error);
      return [];
    }
  }

  /**
   * Generic event parser
   */
  private async parseGenericEvent(
    event: any,
    eventName: string,
    userAddress: string
  ): Promise<ActivityEvent | null> {
    try {
      const activity: ActivityEvent = {
        id: `${event.transaction_hash}_${event.event_index || 0}`,
        txHash: event.transaction_hash,
        blockNumber: event.block_number,
        timestamp: Date.now(),
        activityType: ActivityType.MINT, // Default, should be determined by eventName
        userAddress,
        metadata: {
          eventName,
          contractAddress: event.from_address,
          keys: event.keys,
          data: event.data
        }
      };

      // Get timestamp from block
      try {
        const block = await this.provider.getBlockWithTxHashes(event.block_number);
        activity.timestamp = block.timestamp * 1000;
      } catch (error) {
        console.warn('Could not fetch block timestamp:', error);
      }

      return activity;
    } catch (error) {
      console.error('Error parsing generic event:', error);
      return null;
    }
  }
}