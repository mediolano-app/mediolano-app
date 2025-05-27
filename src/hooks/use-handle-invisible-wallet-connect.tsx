// import { argentWebWallet } from '@/lib/argentInvisibleSdk';
// import { paymasterParams } from '@/lib/constants';
// import { provider } from '@/utils/starknet';
// import { deployAndExecuteWithPaymaster, SessionAccountInterface } from "@argent/invisible-sdk";

// type ConnectStatus = "Connect" | "Connecting" | "Deploying account";

// interface UseHandleInvisibleWalletConnectProps {
//   withApproval: boolean;
//   setInvisibleAccount: (account: SessionAccountInterface) => void;
//   setConnectStatus: (status: ConnectStatus) => void;
// }

// export const useHandleInvisibleWalletConnect = ({
//   withApproval,
//   setInvisibleAccount,
//   setConnectStatus,
// }: UseHandleInvisibleWalletConnectProps) => {
//   const handleConnect = async () => {
//     try {
//       console.log("Start connect, with approval requests: ", withApproval);

//       if (!provider) {
//         throw new Error("No provider provided");
//       }

//       setConnectStatus("Connecting");

//       const response = await argentWebWallet?.requestConnection({
//         callbackData: "custom_callback_data",
//         approvalRequests: withApproval
//           ? [
//               {
//                 tokenAddress: "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7",
//                 amount: BigInt("100000000000000000").toString(),
//                 spender: "0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a",
//               },
//             ]
//           : undefined,
//       });

//       if (response) {
//         const { account: sessionAccount } = response;
//         const isDeployed = await sessionAccount.isDeployed();

//         if (response.deploymentPayload && !isDeployed && response.approvalRequestsCalls && paymasterParams) {
//           console.log("Deploying an account");
//           setConnectStatus("Deploying account");

//           const resp = await deployAndExecuteWithPaymaster(
//             sessionAccount as any,
//             paymasterParams,
//             response.deploymentPayload,
//             response.approvalRequestsCalls
//           );

//           if (resp) {
//             console.log("Deployment hash: ", resp.transaction_hash);
//             await provider.waitForTransaction(resp.transaction_hash);
//             console.log("Account deployed");
//           }
//         } else if (response.approvalRequestsCalls) {
//           console.log("Sending Approvals");
//           const { transaction_hash } = await sessionAccount.execute(response.approvalRequestsCalls);
//           console.log("Approvals hash: ", transaction_hash);
//           await provider.waitForTransaction(transaction_hash);
//           console.log("Approvals minted", transaction_hash);
//         }

//         if (response.approvalTransactionHash) {
//           console.log("Waiting for approval", response.approvalTransactionHash);
//           await provider.waitForTransaction(response.approvalTransactionHash);
//           console.log("Approvals minted", response.approvalTransactionHash);
//         }

//         setInvisibleAccount(sessionAccount as any);
//         setConnectStatus("Connect");
//       } else {
//         console.log("requestConnection response is undefined");
//       }
//     } catch (err: any) {
//       console.error(err);
//       setConnectStatus("Connect");
//     }
//   };

//   return { handleConnect };
// };
