// lib/starknet.ts
import { Contract, RpcProvider, Account } from "starknet";
import ipcollectionABI from "../abis/ipcollection";
import { getContractAddresses, NETWORK_CONFIG, NetworkType } from "@/lib/constants";

export interface MintTokenOptions {
  account: Account;
  network: NetworkType;
  recipient?: string;
  tokenUri?: string;
}

export async function mintToken(options: MintTokenOptions): Promise<string> {
  const { account, network, recipient, tokenUri } = options;

  // Get network-specific configuration
  const contracts = getContractAddresses(network);
  const networkConfig = NETWORK_CONFIG[network];

  if (!contracts.COLLECTION_CONTRACT) {
    throw new Error(`Collection contract address not configured for ${network}`);
  }

  // Get network-specific API key and RPC URL
  const alchemyApiKey = network === 'sepolia'
    ? process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_SEPOLIA || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
    : process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MAINNET;

  // Use network-specific RPC URL
  let nodeUrl = networkConfig.rpcUrl;

  // If Alchemy API key is available, use Alchemy endpoint
  if (alchemyApiKey) {
    const alchemyNetwork = network === 'sepolia' ? 'starknet-sepolia' : 'starknet-mainnet';
    nodeUrl = `https://${alchemyNetwork}.g.alchemy.com/v2/${alchemyApiKey}`;
  }

  if (!nodeUrl) {
    throw new Error(`RPC URL not configured for ${network}`);
  }

  const provider = new RpcProvider({
    nodeUrl,
    chainId: networkConfig.chainId as any
  });

  const contract = new Contract(ipcollectionABI, contracts.COLLECTION_CONTRACT, provider);
  contract.connect(account);

  // Use provided recipient or account address
  const mintRecipient = recipient || account.address;

  // Prepare mint parameters based on contract interface
  const mintParams = tokenUri
    ? [mintRecipient, tokenUri]
    : [mintRecipient];

  const tx = await contract.invoke("mint", mintParams);
  return tx.transaction_hash;
}

// Legacy function for backward compatibility
export async function mintTokenLegacy(account: Account): Promise<string> {
  return mintToken({
    account,
    network: 'sepolia', // Default to sepolia for legacy calls
  });
}
