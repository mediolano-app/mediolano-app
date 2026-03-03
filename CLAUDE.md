# CLAUDE.md — Mediolano IP Creator dApp

## Project Overview
Permissionless IP Creator dApp on Starknet. Users tokenize, license, provenance-track, and trade intellectual property as on-chain assets. Live at https://ip.mediolano.app

**Stack:** Next.js 14 (App Router), React 19 RC, TypeScript, Tailwind + shadcn/ui
**Blockchain:** Starknet (Mainnet + Sepolia), starknet.js v8, starknet-react v5, StarkZap v1

---

## Essential Commands

```bash
npm run dev     # Start development server (port 3000)
npm run build   # Production build
npm run lint    # ESLint
```

> **No test runner is configured.** There are no test files. Do not run `npm test`.

---

## TypeScript Policy

There are **~54 pre-existing TS errors** in the codebase. The next.config.ts sets `typescript: { ignoreBuildErrors: true }` so builds always succeed.

- **Never introduce new errors** in files you create or modify
- Run `npx tsc --noEmit 2>&1 | grep "error TS" | wc -l` to confirm the count stays at 54
- Use `// eslint-disable-next-line @typescript-eslint/no-explicit-any` for intentional `any` casts (e.g. StarkZap v8/v9 boundary)

---

## Critical: StarkZap v8/v9 Boundary

StarkZap (`starkzap: ^1.0.0`) bundles **starknet v9** at `node_modules/starkzap/node_modules/starknet`.
The app uses **starknet v8** via starknet-react. These two stacks coexist:

- **Never** pass `Account`, `Provider`, or starknet class instances across the boundary
- **Always** use plain strings (addresses as `string`, tx hashes as `string`)
- Use `sdk.getProvider() as any` when the StarkZap API requires its internal provider type
- Use `fromAddress(addrString)` to convert plain strings to StarkZap's branded `Address` type
- Use `wallet.address as unknown as string` to extract the address back to a plain string

---

## Wallet Architecture

Three parallel wallet stacks — all can coexist:

| Stack | Wallets | Hook/Context |
|-------|---------|--------------|
| starknet-react | Argent, Braavos | `useAccount()`, `useDisconnect()` |
| StarkZap Cartridge | Cartridge Controller | `useStarkZapWallet()` |
| StarkZap Privy | Email / Google / Twitter | `useStarkZapWallet()` |

**Provider order in `layout.tsx`:**
```
PrivyProvider → StarkZapWalletProvider → ThemeProvider → StarknetProvider
```

**Unified abstraction:** `useUnifiedWallet()` in `src/hooks/useUnifiedWallet.ts`
— normalises all three into `{ address, isConnected, walletType, execute, disconnect }`
— Priority: StarkZap wallet > starknet-react injected

**Important starknet-react API note:** `disconnect` is NOT on `useAccount()` — import it separately from `useDisconnect()`.

---

## Key File Map

```
src/
├── app/
│   ├── layout.tsx                    # Root layout — provider hierarchy
│   ├── page.tsx                      # Home / landing
│   ├── api/
│   │   ├── wallet/starknet/route.ts  # Privy: get/create Starknet wallet
│   │   ├── wallet/sign/route.ts      # Privy: server-side rawSign
│   │   ├── forms-ipfs/               # Upload files to IPFS
│   │   ├── forms-create-*/           # Asset creation by IP type
│   │   ├── uploadmeta/               # Upload NFT metadata JSON
│   │   └── sdk/                      # MediolanoSDK API endpoints
│   ├── create/                       # Asset & collection creation flow
│   ├── portfolio/                    # User portfolio
│   ├── collections/                  # Collection gallery & detail
│   ├── asset/[slug]/                 # Asset detail
│   ├── burn/                         # Burn IP asset
│   ├── transfer/                     # Transfer IP
│   └── provenance/[assetId]/         # Provenance tracking
├── components/
│   ├── starknet-provider.tsx         # StarknetConfig + NetworkContext
│   ├── header/wallet-connect.tsx     # 3-option connect modal
│   ├── ui/                           # 54 shadcn/Radix primitives
│   ├── asset-creation/               # 16 creation form components
│   └── asset/                        # Asset display components
├── contexts/
│   └── starkzap-wallet-context.tsx   # Cartridge + Privy wallet state
├── hooks/
│   ├── useUnifiedWallet.ts           # Cross-stack wallet abstraction
│   ├── useStaking.ts                 # STRK delegation staking
│   ├── useTokenBalance.ts            # ERC20 balances via StarkZap
│   ├── useTxTracker.ts               # Real-time tx monitoring
│   ├── usePaymasterMinting.ts        # AVNU-sponsored mints
│   ├── usePaymasterTransaction.ts    # AVNU-sponsored txs
│   ├── use-collection.ts             # Collection data (large, 28 KB)
│   ├── useActivities.ts              # Activity feed (23 KB)
│   └── useUserActivities.ts          # Per-user activity (24 KB)
├── lib/
│   ├── constants.ts                  # Contract addresses, AVNU config, IP types
│   ├── starkzap.ts                   # StarkZap SDK singleton + token presets
│   └── types.ts                      # Core domain types
├── sdk/
│   ├── index.ts                      # getSDK() singleton
│   ├── services/collection-service.ts
│   └── services/asset-service.ts
├── utils/
│   └── paymaster.ts                  # AVNU paymaster helpers
├── abis/                             # 10 Cairo contract ABIs
└── types/                            # TS types: asset, marketplace, paymaster
```

---

## Smart Contracts (Mainnet)

| Contract | Address |
|----------|---------|
| MIP Collection | `0x05e73b7be06d82beeb390a0e0d655f2c9e7cf519658e04f05d9c690ccc41da03` |
| User Settings  | `0x07c8422f0957f72bf3ced2911be762607ab0a52bc18d9a5de13a55ea0a593c13` |

Token addresses (STRK/ETH/USDC/USDT) are in `src/lib/constants.ts` under `AVNU_PAYMASTER_CONFIG.SUPPORTED_GAS_TOKENS` and also in `src/lib/starkzap.ts` as `STARKZAP_TOKENS`.

---

## Environment Variables

**Required for core functionality:**
```
NEXT_PUBLIC_APP_URL=https://ip.mediolano.app
NEXT_PUBLIC_STARKNET_NETWORK=mainnet          # or sepolia
NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS=0x05e7...
NEXT_PUBLIC_PRIVY_APP_ID=<privy-app-id>
PRIVY_APP_SECRET=<privy-secret>               # SERVER ONLY
```

**Optional / feature flags:**
```
NEXT_PUBLIC_RPC_URL=                          # Custom RPC
NEXT_PUBLIC_AVNU_PAYMASTER_API_KEY=           # AVNU gasless (NEXT_PUBLIC_ prefix required!)
NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP=false
NEXT_PUBLIC_SPONSOR_MINTING=false
NEXT_PUBLIC_SPONSOR_TRANSFERS=false
NEXT_PUBLIC_SPONSOR_MARKETPLACE=false
PINATA_JWT=                                   # IPFS uploads
NEXT_PUBLIC_GATEWAY_URL=https://ipfs.io/ipfs
NEXT_PUBLIC_START_BLOCK=                      # Skip empty history
```

> `.env.local` is gitignored. Never commit secrets.

---

## AVNU Paymaster

Gasless transactions are opt-in per operation type. Before calling paymaster functions:
1. Check `GAS_SPONSORSHIP_CONFIG.ENABLED` and the relevant flag (`SPONSOR_MINTING`, etc.)
2. Use `shouldSponsorTransaction(type)` from `src/utils/paymaster.ts`
3. `executeGaslessTransaction()` — user picks gas token
4. `executeSponsoredTransaction()` — app pays via API key

The paymaster requires the AVNU key as `NEXT_PUBLIC_AVNU_PAYMASTER_API_KEY` (not `AVNU_PAYMASTER_API_KEY`).

---

## MediolanoSDK

Singleton at `src/sdk/index.ts`. Use `getSDK()` to get the shared instance:

```typescript
import { getSDK } from '@/sdk';
const sdk = getSDK();
const collections = await sdk.collections.getAllCollections();
const asset = await sdk.assets.getAsset('0x...', tokenId);
```

The SDK wraps the Starknet RPC provider with an internal cache layer. Call `sdk.clearCache()` after write operations.

---

## Privy Server-Side API Pattern

For `@privy-io/node` (not `@privy-io/server-auth`):

```typescript
import { PrivyClient } from "@privy-io/node";
const privy = new PrivyClient({ appId, appSecret });

// Verify access token → get user_id
const { user_id } = await privy.utils().auth().verifyAccessToken(token);

// List Starknet wallets for user
for await (const w of privy.wallets().list({ user_id, chain_type: "starknet" })) { ... }

// Create wallet
await privy.wallets().create({ chain_type: "starknet", owner: { user_id } });

// Raw sign (for StarkZap PrivySigner callback)
const result = await privy.wallets().rawSign(walletId, { params: { hash } });
// → result.signature
```

---

## IP Types

12 supported types (from `src/lib/constants.ts`):
`Audio, Art, Documents, NFT, Video, Patents, Posts, Publications, RWA, Software, Custom, Generic`

---

## Coding Conventions

- **Components:** `"use client"` only when needed (hooks, events, browser APIs)
- **Path alias:** `@/` maps to `src/` (e.g. `@/lib/constants`)
- **Imports from StarkZap:** always import via `starkzap` package, not internal paths
- **Imports from starknet:** always the app's `starknet` v8, not StarkZap's internal one
- **Forms:** react-hook-form + zod for validation
- **State:** local `useState`/`useReducer` first; `zustand` for cross-component state
- **UI:** shadcn/ui primitives in `src/components/ui/` — do not rebuild what's already there
- **No test files** — do not create `*.test.ts` or `*.spec.ts` files
