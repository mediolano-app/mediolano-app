import { useAccount, useContract, useReadContract } from "@starknet-react/core";
import { ipIdentityAbi } from "@/abis/ip_identity";
import { type Abi } from "starknet";

// Usage: const ipId = useIPIdentity();
export function useIPIdentity() {
  const { address } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_IP_ID;

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

  // Update IP ID metadata
  const updateIpIdMetadata = useContract({
    abi: ipIdentityAbi as Abi,
    address: contractAddress as `0x${string}`,
  });

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
    updateIpIdMetadata,
    verifyIpId,
    useGetIpIdData,
  };
}
