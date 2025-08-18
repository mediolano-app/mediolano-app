# Multi-Network Integration Guide

This document describes the implementation of multi-network support for Starknet Sepolia Testnet and Mainnet in the Mediolano dApp.

## Overview

The dApp now supports seamless operation across both Starknet Sepolia Testnet and Mainnet with:

- ✅ **Network Detection and Switching**: Automatic detection of current network with user-friendly switching
- ✅ **Dynamic Contract Configuration**: Network-specific contract addresses with fallback handling
- ✅ **Network-Aware Tokenization**: Content tokenization workflows that adapt to the current network
- ✅ **Comprehensive Error Handling**: Robust error handling with user-friendly recovery options
- ✅ **Network Status UI**: Clear network status indicators and user guidance
- ✅ **Fallback Support**: Graceful handling of unsupported networks

## Architecture

### Core Components

1. **Network Configuration System** (`src/lib/constants.ts`)
   - Centralized network and contract configuration
   - Environment variable management
   - Network-specific RPC and explorer URLs

2. **Network Context Provider** (`src/components/starknet-provider.tsx`)
   - Enhanced Starknet provider with network switching
   - Network validation and error handling
   - Persistent network preferences

3. **Network Configuration Hook** (`src/hooks/useNetworkConfig.ts`)
   - Network-aware contract addresses
   - Validation utilities
   - Helper functions for URLs and status

4. **Tokenization Service** (`src/services/tokenization.ts`)
   - Network-aware content tokenization
   - Validation and recommendation logic
   - Error handling with recovery options

## Configuration

### Environment Variables

Create network-specific environment variables in your `.env` file:

```bash
# Sepolia Testnet Contract Addresses
NEXT_PUBLIC_CONTRACT_ADDRESS_MIP_SEPOLIA=0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0
NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS_SEPOLIA=0x00d2583f8b3159ee0cda451c26096a819308f1cb921ad206f9ecf6839dc5b0e3
NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS_SEPOLIA=0x055f444b1ace8bec6d79ceb815a8733958e9ceaa598160af291a7429e0146a74

# Mainnet Contract Addresses (TO BE DEPLOYED)
NEXT_PUBLIC_CONTRACT_ADDRESS_MIP_MAINNET=
NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS_MAINNET=
NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS_MAINNET=

# Network-specific RPC URLs
NEXT_PUBLIC_RPC_URL_SEPOLIA=https://starknet-sepolia.public.blastapi.io/rpc/v0_7
NEXT_PUBLIC_RPC_URL_MAINNET=https://starknet-mainnet.public.blastapi.io/rpc/v0_7
```

### Contract Deployment

1. **Sepolia Testnet**: Contracts are already deployed and configured
2. **Mainnet**: Deploy contracts and update environment variables

## Usage

### Basic Network Operations

```typescript
import { useNetworkConfig } from '@/hooks/useNetworkConfig';
import { useNetwork } from '@/components/starknet-provider';

function MyComponent() {
  const { currentNetwork, switchNetwork } = useNetwork();
  const { contractAddresses, validation, isProductionReady } = useNetworkConfig();

  // Switch networks
  const handleSwitchToMainnet = async () => {
    await switchNetwork('mainnet');
  };

  // Check if tokenization is available
  if (validation.isValid) {
    // Proceed with tokenization
  }
}
```

### Tokenization Workflow

```typescript
import { TokenizationService } from '@/services/tokenization';

// Validate network before tokenization
const validation = TokenizationService.validateNetwork(currentNetwork);
if (!validation.isValid) {
  // Handle unsupported network
  const recommended = TokenizationService.getRecommendedNetwork(currentNetwork);
  // Suggest switching to recommended network
}

// Tokenize content
const result = await TokenizationService.tokenizeContent({
  account,
  network: currentNetwork,
  metadata: {
    name: "My Content",
    description: "Content description",
    // ... other metadata
  }
});
```

### Error Handling

```typescript
import { useNetworkErrorHandler } from '@/hooks/useNetworkErrorHandler';

function MyComponent() {
  const { handleError } = useNetworkErrorHandler();

  const performNetworkOperation = async () => {
    try {
      // Network operation
    } catch (error) {
      const { networkError, recoveryActions } = await handleError(error, {
        showToast: true,
        autoRetry: true
      });
      
      // Handle specific error types
      if (networkError.code === 'CONTRACT_NOT_CONFIGURED') {
        // Suggest network switch
      }
    }
  };
}
```

## UI Components

### Network Status Display

```typescript
import { NetworkStatus } from '@/components/network/network-status';

// Simple status indicator
<NetworkStatus />

// Detailed status card
<NetworkStatus showDetails={true} />
```

### Network Warning

```typescript
import { NetworkWarning } from '@/components/network/network-warning';

// Automatic warning for unsupported networks
<NetworkWarning onNetworkSwitch={handleNetworkSwitch} />
```

### Error Boundary

```typescript
import { NetworkErrorBoundary } from '@/components/error/network-error-boundary';

// Wrap components that might have network errors
<NetworkErrorBoundary>
  <TokenizationComponent />
</NetworkErrorBoundary>
```

## Testing

### Running Tests

```bash
# Run network-specific tests
npm test src/__tests__/network/

# Run all tests
npm test
```

### Test Coverage

- ✅ Network configuration validation
- ✅ Contract address resolution
- ✅ Network switching logic
- ✅ Error handling scenarios
- ✅ Tokenization workflows
- ✅ UI component behavior

## Best Practices

### 1. Always Validate Network

```typescript
// Before any contract interaction
const { validation } = useNetworkConfig();
if (!validation.isValid) {
  // Handle unsupported network
  return;
}
```

### 2. Provide User Guidance

```typescript
// Show network warnings
<NetworkWarning />

// Guide users to supported networks
const recommended = TokenizationService.getRecommendedNetwork(currentNetwork);
if (recommended !== currentNetwork) {
  // Suggest switching
}
```

### 3. Handle Errors Gracefully

```typescript
// Use error boundary for network operations
<NetworkErrorBoundary>
  <NetworkSensitiveComponent />
</NetworkErrorBoundary>

// Provide recovery actions
const { handleError } = useNetworkErrorHandler();
```

### 4. Test Both Networks

```typescript
// Test on both networks
describe('Multi-network functionality', () => {
  ['sepolia', 'mainnet'].forEach(network => {
    it(`should work on ${network}`, () => {
      // Test network-specific behavior
    });
  });
});
```

## Deployment Checklist

### Sepolia Testnet
- [x] Smart contracts deployed
- [x] Environment variables configured
- [x] RPC endpoints configured
- [x] Faucet integration working
- [x] Gas sponsorship enabled

### Mainnet
- [ ] Smart contracts deployed
- [ ] Environment variables configured
- [ ] RPC endpoints configured
- [ ] Production monitoring setup
- [ ] Gas optimization verified

## Troubleshooting

### Common Issues

1. **Contract Not Found**
   - Check environment variables
   - Verify contract deployment
   - Switch to supported network

2. **RPC Connection Failed**
   - Check RPC URL configuration
   - Verify network connectivity
   - Try alternative RPC endpoints

3. **Transaction Failed**
   - Check wallet connection
   - Verify sufficient funds
   - Check gas settings

### Debug Mode

Enable debug logging:

```typescript
// In development
localStorage.setItem('debug-network', 'true');
```

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review test cases for examples
3. Check network status components
4. Contact development team

## Future Enhancements

- [ ] Additional network support (Devnet)
- [ ] Advanced gas optimization
- [ ] Network performance monitoring
- [ ] Automated contract deployment
- [ ] Enhanced error recovery
