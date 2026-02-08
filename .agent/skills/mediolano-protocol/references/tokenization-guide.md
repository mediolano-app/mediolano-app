# Tokenization Guide

Complete reference for tokenizing intellectual property using the Mediolano Protocol.

## Overview

Tokenization converts intellectual property into on-chain NFTs with:
- **Permanent ownership records** on Starknet
- **Immutable metadata** stored on IPFS
- **Full provenance tracking**
- **Zero protocol fees**

---

## Tokenization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TOKENIZATION FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. PREPARE        2. UPLOAD         3. BUILD       4. MINT    │
│  ┌─────────┐      ┌─────────┐       ┌─────────┐    ┌─────────┐ │
│  │ Content │  →   │  IPFS   │   →   │   TX    │ →  │ On-Chain│ │
│  │ + Meta  │      │  CIDs   │       │  Call   │    │   NFT   │ │
│  └─────────┘      └─────────┘       └─────────┘    └─────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Prepare Content

### Supported IP Types

| Type | Examples | Recommended Format |
|------|----------|-------------------|
| Art | Illustrations, photography | PNG, JPEG, SVG, WebP |
| Audio | Music, podcasts | MP3, WAV, FLAC |
| Video | Films, animations | MP4, WebM |
| Document | Books, papers | PDF, Markdown |
| Patent | Technical inventions | PDF + JSON |
| Software | Code, apps | ZIP, Git repo |

### Metadata Preparation

Metadata follows **OpenSea/ERC-721 standards**. All IP-specific fields are stored in the `attributes` array:

```typescript
interface TokenizationInput {
  // Top-level fields (OpenSea standard)
  name: string;           // Asset name
  description: string;    // Description
  image: string;          // Cover image (IPFS URI)
  external_url?: string;  // Link back to platform
  
  // All other metadata goes in attributes
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

// IP-specific attributes
const ipAttributes = [
  { trait_type: "Type", value: "art" },
  { trait_type: "Author", value: "Creator Name" },
  { trait_type: "License", value: "CC-BY-4.0" },
  { trait_type: "License-Details", value: "Attribution required" },
  { trait_type: "Commercial", value: "Yes" },
  { trait_type: "Modifications", value: "Allowed" },
  { trait_type: "Attribution", value: "Required" },
  { trait_type: "Registration", value: "2024-01-15" },
  { trait_type: "Status", value: "Registered" },
  { trait_type: "Tags", value: "digital, art" },
];
```

---

## Step 2: Upload to IPFS

### Upload Content File

```typescript
import { PinataSDK } from 'pinata';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
});

// Upload the artwork/content file
async function uploadContent(file: File) {
  const response = await pinata.upload.file(file);
  return `ipfs://${response.IpfsHash}`;
}
```

### Create & Upload Metadata

```typescript
async function createMetadata(
  name: string,
  description: string, 
  contentUri: string,
  options: {
    type: string;
    author: string;
    license: string;
    licenseDetails?: string;
    commercialUse?: boolean;
    modifications?: string;
    attribution?: string;
    tags?: string[];
  }
) {
  // Build OpenSea-compatible metadata
  const metadata = {
    name,
    description,
    image: contentUri,
    external_url: `https://mediolano.app/asset/${Date.now()}`,
    attributes: [
      { trait_type: "Type", value: options.type },
      { trait_type: "Author", value: options.author },
      { trait_type: "License", value: options.license },
      { trait_type: "License-Details", value: options.licenseDetails || "" },
      { trait_type: "Commercial", value: options.commercialUse ? "Yes" : "No" },
      { trait_type: "Modifications", value: options.modifications || "Not specified" },
      { trait_type: "Attribution", value: options.attribution || "Not specified" },
      { trait_type: "Tags", value: options.tags?.join(", ") || "" },
      { trait_type: "Registration", value: new Date().toISOString().split("T")[0] },
      { trait_type: "Status", value: "Registered" },
      { trait_type: "Network", value: "Starknet" },
    ],
  };
  
  const response = await pinata.upload.json(metadata);
  return `ipfs://${response.IpfsHash}`;
}
```

---

## Step 3: Build Transaction

### Using Existing Collection

```typescript
import { getSDK } from '@/sdk';

const sdk = getSDK();

function buildMintTransaction(
  collectionId: string,
  recipient: `0x${string}`,
  tokenUri: string
) {
  return sdk.collections.buildMintCall({
    collectionId,
    recipient,
    tokenUri,
  });
}
```

### Creating New Collection First

```typescript
// Step 1: Create collection
function buildCreateCollection(
  name: string,
  symbol: string,
  collectionMetadataUri: string
) {
  return sdk.collections.buildCreateCollectionCall({
    name,
    symbol,
    baseUri: collectionMetadataUri,
  });
}

// Step 2: After collection creation, mint into it
// Note: You need to get the collection ID from the creation event
```

---

## Step 4: Execute Transaction

### Using starknet-react (Frontend)

```typescript
import { useSendTransaction, useAccount } from '@starknet-react/core';

function TokenizeButton({ mintCall }) {
  const { address } = useAccount();
  const { sendAsync, isPending } = useSendTransaction({ calls: [] });
  
  const handleTokenize = async () => {
    try {
      const result = await sendAsync([mintCall]);
      console.log('Transaction:', result.transaction_hash);
    } catch (error) {
      console.error('Failed:', error);
    }
  };
  
  return (
    <button onClick={handleTokenize} disabled={isPending}>
      {isPending ? 'Tokenizing...' : 'Tokenize IP'}
    </button>
  );
}
```

### Using Account Directly (Backend/Scripts)

```typescript
import { Account, RpcProvider } from 'starknet';

async function executeTokenization(mintCall: any) {
  const provider = new RpcProvider({ nodeUrl: process.env.RPC_URL });
  
  const account = new Account(
    provider,
    process.env.ACCOUNT_ADDRESS,
    process.env.PRIVATE_KEY
  );
  
  const result = await account.execute([mintCall]);
  
  // Wait for confirmation
  await provider.waitForTransaction(result.transaction_hash);
  
  return result.transaction_hash;
}
```

---

## Complete Example

```typescript
import { getSDK } from '@/sdk';
import { PinataSDK } from 'pinata';

const sdk = getSDK();
const pinata = new PinataSDK({ /* config */ });

async function tokenizeArtwork(
  file: File,
  name: string,
  description: string,
  author: string,
  license: string,
  collectionId: string,
  recipient: `0x${string}`
) {
  // 1. Upload artwork to IPFS
  console.log('📤 Uploading artwork...');
  const uploadResponse = await pinata.upload.file(file);
  const imageUri = `ipfs://${uploadResponse.IpfsHash}`;
  
  // 2. Create OpenSea-compatible metadata
  console.log('📝 Creating metadata...');
  const metadata = {
    name,
    description,
    image: imageUri,
    external_url: `https://mediolano.app/asset/${Date.now()}`,
    attributes: [
      { trait_type: "Type", value: "art" },
      { trait_type: "Author", value: author },
      { trait_type: "License", value: license },
      { trait_type: "Commercial", value: "Yes" },
      { trait_type: "Format", value: file.type },
      { trait_type: "Size", value: `${(file.size / 1024).toFixed(1)} KB` },
      { trait_type: "Registration", value: new Date().toISOString().split("T")[0] },
      { trait_type: "Status", value: "Registered" },
      { trait_type: "Network", value: "Starknet" },
    ],
  };
  
  // 3. Upload metadata to IPFS
  console.log('📤 Uploading metadata...');
  const metaResponse = await pinata.upload.json(metadata);
  const tokenUri = `ipfs://${metaResponse.IpfsHash}`;
  
  // 4. Build mint transaction
  console.log('🔨 Building transaction...');
  const mintCall = sdk.collections.buildMintCall({
    collectionId,
    recipient,
    tokenUri,
  });
  
  // 5. Execute (using sendAsync from starknet-react)
  console.log('⛓️ Minting on-chain...');
  const result = await sendAsync([mintCall]);
  
  console.log('✅ Tokenized!');
  console.log(`   TX: ${result.transaction_hash}`);
  console.log(`   Image: ${imageUri}`);
  console.log(`   Metadata: ${tokenUri}`);
  
  return {
    transactionHash: result.transaction_hash,
    imageUri,
    tokenUri,
  };
}
```

---

## Batch Tokenization

For multiple assets at once:

```typescript
async function batchTokenize(
  assets: Array<{ name: string; description: string; imageUri: string }>,
  collectionId: string,
  recipients: `0x${string}`[]
) {
  // 1. Upload all metadata
  const tokenUris = await Promise.all(
    assets.map(async (asset) => {
      const metadata = {
        name: asset.name,
        description: asset.description,
        image: asset.imageUri,
        registrationDate: new Date().toISOString(),
      };
      const response = await pinata.upload.json(metadata);
      return `ipfs://${response.IpfsHash}`;
    })
  );
  
  // 2. Build batch mint
  const batchMintCall = sdk.collections.buildBatchMintCall({
    collectionId,
    recipients,
    tokenUris,
  });
  
  // 3. Execute
  return await sendAsync([batchMintCall]);
}
```

---

## License Selection

### Creative Commons

| License | Commercial Use | Derivatives | Share-Alike |
|---------|---------------|-------------|-------------|
| CC0 | ✅ | ✅ | ❌ |
| CC-BY | ✅ | ✅ | ❌ |
| CC-BY-SA | ✅ | ✅ | ✅ |
| CC-BY-NC | ❌ | ✅ | ❌ |
| CC-BY-NC-SA | ❌ | ✅ | ✅ |
| CC-BY-ND | ✅ | ❌ | ❌ |
| CC-BY-NC-ND | ❌ | ❌ | ❌ |

### Software Licenses

| License | Commercial | Open Source | Copyleft |
|---------|-----------|-------------|----------|
| MIT | ✅ | ✅ | ❌ |
| Apache-2.0 | ✅ | ✅ | ❌ |
| GPL-3.0 | ✅ | ✅ | ✅ |
| BSD-3 | ✅ | ✅ | ❌ |

### Setting License in Attributes

```typescript
const metadata = {
  name: "My Software",
  description: "Open source library",
  image: "ipfs://QmImage",
  external_url: "https://github.com/user/repo",
  attributes: [
    { trait_type: "Type", value: "software" },
    { trait_type: "License", value: "MIT" },
    { trait_type: "License-Details", value: "Free to use, modify, and distribute" },
    { trait_type: "Commercial", value: "Yes" },
    { trait_type: "Modifications", value: "Allowed" },
    { trait_type: "Attribution", value: "Required" },
    // ...
  ],
};
```

---

## Validation

### Before Tokenization

```typescript
function validateInput(input: TokenizationInput): string[] {
  const errors: string[] = [];
  
  if (!input.name?.trim()) {
    errors.push('Name is required');
  }
  
  if (input.name && input.name.length > 100) {
    errors.push('Name must be 100 characters or less');
  }
  
  if (!input.description?.trim()) {
    errors.push('Description is required');
  }
  
  return errors;
}
```

### IPFS CID Validation

```typescript
function isValidCID(cid: string): boolean {
  const cleanCid = cid.replace('ipfs://', '');
  
  // CIDv0 (Qm...)
  if (cleanCid.startsWith('Qm') && cleanCid.length === 46) {
    return true;
  }
  
  // CIDv1 (bafy... or bafk...)
  if ((cleanCid.startsWith('bafy') || cleanCid.startsWith('bafk')) && cleanCid.length >= 46) {
    return true;
  }
  
  return false;
}
```

---

## Fees

| Fee Type | Amount |
|----------|--------|
| Protocol Fee | **$0** |
| Minting Fee | **$0** |
| IPFS Storage | Varies by provider |
| Gas Fee | ~0.001 STRK |

> **Note:** The only costs are IPFS storage (if using paid tier) and Starknet gas fees.

---

## Troubleshooting

### "Collection does not exist"
- Verify the collection ID is correct
- Ensure the collection was successfully created

### "Not collection owner"
- Only the collection owner can mint
- Check wallet address matches owner

### "IPFS fetch failed"
- Verify the CID is correct
- Try different IPFS gateways
- Check if content is pinned

### "Transaction failed"
- Ensure sufficient STRK for gas
- Check transaction parameters
- Verify wallet is connected

---

> See also: [collection-guide.md](collection-guide.md) | [asset-guide.md](asset-guide.md) | [licensing-guide.md](licensing-guide.md)
