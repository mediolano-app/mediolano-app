import { userSettingsAbi } from "@/abis/user_settings";
import {
  useContract,
  useSendTransaction,
  useAccount,
  useProvider,
} from "@starknet-react/core";
import { useCallback, useState } from "react";
import { Abi } from "starknet";

const USER_SETTINGS_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_USER_SETTINGS_CONTRACT_ADDRESS as `0x${string}`;
const USER_SETTINGS_CONTRACT_ABI = userSettingsAbi as Abi;

export const useUsersSettings = () => {
  const { address, account } = useAccount();
  const { provider } = useProvider();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { contract } = useContract({
    address: USER_SETTINGS_CONTRACT_ADDRESS,
    abi: USER_SETTINGS_CONTRACT_ABI,
  });

  const { sendAsync: settingsSend } = useSendTransaction({
    calls: [],
  });

  // Queries
  const getAccountSettings = useCallback(
    async (user: `0x${string}`) => {
      if (!contract) return null;
      return contract.get_settings(user);
    },
    [contract]
  );

  const getNotificationSettings = useCallback(
    async (user: string) => {
      if (!contract) return null;
      return contract.get_notification_settings(user);
    },
    [contract]
  );

  const getSecuritySettings = useCallback(
    async (user: string) => {
      if (!contract) return null;
      return contract.get_security_settings(user);
    },
    [contract]
  );

  const getAdvancedSettings = useCallback(
    async (user: string) => {
      if (!contract) return null;
      return contract.get_advanced_settings(user);
    },
    [contract]
  );

  // Mutations
  const executeSettingsCall = async ({
    method,
    args,
  }: {
    method: string;
    args: any[];
  }) => {
    if (!address) throw new Error("Wallet not connected");
    if (!contract) throw new Error("Contract not initialized");

    setIsUpdating(true);
    setError(null);

    try {
      const contractCall = contract.populate(method, args);
      await settingsSend([contractCall]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to execute contract call";
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const executeMultipleSettingsCalls = async (calls: Array<{
    method: string;
    args: any[];
  }>) => {
    if (!address) throw new Error("Wallet not connected");
    if (!account) throw new Error("Account not connected");
    if (!contract) throw new Error("Contract not initialized");

    setIsUpdating(true);
    setError(null);

    try {
      const contractCalls = calls.map(({ method, args }) => 
        contract.populate(method, args)
      );
      
      const multiCall = await account.execute(contractCalls);
      await provider.waitForTransaction(multiCall.transaction_hash);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to execute multicall";
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    getAccountSettings,
    getNotificationSettings,
    getSecuritySettings,
    getAdvancedSettings,
    executeSettingsCall,
    executeMultipleSettingsCalls,
    contract,
    isUpdating,
    error,
  };
};
