import { constants as SNconstants } from "starknet";

export enum ChainName {
    MAINNET = "MAINNET",
    SEPOLIA = "SEPOLIA",
    LOCALHOST = "LOCALHOST"
}

/**
 * Get the expected chain id in function of the current environment
 * @returns The expected chain id in function of the current environment
 */
export const GetExpectedChainNameWithEnv = () => {
    if (process.env.NODE_ENV === "production") {
        return ChainName.SEPOLIA;
    } else {

        // TODO: Cannot interact with extension wallet on Devnet/localhost
        return ChainName.SEPOLIA;
        //return ChainName.LOCALHOST;
    }
};

/**
 * Get RPC Prvider in function of the current environment
 * @returns The RPC Provider in function of the current environment
 */
export const GetRPCProviderWithEnv = () => {
    if (process.env.NODE_ENV === "production") {
        return process.env.NEXT_PUBLIC_PROVIDER_SEPOLIA_RPC;
    } else {

        // TODO: Cannot interact with extension wallet on Devnet/localhost
        return process.env.NEXT_PUBLIC_PROVIDER_SEPOLIA_RPC;
        //return process.env.NEXT_PUBLIC_PROVIDER_LOCAL_RPC;
    }
};


/**
 * 
 * @param address 
 * @returns 
 */
export const ToShortAddress = (address: string) => {
    return address.substring(0, 5) + "..." + address.substring(address.length - 4);
};

/**
 * Get friendly enum to manage chain with all extension wallet
 * @param chainId chain ID from extension wallet (SN_SEPOLIA from ArgentX, "0x0x534e5f5345504f4c4941" from Braavos/Metamask)
 * @returns one simple enum
 */
export const GetFriendlyChainName = (chainId: string) => {

    if (chainId === SNconstants.NetworkName.SN_MAIN || chainId === SNconstants.StarknetChainId.SN_MAIN) {
        return ChainName.MAINNET;
    }
    else if (chainId === SNconstants.NetworkName.SN_SEPOLIA || chainId === SNconstants.StarknetChainId.SN_SEPOLIA) {
        return ChainName.SEPOLIA;
    }
    else {
        return "Unknown";
    }
};

export const GetChainIdFromName = (chainName: ChainName) => {

    if (chainName === ChainName.MAINNET) {
        return SNconstants.StarknetChainId.SN_MAIN;
    }
    else if (chainName === ChainName.SEPOLIA) {
        return SNconstants.StarknetChainId.SN_SEPOLIA;
    }
    else {
        return "Unknown";
    }
};

export function toU256(value: string | number) {
  const bigIntValue = BigInt(value);
  return {
    low: (
      bigIntValue & BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
    ).toString(),
    high: (bigIntValue >> BigInt(128)).toString(),
  };
}



export function formatDate(dateString: string) {
    const date = new Date(dateString)
  
    // Check if the date is today
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      return "Today"
    }
  
    // Check if the date is yesterday
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }
  
    // If within the last 7 days, show the day name
    const oneWeekAgo = new Date(today)
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    if (date > oneWeekAgo) {
      return date.toLocaleDateString("en-US", { weekday: "long" })
    }
  
    // Otherwise, show the date
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }


  // Utility function to convert decimal string (felt252) to hex string
  export const decToHexAddress = (decimal: string): string => {
    try {
      const bigIntValue = BigInt(decimal);
      const hex = bigIntValue.toString(16).padStart(64, "0"); // Pad to 64 chars (32 bytes)
      return `0x${hex}`;
    } catch (error) {
      console.error(`Error converting decimal ${decimal} to hex:`, error);
      return "";
    }
  };

  export function hexToDecAddress(hex: string): string {
    try {
      if (!hex.startsWith("0x")) return "0";
      return BigInt(hex).toString(10);
    } catch (error) {
      console.error(`Error converting hex ${hex} to decimal:`, error);
      return "0";
    }
  }