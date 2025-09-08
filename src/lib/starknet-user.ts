import { Contract, RpcProvider } from "starknet";
import ipcollectionABI from "../abis/ipcollection";

const SEPOLIA_CONTRACT = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS as string;
const MAINNET_CONTRACT = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS_MAINNET as string;
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
 

function getProvider(network: "sepolia" | "mainnet") {
  if (network === "sepolia") {
    return new RpcProvider({ nodeUrl: `https://starknet-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}` });
  }
  return new RpcProvider({ nodeUrl: `https://starknet-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}` });
}


async function getContract(network: "sepolia" | "mainnet") {
  const address = network === "sepolia" ? SEPOLIA_CONTRACT : MAINNET_CONTRACT;
  const provider = getProvider(network);

//   const { abi: CollectionAbi } = await provider.getClassAt(BigInt(address));
//   if (CollectionAbi === undefined) {
//     throw new Error('no abi.');
//   }

  return new Contract(ipcollectionABI, address, provider);
}

export async function fetchUserCollections({ address, network }: { address: string; network: "sepolia" | "mainnet" }) {
  // TODO: Replace with actual contract call to fetch collections by user address
  // Example: await contract.call("getCollectionsByOwner", [address]);
  console.log('address', address);
  const contract = getContract('sepolia');
  const result = await (await contract).call("list_user_collections", ['0x71e83e00e1957a1b1dd30964de54a44739c5ea83142edbe63c6c4188bef5200']);
  if (result) {
    console.log('collections', result);
    // return result.map((collection: any) => ({
    //   id: collection.id,
    //   name: collection.name,
    //   description: collection.description,
    //   image: collection.image,
    // }));
  }
}

export async function fetchUserCollectionsbyID({ id, network }: { id: any; network: "sepolia" | "mainnet" }) {
  const contract = getContract(network);
  const result = await contract.call("get_collection", [id]);
  if (result) {
    console.log(result);
    // const collection = {
    //     id: re,
    // }
  }
}

export async function fetchUserProfile({ address, network }: { address: string; network: "sepolia" | "mainnet" }) {
  // TODO: Implement actual onchain/offchain profile fetch
  // Return user profile info (address, optional metadata)
  return {
    address,
    name: address,
    bio: '',
    avatar: '',
    specialties: [],
    verified: false,
    joinDate: '',
    followers: 0,
    following: 0,
    totalAssets: 0,
    totalValue: 0,
    totalSales: 0,
    website: '',
    twitter: '',
    instagram: '',
    discord: '',
    location: '',
  };
}
