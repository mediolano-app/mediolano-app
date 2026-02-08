---
name: Mediolano Protocol Skills
description: AI agent skills for zero-fee IP tokenization on Starknet using the Mediolano Protocol
version: 1.0.0
author: Mediolano
---

# Mediolano Protocol SDK Integration

Mediolano is a permissionless intellectual property (IP) tokenization platform on Starknet, providing **zero-fee** IP registration, collection management, and NFT operations.

## Quick Start

The SDK is integrated within the Next.js application at `src/sdk`:

```typescript
import { getSDK, createSDK } from '@/sdk';

// Use singleton instance (recommended)
const sdk = getSDK();

// Or create a new instance
const sdk = createSDK({
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
  collectionContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS as `0x${string}`,
});

// Read collections
const collections = await sdk.collections.getAllCollections();

// Read assets
const asset = await sdk.assets.getAsset('0xNftAddress', tokenId);

// Get SDK status
const status = await sdk.getStatus();
```

---

## Account Setup

### Wallet Account (Frontend/dApps)

```typescript
import { useAccount, useSendTransaction } from '@starknet-react/core';

const { address } = useAccount();
const { sendAsync } = useSendTransaction({ calls: [] });

// Execute transaction
const result = await sendAsync([mintCall]);
```

### Direct Account (Scripts/Backend)

```typescript
import { Account, RpcProvider } from 'starknet';

const provider = new RpcProvider({ nodeUrl: process.env.NEXT_PUBLIC_RPC_URL });
const account = new Account(
  provider,
  process.env.STARKNET_ACCOUNT_ADDRESS,
  process.env.STARKNET_PRIVATE_KEY  // NEVER commit!
);

const result = await account.execute([{
  contractAddress: mintCall.contractAddress,
  entrypoint: mintCall.entrypoint,
  calldata: mintCall.calldata,
}]);
```

---

## Collection Operations

### Read Collections

```typescript
// Get all collections
const collections = await sdk.collections.getAllCollections();

// Get single collection by ID
const collection = await sdk.collections.getCollection('1');

// Get user's collections
const userCollections = await sdk.collections.getUserCollections('0x...');

// Paginated with filters
const result = await sdk.collections.getCollectionsPaginated(
  { page: 1, pageSize: 12 },
  { type: 'art', isActive: true }
);

// Get statistics
const stats = await sdk.collections.getCollectionStats('1');

// Validation
const isValid = await sdk.collections.isValidCollection('1');
const isOwner = await sdk.collections.isCollectionOwner('1', '0xAddress');
```

### Create Collection

```typescript
import { PinataSDK } from 'pinata';

// 1. Upload metadata to IPFS
const pinata = new PinataSDK({ pinataJwt: process.env.PINATA_JWT });
const metadata = {
  name: 'My Collection',
  description: 'Collection description',
  image: 'ipfs://QmCoverImage',
  type: 'art',
};
const response = await pinata.upload.json(metadata);
const baseUri = `ipfs://${response.IpfsHash}`;

// 2. Build transaction
const createCall = sdk.collections.buildCreateCollectionCall({
  name: 'My Collection',
  symbol: 'MYCOL',  // Optional, defaults to 'COLL'
  baseUri,
});

// 3. Execute
await sendAsync([createCall]);
```

### Mint Assets

```typescript
// Single mint
const mintCall = sdk.collections.buildMintCall({
  collectionId: '1',
  recipient: '0x...' as `0x${string}`,
  tokenUri: 'ipfs://QmAssetMetadata',
});

// Batch mint
const batchMintCall = sdk.collections.buildBatchMintCall({
  collectionId: '1',
  recipients: ['0x...' as `0x${string}`, '0x...' as `0x${string}`],
  tokenUris: ['ipfs://Qm1', 'ipfs://Qm2'],
});
```

> See [references/collection-guide.md](references/collection-guide.md) for complete documentation.

---

## Asset Operations

### Read Assets

```typescript
// Get single asset by NFT address and token ID
const asset = await sdk.assets.getAsset('0xNftAddress', tokenId);

// Get all assets in a collection
const assets = await sdk.assets.getCollectionAssets('0xNftAddress');

// Get user's assets within a collection
const userAssets = await sdk.assets.getUserAssets('0xNftAddress', '0xUserAddress');

// Paginated
const result = await sdk.assets.getCollectionAssetsPaginated(
  '0xNftAddress',
  { page: 1, pageSize: 12 }
);

// Get user tokens per collection from registry
const tokens = await sdk.assets.getUserTokensPerCollection('1', '0xUserAddress');

// Token validation
const isValid = await sdk.assets.isValidToken('tokenIdentifier');
```

### NFT Standard Read Operations

```typescript
const owner = await sdk.assets.getTokenOwner('0xNftAddress', tokenId);
const uri = await sdk.assets.getTokenUri('0xNftAddress', tokenId);
const supply = await sdk.assets.getTotalSupply('0xNftAddress');
const balance = await sdk.assets.getBalance('0xNftAddress', '0xOwner');
const tokenAtIndex = await sdk.assets.getTokenOfOwnerByIndex('0xNftAddress', '0xOwner', 0);
```

### Transfer Assets

```typescript
// Single transfer - token is a string identifier
const transferCall = sdk.assets.buildTransferCall({
  from: '0xCurrentOwner' as `0x${string}`,
  to: '0xNewOwner' as `0x${string}`,
  token: 'tokenIdentifier',  // Token identifier string
});

// Batch transfer
const batchTransferCall = sdk.assets.buildBatchTransferCall({
  from: '0xCurrentOwner' as `0x${string}`,
  to: '0xNewOwner' as `0x${string}`,
  tokens: ['token1', 'token2', 'token3'],
});
```

### Burn Assets

```typescript
const burnCall = sdk.assets.buildBurnCall({ token: 'tokenIdentifier' });
const batchBurnCall = sdk.assets.buildBatchBurnCall({ tokens: ['token1', 'token2'] });
```

> See [references/asset-guide.md](references/asset-guide.md) for complete documentation.

---

## API Services

### Internal API Routes (`/api/sdk/`)

These are Next.js API routes powered by the SDK, running on Edge runtime with 30s caching:

| Endpoint | Method | Description | Query Params |
|----------|--------|-------------|--------------|
| `/api/sdk/collections` | GET | List collections | `owner`, `type`, `search`, `isActive`, `page`, `pageSize` |
| `/api/sdk/collections/[id]` | GET | Get single collection | - |
| `/api/sdk/collections/[id]/stats` | GET | Get collection stats | - |
| `/api/sdk/assets` | GET | List assets | `collection` (required), `owner`, `type`, `search`, `page`, `pageSize` |
| `/api/sdk/assets/[nftAddress]/[tokenId]` | GET | Get single asset | - |
| `/api/sdk/status` | GET | SDK health check | - |

```typescript
// Example usage
const res = await fetch('/api/sdk/collections?page=1&pageSize=10&type=art');
const { items, total, hasMore } = await res.json();

// Get single collection
const collection = await fetch('/api/sdk/collections/1').then(r => r.json());
```

### IPFS Upload APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/pinata` | GET | Get Pinata signed upload URL |
| `/api/uploadmeta` | POST | Upload metadata JSON to IPFS |
| `/api/forms-ipfs` | POST | Upload form data with file to IPFS |

### External Indexer API

Base URL: `https://mediolano-api-service.onrender.com/api`

**OpenAPI Docs:** [Swagger UI](https://mediolano-api-service.onrender.com/docs/) | [OpenAPI JSON](https://mediolano-api-service.onrender.com/docs/json)

#### Assets

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/assets` | GET | List all assets |
| `/assets/{id}` | GET | Get asset by ID |
| `/assets/owner/{owner}` | GET | Get assets by owner address |

#### Collections

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/collections` | GET | List collections |
| `/collections/{id}` | GET | Get collection by ID |
| `/collections/creator/{creator}` | GET | Get collections by creator |

**Query params:** `indexerSource` (MEDIALANO-DAPP, MEDIALANO-MIPP), `creator`, `search`, `limit`, `offset`, `sortBy`, `sortOrder`

#### Transfers

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/transfers` | GET | List transfers |
| `/transfers/token/{tokenId}` | GET | Get transfers for token |
| `/transfers/from/{from}` | GET | Get transfers from address |
| `/transfers/to/{to}` | GET | Get transfers to address |

#### Stats

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/stats` | GET | Global statistics |
| `/stats/indexer` | GET | Stats by indexer source |
| `/stats/collection/{collectionId}` | GET | Collection stats |
| `/stats/owner/{owner}` | GET | Owner stats |
| `/stats/trending` | GET | Trending collections |

#### Reports (Community Moderation)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/reports` | GET | List reports |
| `/reports/submit` | POST | Submit a report |
| `/reports/{id}` | GET | Get report by ID |
| `/reports/{id}/status` | PATCH | Update report status |

```typescript
// External API usage example
const BASE_URL = 'https://mediolano-api-service.onrender.com/api';

// Get trending collections
const trending = await fetch(`${BASE_URL}/stats/trending?limit=10`).then(r => r.json());

// Get collections with pagination
const collections = await fetch(`${BASE_URL}/collections?limit=20&offset=0&sortBy=createdAtBlock&sortOrder=desc`).then(r => r.json());

// Get transfer history for a token
const transfers = await fetch(`${BASE_URL}/transfers/token/${tokenId}`).then(r => r.json());
```


## IP Types

| Type | Description |
|------|-------------|
| `art` | Visual artwork, illustrations, photography |
| `audio` | Music, podcasts, sound effects |
| `video` | Films, animations, tutorials |
| `document` | Books, articles, research papers |
| `patent` | Technical inventions, designs |
| `publication` | Journals, magazines |
| `software` | Code, applications, libraries |
| `rwa` | Real world assets with digital twins |

---

## Metadata Schemas

### Collection Metadata (IPFS)

```json
{
  "name": "Collection Name",
  "description": "Description",
  "image": "ipfs://QmCoverImage",
  "type": "art",
  "visibility": "public",
  "enableVersioning": true,
  "allowComments": true,
  "requireApproval": false
}
```

### Asset Metadata (IPFS)

```json
{
  "name": "Asset Name",
  "description": "Description",
  "image": "ipfs://QmAssetImage",
  "type": "art",
  "licenseType": "CC-BY-4.0",
  "registrationDate": "2024-01-01T00:00:00Z",
  "tags": ["art", "digital"],
  "attributes": [
    { "trait_type": "Medium", "value": "Digital" }
  ],
  "external_url": "https://example.com/asset"
}
```

> See [references/tokenization-guide.md](references/tokenization-guide.md) for complete schemas.

---

## License Types

| License | Commercial | Derivatives |
|---------|-----------|-------------|
| CC0 | ✅ | ✅ |
| CC-BY | ✅ | ✅ |
| CC-BY-NC | ❌ | ✅ |
| CC-BY-ND | ✅ | ❌ |
| MIT | ✅ | ✅ |
| Apache-2.0 | ✅ | ✅ |
| All-Rights-Reserved | ❌ | ❌ |

---

## Utilities

```typescript
import {
  normalizeAddress,
  decimalToHex,
  isZeroAddress,
  processIPFSUrl,
  extractCID,
  fetchIPFSMetadata,
  processMetadataImage,
} from '@/sdk/utils';

// Address utilities
normalizeAddress('0x123...')           // Normalize address format
decimalToHex('123456')                 // Convert decimal to hex
isZeroAddress('0x0')                   // Check if zero address

// IPFS utilities
processIPFSUrl('ipfs://Qm...', gateway) // Convert to gateway URL
extractCID('ipfs://Qm...')              // Extract IPFS CID
await fetchIPFSMetadata(cid, gateway)   // Fetch metadata from IPFS
```

---

## Configuration

### Required Environment Variables

```bash
# Starknet RPC endpoint (required)
NEXT_PUBLIC_RPC_URL=https://starknet-mainnet.g.alchemy.com/v2/KEY

# IP Collection contract address (required)
NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS=0x...

# Network (optional, defaults to mainnet)
NEXT_PUBLIC_STARKNET_NETWORK=mainnet

# IPFS gateway (optional)
NEXT_PUBLIC_GATEWAY_URL=https://gateway.pinata.cloud

# Pinata JWT for uploads (server-side only, optional)
PINATA_JWT=eyJhbGc...
```

### SDK Options

```typescript
import { createSDK } from '@/sdk';

const sdk = createSDK({
  rpcUrl: 'https://...',
  network: 'mainnet',               // 'mainnet' | 'sepolia'
  collectionContractAddress: '0x...' as `0x${string}`,
  timeout: 30000,                   // Request timeout (ms)
  maxRetries: 3,                    // Max retry attempts
  retryDelayMs: 1000,               // Base retry delay
  ipfsGateway: 'https://gateway.pinata.cloud',
  cacheOptions: { 
    ttl: 30000,                     // Cache TTL (ms)
    maxEntries: 500                 // Max cache entries
  },
  debug: true,                      // Enable debug logging
});

// Cache management
sdk.clearCache();
sdk.invalidateContractCache('0xContractAddress');
```

> See [references/configuration.md](references/configuration.md) for complete setup.

---

## Fees

| Fee Type | Amount |
|----------|--------|
| Protocol Fee | **$0** |
| Minting Fee | **$0** |
| Transfer Fee | **$0** |
| Gas Fee | ~0.001 STRK |

---

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| "Collection X does not exist" | Invalid collection ID | Verify collection ID |
| "Collection name is required" | Empty name parameter | Provide non-empty name |
| "Base URI is required" | Missing IPFS URI | Upload metadata first |
| "Recipient address is required" | Missing recipient | Provide recipient address |
| "Token is required" | Missing token | Provide token identifier |

> See [references/error-handling.md](references/error-handling.md) for complete error taxonomy.

---

## References & Examples

**Guides:**
[collection-guide](references/collection-guide.md) |
[asset-guide](references/asset-guide.md) |
[tokenization-guide](references/tokenization-guide.md) |
[configuration](references/configuration.md) |
[error-handling](references/error-handling.md)

**Scripts:**
[fetch-collections-example.ts](scripts/fetch-collections-example.ts) |
[create-collection-example.ts](scripts/create-collection-example.ts) |
[mint-example.ts](scripts/mint-example.ts) |
[transfer-example.ts](scripts/transfer-example.ts) |
[upload-ipfs-example.ts](scripts/upload-ipfs-example.ts)

**Links:**
[SDK Source](file:///Users/kalamaha/dev/mediolano-app/src/sdk) |
[External API Docs](https://mediolano-api-service.onrender.com/docs/) |
[App](https://ip.mediolano.app)
