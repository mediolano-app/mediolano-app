# Configuration Guide

Complete reference for configuring the Mediolano SDK.

## Environment Variables

### Required

```bash
# Starknet RPC endpoint
NEXT_PUBLIC_RPC_URL=https://starknet-mainnet.g.alchemy.com/v2/YOUR_KEY

# IP Collection contract address
NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS=0x...
```

### Optional

```bash
# Network (mainnet or sepolia)
NEXT_PUBLIC_STARKNET_NETWORK=mainnet

# IPFS Gateway URL
NEXT_PUBLIC_GATEWAY_URL=https://gateway.pinata.cloud

# Block explorer URL
NEXT_PUBLIC_EXPLORER_URL=https://voyager.online

# Start block for event scanning
NEXT_PUBLIC_START_BLOCK=6204232

# Pinata JWT for IPFS uploads (server-side only)
PINATA_JWT=eyJhbGc...
```

---

## SDK Initialization

### Default (Environment Variables)

```typescript
import { getSDK } from '@/sdk';

// Uses environment variables automatically
const sdk = getSDK();
```

### Custom Configuration

```typescript
import { createSDK } from '@/sdk';

const sdk = createSDK({
  rpcUrl: 'https://starknet-mainnet.g.alchemy.com/v2/YOUR_KEY',
  network: 'mainnet',
  collectionContractAddress: '0x...',
  ipfsGateway: 'https://gateway.pinata.cloud',
  timeout: 30000,
  maxRetries: 3,
  retryDelayMs: 1000,
  cacheOptions: {
    ttl: 30000,      // 30 seconds
    maxEntries: 500,
  },
  debug: true,       // Enable debug logging
});
```

---

## Configuration Options

### SDKConfig

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rpcUrl` | string | - | Starknet RPC endpoint (required) |
| `network` | 'mainnet' \| 'sepolia' | 'mainnet' | Network to connect to |
| `collectionContractAddress` | string | - | IP Collection contract (required) |
| `ipfsGateway` | string | 'https://gateway.pinata.cloud' | IPFS gateway URL |
| `explorerUrl` | string | Network default | Block explorer URL |
| `startBlock` | number | Network default | Start block for scanning |
| `timeout` | number | 30000 | Request timeout (ms) |
| `maxRetries` | number | 3 | Max retry attempts |
| `retryDelayMs` | number | 1000 | Base retry delay (ms) |

### CacheOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ttl` | number | 30000 | Time-to-live (ms) |
| `maxEntries` | number | 500 | Max cache entries |
| `bypassCache` | boolean | false | Skip cache for request |

---

## Network Configuration

### Mainnet

```typescript
const sdk = createSDK({
  rpcUrl: 'https://starknet-mainnet.g.alchemy.com/v2/KEY',
  network: 'mainnet',
  collectionContractAddress: '0x...',
});
```

| Setting | Value |
|---------|-------|
| Network | `mainnet` |
| Chain ID | `SN_MAIN` |
| Start Block | 6204232 |
| Explorer | https://voyager.online |

### Sepolia Testnet

```typescript
const sdk = createSDK({
  rpcUrl: 'https://starknet-sepolia.g.alchemy.com/v2/KEY',
  network: 'sepolia',
  collectionContractAddress: '0x...',
});
```

| Setting | Value |
|---------|-------|
| Network | `sepolia` |
| Chain ID | `SN_SEPOLIA` |
| Start Block | 1861690 |
| Explorer | https://sepolia.voyager.online |

---

## RPC Providers

### Recommended Providers

| Provider | Free Tier | URL |
|----------|-----------|-----|
| Alchemy | ✅ | https://alchemy.com |
| Infura | ✅ | https://infura.io |
| Blast | ✅ | https://blastapi.io |
| Chainstack | ✅ | https://chainstack.com |
| Lava | ✅ | https://lavanet.xyz |

### Public RPC (Development Only)

```typescript
// Not recommended for production
const sdk = createSDK({
  rpcUrl: 'https://free-rpc.nethermind.io/mainnet-juno',
  // ...
});
```

---

## IPFS Configuration

### Pinata (Recommended)

```typescript
import { PinataSDK } from 'pinata';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: 'gateway.pinata.cloud',
});
```

### Gateway URLs

| Provider | Gateway URL |
|----------|-------------|
| Pinata | https://gateway.pinata.cloud/ipfs/ |
| Cloudflare | https://cloudflare-ipfs.com/ipfs/ |
| IPFS.io | https://ipfs.io/ipfs/ |
| Dweb | https://dweb.link/ipfs/ |
| NFT.storage | https://nftstorage.link/ipfs/ |

### Custom Gateway

```typescript
const sdk = createSDK({
  // ...
  ipfsGateway: 'https://your-gateway.com',
});
```

---

## Caching

### Default Behavior

- Cache TTL: 30 seconds
- Max entries: 500
- LRU eviction when full

### Custom Cache Settings

```typescript
const sdk = createSDK({
  // ...
  cacheOptions: {
    ttl: 60000,       // 1 minute
    maxEntries: 1000, // More entries
  },
});
```

### Bypass Cache

```typescript
// For a specific request
const collection = await sdk.collections.getCollection('1', {
  bypassCache: true,
});
```

### Clear Cache

```typescript
// Clear all cache
sdk.clearCache();

// Clear specific contract cache
sdk.invalidateContractCache('0xContractAddress');
```

---

## Debug Mode

Enable debug logging:

```typescript
const sdk = createSDK({
  // ...
  debug: true,
});
```

Debug output includes:
- Cache hits/misses
- RPC calls
- Retry attempts
- Error details

---

## Retry Configuration

### Exponential Backoff

The SDK uses exponential backoff for retries:

```
Attempt 1: 1000ms delay
Attempt 2: 2000ms delay
Attempt 3: 4000ms delay
Max delay: 8000ms
```

### Custom Retry Settings

```typescript
const sdk = createSDK({
  // ...
  maxRetries: 5,      // More attempts
  retryDelayMs: 500,  // Faster initial retry
});
```

### Non-Retryable Errors

These errors are not retried:
- Invalid parameters
- Not found errors
- Aborted requests

---

## Singleton vs Instance

### Singleton (Recommended)

```typescript
import { getSDK } from '@/sdk';

// Returns the same instance every time
const sdk = getSDK();
```

Benefits:
- Shared cache across requests
- Single RPC connection
- Consistent configuration

### New Instance

```typescript
import { createSDK } from '@/sdk';

// Creates a new instance each time
const sdk = createSDK({ /* config */ });
```

Use when:
- Different configurations needed
- Testing with mocks
- Isolated caching

### Reset Singleton

```typescript
import { resetSDK } from '@/sdk';

// Clear and reset the singleton
resetSDK();
```

---

## Type Safety

### Full TypeScript Support

```typescript
import type { SDKConfig, Collection, Asset } from '@/sdk';

const config: SDKConfig = {
  rpcUrl: '...',
  network: 'mainnet',
  collectionContractAddress: '0x...' as `0x${string}`,
};

const collection: Collection = await sdk.collections.getCollection('1');
const asset: Asset = await sdk.assets.getAsset('0x...', 1);
```

---

## Production Checklist

- [ ] Use production RPC endpoint (not public/free)
- [ ] Set appropriate cache TTL
- [ ] Enable error monitoring
- [ ] Configure proper timeouts
- [ ] Use environment variables for secrets
- [ ] Test with mainnet contracts
- [ ] Set up rate limiting for API routes

---

> See also: [error-handling.md](error-handling.md) | [collection-guide.md](collection-guide.md)
