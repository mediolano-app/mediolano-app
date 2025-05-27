import { Contract, RpcProvider, Account, constants } from "starknet";
import ipcollectionABI from "../abis/ipcollection";

const COLLECTION_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_IPCOLLECTION_ADDRESS as string;
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const envName = (process.env.NEXT_PUBLIC_ENV_NAME) as "mainnet" | "sepolia";
const isMainnet = envName === "mainnet";
const chainId = isMainnet ? constants.StarknetChainId.SN_MAIN : constants.StarknetChainId.SN_SEPOLIA;

const nodeUrl = `https://starknet-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
export const provider = new RpcProvider({
  chainId: chainId,
  nodeUrl:  nodeUrl, // process.env.NEXT_PUBLIC_RPC_URL ||
  headers: JSON.parse("{}"), // process.env.NEXT_PUBLIC_RPC_HEADERS || 
});

export async function mintToken(account: Account): Promise<string> {
  if (!ALCHEMY_API_KEY) {
    throw new Error("Alchemy API Key is not set in the environment variables.");
  }

  const contract = new Contract(ipcollectionABI, COLLECTION_CONTRACT_ADDRESS, provider);
  contract.connect(account);

  const tx = await contract.invoke("mint", [account.address]);
  return tx.transaction_hash;
}