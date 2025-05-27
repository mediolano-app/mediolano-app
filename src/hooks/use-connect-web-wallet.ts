import { useEffect } from 'react'
import { argentWebWallet } from '@/lib/argentInvisibleSdk'
import { provider } from '@/utils/starknet'
import { SessionAccountInterface } from "@argent/webwallet-sdk"

export const useConnectWebWallet = (
  setInvisibleAccount: (account: SessionAccountInterface) => void
) => {
  useEffect(() => {
    if (!argentWebWallet) {
      return
    }

    argentWebWallet
      .connect()
      .then(async (res) => {
        if (!res) {
          console.log("Not connected");
          return;
        }

        console.log("Connected to ArgentWebWallet", res);
        const { account, callbackData, approvalTransactionHash } = res;

        if (account.getSessionStatus() !== "VALID") {
          console.log("Session is not valid");
          return;
        }

        console.log("Approval transaction hash", approvalTransactionHash);
        console.log("Callback data", callbackData);

        if (approvalTransactionHash && provider) {
          console.log("Waiting for approval");
          await provider.waitForTransaction(approvalTransactionHash)
        }

        setInvisibleAccount(account);
      })
      .catch((err) => {
        console.error("Failed to connect to ArgentWebWallet", err);
      });
  }, [setInvisibleAccount]);
}