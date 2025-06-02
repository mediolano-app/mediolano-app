# AVNU Paymaster Integration Guide

## Overview

This document provides comprehensive guidance on the AVNU Paymaster integration with the Mediolano ERC-721 Collections Protocol. The integration enables gas fee abstraction, allowing users to interact with the protocol without holding ETH or STRK tokens.

## Features

### 🎁 Sponsored Transactions
- **Zero gas fees** for users
- Mediolano and partners sponsor transaction costs
- Perfect for user onboarding and engagement
- Configurable sponsorship rules per transaction type

### ⛽ Gasless Transactions
- Pay gas fees with **USDC, USDT, ETH, or STRK**
- No need to hold ETH for gas
- Flexible token selection
- Real-time gas price conversion

### 🔄 Meta-Transactions
- Users sign messages instead of transactions
- Relayers execute transactions on behalf of users
- Enhanced user experience
- Reduced transaction complexity

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Mediolano     │    │  AVNU Paymaster  │    │   Starknet      │
│     dApp        │◄──►│     Service      │◄──►│   Network       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐             ┌────▼────┐             ┌────▼────┐
    │  User   │             │   Gas   │             │ Smart   │
    │Interface│             │ Token   │             │Contract │
    │         │             │ Pricing │             │         │
    └─────────┘             └─────────┘             └─────────┘
```

## Installation

The integration is already installed in the project. To set it up:

1. **Install dependencies** (already done):
```bash
npm install @avnu/gasless-sdk axios
```

2. **Configure environment variables**:
```bash
# Copy the example file
cp .env.example .env.local

# Add your AVNU API key
NEXT_PUBLIC_AVNU_PAYMASTER_API_KEY=your_api_key_here

# Configure sponsorship settings
NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP=true
NEXT_PUBLIC_SPONSOR_MINTING=true
NEXT_PUBLIC_SPONSOR_TRANSFERS=false
NEXT_PUBLIC_SPONSOR_MARKETPLACE=true
```

## Usage

### Basic Paymaster Transaction

```typescript
import { usePaymasterTransaction } from '@/hooks/usePaymasterTransaction';

function MyComponent() {
  const {
    executeGasless,
    executeSponsored,
    executeTransaction,
    isLoading,
    transactionHash,
    error,
    canSponsor,
    gasTokenPrices,
  } = usePaymasterTransaction({
    calls: myTransactionCalls,
    transactionType: "mint",
    enabled: true,
  });

  // Execute gasless transaction
  const handleGasless = async () => {
    await executeGasless(
      "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8", // USDC
      BigInt("1000000") // 1 USDC
    );
  };

  // Execute sponsored transaction
  const handleSponsored = async () => {
    if (canSponsor) {
      await executeSponsored();
    }
  };

  return (
    <div>
      <button onClick={handleSponsored} disabled={!canSponsor}>
        Mint with Sponsorship (FREE)
      </button>
      <button onClick={handleGasless}>
        Mint with USDC
      </button>
    </div>
  );
}
```

### Enhanced Minting with Paymaster

```typescript
import { usePaymasterMinting } from '@/hooks/usePaymasterMinting';

function MintingComponent() {
  const {
    mintWithPaymaster,
    mintSponsored,
    mintTraditional,
    isMinting,
    mintingHash,
    canSponsorMint,
  } = usePaymasterMinting();

  const handleMint = async () => {
    const recipient = "0x123...";
    const tokenURI = "ipfs://QmExample...";

    if (canSponsorMint) {
      // Free minting with sponsorship
      await mintSponsored(recipient, tokenURI);
    } else {
      // Gasless minting with USDC
      await mintWithPaymaster(
        recipient, 
        tokenURI, 
        "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8", // USDC
        BigInt("1000000") // 1 USDC max
      );
    }
  };

  return (
    <button onClick={handleMint} disabled={isMinting}>
      {isMinting ? "Minting..." : "Mint NFT"}
    </button>
  );
}
```

### Gas Token Selection UI

```typescript
import { GasTokenSelector } from '@/components/paymaster/GasTokenSelector';

function TransactionForm() {
  const [selectedToken, setSelectedToken] = useState("");
  const [maxAmount, setMaxAmount] = useState(BigInt(0));

  return (
    <GasTokenSelector
      gasTokenPrices={gasTokenPrices}
      canSponsor={true}
      onTokenSelect={(token, amount) => {
        setSelectedToken(token);
        setMaxAmount(amount);
      }}
      onSponsoredSelect={() => {
        // Handle sponsored transaction
      }}
      onRefreshPrices={refreshPrices}
    />
  );
}
```

## Supported Gas Tokens

| Token | Symbol | Address | Decimals |
|-------|--------|---------|----------|
| USD Coin | USDC | `0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8` | 6 |
| Tether | USDT | `0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8` | 6 |
| Ethereum | ETH | `0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7` | 18 |
| Starknet | STRK | `0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d` | 18 |

## Transaction Types

### Sponsored Transaction Types

1. **NFT Minting** (`mint`)
   - Free minting for new users
   - Configurable via `NEXT_PUBLIC_SPONSOR_MINTING`

2. **Marketplace Transactions** (`marketplace_buy`, `marketplace_list`)
   - Sponsored buying and listing
   - Configurable via `NEXT_PUBLIC_SPONSOR_MARKETPLACE`

3. **Revenue Claiming** (`revenue_claim`)
   - Free revenue distribution claims
   - Encourages ecosystem participation

### Configuration

```typescript
// In src/lib/constants.ts
export const GAS_SPONSORSHIP_CONFIG = {
  ENABLED: process.env.NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP === "true",
  SPONSOR_MINTING: process.env.NEXT_PUBLIC_SPONSOR_MINTING === "true",
  SPONSOR_TRANSFERS: process.env.NEXT_PUBLIC_SPONSOR_TRANSFERS === "true",
  SPONSOR_MARKETPLACE: process.env.NEXT_PUBLIC_SPONSOR_MARKETPLACE === "true",
  MAX_SPONSORED_AMOUNT: process.env.NEXT_PUBLIC_MAX_SPONSORED_AMOUNT || "1000000000000000",
};
```

## API Reference

### Hooks

#### `usePaymasterTransaction`
Main hook for Paymaster transactions.

**Parameters:**
- `calls`: Array of contract calls
- `transactionType`: Type of transaction for sponsorship rules
- `enabled`: Whether the hook is active

**Returns:**
- `executeGasless(tokenAddress, maxAmount)`: Execute with alternative gas token
- `executeSponsored()`: Execute with sponsorship
- `executeTransaction()`: Execute traditional transaction
- `isLoading`: Transaction loading state
- `transactionHash`: Transaction hash when successful
- `error`: Error message if failed
- `canSponsor`: Whether sponsorship is available
- `gasTokenPrices`: Current gas token prices

#### `usePaymasterMinting`
Specialized hook for NFT minting with Paymaster.

#### `usePaymasterMarketplace`
Specialized hook for marketplace transactions with Paymaster.

### Components

#### `GasTokenSelector`
UI component for selecting gas payment method.

#### `TransactionStatus`
Displays transaction status with Paymaster information.

#### `PaymasterDemo`
Complete demo showcasing all Paymaster features.

## Testing

### Demo Page
Visit `/paymaster-demo` to test the integration:

1. **Connect Wallet**: Use Argent or Braavos wallet
2. **Check Compatibility**: Verify gasless compatibility
3. **Try Sponsored Minting**: Free NFT minting
4. **Test Gasless Payments**: Pay with USDC/USDT
5. **Compare Traditional**: Standard ETH gas payments

### Unit Tests
```bash
# Run Paymaster-specific tests
npm test -- --testPathPattern=paymaster

# Run integration tests
npm test -- --testPathPattern=integration
```

## Security Considerations

1. **API Key Protection**: Store AVNU API keys securely
2. **Sponsorship Limits**: Configure maximum sponsored amounts
3. **Transaction Validation**: Validate all transaction parameters
4. **Error Handling**: Implement comprehensive error handling
5. **Rate Limiting**: Monitor and limit sponsored transaction frequency

## Troubleshooting

### Common Issues

1. **"Account not compatible with gasless transactions"**
   - Ensure wallet supports account abstraction
   - Try with Argent or Braavos wallet

2. **"API key required for sponsored transactions"**
   - Add `NEXT_PUBLIC_AVNU_PAYMASTER_API_KEY` to environment
   - Contact AVNU for API key

3. **"Gas token prices not available"**
   - Check network connectivity
   - Verify AVNU service status

4. **"Sponsorship not available"**
   - Check sponsorship configuration
   - Verify transaction type eligibility

### Debug Mode

Enable debug logging:
```typescript
// In your component
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Paymaster Debug:', {
      gasTokenPrices,
      canSponsor,
      isGaslessCompatible,
    });
  }
}, [gasTokenPrices, canSponsor, isGaslessCompatible]);
```

## Resources

- [AVNU Documentation](https://doc.avnu.fi/avnu-paymaster/integration)
- [Starknet Account Abstraction](https://docs.starknet.io/documentation/architecture_and_concepts/Accounts/introduction/)
- [Mediolano Protocol Docs](https://docs.mediolano.xyz)

## Support

For technical support:
- **Discord**: [Mediolano Community](https://discord.gg/NhqdTvyA)
- **Telegram**: [Mediolano Starknet](https://t.me/MediolanoStarknet)
- **Email**: mediolanoapp@gmail.com
