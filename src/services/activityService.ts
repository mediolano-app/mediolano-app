import { Provider, num } from 'starknet';
import { 
  ActivityEvent, 
  ActivityType, 
  ActivityFilter,
  STARKNET_EVENT_SIGNATURES,
  STARKNET_EXPLORER_URL 
} from '@/types/activity';

export class ActivityFeedService {
  private provider: Provider;
  private contractAddresses: Map<ActivityType, string>;

  constructor() {
  
    this.provider = new Provider({ 
      nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_6'
    });

    // Map activity types to their respective contract addresses
    this.contractAddresses = new Map([
      [ActivityType.MINT, '0x...'], // Replace with actual Mediolano mint contract
      [ActivityType.CREATE_OFFER, '0x...'], // Replace with marketplace contract
      [ActivityType.BUY, '0x...'], // Replace with marketplace contract
      [ActivityType.SELL, '0x...'], // Replace with marketplace contract
      [ActivityType.CREATE_IP_COIN, '0x...'], // Replace with IP coin factory
      [ActivityType.POOL_LIQUIDITY, '0x...'], // Replace with liquidity pool contract
      [ActivityType.DAO_VOTE, '0x...'] // Replace with DAO contract
    ]);
  }

  async fetchUserActivity(
    walletAddress: string,
    filter: ActivityFilter,
    page: number = 1,
    limit: number = 20
  ): Promise<{ activities: ActivityEvent[]; hasMore: boolean; total: number }> {
    try {
      const allActivities: ActivityEvent[] = [];
      
      // Fetch events for each activity type
      for (const activityType of filter.activityTypes) {
        const contractAddress = this.contractAddresses.get(activityType);
        if (!contractAddress) continue;

        const events = await this.fetchEventsForActivityType(
          contractAddress,
          activityType,
          walletAddress,
          filter
        );
        
        allActivities.push(...events);
      }

      // Sort activities
      const sortedActivities = this.sortActivities(allActivities, filter);
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedActivities = sortedActivities.slice(startIndex, endIndex);
      
      return {
        activities: paginatedActivities,
        hasMore: endIndex < sortedActivities.length,
        total: sortedActivities.length
      };
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw new Error('Failed to fetch activity data');
    }
  }

  private async fetchEventsForActivityType(
    contractAddress: string,
    activityType: ActivityType,
    userAddress: string,
    filter: ActivityFilter
  ): Promise<ActivityEvent[]> {
    try {
      const eventSignature = STARKNET_EVENT_SIGNATURES[activityType];
      
      // Fetch events from the contract
      const events = await this.provider.getEvents({
        address: contractAddress,
        keys: [[eventSignature]],
        from_block: { block_number: 0 },
        to_block: 'latest',
        chunk_size: 100
      });

      const activities: ActivityEvent[] = [];

      for (const event of events.events) {
        // Filter events by user address
        if (!this.isUserEvent(event, userAddress)) continue;
        
        // Parse event into ActivityEvent
        const activity = await this.parseEvent(event, activityType);
        if (activity && this.matchesDateFilter(activity, filter)) {
          activities.push(activity);
        }
      }

      return activities;
    } catch (error) {
      console.error(`Error fetching ${activityType} events:`, error);
      return [];
    }
  }

  private isUserEvent(event: any, userAddress: string): boolean {
    // Check if the event involves the user (as sender, receiver, or participant)
    const normalizedUserAddress = num.toHex(userAddress);
    
    return event.data.some((data: string) => {
      const normalizedData = num.toHex(data);
      return normalizedData === normalizedUserAddress;
    });
  }

  private async parseEvent(event: any, activityType: ActivityType): Promise<ActivityEvent | null> {
    try {
      const block = await this.provider.getBlock(event.block_number);
      const timestamp = block.timestamp * 1000; // Convert to milliseconds

      const baseActivity: Partial<ActivityEvent> = {
        id: `${event.transaction_hash}_${event.event_index}`,
        txHash: event.transaction_hash,
        blockNumber: event.block_number,
        timestamp,
        activityType,
        userAddress: num.toHex(event.data[0]) // Assuming first data field is user address
      };

      // Parse activity-specific data
      switch (activityType) {
        case ActivityType.MINT:
          return this.parseMintEvent(event, baseActivity);
        case ActivityType.CREATE_OFFER:
          return this.parseCreateOfferEvent(event, baseActivity);
        case ActivityType.BUY:
        case ActivityType.SELL:
          return this.parseTradeEvent(event, baseActivity);
        case ActivityType.CREATE_IP_COIN:
          return this.parseCreateIPCoinEvent(event, baseActivity);
        case ActivityType.POOL_LIQUIDITY:
          return this.parsePoolLiquidityEvent(event, baseActivity);
        case ActivityType.DAO_VOTE:
          return this.parseDAOVoteEvent(event, baseActivity);
        default:
          return null;
      }
    } catch (error) {
      console.error('Error parsing event:', error);
      return null;
    }
  }

  private parseMintEvent(event: any, base: Partial<ActivityEvent>): ActivityEvent {
    return {
      ...base,
      assetId: num.toHex(event.data[1]),
      assetName: this.decodeString(event.data[2]),
      metadata: {
        ipType: this.decodeString(event.data[3]),
        royalty: num.toBigInt(event.data[4]).toString()
      }
    } as ActivityEvent;
  }

  private parseCreateOfferEvent(event: any, base: Partial<ActivityEvent>): ActivityEvent {
    return {
      ...base,
      assetId: num.toHex(event.data[1]),
      price: num.toBigInt(event.data[2]).toString(),
      currency: 'ETH',
      metadata: {
        offerId: num.toHex(event.data[3]),
        duration: num.toBigInt(event.data[4]).toString()
      }
    } as ActivityEvent;
  }

  private parseTradeEvent(event: any, base: Partial<ActivityEvent>): ActivityEvent {
    return {
      ...base,
      assetId: num.toHex(event.data[1]),
      amount: '1', // NFTs are typically quantity 1
      price: num.toBigInt(event.data[2]).toString(),
      currency: 'ETH',
      metadata: {
        buyer: num.toHex(event.data[3]),
        seller: num.toHex(event.data[4])
      }
    } as ActivityEvent;
  }

  private parseCreateIPCoinEvent(event: any, base: Partial<ActivityEvent>): ActivityEvent {
    return {
      ...base,
      assetId: num.toHex(event.data[1]),
      assetName: this.decodeString(event.data[2]),
      amount: num.toBigInt(event.data[3]).toString(),
      metadata: {
        symbol: this.decodeString(event.data[4]),
        totalSupply: num.toBigInt(event.data[5]).toString()
      }
    } as ActivityEvent;
  }

  private parsePoolLiquidityEvent(event: any, base: Partial<ActivityEvent>): ActivityEvent {
    return {
      ...base,
      assetId: num.toHex(event.data[1]),
      amount: num.toBigInt(event.data[2]).toString(),
      price: num.toBigInt(event.data[3]).toString(),
      currency: 'ETH',
      metadata: {
        poolAddress: num.toHex(event.data[4]),
        liquidityType: event.data[5] === '1' ? 'add' : 'remove'
      }
    } as ActivityEvent;
  }

  private parseDAOVoteEvent(event: any, base: Partial<ActivityEvent>): ActivityEvent {
    const voteChoices = ['against', 'for', 'abstain'];
    const voteChoice = voteChoices[Number(event.data[2])] as 'for' | 'against' | 'abstain';
    
    return {
      ...base,
      proposalId: num.toHex(event.data[1]),
      voteChoice,
      amount: num.toBigInt(event.data[3]).toString(), // Voting power
      metadata: {
        proposalTitle: this.decodeString(event.data[4])
      }
    } as ActivityEvent;
  }

  private decodeString(data: string): string {
    try {
      // Decode Cairo string (simplified implementation)
      return Buffer.from(data.slice(2), 'hex').toString('utf8').replace(/\0/g, '');
    } catch {
      return 'Unknown';
    }
  }

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
      }
      
      return filter.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  private matchesDateFilter(activity: ActivityEvent, filter: ActivityFilter): boolean {
    if (!filter.dateRange) return true;
    
    const activityDate = new Date(activity.timestamp);
    return activityDate >= filter.dateRange.start && activityDate <= filter.dateRange.end;
  }

  getExplorerUrl(txHash: string): string {
    return `${STARKNET_EXPLORER_URL}/tx/${txHash}`;
  }

  async getAssetMetadata(assetId: string): Promise<{ name: string; image?: string } | null> {
    try {
      // This would typically call a metadata service or IPFS
      // For now, return a placeholder implementation
      return {
        name: `Asset #${assetId.slice(-6)}`,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=${assetId}`
      };
    } catch (error) {
      console.error('Error fetching asset metadata:', error);
      return null;
    }
  }
}