"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useContract, useSendTransaction, useProvider } from "@starknet-react/core";
import { ipIdentityAbi } from "@/abis/ip_identity";
import { Abi, num } from "starknet";
import type { Licensing } from "@/lib/types";

// Interface for license data from blockchain
export interface PortfolioLicense {
  id: string;
  name: string;
  licenseType: string;
  startDate: string;
  endDate: string;
  price: number;
  licensor: string;
  licensee: string;
  assetId: string;
  terms?: string;
}

// Interface for license creation parameters
interface CreateLicenseParams {
  nftId: string;
  tokenId: string;
  licenseType: "Personal" | "Commercial" | "Exclusive";
  licensee: string;
  startDate: string;
  endDate: string;
  terms: string;
  price: number;
}

const IP_IDENTITY_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS_IP_ID as `0x${string}` | undefined;

export function usePortfolioLicensing() {
  const { account, address } = useAccount();
  const { provider } = useProvider();
  const [licenses, setLicenses] = useState<PortfolioLicense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    address: IP_IDENTITY_CONTRACT_ADDRESS,
    abi: ipIdentityAbi as Abi,
  });

  const { sendAsync: sendTransaction } = useSendTransaction({
    calls: [],
  });

  // Fetch all licenses for the connected user (mocked, as ipIdentityAbi lacks fetch function)
  const fetchUserLicenses = useCallback(async () => {
    if (!account || !address) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Placeholder data (replace with real contract call if available)
      const placeholderLicenses: PortfolioLicense[] = [
        {
          id: "1",
          name: "Commercial License for IP Asset #1",
          licenseType: "Commercial",
          startDate: "2023-01-01",
          endDate: "2024-01-01",
          price: 0.5,
          licensor: "0x123...",
          licensee: address,
          assetId: "1",
          terms: "Usage rights for digital marketing only",
        },
        {
          id: "2",
          name: "Personal License for IP Asset #3",
          licenseType: "Personal",
          startDate: "2023-02-15",
          endDate: "2023-08-15",
          price: 0.2,
          licensor: "0x456...",
          licensee: address,
          assetId: "3",
          terms: "Personal use only, no commercial rights",
        },
      ];
      
      setLicenses(placeholderLicenses);
      setError(null);
    } catch (err) {
      console.error("Error fetching licenses:", err);
      setError("Failed to load licensing data");
    } finally {
      setIsLoading(false);
    }
  }, [account, address]);

  // Fetch licenses for a specific NFT (mocked, as ipIdentityAbi lacks fetch function)
  const fetchNFTLicenses = useCallback(async (nftId: string) => {
    if (!account) return [];

    try {
      const mockLicenses: PortfolioLicense[] = [
        {
          id: `license-${nftId}-1`,
          name: `Personal License for IP Asset #${nftId}`,
          licenseType: "Personal",
          startDate: "2023-02-15",
          endDate: "2023-08-15",
          price: 0.2,
          licensor: address || "0x789...",
          licensee: "0x789...",
          assetId: nftId,
          terms: "Personal use only, no commercial rights",
        },
      ];
      return mockLicenses;
    } catch (err) {
      console.error(`Failed to fetch licenses for NFT ${nftId}:`, err);
      return [];
    }
  }, [account, address]);

  // Create a new license using register_ip_id
  const createLicense = useCallback(
    async (params: CreateLicenseParams) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }
      if (!contract) {
        throw new Error("Contract not initialized");
      }
      if (!IP_IDENTITY_CONTRACT_ADDRESS) {
        throw new Error("IP Identity contract address not set");
      }

      setIsLoading(true);
      setError(null);

      try {
        const licenseTerms = [
          params.licenseType,
          params.licensee,
          params.startDate,
          params.endDate,
          params.terms,
          params.price.toString(),
        ].map((item) => num.toHex(item));

        const contractCall = contract.populate("register_ip_id", [
          num.toHex(params.tokenId),
          [],
          ["NFT"],
          licenseTerms,
        ]);

        const result = await sendTransaction([contractCall]);
        await provider.waitForTransaction(result.transaction_hash);

        console.log("✅ License created successfully:", {
          transactionHash: result.transaction_hash,
          tokenId: params.tokenId,
          licenseType: params.licenseType,
          licensee: params.licensee,
        });

        await fetchUserLicenses();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create license";
        console.error("Failed to create license:", err);
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [account, contract, sendTransaction, provider, fetchUserLicenses]
  );

  // Revoke a license (mocked, as ipIdentityAbi lacks revoke function)
  const revokeLicense = useCallback(
    async (licenseId: string) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("Revoking license:", licenseId);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await fetchUserLicenses();
        return true;
      } catch (err) {
        console.error("Failed to revoke license:", err);
        setError("Failed to revoke license");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [account, fetchUserLicenses]
  );

  // Load licenses on component mount
  useEffect(() => {
    fetchUserLicenses();
  }, [fetchUserLicenses]);

  // Convert PortfolioLicense to Licensing format
  const convertToLicensingFormat = (portfolioLicense: PortfolioLicense): Licensing => {
    return {
      id: portfolioLicense.id,
      type: portfolioLicense.licenseType as "Commercial" | "Personal" | "Exclusive",
      licensee: portfolioLicense.licensee,
      startDate: portfolioLicense.startDate,
      endDate: portfolioLicense.endDate,
      terms: portfolioLicense.terms || `License for ${portfolioLicense.name}`,
    };
  };

  return {
    licenses,
    licensingsForUI: licenses.map(convertToLicensingFormat),
    isLoading,
    error,
    fetchUserLicenses,
    fetchNFTLicenses,
    createLicense,
    revokeLicense,
  };
}