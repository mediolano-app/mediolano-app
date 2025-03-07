// lib/starknet.ts
import { Contract, RpcProvider, Account } from "starknet";
import ipcollectionABI from "../abis/ipcollection";

const COLLECTION_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_IPCOLLECTION_ADDRESS as string;
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export async function mintToken(account: Account): Promise<string> {
  if (!ALCHEMY_API_KEY) {
    throw new Error("Alchemy API Key is not set in the environment variables.");
  }

  // Construct the Alchemy RPC endpoint for Starknet Sepolia (adjust the URL if needed)
  const nodeUrl = `https://starknet-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
  const provider = new RpcProvider({ nodeUrl });

  // Create a contract instance with the provided ABI and contract address
  const contract = new Contract(ipcollectionABI, COLLECTION_CONTRACT_ADDRESS, provider);

  // Connect the contract instance to the user's account so that transactions can be signed
  contract.connect(account);

  // Call the mint function on the contract using the user's address as recipient
  const tx = await contract.invoke("mint", [account.address]);
  return tx.transaction_hash;
}
