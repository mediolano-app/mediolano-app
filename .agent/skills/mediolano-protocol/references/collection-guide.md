# Collection Guide

Complete reference for IP Collection operations using the Mediolano SDK.

## Overview

Collections are the primary organizational unit in the Mediolano Protocol. Each collection:
- Has a unique on-chain ID
- Deploys its own NFT contract for assets
- Stores metadata on IPFS
- Tracks minting, burning, and transfer statistics

---

## Collection Data Structure

```typescript
interface Collection {
  id: string;                    // Unique collection ID
  name: string;                  // Collection name
  symbol: string;                // Token symbol (e.g., "MYART")
  baseUri: string;               // IPFS metadata URI
  description: string;           // From IPFS metadata
  image: string;                 // Cover image URL
  owner: `0x${string}`;          // Owner wallet address
  nftAddress: `0x${string}`;     // Deployed NFT contract
  isActive: boolean;             // Active status
  totalMinted: number;           // Total tokens minted
  totalBurned: number;           // Total tokens burned
  totalTransfers: number;        // Total transfers
  itemCount: number;             // Current supply (minted - burned)
  totalSupply: number;           // Same as totalMinted
  lastMintTime: string;          // Last mint timestamp
  lastBurnTime: string;          // Last burn timestamp
  lastTransferTime: string;      // Last transfer timestamp
  type?: string;                 // Collection type (art, audio, etc.)
  visibility?: string;           // public/private/unlisted
  enableVersioning?: boolean;    // Version tracking enabled
  allowComments?: boolean;       // Comments allowed
  requireApproval?: boolean;     // Minting requires approval
}
```

---

## Reading Collections

### Get Single Collection

```typescript
import { getSDK } from '@/sdk';

const sdk = getSDK();

async function getCollection(id: string) {
  try {
    const collection = await sdk.collections.getCollection(id);
    
    console.log(`Name: ${collection.name}`);
    console.log(`Owner: ${collection.owner}`);
    console.log(`NFT Contract: ${collection.nftAddress}`);
    console.log(`Items: ${collection.itemCount}`);
    console.log(`Active: ${collection.isActive}`);
    
    return collection;
  } catch (error) {
    if (error.message.includes('does not exist')) {
      console.log('Collection not found');
      return null;
    }
    throw error;
  }
}
```

### Get All Collections

```typescript
async function getAllCollections() {
  const collections = await sdk.collections.getAllCollections();
  
  console.log(`Found ${collections.length} collections`);
  
  // Sort by most items
  const sorted = collections.sort((a, b) => b.itemCount - a.itemCount);
  
  return sorted;
}
```

### Paginated Collections

```typescript
async function getCollectionPage(page: number, pageSize: number = 12) {
  const result = await sdk.collections.getCollectionsPaginated(
    { page, pageSize },
    { isActive: true } // Optional filter
  );
  
  console.log(`Page ${result.page} of ${Math.ceil(result.total / result.pageSize)}`);
  console.log(`Showing ${result.items.length} of ${result.total}`);
  console.log(`Has more: ${result.hasMore}`);
  
  return result;
}
```

### Filter Options

```typescript
interface CollectionFilter {
  owner?: `0x${string}`;     // Filter by owner address
  isActive?: boolean;         // Filter by active status
  type?: string;              // Filter by type (art, audio, etc.)
  search?: string;            // Search name/description
}

// Examples
const artCollections = await sdk.collections.getCollectionsPaginated(
  { page: 1, pageSize: 20 },
  { type: 'art' }
);

const userCollections = await sdk.collections.getCollectionsPaginated(
  { page: 1, pageSize: 20 },
  { owner: '0x123...' }
);

const searchResults = await sdk.collections.getCollectionsPaginated(
  { page: 1, pageSize: 20 },
  { search: 'music' }
);
```

### Get User Collections

```typescript
async function getUserCollections(userAddress: `0x${string}`) {
  const collections = await sdk.collections.getUserCollections(userAddress);
  
  console.log(`User owns ${collections.length} collections`);
  
  collections.forEach(c => {
    console.log(`- ${c.name} (${c.itemCount} items)`);
  });
  
  return collections;
}
```

### Collection Statistics

```typescript
async function getStats(collectionId: string) {
  const stats = await sdk.collections.getCollectionStats(collectionId);
  
  console.log('Collection Statistics:');
  console.log(`  Minted: ${stats.totalMinted}`);
  console.log(`  Burned: ${stats.totalBurned}`);
  console.log(`  Transfers: ${stats.totalTransfers}`);
  console.log(`  Last Mint: ${stats.lastMintTime}`);
  
  return stats;
}
```

### Validation Checks

```typescript
// Check if collection exists
const isValid = await sdk.collections.isValidCollection('1');

// Check ownership
const isOwner = await sdk.collections.isCollectionOwner('1', '0xUserAddress');
```

---

## Creating Collections

### Step 1: Prepare Metadata

```typescript
const collectionMetadata = {
  name: "My Art Collection",
  description: "A curated collection of digital artwork",
  image: "ipfs://QmCoverImageCid",
  coverImage: "ipfs://QmCoverImageCid",
  type: "art",
  visibility: "public",
  enableVersioning: true,
  allowComments: true,
  requireApproval: false
};
```

### Step 2: Upload to IPFS

```typescript
// Using Pinata
const response = await pinata.upload.json(collectionMetadata);
const baseUri = `ipfs://${response.IpfsHash}`;
```

### Step 3: Build Transaction

```typescript
const createCall = sdk.collections.buildCreateCollectionCall({
  name: "My Art Collection",
  symbol: "MYART",  // Optional, auto-generated if empty
  baseUri: baseUri,
});
```

### Step 4: Execute

```typescript
// Using starknet-react
const { sendAsync } = useSendTransaction({ calls: [] });
const result = await sendAsync([createCall]);

console.log('Transaction:', result.transaction_hash);
```

### Symbol Generation

If no symbol is provided, the SDK generates one:
- Removes non-alphanumeric characters
- Converts to uppercase
- Defaults to "COLL" if empty

---

## Minting Assets

### Single Mint

```typescript
const mintCall = sdk.collections.buildMintCall({
  collectionId: "1",
  recipient: "0xRecipientAddress",
  tokenUri: "ipfs://QmAssetMetadataCid",
});

await sendTransaction([mintCall]);
```

### Batch Mint

```typescript
const batchMintCall = sdk.collections.buildBatchMintCall({
  collectionId: "1",
  recipients: [
    "0xAddr1",
    "0xAddr2",
    "0xAddr3"
  ],
  tokenUris: [
    "ipfs://QmCid1",
    "ipfs://QmCid2",
    "ipfs://QmCid3"
  ],
});

await sendTransaction([batchMintCall]);
```

> **Note:** Recipients and tokenUris arrays must have the same length.

---

## Collection Types

| Type | Description | Examples |
|------|-------------|----------|
| `art` | Visual artwork | Digital paintings, illustrations, photography |
| `audio` | Audio content | Music tracks, podcasts, sound effects |
| `video` | Video content | Films, animations, tutorials |
| `document` | Written works | Books, articles, research papers |
| `patent` | Inventions | Technical patents, design patents |
| `publication` | Publications | Journals, magazines, newsletters |
| `software` | Code/Software | Open source, apps, libraries |
| `rwa` | Real World Assets | Physical items with digital twins |
| `general` | General purpose | Miscellaneous IP |

---

## Best Practices

1. **Always validate metadata** before uploading to IPFS
2. **Use descriptive names** that clearly identify the collection
3. **Include a cover image** for better discoverability
4. **Set appropriate visibility** (public/private/unlisted)
5. **Use batch minting** for multiple assets to save gas
6. **Check collection validity** before attempting operations

---

## Error Handling

```typescript
try {
  const collection = await sdk.collections.getCollection(id);
} catch (error) {
  if (error.message.includes('does not exist')) {
    // Collection not found
  } else if (error.message.includes('invalid')) {
    // Invalid collection ID format
  } else {
    // Network or other error
    throw error;
  }
}
```

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/sdk/collections` | List collections |
| `GET /api/sdk/collections?owner=0x...` | Filter by owner |
| `GET /api/sdk/collections?type=art` | Filter by type |
| `GET /api/sdk/collections?search=query` | Search |
| `GET /api/sdk/collections/[id]` | Get single |
| `GET /api/sdk/collections/[id]/stats` | Get stats |

---

> See also: [asset-guide.md](asset-guide.md) | [tokenization-guide.md](tokenization-guide.md)
