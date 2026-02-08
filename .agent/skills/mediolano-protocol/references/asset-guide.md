# Asset Guide

Complete reference for IP Asset (NFT) operations using the Mediolano SDK.

## Overview

Assets are the individual IP tokens within a collection. Each asset:
- Has a unique token ID within its collection
- Is an ERC-721 compatible NFT
- Stores metadata on IPFS
- Tracks ownership and provenance

---

## Asset Data Structure

```typescript
interface Asset {
  tokenId: number;                // Token ID within collection
  nftAddress: `0x${string}`;      // NFT contract address
  collectionId: string;           // Parent collection ID
  name: string;                   // Asset name
  description?: string;           // Asset description
  image?: string;                 // Image URL (resolved)
  owner: `0x${string}`;           // Current owner
  tokenUri: string;               // IPFS metadata URI
  ipfsCid?: string;               // IPFS CID
  type?: string;                  // Asset type
  registrationDate?: string;      // Registration timestamp
  licenseType?: string;           // License (CC-BY, MIT, etc.)
  externalUrl?: string;           // External link
  tags?: string[];                // Tags for categorization
  attributes?: AssetAttribute[];  // NFT attributes/traits
  properties?: Record<string, unknown>;
}

interface AssetAttribute {
  trait_type: string;
  value: string | number | boolean;
  display_type?: string;
}
```

---

## Reading Assets

### Get Single Asset

```typescript
import { getSDK } from '@/sdk';

const sdk = getSDK();

async function getAsset(nftAddress: `0x${string}`, tokenId: number) {
  const asset = await sdk.assets.getAsset(nftAddress, tokenId);
  
  console.log(`Name: ${asset.name}`);
  console.log(`Owner: ${asset.owner}`);
  console.log(`Token ID: ${asset.tokenId}`);
  console.log(`Type: ${asset.type || 'Unknown'}`);
  console.log(`Image: ${asset.image}`);
  
  return asset;
}
```

### Get Collection Assets

```typescript
async function getCollectionAssets(nftAddress: `0x${string}`) {
  const assets = await sdk.assets.getCollectionAssets(nftAddress);
  
  console.log(`Found ${assets.length} assets`);
  
  assets.forEach(asset => {
    console.log(`- Token #${asset.tokenId}: ${asset.name}`);
  });
  
  return assets;
}
```

### Paginated Assets

```typescript
async function getAssetPage(
  nftAddress: `0x${string}`,
  page: number,
  pageSize: number = 12
) {
  const result = await sdk.assets.getCollectionAssetsPaginated(
    nftAddress,
    { page, pageSize }
  );
  
  console.log(`Page ${result.page} - ${result.items.length} items`);
  console.log(`Total: ${result.total}, Has More: ${result.hasMore}`);
  
  return result;
}
```

### Filter Options

```typescript
interface AssetFilter {
  owner?: `0x${string}`;   // Filter by owner
  type?: string;           // Filter by type
  search?: string;         // Search name/description
}

// Filter by type
const artAssets = await sdk.assets.getCollectionAssetsPaginated(
  nftAddress,
  { page: 1, pageSize: 20 },
  { type: 'art' }
);

// Search
const searchResults = await sdk.assets.getCollectionAssetsPaginated(
  nftAddress,
  { page: 1, pageSize: 20 },
  { search: 'sunset' }
);
```

### Get User Assets

```typescript
// Assets owned by user in a specific collection
async function getUserAssets(
  nftAddress: `0x${string}`,
  userAddress: `0x${string}`
) {
  const assets = await sdk.assets.getUserAssets(nftAddress, userAddress);
  
  console.log(`User owns ${assets.length} assets`);
  
  return assets;
}

// Token IDs from registry (all collections)
async function getUserTokenIds(
  collectionId: string,
  userAddress: `0x${string}`
) {
  const tokenIds = await sdk.assets.getUserTokensPerCollection(
    collectionId,
    userAddress
  );
  
  console.log(`Token IDs: ${tokenIds.join(', ')}`);
  
  return tokenIds;
}
```

---

## NFT Standard Operations

### Token Owner

```typescript
const owner = await sdk.assets.getTokenOwner(nftAddress, tokenId);
console.log(`Owner: ${owner}`);
```

### Token URI

```typescript
const uri = await sdk.assets.getTokenUri(nftAddress, tokenId);
console.log(`URI: ${uri}`);
```

### Total Supply

```typescript
const supply = await sdk.assets.getTotalSupply(nftAddress);
console.log(`Total Supply: ${supply}`);
```

### Balance

```typescript
const balance = await sdk.assets.getBalance(nftAddress, ownerAddress);
console.log(`Balance: ${balance} tokens`);
```

### Token by Index

```typescript
// Get the Nth token owned by an address
const tokenId = await sdk.assets.getTokenOfOwnerByIndex(
  nftAddress,
  ownerAddress,
  index // 0-based index
);
```

---

## Transferring Assets

### Single Transfer

```typescript
const transferCall = sdk.assets.buildTransferCall({
  from: "0xCurrentOwner",
  to: "0xNewOwner",
  token: "1:5",  // format: collectionId:tokenId
});

await sendTransaction([transferCall]);
```

### Batch Transfer

```typescript
const batchTransferCall = sdk.assets.buildBatchTransferCall({
  from: "0xCurrentOwner",
  to: "0xNewOwner",
  tokens: ["1:5", "1:6", "1:7"],
});

await sendTransaction([batchTransferCall]);
```

### Token Format

The `token` parameter uses the format `collectionId:tokenId`:
- `"1:5"` = Collection 1, Token 5
- `"42:100"` = Collection 42, Token 100

---

## Burning Assets

### Single Burn

```typescript
const burnCall = sdk.assets.buildBurnCall({
  token: "1:5",
});

await sendTransaction([burnCall]);
```

### Batch Burn

```typescript
const batchBurnCall = sdk.assets.buildBatchBurnCall({
  tokens: ["1:5", "1:6", "1:7"],
});

await sendTransaction([batchBurnCall]);
```

> **Warning:** Burning is irreversible. The token and its on-chain record will be permanently destroyed.

---

## Asset Metadata

### Standard Schema

```json
{
  "name": "Artwork Title",
  "description": "Description of the artwork",
  "image": "ipfs://QmImageCid",
  "type": "art",
  "external_url": "https://example.com/asset",
  "attributes": [
    { "trait_type": "Medium", "value": "Digital" },
    { "trait_type": "Year", "value": 2024 },
    { "trait_type": "Edition", "value": "1 of 10" }
  ],
  "properties": {
    "files": [
      { "uri": "ipfs://QmHighRes", "type": "image/png" }
    ]
  },
  "licenseType": "CC-BY-4.0",
  "registrationDate": "2024-01-01T00:00:00Z",
  "tags": ["digital", "abstract", "colorful"]
}
```

### Fetching Metadata

```typescript
import { fetchIPFSMetadata, extractCID } from '@/sdk/utils';

// From token URI
const cid = extractCID(asset.tokenUri);
const metadata = await fetchIPFSMetadata(cid);

console.log('Metadata:', metadata);
```

---

## Display Assets

### Enrich for Display

```typescript
async function enrichAsset(asset: Asset, collectionName?: string) {
  const enriched = await sdk.assets.enrichAsset(asset, collectionName);
  
  console.log(`Name: ${enriched.name}`);
  console.log(`Collection: ${enriched.collectionName}`);
  console.log(`Owner: ${enriched.formattedOwner}`);  // Shortened
  console.log(`Image: ${enriched.resolvedImage}`);   // Full URL
  
  return enriched;
}
```

### DisplayAsset Type

```typescript
interface DisplayAsset extends Asset {
  collectionName?: string;     // Collection name
  formattedOwner?: string;     // "0x1234...5678"
  resolvedImage?: string;      // Full gateway URL
}
```

---

## Provenance Tracking

Assets maintain provenance through on-chain events:

```typescript
interface ProvenanceRecord {
  eventType: 'mint' | 'transfer' | 'burn' | 'remix';
  from?: `0x${string}`;
  to?: `0x${string}`;
  operator?: `0x${string}`;
  transactionHash: string;
  blockNumber: number;
  timestamp?: number;
}
```

---

## Best Practices

1. **Always resolve IPFS URLs** before displaying images
2. **Cache asset data** to reduce RPC calls
3. **Use batch operations** for multiple transfers/burns
4. **Validate ownership** before attempting transfers
5. **Handle missing metadata** gracefully
6. **Use pagination** for large collections

---

## Error Handling

```typescript
try {
  const asset = await sdk.assets.getAsset(nftAddress, tokenId);
} catch (error) {
  if (error.message.includes('not found')) {
    // Token doesn't exist
  } else if (error.message.includes('invalid')) {
    // Invalid address or token ID
  } else {
    throw error;
  }
}
```

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/sdk/assets?collection=0x...` | List collection assets |
| `GET /api/sdk/assets?collection=0x...&owner=0x...` | Filter by owner |
| `GET /api/sdk/assets?collection=0x...&search=query` | Search |
| `GET /api/sdk/assets/[nftAddress]/[tokenId]` | Get single asset |

---

> See also: [collection-guide.md](collection-guide.md) | [tokenization-guide.md](tokenization-guide.md) | [licensing-guide.md](licensing-guide.md)
