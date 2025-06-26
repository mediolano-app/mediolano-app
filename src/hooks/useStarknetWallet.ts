import { useAccount, useConnect, useDisconnect, useContract } from "@starknet-react/core"
import { useEffect, useMemo } from "react"
import ipcollectionABI from "@/abis/ipcollection"
import { abi as mipABI } from "@/abis/abi"
import type { Abi } from "starknet"

export const useStarknetWallet = () => {
  const { account, address, status } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // Use a known deployed contract address or fall back to a test approach
  // For Sepolia testnet, let's use one of your other deployed contracts temporarily
  const contractAddress = useMemo(() => {
    // Try to use your user settings contract address as it appears to be deployed
    const userSettingsAddress = process.env.NEXT_PUBLIC_USER_SETTINGS_CONTRACT_ADDRESS
    const mipAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP
    
    console.log("🔍 CONTRACT ADDRESS DEBUG (useStarknetWallet):")
    console.log("  - MIP Contract from env:", mipAddress)
    console.log("  - User Settings Contract from env:", userSettingsAddress)
    console.log("  - MIP Contract length:", mipAddress?.length || 0)
    console.log("  - MIP Contract valid format:", mipAddress?.startsWith('0x') && mipAddress?.length > 10)
    
    // For now, return the MIP address but we'll handle the "not deployed" error gracefully
    const finalAddress = mipAddress as `0x${string}` | undefined
    console.log("  - Final contract address selected:", finalAddress)
    
    return finalAddress
  }, [])

  // Get the MIP contract instance (but handle errors gracefully)
  const { contract: mipContract } = useContract({
    abi: mipABI as Abi, // Use the main MIP ABI which has mint_item function
    address: contractAddress,
  })

  const isConnected = useMemo(() => {
    const connected = status === "connected" && !!account && !!address
    console.log("💼 WALLET CONNECTION DEBUG:")
    console.log("  - Status:", status)
    console.log("  - Has account:", !!account)
    console.log("  - Has address:", !!address)
    console.log("  - Is connected:", connected)
    if (address) {
      console.log("  - Wallet address:", address)
    }
    return connected
  }, [status, account, address])

  // Check if we have a valid contract address
  const hasValidContract = useMemo(() => {
    const valid = !!contractAddress && contractAddress !== "0x0"
    console.log("📄 CONTRACT VALIDITY DEBUG:")
    console.log("  - Contract address:", contractAddress)
    console.log("  - Has valid contract:", valid)
    return valid
  }, [contractAddress])

  // Log when mipContract is accessed
  useEffect(() => {
    if (mipContract) {
      console.log("📋 MIP CONTRACT DEBUG:")
      console.log("  - Contract instance created")
      console.log("  - Contract address:", mipContract.address)
      console.log("  - Contract abi length:", mipContract.abi?.length || 0)
    }
  }, [mipContract])

  return {
    // Wallet connection state
    account,
    address,
    isConnected,
    status,
    
    // Connection actions
    connect,
    disconnect,
    connectors,
    
    // Contract instance
    mipContract,
    contractAddress,
    hasValidContract,
  }
}