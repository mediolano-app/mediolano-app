/**
 * Application-wide constants
 */

// Network types
export type NetworkType = 'mainnet' | 'sepolia';

// Network-specific contract addresses configuration
export const NETWORK_CONTRACTS = {
  sepolia: {
    MIP_CONTRACT: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP_SEPOLIA || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP || "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0",
    COLLECTION_CONTRACT: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS_SEPOLIA || process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS || "0x00d2583f8b3159ee0cda451c26096a819308f1cb921ad206f9ecf6839dc5b0e3",
    REVENUE_CONTRACT: process.env.NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS_SEPOLIA || "0x055f444b1ace8bec6d79ceb815a8733958e9ceaa598160af291a7429e0146a74",
    AGREEMENT_FACTORY: process.env.NEXT_PUBLIC_AGREEMENT_FACTORY_ADDRESS_SEPOLIA || process.env.NEXT_PUBLIC_AGREEMENT_FACTORY_ADDRESS || "0x025a178bc9ace058ab1518392780610665857dfde111e1bed4d69742451bc61c",
    USER_SETTINGS: process.env.NEXT_PUBLIC_USER_SETTINGS_CONTRACT_ADDRESS_SEPOLIA || process.env.NEXT_PUBLIC_USER_SETTINGS_CONTRACT_ADDRESS || "0x06398e87b9bae77238d75a3ff6c5a247de26d931d6ca66467b85087cf4f57bdf",
    LICENSING_CONTRACT: process.env.NEXT_PUBLIC_LICENSING_CONTRACT_ADDRESS_SEPOLIA || process.env.NEXT_PUBLIC_LICENSING_CONTRACT_ADDRESS || "",
    MARKETPLACE_ADDRESS: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS_SEPOLIA || process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "",
    LISTING_CONTRACT: process.env.NEXT_PUBLIC_LISTING_CONTRACT_ADDRESS_SEPOLIA || process.env.NEXT_PUBLIC_LISTING_CONTRACT_ADDRESS || "",
  },
  mainnet: {
    MIP_CONTRACT: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP_MAINNET || "",
    COLLECTION_CONTRACT: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS_MAINNET || "",
    REVENUE_CONTRACT: process.env.NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS_MAINNET || "",
    AGREEMENT_FACTORY: process.env.NEXT_PUBLIC_AGREEMENT_FACTORY_ADDRESS_MAINNET || "",
    USER_SETTINGS: process.env.NEXT_PUBLIC_USER_SETTINGS_CONTRACT_ADDRESS_MAINNET || "",
    LICENSING_CONTRACT: process.env.NEXT_PUBLIC_LICENSING_CONTRACT_ADDRESS_MAINNET || "",
    MARKETPLACE_ADDRESS: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS_MAINNET || "",
    LISTING_CONTRACT: process.env.NEXT_PUBLIC_LISTING_CONTRACT_ADDRESS_MAINNET || "",
  }
} as const;

// Helper function to get contract addresses for current network
export const getContractAddresses = (network: NetworkType) => {
  return NETWORK_CONTRACTS[network];
};

// Legacy exports for backward compatibility
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`;
export const IP_REVENUE_CONTRACT_ADDRESS = "0x055f444b1ace8bec6d79ceb815a8733958e9ceaa598160af291a7429e0146a74";

// Network-specific RPC configuration
export const NETWORK_CONFIG = {
  sepolia: {
    chainId: "0x534e5f5345504f4c4941", // SN_SEPOLIA
    name: "Starknet Sepolia",
    explorerUrl: "https://sepolia.starkscan.co",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA || process.env.NEXT_PUBLIC_RPC_URL || "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
    faucetUrl: "https://starknet-faucet.vercel.app/",
  },
  mainnet: {
    chainId: "0x534e5f4d41494e", // SN_MAIN
    name: "Starknet Mainnet",
    explorerUrl: "https://starkscan.co",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_MAINNET || "https://starknet-mainnet.public.blastapi.io/rpc/v0_7",
    faucetUrl: null,
  }
} as const;

// AVNU Paymaster Configuration (network-specific gas tokens)
export const AVNU_PAYMASTER_CONFIG = {
  API_BASE_URL: "https://starknet.api.avnu.fi/paymaster/v1",
  API_KEY: process.env.NEXT_PUBLIC_AVNU_PAYMASTER_API_KEY,
  GASLESS_API_URL: "https://starknet.api.avnu.fi",
  SUPPORTED_GAS_TOKENS: {
    sepolia: [
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
    mainnet: [
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
    ]
  }
} as const;

// Gas sponsorship settings
export const GAS_SPONSORSHIP_CONFIG = {
  ENABLED: process.env.NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP === "true",
  SPONSOR_MINTING: process.env.NEXT_PUBLIC_SPONSOR_MINTING === "true",
  SPONSOR_TRANSFERS: process.env.NEXT_PUBLIC_SPONSOR_TRANSFERS === "true",
  SPONSOR_MARKETPLACE: process.env.NEXT_PUBLIC_SPONSOR_MARKETPLACE === "true",
  MAX_SPONSORED_AMOUNT: process.env.NEXT_PUBLIC_MAX_SPONSORED_AMOUNT || "1000000000000000", // 0.001 ETH in wei
} as const;

/** List of featured collection IDs (string) */
export const FEATURED_COLLECTION_IDS = [
  "20", 
];


// Contract addresses   
//export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`;

