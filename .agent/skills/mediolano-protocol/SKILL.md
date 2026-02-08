---
name: Mediolano Protocol Skills
description: AI agent skills for zero-fee IP tokenization on Starknet using the Mediolano Protocol
version: 1.0.0
author: Mediolano
---

# Mediolano Protocol SDK Integration

Mediolano is a permissionless intellectual property (IP) tokenization platform on Starknet, providing zero-fee IP registration, collection management, and NFT operations.

## Installation

```bash
npx skills add mediolano-app/mediolano-app
```

## Quick Start

```typescript
import { getSDK } from '@/sdk';

const sdk = getSDK();

// Read collections
const collections = await sdk.collections.getAllCollections();

// Read assets
const asset = await sdk.assets.getAsset('0xNftAddress', tokenId);

// Build mint transaction
const mintCall = sdk.collections.buildMintCall({
  collectionId: '1',
  recipient: '0x...',
  tokenUri: 'ipfs://Qm...',
});
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

const provider = new RpcProvider({ nodeUrl: process.env.RPC_URL });
const account = new Account(
  provider,
  process.env.ACCOUNT_ADDRESS,
  process.env.PRIVATE_KEY  // NEVER commit!
);

const result = await account.execute([mintCall]);
```

---

## Collection Operations

### Read Collections

```typescript
// Get all collections
const collections = await sdk.collections.getAllCollections();

// Get single collection
const collection = await sdk.collections.getCollection('1');

// Get user collections
const userCollections = await sdk.collections.getUserCollections('0x...');

// Paginated with filters
const result = await sdk.collections.getCollectionsPaginated(
  { page: 1, pageSize: 12 },
  { type: 'art', isActive: true }
);

// Get statistics
const stats = await sdk.collections.getCollectionStats('1');
```

### Create Collection

```typescript
// 1. Upload metadata to IPFS
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
  symbol: 'MYCOL',
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
  recipient: '0x...',
  tokenUri: 'ipfs://QmAssetMetadata',
});

// Batch mint
const batchMintCall = sdk.collections.buildBatchMintCall({
  collectionId: '1',
  recipients: ['0x...', '0x...'],
  tokenUris: ['ipfs://Qm1', 'ipfs://Qm2'],
});
```

> See [references/collection-guide.md](references/collection-guide.md) for complete documentation.

---

## Asset Operations

### Read Assets

```typescript
// Get single asset
const asset = await sdk.assets.getAsset('0xNftAddress', tokenId);

// Get collection assets
const assets = await sdk.assets.getCollectionAssets('0xNftAddress');

// Get user assets
const userAssets = await sdk.assets.getUserAssets('0xNftAddress', '0xUserAddress');

// Paginated
const result = await sdk.assets.getCollectionAssetsPaginated(
  '0xNftAddress',
  { page: 1, pageSize: 12 }
);

// NFT standard methods
const owner = await sdk.assets.getTokenOwner('0xNftAddress', tokenId);
const uri = await sdk.assets.getTokenUri('0xNftAddress', tokenId);
const supply = await sdk.assets.getTotalSupply('0xNftAddress');
```

### Transfer Assets

```typescript
// Single transfer
const transferCall = sdk.assets.buildTransferCall({
  from: '0xCurrentOwner',
  to: '0xNewOwner',
  token: '1:5',  // collectionId:tokenId
});

// Batch transfer
const batchTransferCall = sdk.assets.buildBatchTransferCall({
  from: '0xCurrentOwner',
  to: '0xNewOwner',
  tokens: ['1:5', '1:6', '1:7'],
});
```

### Burn Assets

```typescript
const burnCall = sdk.assets.buildBurnCall({ token: '1:5' });
const batchBurnCall = sdk.assets.buildBatchBurnCall({ tokens: ['1:5', '1:6'] });
```

> See [references/asset-guide.md](references/asset-guide.md) for complete documentation.

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sdk/collections` | GET | List collections |
| `/api/sdk/collections?owner=0x&type=art` | GET | Filter collections |
| `/api/sdk/collections/[id]` | GET | Get single collection |
| `/api/sdk/collections/[id]/stats` | GET | Get collection stats |
| `/api/sdk/assets?collection=0x` | GET | List assets |
| `/api/sdk/assets/[address]/[tokenId]` | GET | Get single asset |
| `/api/sdk/status` | GET | Health check |

```typescript
// API usage
const response = await fetch('/api/sdk/collections?page=1&pageSize=10');
const { items, total, hasMore } = await response.json();
```

---

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

### Collection Metadata

```json
{
  "name": "Collection Name",
  "description": "Description",
  "image": "ipfs://QmCoverImage",
  "type": "art",
  "visibility": "public"
}
```

### Asset Metadata

```json
{
  "name": "Asset Name",
  "description": "Description",
  "image": "ipfs://QmAssetImage",
  "type": "art",
  "licenseType": "CC-BY-4.0",
  "attributes": [
    { "trait_type": "Medium", "value": "Digital" }
  ],
  "registrationDate": "2024-01-01T00:00:00Z"
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
  shortenAddress,
  isValidAddress,
  processIPFSUrl,
  extractCID,
  fetchIPFSMetadata,
} from '@/sdk/utils';

normalizeAddress('0x123...')      // Normalize
shortenAddress('0x123...', 4)     // "0x1234...5678"
processIPFSUrl('ipfs://Qm...')    // Full gateway URL
extractCID('ipfs://Qm...')        // Just the CID
```

---

## Error Quick Reference

| Error | Cause | Solution |
|-------|-------|----------|
| "Collection does not exist" | Invalid ID | Check collection ID |
| "Not collection owner" | Wrong wallet | Switch to owner wallet |
| "Token not found" | Invalid token | Verify token exists |
| "IPFS fetch failed" | CID issue | Check IPFS gateway |

> See [references/error-handling.md](references/error-handling.md) for complete error taxonomy.

---

## Configuration

### Environment Variables

```bash
NEXT_PUBLIC_RPC_URL=https://starknet-mainnet.g.alchemy.com/v2/KEY
NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_GATEWAY_URL=https://gateway.pinata.cloud
PINATA_JWT=eyJhbGc...  # Server-side only
```

### SDK Options

```typescript
const sdk = createSDK({
  rpcUrl: '...',
  network: 'mainnet',
  timeout: 30000,
  maxRetries: 3,
  cacheOptions: { ttl: 30000, maxEntries: 500 },
  debug: true,
});
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
[Docs](https://mediolano.xyz/docs) |
[SDK Source](src/sdk) |
[App](https://mediolano.xyz)
