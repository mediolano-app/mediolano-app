import { accountABI } from "@/abis/account";
import {
  useContract,
  useSendTransaction,
  useAccount,
  useProvider,
} from "@starknet-react/core";
import { useCallback, useState } from "react";
import { Abi } from "starknet";

const ACCOUNT_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_ACCOUNT_CONTRACT_ADDRESS as `0x${string}`;
const ACCOUNT_CONTRACT_ABI = accountABI as Abi;

// Type definitions based on the ABI
export interface PersonalInfo {
  username: string;
  name: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  org: string;
  website: string;
}

export interface SocialMediaLinks {
  x_handle: string;
  linkedin: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  discord: string;
  youtube: string;
  github: string;
}

export interface ProfileSettings {
  display_public_profile: boolean;
  email_notifications: boolean;
  marketplace_profile: boolean;
}

export interface UserProfile
  extends PersonalInfo,
    SocialMediaLinks,
    ProfileSettings {}

export const useAccountContract = () => {
  const { address, account } = useAccount();
  const { provider } = useProvider();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    address: ACCOUNT_CONTRACT_ADDRESS,
    abi: ACCOUNT_CONTRACT_ABI,
  });

  
  const { sendAsync: accountSend } = useSendTransaction({
    calls: [],
  });

  // Read Functions (View)
  const getProfile = useCallback(
    async (user: `0x${string}`) => {
      if (!contract) return null;
      try {
        return await contract.get_profile(user);
      } catch (err) {
        console.error("Error getting profile:", err);
        return null;
      }
    },
    [contract]
  );

  const getPersonalInfo = useCallback(
    async (user: `0x${string}`) => {
      if (!contract) return null;
      try {
        return await contract.get_personal_info(user);
      } catch (err) {
        console.error("Error getting personal info:", err);
        return null;
      }
    },
    [contract]
  );

  const getSocialLinks = useCallback(
    async (user: `0x${string}`) => {
      if (!contract) return null;
      try {
        return await contract.get_social_links(user);
      } catch (err) {
        console.error("Error getting social links:", err);
        return null;
      }
    },
    [contract]
  );

  const getSettings = useCallback(
    async (user: `0x${string}`) => {
      if (!contract) return null;
      try {
        return await contract.get_settings(user);
      } catch (err) {
        console.error("Error getting settings:", err);
        return null;
      }
    },
    [contract]
  );

  const isProfileRegistered = useCallback(
    async (user: `0x${string}`) => {
      if (!contract) return false;
      try {
        return await contract.is_profile_registered(user);
      } catch (err) {
        console.error("Error checking profile registration:", err);
        return false;
      }
    },
    [contract]
  );

  const getProfileCount = useCallback(async () => {
    if (!contract) return 0;
    try {
      return await contract.get_profile_count();
    } catch (err) {
      console.error("Error getting profile count:", err);
      return 0;
    }
  }, [contract]);

  const getUsername = useCallback(
    async (user: `0x${string}`) => {
      if (!contract) return "";
      try {
        return await contract.get_username(user);
      } catch (err) {
        console.error("Error getting username:", err);
        return "";
      }
    },
    [contract]
  );

  const isProfilePublic = useCallback(
    async (user: `0x${string}`) => {
      if (!contract) return false;
      try {
        return await contract.is_profile_public(user);
      } catch (err) {
        console.error("Error checking if profile is public:", err);
        return false;
      }
    },
    [contract]
  );

  // Write Functions (External) - Direct contract function calls
  const registerProfile = useCallback(
    async (
      personalInfo: PersonalInfo,
      socialLinks: SocialMediaLinks,
      settings: ProfileSettings
    ) => {
      if (!address) throw new Error("Wallet not connected");
      if (!contract) throw new Error("Contract not initialized");

      setIsUpdating(true);
      setError(null);

      try {
        const contractCall = contract.populate("register_profile", [
          personalInfo,
          socialLinks,
          settings,
        ]);
        const result = await accountSend([contractCall]);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to register profile";
        setError(errorMessage);
        throw err;
      } finally {
        console.log("Updating state...");
        setIsUpdating(false);
      }
    },
    [address, contract, accountSend]
  );

  const updatePersonalInfo = useCallback(
    async (personalInfo: PersonalInfo) => {
      if (!address) throw new Error("Wallet not connected");
      if (!contract) throw new Error("Contract not initialized");

      setIsUpdating(true);
      setError(null);

      try {
        const contractCall = contract.populate("update_personal_info", [
          personalInfo,
        ]);
        await account?.execute([contractCall]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update personal info";
        setError(errorMessage);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [address, contract, accountSend]
  );

  const updateSocialLinks = useCallback(
    async (socialLinks: SocialMediaLinks) => {
      if (!address) throw new Error("Wallet not connected");
      if (!contract) throw new Error("Contract not initialized");

      setIsUpdating(true);
      setError(null);

      try {
        const contractCall = contract.populate("update_social_links", [
          socialLinks,
        ]);
        await accountSend([contractCall]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update social links";
        setError(errorMessage);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [address, contract, accountSend]
  );

  const updateSettings = useCallback(
    async (settings: ProfileSettings) => {
      if (!address) throw new Error("Wallet not connected");
      if (!contract) throw new Error("Contract not initialized");

      setIsUpdating(true);
      setError(null);

      console.log(settings, "settings");

      try {
        const contractCall = contract.populate("update_settings", [settings]);
        await accountSend([contractCall]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update settings";
        setError(errorMessage);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [address, contract, accountSend]
  );

  // Generic multicall function to execute multiple contract calls at once
  const executeMultipleProfileCalls = useCallback(
    async (calls: Array<{ method: string; args: any[] }>) => {
      if (!address) throw new Error("Wallet not connected");
      if (!account) throw new Error("Account not connected");
      if (!contract) throw new Error("Contract not initialized");

      setIsUpdating(true);
      setError(null);

  
      try {
        const contractCalls = calls.map(({ method, args }) => {
          const populatedCall = contract.populate(method, args);
          return {
            contractAddress: ACCOUNT_CONTRACT_ADDRESS,
            entrypoint: method,
            calldata: populatedCall.calldata
          };
        });

        const result = await account.execute(contractCalls);
        await provider.waitForTransaction(result.transaction_hash);

        console.log("✅ [MULTICALL] Profile calls executed successfully!", {
          transactionHash: result?.transaction_hash,
          userAddress: address,
          executedMethods: calls.map(call => call.method),
          result,
          timestamp: new Date().toISOString(),
        });

        return result;
      } catch (err) {
        console.error("❌ [MULTICALL] Profile calls failed:", {
          error: err,
          userAddress: address,
          methods: calls.map(call => call.method),
          message: err instanceof Error ? err.message : "Unknown error",
          timestamp: new Date().toISOString(),
        });

        const errorMessage =
          err instanceof Error ? err.message : "Failed to execute profile multicall";
        setError(errorMessage);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [address, account, contract, provider]
  );

  // Convenience function to update all profile sections at once
  const updateProfileMulticall = useCallback(
    async (
      personalInfo: PersonalInfo,
      socialLinks: SocialMediaLinks,
      settings: ProfileSettings
    ) => {
      const calls = [
        { method: "update_personal_info", args: [personalInfo] },
        { method: "update_social_links", args: [socialLinks] },
        { method: "update_settings", args: [settings] },
      ];

      return executeMultipleProfileCalls(calls);
    },
    [executeMultipleProfileCalls]
  );

  return {
    // Read functions
    getProfile,
    getPersonalInfo,
    getSocialLinks,
    getSettings,
    isProfileRegistered,
    getProfileCount,
    getUsername,
    isProfilePublic,

    // Write functions
    registerProfile,
    updatePersonalInfo,
    updateSocialLinks,
    updateSettings,
    updateProfileMulticall,

    // State
    contract,
    isUpdating,
    error,

    // Account info
    address,
    account,
  };
};
