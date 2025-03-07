// lib/pinatasdk.ts
import { PinataSDK } from "pinata-web3";

// Configure Pinata using server-side environment variables.
const pinataClient = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "",
  pinataGateway: process.env.PINATA_HOST || "violet-adjacent-skink-713.mypinata.cloud" // adjust as needed
});

/**
 * Upload metadata to Pinata using the JSON upload method.
 *
 * This function combines your form metadata with additional integration data
 * (such as your contract address and a timestamp) and then uses the Pinata SDK's
 * `upload.json` method to pin the JSON to IPFS.
 */
export async function uploadMetadataToPinata(metadata: Record<string, any>): Promise<string> {
  // Combine the incoming metadata with extra fields required for integration.
  const combinedMetadata = {
    ...metadata,
    contractAddress: process.env.NEXT_PUBLIC_IPCOLLECTION_ADDRESS || "",
    timestamp: new Date().toISOString(),
  };

  try {
    // Use the json method from pinataClient.upload to pin the JSON object.
    const uploadBuilder = pinataClient.upload.json(combinedMetadata, {
      metadata: { name: "collection-metadata.json" }
    });
    // The uploadBuilder is thenable so we can await its resolution.
    const result = await uploadBuilder;
    // Use the IpfsHash from the result to construct an IPFS URI.
    const ipfsHash = result.IpfsHash;
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error("Failed to upload metadata to Pinata:", error);
    throw new Error("Could not upload metadata to Pinata");
  }
}
