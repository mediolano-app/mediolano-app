import { ArgentWebWallet } from "@argent/webwallet-sdk"

export const argentWebWallet = ArgentWebWallet.init({
  appName: "Test dapp",
  environment: "mainnet", // Or sepolia
  sessionParams: {
    allowedMethods: [
      {
        contract: "0x0", // Your contract here - It needs to be whitelisted by Argent
        selector: "method_name" // Method selector here
      }
    ],
    validityDays: 15 // Session validity period - you choose or it will fallback to maximum set by WebWallet (usually 30 days)
  }
})