export const IPFS_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "https://gateway.pinata.cloud";
export const COLLECTION_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS!;

export const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://voyager.online";

export const START_BLOCK = process.env.NEXT_PUBLIC_STARKNET_NETWORK === "mainnet" ? 6204232 : 0;