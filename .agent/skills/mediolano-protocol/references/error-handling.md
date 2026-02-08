# Error Handling Guide

Complete reference for handling errors in the Mediolano SDK.

## Error Types

### SDK Errors

```typescript
interface SDKError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

### Error Codes

| Code | Description | Retryable |
|------|-------------|-----------|
| `PROVIDER_ERROR` | RPC provider issue | ✅ |
| `CONTRACT_ERROR` | Contract call failed | ❌ |
| `INVALID_INPUT` | Invalid parameters | ❌ |
| `NOT_FOUND` | Resource not found | ❌ |
| `NETWORK_ERROR` | Network connectivity | ✅ |
| `CACHE_ERROR` | Cache operation failed | ✅ |
| `TIMEOUT` | Request timed out | ✅ |
| `ABORTED` | Request cancelled | ❌ |

---

## Common Errors

### Collection Not Found

```typescript
try {
  const collection = await sdk.collections.getCollection('99999');
} catch (error) {
  if (error.message.includes('does not exist')) {
    console.log('Collection not found');
    // Show "not found" UI
  }
}
```

### Invalid Address

```typescript
try {
  const assets = await sdk.assets.getUserAssets(
    'invalid-address',  // Not a valid address
    userAddress
  );
} catch (error) {
  if (error.message.includes('invalid')) {
    console.log('Invalid address format');
    // Show validation error
  }
}
```

### Network Timeout

```typescript
try {
  const collections = await sdk.collections.getAllCollections();
} catch (error) {
  if (error.name === 'AbortError' || error.message.includes('timeout')) {
    console.log('Request timed out');
    // Retry or show timeout message
  }
}
```

### IPFS Fetch Failed

```typescript
import { fetchIPFSMetadata } from '@/sdk/utils';

try {
  const metadata = await fetchIPFSMetadata(cid);
} catch (error) {
  console.log('Failed to fetch from IPFS');
  // Use fallback metadata
  return { name: 'Unknown', image: '/placeholder.svg' };
}
```

---

## Error Handling Patterns

### Basic Try-Catch

```typescript
async function getCollectionSafe(id: string) {
  try {
    return await sdk.collections.getCollection(id);
  } catch (error) {
    console.error('Failed to get collection:', error);
    return null;
  }
}
```

### With Error Classification

```typescript
async function getCollectionWithErrorType(id: string) {
  try {
    return {
      success: true,
      data: await sdk.collections.getCollection(id),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    if (message.includes('does not exist')) {
      return { success: false, error: 'not_found' };
    }
    if (message.includes('invalid')) {
      return { success: false, error: 'invalid_input' };
    }
    if (message.includes('timeout')) {
      return { success: false, error: 'timeout' };
    }
    
    return { success: false, error: 'unknown' };
  }
}
```

### With Retry Logic

```typescript
async function getWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry non-retryable errors
      if (
        lastError.message.includes('does not exist') ||
        lastError.message.includes('invalid')
      ) {
        throw lastError;
      }
      
      // Wait before retry
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError;
}

// Usage
const collection = await getWithRetry(() => 
  sdk.collections.getCollection('1')
);
```

### With Fallback

```typescript
async function getCollectionOrDefault(id: string): Promise<Collection> {
  try {
    return await sdk.collections.getCollection(id);
  } catch {
    return {
      id,
      name: 'Unknown Collection',
      description: 'Failed to load collection',
      image: '/placeholder.svg',
      owner: '0x0',
      nftAddress: '0x0',
      isActive: false,
      totalMinted: 0,
      totalBurned: 0,
      totalTransfers: 0,
      itemCount: 0,
      totalSupply: 0,
      lastMintTime: '',
      lastBurnTime: '',
      lastTransferTime: '',
    } as Collection;
  }
}
```

---

## React Error Handling

### Error Boundary

```typescript
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

class SDKErrorBoundary extends Component<Props, State> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error) {
    console.error('SDK Error:', error);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

### Hook with Error State

```typescript
function useCollection(id: string) {
  const [data, setData] = useState<Collection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        setError(null);
        const collection = await sdk.collections.getCollection(id);
        setData(collection);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    
    fetch();
  }, [id]);
  
  return { data, error, loading };
}
```

---

## API Route Error Handling

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const sdk = getSDK();
    const data = await sdk.collections.getAllCollections();
    
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    // Determine status code
    let status = 500;
    if (message.includes('does not exist')) status = 404;
    if (message.includes('invalid')) status = 400;
    if (message.includes('timeout')) status = 504;
    
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
```

---

## Transaction Errors

### Building Transaction

```typescript
try {
  const call = sdk.collections.buildCreateCollectionCall({
    name: '',  // Empty name
    baseUri: 'ipfs://...',
  });
} catch (error) {
  // "Collection name is required"
  console.log('Validation error:', error.message);
}
```

### Executing Transaction

```typescript
try {
  const result = await sendAsync([mintCall]);
  console.log('Success:', result.transaction_hash);
} catch (error) {
  if (error.message.includes('insufficient')) {
    console.log('Not enough STRK for gas');
  } else if (error.message.includes('rejected')) {
    console.log('User rejected transaction');
  } else if (error.message.includes('reverted')) {
    console.log('Transaction reverted');
  }
}
```

---

## Logging & Monitoring

### Debug Logging

```typescript
const sdk = createSDK({
  // ...
  debug: true,  // Enable SDK debug logs
});
```

### Custom Error Logger

```typescript
function logError(context: string, error: unknown) {
  const timestamp = new Date().toISOString();
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  
  console.error(JSON.stringify({
    timestamp,
    context,
    message,
    stack,
  }));
  
  // Send to error tracking service
  // errorTracker.capture(error, { context });
}
```

---

## Error Messages Reference

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Collection X does not exist" | Invalid collection ID | Verify ID is correct |
| "Collection name is required" | Empty name parameter | Provide non-empty name |
| "Base URI is required" | Missing IPFS URI | Upload metadata to IPFS first |
| "Wallet not connected" | No wallet connection | Connect wallet first |
| "Contract not available" | Contract init failed | Check contract address |
| "Token not found" | Invalid token ID | Verify token exists |
| "Not collection owner" | Wrong wallet | Switch to owner wallet |
| "Request aborted" | Request cancelled | Don't cancel request |
| "timeout" | Slow RPC response | Increase timeout or retry |

---

> See also: [configuration.md](configuration.md) | [tokenization-guide.md](tokenization-guide.md)
