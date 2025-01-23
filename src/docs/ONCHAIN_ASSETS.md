# Onchain Assets Documentation

This document provides detailed information about how onchain assets are managed in the Mediolano dApp.

## Overview

The Mediolano dApp uses a custom React hook `useAssets` to manage and display intellectual property assets stored on the Starknet blockchain. The system supports both real blockchain data and test data for development purposes.

## Features

- **Real-time Asset Loading**: Automatically fetches and updates asset data from the blockchain
- **Test Data Support**: Provides sample assets for development and testing
- **Pagination**: Handles large collections of assets efficiently
- **Real-time Updates**: Supports polling for live updates
- **Error Handling**: Robust error management with fallback to test data
- **Search & Sort**: Built-in support for filtering and sorting assets

## Usage

### Basic Implementation

```typescript
import { useAssets } from "@/hooks/useAssets";

function AssetsGallery() {
  const { assets, loading, error, totalAssets, fetchAssets, isTestData } = useAssets();

  // Use the assets data in your component
}
```

### Configuration Options

The `useAssets` hook accepts the following options:

```typescript
interface UseAssetsOptions {
  pageSize?: number; // Number of assets per page (default: 12)
  useTestData?: boolean; // Enable test data mode (default: true)
  pollingInterval?: number; // Update interval in ms (default: 5000)
}
```

### Return Values

```typescript
interface UseAssetsReturn {
  assets: Asset[]; // Current page of assets
  loading: boolean; // Loading state
  error: Error | null; // Error state
  totalAssets: number; // Total number of assets
  fetchAssets: (page: number) => void; // Function to fetch specific page
  isTestData: boolean; // Indicates if showing test data
  isPolling: boolean; // Current polling state
  startPolling: () => void; // Start real-time updates
  stopPolling: () => void; // Stop real-time updates
}
```

### Asset Structure

Each asset follows this structure:

```typescript
interface Asset {
  id: string; // Unique identifier
  uri: string; // Asset URI (usually IPFS)
  owner: string; // Owner's address
  name: string; // Asset name
  description?: string; // Optional description
}
```

## Test Data

The system includes sample test assets for development:

```typescript
const TEST_ASSETS = [
  {
    id: "1",
    uri: "https://picsum.photos/400/400?random=1",
    owner: "0x123...abc",
    name: "Test IP Asset #1",
    description: "A sample intellectual property asset",
  },
  // ... more test assets
];
```

## Smart Contract Integration

The system integrates with a Starknet smart contract for managing assets:

- Contract functions used:
  - `current()`: Gets total number of assets
  - `token_uri(tokenId)`: Gets asset URI
  - `ownerOf(tokenId)`: Gets asset owner

## Error Handling

The system handles various error scenarios:

- Contract initialization failures
- Network connectivity issues
- Wallet connection problems
- Invalid data responses

When errors occur with real data and `useTestData` is enabled, the system automatically falls back to test data.

## Real-time Updates

The polling system automatically:

- Starts when a wallet is connected
- Stops when using test data
- Updates at configurable intervals (default: 5 seconds)
- Can be manually controlled with `startPolling()` and `stopPolling()`

## Best Practices

1. **Enable Test Data During Development**

   ```typescript
   const { assets } = useAssets({ useTestData: true });
   ```

2. **Adjust Page Size for Performance**

   ```typescript
   const { assets } = useAssets({ pageSize: 8 }); // Smaller pages for faster loading
   ```

3. **Custom Polling Intervals**

   ```typescript
   const { assets } = useAssets({ pollingInterval: 10000 }); // 10 second updates
   ```

4. **Error Handling**
   ```typescript
   const { error, assets } = useAssets();
   if (error) {
     // Handle error appropriately
   }
   ```

## Development Notes

- Test data is automatically used when no wallet is connected
- Real data requires a connected wallet and valid contract address
- Pagination is handled automatically based on the page size
- Asset URIs typically point to IPFS content
- The system supports both mainnet and testnet configurations
