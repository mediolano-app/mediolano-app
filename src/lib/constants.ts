/**
 * Application-wide constants
 */
// Contract addresses
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`;
export const IP_REVENUE_CONTRACT_ADDRESS="0x055f444b1ace8bec6d79ceb815a8733958e9ceaa598160af291a7429e0146a74";

// AVNU Paymaster Configuration
export const AVNU_PAYMASTER_CONFIG = {
  API_BASE_URL: "https://starknet.api.avnu.fi/paymaster/v1",
  API_KEY: process.env.NEXT_PUBLIC_AVNU_PAYMASTER_API_KEY,
  GASLESS_API_URL: "https://starknet.api.avnu.fi",
  SUPPORTED_GAS_TOKENS: [
    {
      symbol: "USDC",
      address: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
      decimals: 6,
    },
    {
      symbol: "USDT",
      address: "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
      decimals: 6,
    },
    {
      symbol: "ETH",
      address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      decimals: 18,
    },
    {
      symbol: "STRK",
      address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      decimals: 18,
    },
  ],
} as const;

// Gas sponsorship settings
export const GAS_SPONSORSHIP_CONFIG = {
  ENABLED: process.env.NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP === "true",
  SPONSOR_MINTING: process.env.NEXT_PUBLIC_SPONSOR_MINTING === "true",
  SPONSOR_TRANSFERS: process.env.NEXT_PUBLIC_SPONSOR_TRANSFERS === "true",
  SPONSOR_MARKETPLACE: process.env.NEXT_PUBLIC_SPONSOR_MARKETPLACE === "true",
  MAX_SPONSORED_AMOUNT: process.env.NEXT_PUBLIC_MAX_SPONSORED_AMOUNT || "1000000000000000", // 0.001 ETH in wei
} as const;


// Contract addresses   
//export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`;

