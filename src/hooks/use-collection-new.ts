/*
  Get Collection Data from Smart Contract
  Handle Error gracefully or Provide fallback data if collection not found
  Retrieve Assets in a Collection
*/

import { Collection } from "@/types/asset";
import { RpcProvider, Contract, Account, ec, json } from "starknet";

/*
Given a Collection Address, Get the collection ID from the Factory Contract
When you do, Fetch the Collection Details and the Collection Stats from the Factory Contract
Build the Object Shape
Return
*/

async function getCollectionId(collectionAddress: string): Promise<string> {
  const provider = new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
  });

  const { abi } = await provider.getClassAt(collectionAddress);
  const collectionContract = new Contract(abi, collectionAddress, provider);

  const collectionId = await collectionContract.get_collection_id();
  return collectionId;
}

async function getCollection(collectionId: string): Promise<Collection> {
  const provider = new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
  });
  const collectionFactory =
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS!;

  const { abi } = await provider.getClassAt(collectionFactory);
  const collectionContract = new Contract(abi, collectionFactory, provider);
  const collection = await collectionContract.get_collection(collectionId);
  const collectionStats =
    await collectionContract.get_collection_stats(collectionId);
}

/*
This function fetches the creator of a collection given its owner's address.
expected data returned from the contract call is to take the Shape
creator: {
  id: string
  username: string
  name: string
  avatar: string
  verified: boolean
  wallet: string
}
*/
async function getCollectionCreator(collectionOwner: string): Promise<object> {
  const provider = new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
  });
  // Would be the ownership contract
  const collectionFactory =
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS!;

  const { abi } = await provider.getClassAt(collectionFactory);
  const collectionContract = new Contract(abi, collectionFactory, provider);
  // Would be a call to read a creator, given his address
  const creator =
    await collectionContract.get_collection_creator(collectionOwner);
  return { creator };
}
