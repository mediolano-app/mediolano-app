import { useAccount, useConnect, useDisconnect, useContract } from "@starknet-react/core"
import { useMemo } from "react"
import { abi as mipABI } from "@/abis/abi"
import type { Abi } from "starknet"

export const useStarknetWallet = () => {
  const { account, address, status } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // Use a known deployed contract address or fall back to a test approach
  // For Sepolia testnet, let's use one of your other deployed contracts temporarily
  const contractAddress = useMemo(() => {
    const userSettingsAddress = process.env.NEXT_PUBLIC_USER_SETTINGS_CONTRACT_ADDRESS
    const mipAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP
    
    // For now, return the MIP address but we'll handle the "not deployed" error gracefully
    const finalAddress = mipAddress as `0x${string}` | undefined
    
    return finalAddress
  }, [])

  // Get the MIP contract instance (but handle errors gracefully)
  const { contract: mipContract } = useContract({
    abi: mipABI as Abi, // Use the main MIP ABI which has mint_item function
    address: contractAddress,
  })

  const isConnected = useMemo(() => {
    return status === "connected" && !!account && !!address
  }, [status, account, address])

  // Check if we have a valid contract address
  const hasValidContract = useMemo(() => {
    return !!contractAddress && contractAddress !== "0x0"
  }, [contractAddress])

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