import { Contract, uint256, AccountInterface } from "starknet"
import type { Abi } from "starknet"
import { abi as mipABI } from "@/abis/abi" // Use the main MIP ABI instead of ipcollection

export interface TokenMetadata {
  name: string
  description: string
  image: string
  attributes: Record<string, string | number>[]
  properties: Record<string, string | number>
}

export interface MintNFTParams {
  account: AccountInterface
  contractAddress: string
  recipientAddress: string
  tokenMetadata: TokenMetadata
  ipfsHash: string
  ipfsUrl: string
}

export interface MintResult {
  success: boolean
  transactionHash?: string
  tokenId?: string
  error?: string
  receipt?: Record<string, unknown>
}

export class StarknetMintingService {
  /**
   * Mint a real NFT on Starknet using the MIP contract with public minting
   */
  static async mintTwitterPostNFT(params: MintNFTParams): Promise<MintResult> {
    const { account, contractAddress, recipientAddress, ipfsUrl } = params

    try {
      console.log("🚀 Starting real Starknet NFT minting with public mint function...")
      console.log("🔍 STARKNET MINTING DEBUG INFO:")
      console.log("  - Contract address:", contractAddress)
      console.log("  - Contract address type:", typeof contractAddress)
      console.log("  - Contract address length:", contractAddress?.length || 0)
      console.log("  - Contract address starts with 0x:", contractAddress?.startsWith('0x'))
      console.log("  - Recipient address:", recipientAddress)
      console.log("  - Account address:", account.address)
      console.log("  - IPFS URL:", ipfsUrl)
      console.log("  - IPFS hash:", params.ipfsHash)
      
      // Log detailed account information
      console.log("👤 ACCOUNT DEBUG INFO:")
      console.log("  - Account type:", typeof account)
      console.log("  - Account has address:", !!account.address)
      console.log("  - Account methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(account)))

      // Check if contract address is provided
      if (!contractAddress || contractAddress === "0x0") {
        console.error("❌ INVALID CONTRACT ADDRESS:")
        console.error("  - Contract address:", contractAddress)
        console.error("  - Environment NEXT_PUBLIC_CONTRACT_ADDRESS_MIP:", process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP)
        throw new Error("No valid contract address configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS_MIP in your environment variables.")
      }

      // Create contract instance using the MIP ABI (which has mint_item function)
      console.log("📄 Creating contract instance...")
      console.log("  - Using ABI: MIP ABI (has mint_item function)")
      console.log("  - Contract address for instance:", contractAddress)
      
      const contract = new Contract(mipABI as Abi, contractAddress, account)
      
      console.log("✅ Contract instance created successfully with MIP ABI")
      console.log("  - Contract instance address:", contract.address)
      console.log("  - Contract instance methods:", Object.getOwnPropertyNames(contract))

      // Check if the recipient address is valid (not zero address)
      if (!recipientAddress || recipientAddress === "0x0") {
        throw new Error("Invalid recipient address")
      }

      // First, let's check if the contract exists by trying to call a view function
      try {
        console.log("🔍 Checking if contract is deployed...")
        console.log("  - Calling contract.call('name') to test deployment...")
        const contractName = await contract.call("name")
        console.log("✅ Contract is deployed and accessible")
        console.log("  - Contract name:", contractName)
      } catch (contractCheckError) {
        console.error("❌ Contract check failed:", contractCheckError)
        console.error("  - Error type:", typeof contractCheckError)
        console.error("  - Error message:", contractCheckError instanceof Error ? contractCheckError.message : contractCheckError)
        console.error("  - Error stack:", contractCheckError instanceof Error ? contractCheckError.stack : 'No stack')
        
        // Check if it's a "contract not deployed" error
        if (contractCheckError instanceof Error && 
            (contractCheckError.message.includes("not deployed") || 
             contractCheckError.message.includes("Contract not found"))) {
          throw new Error(`Contract ${contractAddress} is not deployed on this network. Please check:
1. You're connected to the correct network (Sepolia/Mainnet)
2. The contract address is correct
3. The contract has been deployed

Current contract address: ${contractAddress}
Please contact the administrator to deploy the contract or use a different address.`)
        }
        
        // For other errors, let's continue and see if minting works
        console.warn("⚠️ Contract check failed, but continuing with mint attempt...")
      }

      // Prepare the metadata URI for the NFT
      const tokenURI = ipfsUrl || `ipfs://${params.ipfsHash}`
      console.log("🏷️ Token URI prepared:", tokenURI)

      // Call the mint_item function - this should be publicly accessible
      console.log("📝 Preparing mint_item transaction...")
      console.log("  - Function to call: mint_item")
      console.log("  - Parameters: [recipientAddress, tokenURI]")
      console.log("  - Recipient address param:", recipientAddress)
      console.log("  - Token URI param:", tokenURI)
      
      const mintCall = contract.populate("mint_item", [recipientAddress, tokenURI])

      console.log("📝 Mint call prepared successfully:")
      console.log("  - Contract address in call:", mintCall.contractAddress)
      console.log("  - Entrypoint:", mintCall.entrypoint)
      console.log("  - Calldata length:", mintCall.calldata?.length || 0)
      console.log("  - Calldata:", mintCall.calldata)

      // Estimate gas first to catch potential failures
      try {
        console.log("⛽ Estimating gas for mint_item transaction...")
        console.log("  - Account for estimation:", account.address)
        console.log("  - Call details:", {
          contractAddress: mintCall.contractAddress,
          entrypoint: mintCall.entrypoint,
          calldataLength: mintCall.calldata?.length || 0
        })
        
        const estimate = await account.estimateFee(mintCall)
        console.log("✅ Gas estimation successful!")
        console.log("  - Gas consumed:", estimate.gas_consumed)
        console.log("  - Gas price:", estimate.gas_price)
        console.log("  - Overall fee:", estimate.overall_fee)
        
      } catch (estimateError) {
        console.error("❌ Gas estimation failed:")
        console.error("  - Error type:", typeof estimateError)
        console.error("  - Error message:", estimateError instanceof Error ? estimateError.message : estimateError)
        console.error("  - Error stack:", estimateError instanceof Error ? estimateError.stack : 'No stack')
        
        // Provide more specific error messages based on the error
        if (estimateError instanceof Error) {
          if (estimateError.message.includes("not deployed") || 
              estimateError.message.includes("Contract not found")) {
            throw new Error(`The contract at address ${contractAddress} is not deployed on this network.

Possible solutions:
1. Check if you're connected to the correct network (Sepolia testnet vs Mainnet)
2. Verify the contract address in your environment variables
3. Deploy the contract to this network
4. Use a different contract address that is already deployed

Current network: Check your wallet connection
Contract address: ${contractAddress}`)
          }
          
          if (estimateError.message.includes("Caller is not the owner")) {
            throw new Error("Contract doesn't allow public minting. Please contact the administrator.")
          }
          
          if (estimateError.message.includes("execution error")) {
            throw new Error("Transaction would fail. Please check contract state and parameters.")
          }
          
          if (estimateError.message.includes("invalid contract")) {
            throw new Error("Contract not found. Please check the contract address.")
          }
        }
        
        throw new Error(`Transaction estimation failed: ${estimateError instanceof Error ? estimateError.message : 'Unknown error'}

This usually means:
1. The contract is not deployed on this network
2. The function doesn't exist in the contract
3. You don't have permission to call this function

Contract address: ${contractAddress}
Function: mint_item`)
      }

      // Execute the transaction
      console.log("⛓️ Executing mint_item transaction...")
      const result = await account.execute(mintCall)

      console.log("✅ Transaction executed successfully!")
      console.log("Transaction hash:", result.transaction_hash)

      // Wait for transaction confirmation
      console.log("⏳ Waiting for transaction confirmation...")
      const receipt = await account.waitForTransaction(result.transaction_hash)

      console.log("🎉 Transaction confirmed!")
      console.log("Receipt status:", receipt.execution_status || 'ACCEPTED')

      // Extract token ID from events or return value
      let tokenId: string | undefined

      if ('events' in receipt && Array.isArray(receipt.events)) {
        console.log("🔍 Looking for Transfer event in receipt...")
        console.log("Number of events:", receipt.events.length)
        
        // Look for Transfer event (from 0x0 to recipient)
        for (const event of receipt.events) {
          console.log("Event keys:", event.keys)
          console.log("Event data:", event.data)
          
          // Transfer event has 4 keys: [event_hash, from, to, token_id]
          if (event.keys && event.keys.length >= 4) {
            const from = event.keys[1]
            const to = event.keys[2]
            const eventTokenId = event.keys[3]
            
            // Check if this is a mint (transfer from 0x0)
            if (from === "0x0" && to === recipientAddress) {
              tokenId = eventTokenId
              console.log("🏷️ Token ID extracted from Transfer event:", tokenId)
              break
            }
          }
        }
      }

      // If we couldn't extract token ID from events, try to get it from return value or total supply
      if (!tokenId) {
        try {
          console.log("🔢 Attempting to get token ID from total supply...")
          const totalSupply = await contract.call("total_supply")
          tokenId = totalSupply.toString()
          console.log("🏷️ Token ID estimated from total supply:", tokenId)
        } catch (supplyError) {
          console.warn("⚠️ Could not get total supply:", supplyError)
          // Generate a placeholder token ID based on transaction hash
          tokenId = `mint_${result.transaction_hash.slice(-8)}`
          console.log("🏷️ Using hash-based token ID:", tokenId)
        }
      }

      return {
        success: true,
        transactionHash: result.transaction_hash,
        tokenId: tokenId,
        receipt: receipt as unknown as Record<string, unknown>
      }

    } catch (error) {
      console.error("❌ Starknet minting failed:", error)
      
      let errorMessage = "Unknown minting error"
      if (error instanceof Error) {
        errorMessage = error.message
        
        // Handle specific error cases
        if (errorMessage.includes("User refused operation") || errorMessage.includes("USER_REFUSED_OP")) {
          errorMessage = "Transaction was rejected by user"
        } else if (errorMessage.includes("not deployed") || errorMessage.includes("Contract not found")) {
          // This error is already well-formatted from above, so keep it as is
        } else if (errorMessage.includes("Caller is not the owner")) {
          errorMessage = "Contract access denied. Please contact the administrator."
        } else if (errorMessage.includes("execution error")) {
          errorMessage = "Contract execution failed. Please try again or contact support."
        }
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message)
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * Get the Starknet explorer URL for a transaction
   */
  static getTransactionUrl(transactionHash: string, network: 'mainnet' | 'sepolia' = 'sepolia'): string {
    const baseUrl = network === 'mainnet' 
      ? 'https://starkscan.co' 
      : 'https://sepolia.starkscan.co'
    
    return `${baseUrl}/tx/${transactionHash}`
  }

  /**
   * Get the Starknet explorer URL for an NFT token
   */
  static getTokenUrl(contractAddress: string, tokenId: string, network: 'mainnet' | 'sepolia' = 'sepolia'): string {
    const baseUrl = network === 'mainnet' 
      ? 'https://starkscan.co' 
      : 'https://sepolia.starkscan.co'
    
    return `${baseUrl}/token/${contractAddress}/${tokenId}`
  }

  /**
   * Verify if a transaction was successful
   */
  static async verifyTransaction(account: AccountInterface, transactionHash: string): Promise<boolean> {
    try {
      const receipt = await account.waitForTransaction(transactionHash)
      
      // Check finality status for newer Starknet versions
      if ('finality_status' in receipt) {
        return receipt.finality_status === 'ACCEPTED_ON_L2' || receipt.finality_status === 'ACCEPTED_ON_L1'
      }
      
      // Fallback for older versions - need to properly type cast
      const receiptWithStatus = receipt as { status?: string }
      if ('status' in receiptWithStatus) {
        return receiptWithStatus.status === 'ACCEPTED_ON_L2' || receiptWithStatus.status === 'ACCEPTED_ON_L1'
      }
      
      return true // Assume success if we got a receipt
    } catch (error) {
      console.error("Transaction verification failed:", error)
      return false
    }
  }
}