import { Contract, RpcProvider, num, hash, CallData } from 'starknet';
import { 
  ActivityEvent, 
  ActivityFilter, 
  ActivityType, 
  STARKNET_EXPLORER_URL,
  CONTRACT_ADDRESSES 
} from '@/types/activity';

export interface ActivityFetchResult {
  activities: ActivityEvent[];
  total: number;
  hasMore: boolean;
  cached?: boolean;
  lastUpdated?: number;
}

export interface ActivityServiceConfig {
  providerUrl?: string;
  maxRetries?: number;
  retryDelay?: number;
  requestTimeout?: number;
  cacheEnabled?: boolean;
  cacheTtlMs?: number;
  maxBlockLookback?: number;
  chunkSize?: number;
  rateLimitPerSecond?: number;
  enableMetrics?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export interface ServiceMetrics {
  requestCount: number;
  errorCount: number;
  cacheHitCount: number;
  cacheMissCount: number;
  avgResponseTimeMs: number;
  lastErrorTimestamp?: number;
  lastErrorMessage?: string;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  lastCheck: number;
  rpcConnected: boolean;
  errorRate: number;
  responseTimeMs: number;
}

// Circuit breaker states
enum CircuitState {
  CLOSED = 'closed',
  OPEN = 'open', 
  HALF_OPEN = 'half-open'
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeoutMs: number;
  monitoringWindowMs: number;
}

class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private nextAttempt = 0;

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN - operation rejected');
      }
      this.state = CircuitState.HALF_OPEN;
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.config.recoveryTimeoutMs;
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}

class RateLimiter {
  private requests: number[] = [];
  
  constructor(private maxRequests: number, private windowMs: number = 1000) {}

  async waitForSlot(): Promise<void> {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest) + 10; // +10ms buffer
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.waitForSlot(); // Recursive call after waiting
      }
    }
    
    this.requests.push(now);
  }
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    const now = Date.now();
    
    // Evict expired entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictExpired();
      
      // If still full, evict oldest entries
      if (this.cache.size >= this.maxSize) {
        const entries = Array.from(this.cache.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        
        for (let i = 0; i < Math.floor(this.maxSize * 0.1); i++) {
          this.cache.delete(entries[i][0]);
        }
      }
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttlMs
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private evictExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  size(): number {
    return this.cache.size;
  }
}

export class ActivityFeedService {
  private provider: RpcProvider;
  private contracts: Map<string, Contract> = new Map();
  private cache: MemoryCache;
  private rateLimiter: RateLimiter;
  private circuitBreaker: CircuitBreaker;
  private metrics: ServiceMetrics;
  private config: Required<ActivityServiceConfig>;
  private startTime: number;
  private isShuttingDown = false;

  constructor(config: ActivityServiceConfig = {}) {
    this.startTime = Date.now();
    
    // Set default configuration
    this.config = {
      providerUrl: config.providerUrl || process.env.NEXT_PUBLIC_STARKNET_RPC_URL || 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7',
      maxRetries: config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
      requestTimeout: config.requestTimeout ?? 30000,
      cacheEnabled: config.cacheEnabled ?? true,
      cacheTtlMs: config.cacheTtlMs ?? 300000, // 5 minutes
      maxBlockLookback: config.maxBlockLookback ?? 50000,
      chunkSize: config.chunkSize ?? 100,
      rateLimitPerSecond: config.rateLimitPerSecond ?? 10,
      enableMetrics: config.enableMetrics ?? true,
      logLevel: config.logLevel ?? 'info'
    };

    this.provider = new RpcProvider({
      nodeUrl: this.config.providerUrl
    });

    this.cache = new MemoryCache();
    this.rateLimiter = new RateLimiter(this.config.rateLimitPerSecond);
    
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,
      recoveryTimeoutMs: 30000,
      monitoringWindowMs: 60000
    });

    this.metrics = {
      requestCount: 0,
      errorCount: 0,
      cacheHitCount: 0,
      cacheMissCount: 0,
      avgResponseTimeMs: 0
    };

    this.log('info', 'ActivityFeedService initialized', { config: this.config });
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    this.cache.clear();
    this.log('info', 'ActivityFeedService shutdown completed');
  }

  // Health check endpoint
  async getHealthStatus(): Promise<HealthStatus> {
    const now = Date.now();
    const uptime = now - this.startTime;
    
    try {
      // Test RPC connection
      const startTime = Date.now();
      await Promise.race([
        this.provider.getBlockNumber(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);
      const responseTime = Date.now() - startTime;
      
      const errorRate = this.metrics.requestCount > 0 
        ? this.metrics.errorCount / this.metrics.requestCount 
        : 0;

      let status: HealthStatus['status'] = 'healthy';
      if (errorRate > 0.1 || responseTime > 2000) status = 'degraded';
      if (errorRate > 0.5 || responseTime > 5000) status = 'unhealthy';

      return {
        status,
        uptime,
        lastCheck: now,
        rpcConnected: true,
        errorRate,
        responseTimeMs: responseTime
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        uptime,
        lastCheck: now,
        rpcConnected: false,
        errorRate: 1,
        responseTimeMs: -1
      };
    }
  }

  // Get service metrics
  getMetrics(): ServiceMetrics {
    return { ...this.metrics };
  }

  // Main method with production features
  async fetchUserActivity(
    walletAddress: string,
    filter: ActivityFilter,
    page: number = 1,
    limit: number = 20
  ): Promise<ActivityFetchResult> {
    const startTime = Date.now();
    this.metrics.requestCount++;

    try {
      // Validate inputs
      this.validateInputs(walletAddress, filter, page, limit);
      
      if (this.isShuttingDown) {
        throw new Error('Service is shutting down');
      }

      // Rate limiting
      await this.rateLimiter.waitForSlot();

      // Check cache first
      const cacheKey = this.generateCacheKey(walletAddress, filter, page, limit);
      
      if (this.config.cacheEnabled) {
        const cached = this.cache.get<ActivityFetchResult>(cacheKey);
        if (cached) {
          this.metrics.cacheHitCount++;
          this.log('debug', 'Cache hit', { cacheKey });
          return { ...cached, cached: true };
        }
        this.metrics.cacheMissCount++;
      }

      // Execute with circuit breaker
      const result = await this.circuitBreaker.execute(async () => {
        return await this.fetchActivitiesInternal(walletAddress, filter, page, limit);
      });

      // Cache the result
      if (this.config.cacheEnabled && result.activities.length > 0) {
        this.cache.set(cacheKey, result, this.config.cacheTtlMs);
      }

      // Update metrics
      const responseTime = Date.now() - startTime;
      this.updateResponseTimeMetrics(responseTime);

      this.log('info', 'Activity fetch completed', {
        walletAddress: this.maskAddress(walletAddress),
        activitiesCount: result.activities.length,
        responseTimeMs: responseTime
      });

      return { ...result, lastUpdated: Date.now() };

    } catch (error) {
      this.metrics.errorCount++;
      this.metrics.lastErrorTimestamp = Date.now();
      this.metrics.lastErrorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      const responseTime = Date.now() - startTime;
      this.updateResponseTimeMetrics(responseTime);
      
      this.log('error', 'Activity fetch failed', {
        walletAddress: this.maskAddress(walletAddress),
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTimeMs: responseTime
      });

      
      if (this.config.cacheEnabled) {
        const cacheKey = this.generateCacheKey(walletAddress, filter, page, limit);
        const staleData = this.cache.get<ActivityFetchResult>(cacheKey + '_stale');
        if (staleData) {
          this.log('warn', 'Returning stale cache data due to error');
          return { ...staleData, cached: true };
        }
      }

      throw new Error(`Failed to fetch activities: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Internal fetch method with retries
  private async fetchActivitiesInternal(
    walletAddress: string,
    filter: ActivityFilter,
    page: number,
    limit: number
  ): Promise<ActivityFetchResult> {
    return await this.withRetry(async () => {
      const activities: ActivityEvent[] = [];
      
      // Get the latest block number with timeout
      const latestBlock = await Promise.race([
        this.provider.getBlockNumber(),
        this.createTimeoutPromise('Failed to get latest block number')
      ]);
      
      const fromBlock = Math.max(0, latestBlock - this.config.maxBlockLookback);
      
      this.log('debug', 'Fetching activities', {
        fromBlock,
        toBlock: latestBlock,
        walletAddress: this.maskAddress(walletAddress)
      });

      // Fetch activities for each type with controlled concurrency
      const activityPromises = filter.activityTypes.map(activityType =>
        this.fetchActivitiesByTypeWithRetry(walletAddress, activityType, fromBlock, latestBlock)
      );

      const activityArrays = await Promise.allSettled(activityPromises);
      
      // Process results and log any failures
      activityArrays.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          activities.push(...result.value);
        } else {
          this.log('warn', 'Failed to fetch activity type', {
            activityType: filter.activityTypes[index],
            error: result.reason?.message
          });
        }
      });

      // Sort activities
      const sortedActivities = this.sortActivities(activities, filter);
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedActivities = sortedActivities.slice(startIndex, endIndex);
      
      this.log('debug', 'Activity processing completed', {
        totalFound: activities.length,
        totalSorted: sortedActivities.length,
        returned: paginatedActivities.length,
        page
      });
      
      return {
        activities: paginatedActivities,
        total: sortedActivities.length,
        hasMore: endIndex < sortedActivities.length
      };
    });
  }

  // Enhanced validation
  private validateInputs(walletAddress: string, filter: ActivityFilter, page: number, limit: number): void {
    if (!walletAddress || typeof walletAddress !== 'string') {
      throw new Error('Invalid wallet address');
    }

    // Basic hex address validation
    if (!/^0x[0-9a-fA-F]+$/.test(walletAddress)) {
      throw new Error('Invalid wallet address format');
    }

    if (!filter || !Array.isArray(filter.activityTypes) || filter.activityTypes.length === 0) {
      throw new Error('Invalid activity filter');
    }

    if (!Number.isInteger(page) || page < 1 || page > 1000) {
      throw new Error('Invalid page number (must be 1-1000)');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error('Invalid limit (must be 1-100)');
    }

    // Validate activity types
    const validTypes = Object.values(ActivityType);
    const invalidTypes = filter.activityTypes.filter(type => !validTypes.includes(type));
    if (invalidTypes.length > 0) {
      throw new Error(`Invalid activity types: ${invalidTypes.join(', ')}`);
    }
  }

  // Retry wrapper
  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt === this.config.maxRetries) {
          break;
        }

        const delay = this.config.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        this.log('warn', `Attempt ${attempt} failed, retrying in ${delay}ms`, {
          error: lastError.message
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  // Fetch activities by type with retry
  private async fetchActivitiesByTypeWithRetry(
    walletAddress: string,
    activityType: ActivityType,
    fromBlock: number,
    toBlock: number
  ): Promise<ActivityEvent[]> {
    return await this.withRetry(async () => {
      return await this.fetchActivitiesByType(walletAddress, activityType, fromBlock, toBlock);
    });
  }

 
  private async fetchActivitiesByType(
    walletAddress: string,
    activityType: ActivityType,
    fromBlock: number,
    toBlock: number
  ): Promise<ActivityEvent[]> {
    const activities: ActivityEvent[] = [];

    try {
      switch (activityType) {
        case ActivityType.MINT:
          const mintActivities = await this.fetchMintActivities(walletAddress, fromBlock, toBlock);
          activities.push(...mintActivities);
          break;
          
        case ActivityType.CREATE_OFFER:
          const offerActivities = await this.fetchOfferActivities(walletAddress, fromBlock, toBlock);
          activities.push(...offerActivities);
          break;
          
        case ActivityType.BUY:
        case ActivityType.SELL:
          const tradeActivities = await this.fetchTradeActivities(walletAddress, activityType, fromBlock, toBlock);
          activities.push(...tradeActivities);
          break;
          
        case ActivityType.CREATE_IP_COIN:
          const coinActivities = await this.fetchIPCoinActivities(walletAddress, fromBlock, toBlock);
          activities.push(...coinActivities);
          break;
          
        case ActivityType.POOL_LIQUIDITY:
          const liquidityActivities = await this.fetchLiquidityActivities(walletAddress, fromBlock, toBlock);
          activities.push(...liquidityActivities);
          break;
          
        case ActivityType.DAO_VOTE:
          const voteActivities = await this.fetchVoteActivities(walletAddress, fromBlock, toBlock);
          activities.push(...voteActivities);
          break;
          
        default:
          this.log('warn', 'Unknown activity type', { activityType });
      }
    } catch (error) {
      this.log('error', `Error fetching ${activityType} activities`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }

    return activities;
  }

  
  private async fetchMintActivities(
    walletAddress: string,
    fromBlock: number,
    toBlock: number
  ): Promise<ActivityEvent[]> {
    try {
      const transferSelector = hash.getSelectorFromName("Transfer");
      
      const eventFilter = {
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        address: CONTRACT_ADDRESSES.MIP,
        keys: [
          [transferSelector],
          ['0x0'], // from address (mint = from zero)
          [walletAddress] // to address (user receiving the mint)
        ],
        chunk_size: this.config.chunkSize
      };

      const response = await Promise.race([
        this.provider.getEvents(eventFilter),
        this.createTimeoutPromise('Mint activities fetch timeout')
      ]);

      const activities: ActivityEvent[] = [];

      for (const event of response.events || []) {
        try {
          const activity = await this.parseMintEvent(event, walletAddress);
          if (activity && this.validateActivity(activity)) {
            activities.push(activity);
          }
        } catch (error) {
          this.log('warn', 'Error parsing mint event', {
            eventHash: event.transaction_hash,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return activities;
    } catch (error) {
      this.log('error', 'Error fetching mint activities', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }


  private async fetchOfferActivities(
    walletAddress: string,
    fromBlock: number,
    toBlock: number
  ): Promise<ActivityEvent[]> {
    try {
      const offerCreatedSelector = hash.getSelectorFromName("OfferCreated");
      
      const eventFilter = {
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        address: CONTRACT_ADDRESSES.AGREEMENT_FACTORY,
        keys: [
          [offerCreatedSelector],
          [walletAddress] // offerer address
        ],
        chunk_size: this.config.chunkSize
      };

      const response = await Promise.race([
        this.provider.getEvents(eventFilter),
        this.createTimeoutPromise('Offer activities fetch timeout')
      ]);

      const activities: ActivityEvent[] = [];

      for (const event of response.events || []) {
        try {
          const activity = await this.parseOfferEvent(event, walletAddress);
          if (activity && this.validateActivity(activity)) {
            activities.push(activity);
          }
        } catch (error) {
          this.log('warn', 'Error parsing offer event', {
            eventHash: event.transaction_hash,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return activities;
    } catch (error) {
      this.log('error', 'Error fetching offer activities', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

 
  private async fetchTradeActivities(
    walletAddress: string,
    activityType: ActivityType.BUY | ActivityType.SELL,
    fromBlock: number,
    toBlock: number
  ): Promise<ActivityEvent[]> {
    try {
      const eventName = activityType === ActivityType.BUY ? "Purchase" : "Sale";
      const eventSelector = hash.getSelectorFromName(eventName);
      
      const eventFilter = {
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        address: CONTRACT_ADDRESSES.AGREEMENT_FACTORY,
        keys: [
          [eventSelector]
        ],
        chunk_size: this.config.chunkSize
      };

      const response = await Promise.race([
        this.provider.getEvents(eventFilter),
        this.createTimeoutPromise('Trade activities fetch timeout')
      ]);

      const activities: ActivityEvent[] = [];

      for (const event of response.events || []) {
        try {
          const activity = await this.parseTradeEvent(event, walletAddress, activityType);
          if (activity && this.validateActivity(activity)) {
            activities.push(activity);
          }
        } catch (error) {
          this.log('warn', 'Error parsing trade event', {
            eventHash: event.transaction_hash,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return activities;
    } catch (error) {
      this.log('error', 'Error fetching trade activities', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  
  private async fetchIPCoinActivities(
    walletAddress: string,
    fromBlock: number,
    toBlock: number
  ): Promise<ActivityEvent[]> {
    try {
      const coinCreatedSelector = hash.getSelectorFromName("IPCoinCreated");
      
      const eventFilter = {
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        address: CONTRACT_ADDRESSES.REVENUE_CONTRACT,
        keys: [
          [coinCreatedSelector],
          [walletAddress] 
        ],
        chunk_size: this.config.chunkSize
      };

      const response = await Promise.race([
        this.provider.getEvents(eventFilter),
        this.createTimeoutPromise('IP coin activities fetch timeout')
      ]);

      const activities: ActivityEvent[] = [];

      for (const event of response.events || []) {
        try {
          const activity = await this.parseIPCoinEvent(event, walletAddress);
          if (activity && this.validateActivity(activity)) {
            activities.push(activity);
          }
        } catch (error) {
          this.log('warn', 'Error parsing IP coin event', {
            eventHash: event.transaction_hash,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return activities;
    } catch (error) {
      this.log('error', 'Error fetching IP coin activities', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }


  private async fetchLiquidityActivities(
    walletAddress: string,
    fromBlock: number,
    toBlock: number
  ): Promise<ActivityEvent[]> {
    try {
      const liquidityAddedSelector = hash.getSelectorFromName("LiquidityAdded");
      
      const eventFilter = {
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        address: CONTRACT_ADDRESSES.REVENUE_CONTRACT,
        keys: [
          [liquidityAddedSelector],
          [walletAddress] 
        ],
        chunk_size: this.config.chunkSize
      };

      const response = await Promise.race([
        this.provider.getEvents(eventFilter),
        this.createTimeoutPromise('Liquidity activities fetch timeout')
      ]);

      const activities: ActivityEvent[] = [];

      for (const event of response.events || []) {
        try {
          const activity = await this.parseLiquidityEvent(event, walletAddress);
          if (activity && this.validateActivity(activity)) {
            activities.push(activity);
          }
        } catch (error) {
          this.log('warn', 'Error parsing liquidity event', {
            eventHash: event.transaction_hash,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return activities;
    } catch (error) {
      this.log('error', 'Error fetching liquidity activities', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  
  private async fetchVoteActivities(
    walletAddress: string,
    fromBlock: number,
    toBlock: number
  ): Promise<ActivityEvent[]> {
    try {
      const voteCastSelector = hash.getSelectorFromName("VoteCast");
      
      const eventFilter = {
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        address: CONTRACT_ADDRESSES.USER_SETTINGS,
        keys: [
          [voteCastSelector],
          [walletAddress] 
        ],
        chunk_size: this.config.chunkSize
      };

      const response = await Promise.race([
        this.provider.getEvents(eventFilter),
        this.createTimeoutPromise('Vote activities fetch timeout')
      ]);

      const activities: ActivityEvent[] = [];

      for (const event of response.events || []) {
        try {
          const activity = await this.parseVoteEvent(event, walletAddress);
          if (activity && this.validateActivity(activity)) {
            activities.push(activity);
          }
        } catch (error) {
          this.log('warn', 'Error parsing vote event', {
            eventHash: event.transaction_hash,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return activities;
    } catch (error) {
      this.log('error', 'Error fetching vote activities', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  
  private async parseMintEvent(event: any, walletAddress: string): Promise<ActivityEvent | null> {
    try {
      if (!event?.transaction_hash || !event?.block_number || !Array.isArray(event.data)) {
        this.log('warn', 'Invalid mint event structure', { event });
        return null;
      }

      const block = await Promise.race([
        this.provider.getBlockWithTxHashes(event.block_number),
        this.createTimeoutPromise('Block fetch timeout for mint event')
      ]);
      
      const tokenIdLow = event.data[0] || '0x0';
      const tokenIdHigh = event.data[1] || '0x0';
      
      return {
        id: `${event.transaction_hash}_${event.event_index || 0}`,
        txHash: event.transaction_hash,
        blockNumber: event.block_number,
        timestamp: block.timestamp * 1000,
        activityType: ActivityType.MINT,
        userAddress: walletAddress.toLowerCase(),
        assetId: tokenIdLow,
        assetName: `IP Asset #${num.toHex(tokenIdLow).slice(-6)}`,
        metadata: {
          tokenIdLow,
          tokenIdHigh,
          contractAddress: event.from_address,
          recipient: walletAddress.toLowerCase()
        }
      };
    } catch (error) {
      this.log('error', 'Error parsing mint event', {
        eventHash: event?.transaction_hash,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  private async parseOfferEvent(event: any, walletAddress: string): Promise<ActivityEvent | null> {
    try {
      if (!event?.transaction_hash || !event?.block_number || !Array.isArray(event.data)) {
        this.log('warn', 'Invalid offer event structure', { event });
        return null;
      }

      const block = await Promise.race([
        this.provider.getBlockWithTxHashes(event.block_number),
        this.createTimeoutPromise('Block fetch timeout for offer event')
      ]);
      
      const assetId = event.data[0] || '0x0';
      const priceLow = event.data[1] || '0x0';
      const priceHigh = event.data[2] || '0x0';
      
      return {
        id: `${event.transaction_hash}_${event.event_index || 0}`,
        txHash: event.transaction_hash,
        blockNumber: event.block_number,
        timestamp: block.timestamp * 1000,
        activityType: ActivityType.CREATE_OFFER,
        userAddress: walletAddress.toLowerCase(),
        assetId: num.toHex(assetId),
        assetName: `IP Asset #${num.toHex(assetId).slice(-6)}`,
        price: this.formatPrice(priceLow),
        currency: 'ETH',
        metadata: {
          assetId,
          priceLow,
          priceHigh,
          offerer: walletAddress.toLowerCase()
        }
      };
    } catch (error) {
      this.log('error', 'Error parsing offer event', {
        eventHash: event?.transaction_hash,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  private async parseTradeEvent(
    event: any, 
    walletAddress: string, 
    activityType: ActivityType.BUY | ActivityType.SELL
  ): Promise<ActivityEvent | null> {
    try {
      if (!event?.transaction_hash || !event?.block_number || !Array.isArray(event.data)) {
        this.log('warn', 'Invalid trade event structure', { event });
        return null;
      }

      const block = await Promise.race([
        this.provider.getBlockWithTxHashes(event.block_number),
        this.createTimeoutPromise('Block fetch timeout for trade event')
      ]);
      
      const buyer = event.data[0] || '0x0';
      const seller = event.data[1] || '0x0';
      const assetId = event.data[2] || '0x0';
      const priceLow = event.data[3] || '0x0';
      
      const normalizedWallet = walletAddress.toLowerCase();
      const normalizedBuyer = buyer.toLowerCase();
      const normalizedSeller = seller.toLowerCase();
      
      if (normalizedWallet !== normalizedBuyer && normalizedWallet !== normalizedSeller) {
        return null; // User not involved in this trade
      }
      
      return {
        id: `${event.transaction_hash}_${event.event_index || 0}`,
        txHash: event.transaction_hash,
        blockNumber: event.block_number,
        timestamp: block.timestamp * 1000,
        activityType,
        userAddress: walletAddress.toLowerCase(),
        assetId: num.toHex(assetId),
        assetName: `IP Asset #${num.toHex(assetId).slice(-6)}`,
        price: this.formatPrice(priceLow),
        currency: 'ETH',
        metadata: {
          buyer: normalizedBuyer,
          seller: normalizedSeller,
          assetId,
          priceLow
        }
      };
    } catch (error) {
      this.log('error', 'Error parsing trade event', {
        eventHash: event?.transaction_hash,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  private async parseIPCoinEvent(event: any, walletAddress: string): Promise<ActivityEvent | null> {
    try {
      if (!event?.transaction_hash || !event?.block_number || !Array.isArray(event.data)) {
        this.log('warn', 'Invalid IP coin event structure', { event });
        return null;
      }

      const block = await Promise.race([
        this.provider.getBlockWithTxHashes(event.block_number),
        this.createTimeoutPromise('Block fetch timeout for IP coin event')
      ]);
      
      const ipAssetId = event.data[0] || '0x0';
      const coinAddress = event.data[1] || '0x0';
      
      return {
        id: `${event.transaction_hash}_${event.event_index || 0}`,
        txHash: event.transaction_hash,
        blockNumber: event.block_number,
        timestamp: block.timestamp * 1000,
        activityType: ActivityType.CREATE_IP_COIN,
        userAddress: walletAddress.toLowerCase(),
        assetId: num.toHex(ipAssetId),
        assetName: `IP Coin for Asset #${num.toHex(ipAssetId).slice(-6)}`,
        metadata: {
          ipAssetId,
          coinAddress,
          creator: walletAddress.toLowerCase()
        }
      };
    } catch (error) {
      this.log('error', 'Error parsing IP coin event', {
        eventHash: event?.transaction_hash,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  private async parseLiquidityEvent(event: any, walletAddress: string): Promise<ActivityEvent | null> {
    try {
      if (!event?.transaction_hash || !event?.block_number || !Array.isArray(event.data)) {
        this.log('warn', 'Invalid liquidity event structure', { event });
        return null;
      }

      const block = await Promise.race([
        this.provider.getBlockWithTxHashes(event.block_number),
        this.createTimeoutPromise('Block fetch timeout for liquidity event')
      ]);
      
      const amountLow = event.data[0] || '0x0';
      const amountHigh = event.data[1] || '0x0';
      
      return {
        id: `${event.transaction_hash}_${event.event_index || 0}`,
        txHash: event.transaction_hash,
        blockNumber: event.block_number,
        timestamp: block.timestamp * 1000,
        activityType: ActivityType.POOL_LIQUIDITY,
        userAddress: walletAddress.toLowerCase(),
        amount: this.formatPrice(amountLow),
        currency: 'ETH',
        metadata: {
          amountLow,
          amountHigh,
          provider: walletAddress.toLowerCase(),
          poolAddress: event.from_address
        }
      };
    } catch (error) {
      this.log('error', 'Error parsing liquidity event', {
        eventHash: event?.transaction_hash,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  private async parseVoteEvent(event: any, walletAddress: string): Promise<ActivityEvent | null> {
    try {
      if (!event?.transaction_hash || !event?.block_number || !Array.isArray(event.data)) {
        this.log('warn', 'Invalid vote event structure', { event });
        return null;
      }

      const block = await Promise.race([
        this.provider.getBlockWithTxHashes(event.block_number),
        this.createTimeoutPromise('Block fetch timeout for vote event')
      ]);
      
      const proposalId = event.data[0] || '0x0';
      const voteValue = event.data[1] || '0x0';
      
      const voteChoice = this.parseVoteChoice(voteValue);
      
      return {
        id: `${event.transaction_hash}_${event.event_index || 0}`,
        txHash: event.transaction_hash,
        blockNumber: event.block_number,
        timestamp: block.timestamp * 1000,
        activityType: ActivityType.DAO_VOTE,
        userAddress: walletAddress.toLowerCase(),
        proposalId: num.toHex(proposalId),
        voteChoice,
        metadata: {
          proposalId,
          voteValue,
          voter: walletAddress.toLowerCase()
        }
      };
    } catch (error) {
      this.log('error', 'Error parsing vote event', {
        eventHash: event?.transaction_hash,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  // Utility methods
  private parseVoteChoice(voteValue: string): 'for' | 'against' | 'abstain' {
    try {
      const value = num.toBigInt(voteValue);
      if (value === 1n) return 'for';
      if (value === 2n) return 'against';
      return 'abstain';
    } catch {
      return 'abstain';
    }
  }

  private formatPrice(priceWei: string): string {
    try {
      const wei = num.toBigInt(priceWei);
      const eth = Number(wei) / Math.pow(10, 18);
      return eth.toFixed(6);
    } catch {
      return '0';
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
          const amountA = parseFloat(a.amount || a.price || '0');
          const amountB = parseFloat(b.amount || b.price || '0');
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

  // Activity validation
  private validateActivity(activity: ActivityEvent): boolean {
    try {
      if (!activity.id || !activity.txHash || !activity.activityType || !activity.userAddress) {
        return false;
      }
      
      if (!activity.timestamp || activity.timestamp <= 0) {
        return false;
      }
      
      if (!activity.blockNumber || activity.blockNumber <= 0) {
        return false;
      }
      
      // Validate transaction hash format
      if (!/^0x[0-9a-fA-F]{64}$/.test(activity.txHash)) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  // Cache key generation
  private generateCacheKey(
    walletAddress: string,
    filter: ActivityFilter,
    page: number,
    limit: number
  ): string {
    const filterHash = JSON.stringify({
      activityTypes: filter.activityTypes.sort(),
      sortBy: filter.sortBy,
      sortOrder: filter.sortOrder
    });
    
    return `activities:${walletAddress}:${Buffer.from(filterHash).toString('base64')}:${page}:${limit}`;
  }

  // Timeout helper
  private createTimeoutPromise(message: string): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), this.config.requestTimeout);
    });
  }

  // Logging
  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, meta?: any): void {
    if (!this.shouldLog(level)) return;
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      service: 'ActivityFeedService',
      ...meta
    };
    
    console.log(JSON.stringify(logEntry));
  }

  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevelIndex = levels.indexOf(this.config.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= configLevelIndex;
  }

  // Mask sensitive data
  private maskAddress(address: string): string {
    if (address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Update response time metrics
  private updateResponseTimeMetrics(responseTime: number): void {
    if (this.metrics.requestCount === 1) {
      this.metrics.avgResponseTimeMs = responseTime;
    } else {
      this.metrics.avgResponseTimeMs = 
        (this.metrics.avgResponseTimeMs * (this.metrics.requestCount - 1) + responseTime) / 
        this.metrics.requestCount;
    }
  }

  // Public utility methods
  getExplorerUrl(txHash: string): string {
    if (!txHash || !/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
      throw new Error('Invalid transaction hash');
    }
    return `${STARKNET_EXPLORER_URL}/tx/${txHash}`;
  }

  async getAssetMetadata(assetId: string): Promise<any> {
    const cacheKey = `asset_metadata:${assetId}`;
    
    if (this.config.cacheEnabled) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.metrics.cacheHitCount++;
        return cached;
      }
      this.metrics.cacheMissCount++;
    }

    try {
      // In production, this would fetch from IPFS or other metadata source
      const metadata = {
        name: `Asset #${assetId}`,
        image: '/placeholder.svg',
        description: `Blockchain asset with ID ${assetId}`,
        lastUpdated: Date.now()
      };

      if (this.config.cacheEnabled) {
        this.cache.set(cacheKey, metadata, this.config.cacheTtlMs);
      }

      return metadata;
    } catch (error) {
      this.log('error', 'Error fetching asset metadata', {
        assetId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Return fallback metadata
      return {
        name: `Asset #${assetId}`,
        image: '/placeholder.svg',
        description: `Blockchain asset with ID ${assetId}`,
        error: true
      };
    }
  }

  // Bulk operations
  async fetchMultipleUserActivities(
    walletAddresses: string[],
    filter: ActivityFilter,
    page: number = 1,
    limit: number = 20
  ): Promise<Map<string, ActivityFetchResult>> {
    if (!Array.isArray(walletAddresses) || walletAddresses.length === 0) {
      throw new Error('Invalid wallet addresses array');
    }

    if (walletAddresses.length > 10) {
      throw new Error('Too many wallet addresses (max 10)');
    }

    const results = new Map<string, ActivityFetchResult>();
    
    // Process in parallel with limited concurrency
    const promises = walletAddresses.map(async (address) => {
      try {
        const result = await this.fetchUserActivity(address, filter, page, limit);
        results.set(address, result);
      } catch (error) {
        this.log('warn', 'Failed to fetch activities for address', {
          address: this.maskAddress(address),
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        // Set empty result for failed addresses
        results.set(address, {
          activities: [],
          total: 0,
          hasMore: false,
          lastUpdated: Date.now()
        });
      }
    });

    await Promise.all(promises);
    return results;
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    this.log('info', 'Cache cleared');
  }

  // Get cache statistics
  getCacheStats(): { size: number; hitRate: number } {
    const totalRequests = this.metrics.cacheHitCount + this.metrics.cacheMissCount;
    const hitRate = totalRequests > 0 ? this.metrics.cacheHitCount / totalRequests : 0;
    
    return {
      size: this.cache.size(),
      hitRate: Math.round(hitRate * 100) / 100
    };
  }
}