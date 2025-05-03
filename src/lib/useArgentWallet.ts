// useArgentWallet.ts
import { useCallback, useEffect, useState } from "react";
import { RpcProvider, constants } from "starknet";
import { ArgentWebWallet, deployAndExecuteWithPaymaster, SessionAccountInterface } from "@argent/invisible-sdk";

interface UseArgentWalletProps {
  envName?: "mainnet" | "sepolia";
  rpcUrl?: string;
  rpcHeaders?: string;
  appName?: string;
  validityDays?: number;
  paymasterApiKey?: string;
  allowedContracts?: Array<{
    contract: string;
    selector: string;
  }>;
}

interface UseArgentWalletReturn {
  account: SessionAccountInterface | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  isDeploying: boolean;
  connect: () => Promise<string | undefined>;
  counter: bigint | undefined;
}

export const useArgentWallet = ({
  envName = "sepolia",
  rpcUrl,
  rpcHeaders = "{}",
  appName = "Your App",
  validityDays,
  paymasterApiKey,
  allowedContracts = [],
}: UseArgentWalletProps): UseArgentWalletReturn => {
  const [account, setAccount] = useState<SessionAccountInterface | undefined>(undefined);
  const [counter, setCounter] = useState<bigint | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  
  const isMainnet = envName === "mainnet";
  const chainId = isMainnet ? constants.StarknetChainId.SN_MAIN : constants.StarknetChainId.SN_SEPOLIA;

  // Use the first allowed contract for counter demonstration
  const DUMMY_CONTRACT_ADDRESS = allowedContracts.length > 0 
    ? allowedContracts[0].contract 
    : isMainnet 
      ? "0x001c515f991f706039696a54f6f33730e9b0e8cc5d04187b13c2c714401acfd4" 
      : "0x07557a2fbe051e6327ab603c6d1713a91d2cfba5382ac6ca7de884d3278636d7";

  const paymasterParams = !paymasterApiKey ? undefined : { apiKey: paymasterApiKey };
  
  // Initialize provider
  const provider = new RpcProvider({
    chainId: chainId,
    nodeUrl: rpcUrl,
    headers: JSON.parse(rpcHeaders),
  });

  // Initialize Argent Web Wallet
  const argentWebWallet = ArgentWebWallet.init({
    appName,
    environment: envName,
    sessionParams: {
      allowedMethods: allowedContracts.length > 0 ? allowedContracts : [
        {
          contract: DUMMY_CONTRACT_ADDRESS,
          selector: "increase_number",
        },
      ],
      validityDays: validityDays || undefined,
    },
    webwalletTheme: "dark",
    paymasterParams,
  });
  
  // Fetch counter function
  const fetchCounter = useCallback(async (sessionAccount?: SessionAccountInterface) => {
    if (!sessionAccount || !provider) {
      return undefined;
    }

    try {
      const [result] = await provider.callContract({
        contractAddress: DUMMY_CONTRACT_ADDRESS,
        entrypoint: "get_number",
        calldata: [sessionAccount.address],
      });

      return BigInt(result);
    } catch (error) {
      console.error("Error fetching counter:", error);
      return undefined;
    }
  }, [provider, DUMMY_CONTRACT_ADDRESS]);

  // Auto-connect effect
  useEffect(() => {
    if (!argentWebWallet) return;

    argentWebWallet
      .connect()
      .then(async (res) => {
        if (!res) {
          console.log("Not connected");
          return;
        }

        console.log("Connected to ArgentWebWallet", res);
        const { account: sessionAccount, approvalTransactionHash } = res;

        if (sessionAccount.getSessionStatus() !== "VALID") {
          console.log("Session is not valid");
          return;
        }

        if (approvalTransactionHash && provider) {
          console.log("Waiting for approval");
          await provider.waitForTransaction(approvalTransactionHash);
        }

        setAccount(sessionAccount);
        fetchCounter(sessionAccount).then(setCounter);
      })
      .catch((err) => {
        console.error("Failed to connect to ArgentWebWallet", err);
      });
  }, [argentWebWallet, provider, fetchCounter]);

  // Connect function
  const connect = async (): Promise<string | undefined> => {
    try {
      if (!provider) {
        throw new Error("No provider provided");
      }

      setIsConnecting(true);

      // Always include approvals
      const response = await argentWebWallet?.requestConnection({
        callbackData: "custom_callback_data",
        approvalRequests: [
          {
            tokenAddress: "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7",
            amount: BigInt("100000000000000000").toString(),
            spender: "0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a",
          },
        ],
      });

      if (response) {
        const { account: sessionAccount } = response;
        const isDeployed = await sessionAccount.isDeployed();

        if (response.deploymentPayload && !isDeployed && response.approvalRequestsCalls && paymasterParams) {
          console.log("Deploying an account");
          setIsDeploying(true);

          const resp = await deployAndExecuteWithPaymaster(
            sessionAccount, 
            paymasterParams, 
            response.deploymentPayload, 
            response.approvalRequestsCalls
          );

          if (resp) {
            console.log("Deployment hash: ", resp.transaction_hash);
            await provider.waitForTransaction(resp.transaction_hash);
            console.log("Account deployed");
          }
          setIsDeploying(false);
        } else if (response.approvalRequestsCalls) {
          console.log("Sending Approvals");
          const { transaction_hash } = await sessionAccount.execute(response.approvalRequestsCalls);
          console.log("Approvals hash: ", transaction_hash);
          await provider.waitForTransaction(transaction_hash);
          console.log("Approvals minted", transaction_hash);
        }

        if (response.approvalTransactionHash) {
          console.log("Waiting for approval", response.approvalTransactionHash);
          await provider.waitForTransaction(response.approvalTransactionHash);
          console.log("Approvals minted", response.approvalTransactionHash);
        }

        setAccount(sessionAccount);
        setIsConnecting(false);
        
        // Fetch counter after connection
        const newCounter = await fetchCounter(sessionAccount);
        setCounter(newCounter);
        
        return sessionAccount.address;
      } else {
        console.log("requestConnection response is undefined");
        setIsConnecting(false);
        return undefined;
      }
    } catch (err: any) {
      console.error(err);
      setIsConnecting(false);
      return undefined;
    }
  };

  // Update counter whenever account changes
  useEffect(() => {
    if (account) {
      fetchCounter(account).then(setCounter);
    }
  }, [account, fetchCounter]);

  return {
    account,
    isConnected: !!account,
    isConnecting,
    isDeploying,
    connect,
    counter
  };
};