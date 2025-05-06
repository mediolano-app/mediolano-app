// import {
//   useContract,
//   useSendTransaction,
//   useAccount,
// } from "@starknet-react/core";
// import { useCallback } from "react";
// import UserSettingsABI from "../abis/user_settings";
// import { BigNumberish } from "starknet";

// export type GetSettingResponse = Record<
//   number,
//   boolean | object | BigNumberish
// >;

// export type VerifySettingResponse = boolean;

// export interface TransactionResponse {
//   transaction_hash: string;
// }

// const { send, error } = useSendTransaction({
//   calls: [contract.populate("transfer", [address, 1n])],
// });

// export const useUsersSettings = () => {
//   const { address } = useAccount();
//   const { contract } = useContract({
//     address: process.env
//       .NEXT_PUBLIC_USER_SETTINGS_CONTRACT_ADDRESS as `0x${string}`,
//     abi: UserSettingsABI,
//   });

//   const { send: sendStoreSetting, error: storeSettingError } =
//     useSendTransaction({
//       calls:
//         contract && address
//           ? [contract.populate("store_setting", [])]
//           : undefined,
//     });

//   // Queries
//   const getSetting = useCallback(
//     async (user: string, key: string): Promise<GetSettingResponse | null> => {
//       if (!contract) return null;
//       return contract.get_setting(user, key);
//     },
//     [contract]
//   );

//   const verifySetting = useCallback(
//     async (
//       user: string,
//       key: string,
//       signature: string[]
//     ): Promise<VerifySettingResponse | null> => {
//       if (!contract) return null;
//       return contract.verify_setting(user, key, signature);
//     },
//     [contract]
//   );

//   // Mutations
//   const storeSetting = useCallback(
//     async (
//       key: string,
//       encryptedData: string[],
//       walletSignature: string[],
//       pubKey: string
//     ): Promise<TransactionResponse> => {
//       if (!contract) throw new Error("Contract not initialized");
//       return contract.store_setting(
//         key,
//         encryptedData,
//         walletSignature,
//         pubKey
//       );
//     },
//     [contract]
//   );

//   const removeSetting = useCallback(
//     async (key: string): Promise<TransactionResponse> => {
//       if (!contract) throw new Error("Contract not initialized");
//       return contract.remove_setting(key);
//     },
//     [contract]
//   );

//   const updateWalletKey = useCallback(
//     async (
//       newPubKey: string,
//       signature: string[]
//     ): Promise<TransactionResponse> => {
//       if (!contract) throw new Error("Contract not initialized");
//       return contract.update_wallet_key(newPubKey, signature);
//     },
//     [contract]
//   );

//   return {
//     // Query functions
//     getSetting,
//     verifySetting,

//     // Mutation functions
//     storeSetting,
//     removeSetting,
//     updateWalletKey,

//     // Contract instance
//     contract,
//   };
// };
