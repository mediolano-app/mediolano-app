// Mock blockchain integration functions

// Mock function to connect wallet
export async function mockConnectWallet(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        // Generate a random Ethereum address
        const address = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
        resolve(address)
      }, 1000)
    } catch (error) {
      reject(new Error("Failed to connect wallet"))
    }
  })
}

// Mock function to disconnect wallet
export async function mockDisconnectWallet(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve()
      }, 500)
    } catch (error) {
      reject(new Error("Failed to disconnect wallet"))
    }
  })
}

// Mock function to create a campaign
export async function mockCreateCampaign(campaignData: any): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        // Generate a random campaign ID
        const campaignId = "campaign-" + Math.random().toString(36).substring(2, 10)
        console.log("Campaign created:", campaignData)
        resolve(campaignId)
      }, 2000)
    } catch (error) {
      reject(new Error("Failed to create campaign"))
    }
  })
}

// Mock function to get campaign data from blockchain
export async function mockGetCampaignData(campaignId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        // Check if campaignId is valid
        if (!campaignId) {
          reject(new Error("Invalid campaign ID"))
          return
        }

        resolve({
          id: campaignId,
          contractAddress:
            "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
          // Other blockchain-specific data
        })
      }, 1000)
    } catch (error) {
      reject(new Error(`Failed to get campaign data: ${error}`))
    }
  })
}

// Mock function to verify task completion
export async function mockVerifyTaskCompletion(campaignId: string, taskId: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        // Validate inputs
        if (!campaignId || !taskId) {
          reject(new Error("Invalid campaign or task ID"))
          return
        }

        // Simulate verification with 90% success rate
        const isVerified = Math.random() > 0.1
        resolve(isVerified)
      }, 1500)
    } catch (error) {
      reject(new Error("Failed to verify task completion"))
    }
  })
}

// Mock function to claim rewards
export async function mockClaimRewards(campaignId: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        // Validate input
        if (!campaignId) {
          reject(new Error("Invalid campaign ID"))
          return
        }

        // Simulate claiming with 95% success rate
        const isSuccess = Math.random() > 0.05
        resolve(isSuccess)
      }, 2000)
    } catch (error) {
      reject(new Error("Failed to claim rewards"))
    }
  })
}

