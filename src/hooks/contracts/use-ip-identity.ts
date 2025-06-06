import { useAccount, useContract, useReadContract } from "@starknet-react/core";
import { ipIdentityAbi } from "@/abis/ip_identity";
import { type Abi } from "starknet";


export function useIPIdentity() {
  const { address } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_IP_ID;

  // Utility: Construct IPFS-compatible metadata (with license field, matching IPFSMetadata interface)
  function buildIPFSMetadata(metadata: Record<string, any>): Record<string, any> {
    const {
      name = "Untitled Asset",
      description = "",
      image = "",
      type = "",
      creator = "",
      attributes = [],
      registrationDate = "",
    
      ...rest
    } = metadata;
    return {
      name,
      description,
      image,
      type,
      creator,
      attributes,
      registrationDate,
    
      ...rest,
    };
  }

  // Contract instance
  const { contract } = useContract({
    abi: ipIdentityAbi as Abi,
    address: contractAddress as `0x${string}`,
  });

  // Register a new IP ID
  const registerIpId = useContract({
    abi: ipIdentityAbi as Abi,
    address: contractAddress as `0x${string}`,
  });

  // Update IP ID metadata (enforces OpenSea standard)
  const updateIpIdMetadataRaw = useContract({
    abi: ipIdentityAbi as Abi,
    address: contractAddress as `0x${string}`,
  });
  // Wrapper to ensure OpenSea-compliant metadata
  async function updateIpIdMetadata(ip_id: string | number, metadata: Record<string, any>, ...args: any[]) {
    const ipfsMetadata = buildIPFSMetadata(metadata);
    // You may need to upload to IPFS here and get a URI, or encode as needed for the contract
    // Example: const uri = await uploadMetadataToPinata(ipfsMetadata);
    // Then call the contract with the URI or metadata as required
    if (!updateIpIdMetadataRaw.contract) throw new Error("Contract not initialized");
    return updateIpIdMetadataRaw.contract.update_ip_id_metadata(ip_id, ipfsMetadata, ...args);
  }

  // Verify IP ID (owner only)
  const verifyIpId = useContract({
    abi: ipIdentityAbi as Abi,
    address: contractAddress as `0x${string}`,
  });

  // Get IP ID data (hook)
  function useGetIpIdData(ip_id: string | number) {
    return useReadContract({
      abi: ipIdentityAbi as Abi,
      functionName: "get_ip_id_data",
      address: contractAddress as `0x${string}`,
      args: [ip_id],
      watch: false,
    });
  }

  return {
    address,
    contract,
    registerIpId,
    updateIpIdMetadata, // Use this to update metadata (IPFSMetadata-compatible)
    verifyIpId,
    useGetIpIdData,
    buildIPFSMetadata, // Exported for convenience
  };
}
