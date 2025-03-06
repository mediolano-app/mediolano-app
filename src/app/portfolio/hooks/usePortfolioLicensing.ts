"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
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

export function usePortfolioLicensing() {
  const { account } = useAccount();
  
  const [licenses, setLicenses] = useState<PortfolioLicense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all licenses for the connected user
  const fetchUserLicenses = useCallback(async () => {
    if (!account) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulating a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Placeholder data
      const placeholderLicenses: PortfolioLicense[] = [
        {
          id: "1",
          name: "Commercial License for IP Asset #1",
          licenseType: "Commercial",
          startDate: "2023-01-01",
          endDate: "2024-01-01",
          price: 0.5,
          licensor: "0x123...",
          licensee: account.address,
          assetId: "1",
          terms: "Usage rights for digital marketing only"
        },
        {
          id: "2",
          name: "Personal License for IP Asset #3",
          licenseType: "Personal",
          startDate: "2023-02-15",
          endDate: "2023-08-15",
          price: 0.2,
          licensor: "0x456...",
          licensee: account.address,
          assetId: "3",
          terms: "Personal use only, no commercial rights"
        }
      ];
      
      setLicenses(placeholderLicenses);
      setError(null);
    } catch (err) {
      console.error("Error fetching licenses:", err);
      setError("Failed to load licensing data");
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  // Fetch licenses for a specific NFT
  const fetchNFTLicenses = useCallback(async (nftId: string) => {
    if (!account) return [];

    try {
      // This would be the actual contract call in a real implementation
      // const nftLicenses = await contract.getNFTLicenses(nftId);
      
      // Mock data for development
      const mockLicenses: PortfolioLicense[] = [
        {
          id: `license-${nftId}-1`,
          name: `Personal License for IP Asset #${nftId}`,
          licenseType: "Personal",
          startDate: "2023-02-15",
          endDate: "2023-08-15",
          price: 0.2,
          licensor: account.address,
          licensee: "0x789...",
          assetId: nftId,
          terms: "Personal use only, no commercial rights"
        }
      ];

      return mockLicenses;
    } catch (err) {
      console.error(`Failed to fetch licenses for NFT ${nftId}:`, err);
      return [];
    }
  }, [account]);

  // Create a new license
  const createLicense = useCallback(async (params: CreateLicenseParams) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      // This would be the actual contract call in a real implementation
      // await contract.createLicense(
      //   params.tokenId,
      //   params.licenseType,
      //   params.licensee,
      //   new Date(params.startDate).getTime() / 1000,
      //   new Date(params.endDate).getTime() / 1000,
      //   params.terms,
      //   params.price
      // );

      // For development, just log the parameters
      console.log("Creating license with params:", params);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refresh licenses after creation
      await fetchUserLicenses();

      return true;
    } catch (err) {
      console.error("Failed to create license:", err);
      setError("Failed to create license");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [account, fetchUserLicenses]);

  // Revoke a license
  const revokeLicense = useCallback(async (licenseId: string) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      // This would be the actual contract call in a real implementation
      // await contract.revokeLicense(licenseId);

      // For development, just log the action
      console.log("Revoking license:", licenseId);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refresh licenses after revocation
      await fetchUserLicenses();

      return true;
    } catch (err) {
      console.error("Failed to revoke license:", err);
      setError("Failed to revoke license");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [account, fetchUserLicenses]);

  // Load licenses on component mount
  useEffect(() => {
    fetchUserLicenses();
  }, [fetchUserLicenses]);

  // Convert PortfolioLicense to Licensing format (for compatibility with UI components)
  const convertToLicensingFormat = (portfolioLicense: PortfolioLicense): Licensing => {
    return {
      id: portfolioLicense.id,
      type: portfolioLicense.licenseType as "Commercial" | "Personal" | "Exclusive",
      licensee: portfolioLicense.licensee,
      startDate: portfolioLicense.startDate,
      endDate: portfolioLicense.endDate,
      terms: portfolioLicense.terms || `License for ${portfolioLicense.name}`
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
    revokeLicense
  };
} 