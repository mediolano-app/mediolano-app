import { PinataSDK } from "pinata-web3";

export const pinataClient = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "",
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL || "ipfs.io"
});


export async function uploadMetadataToPinata(metadata: Record<string, any>): Promise<string> {

  const combinedMetadata = {
    ...metadata,
    contractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS || "",
    timestamp: new Date().toISOString(),
  };

  try {
    const uploadBuilder = pinataClient.upload.json(combinedMetadata, {
      metadata: { name: "collection-metadata.json" }
    });
    const result = await uploadBuilder;
    // Use the IpfsHash from the result to construct an IPFS URI.
    const ipfsHash = result.IpfsHash;
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error("Failed to upload metadata to Pinata:", error);
    throw new Error("Could not upload metadata to Pinata");
  }
}
