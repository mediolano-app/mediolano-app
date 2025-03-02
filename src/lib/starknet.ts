import { Provider, Account, Contract } from 'starknet';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;

const provider = new Provider({ rpc: { nodeUrl: RPC_URL } });

// Example deploy function (customize per your contract)
export const deployIpCollectionContract = async (
  signer: Account,
  collectionName: string,
  collectionSymbol: string
) => {
  const compiledContract = await import('../../onchain/contracts/ipcollection.json');

  const { transaction_hash, contract_address } = await signer.deployContract({
    classHash: compiledContract.class_hash,
    constructorCalldata: [collectionName, collectionSymbol],
  });

  await provider.waitForTransaction(transaction_hash);
  
  return contract_address;
};
