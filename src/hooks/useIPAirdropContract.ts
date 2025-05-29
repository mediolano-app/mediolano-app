"use client"

import { useContract, useAccount } from "@starknet-react/core"
import { type Contract, uint256, shortString, Abi, } from "starknet"
import { useCallback, useState } from "react"
import { ipAirdropAbi } from "@/abis/ip_airdrop"
import type { Campaign, Task } from "@/app/services/airdrop-campaign/lib/types"

// Contract address from environment variable
const contractAddress = process.env.NEXT_PUBLIC_IP_AIRDROP_CONTRACT_ADDRESS?.startsWith("0x")
  ? (process.env.NEXT_PUBLIC_IP_AIRDROP_CONTRACT_ADDRESS as `0x${string}`)
  : (`0x${process.env.NEXT_PUBLIC_IP_AIRDROP_CONTRACT_ADDRESS || ""}` as `0x${string}`)

export function useIPAirdropContract() {
  const { contract } = useContract({
    abi: ipAirdropAbi as Abi,
    address: contractAddress,
  })
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)

  // Create a new airdrop campaign
  const createCampaign = useCallback(
    async (campaignData: {
      tokenAddress: string
      name: string
      description: string
      image: string
      rewardPerUser: number
      maxParticipants: number
      endDate: Date
    }): Promise<string> => {
      if (!contract || !address) {
        throw new Error("Contract not initialized or wallet not connected")
      }

      setIsLoading(true)
      try {
        const startTime = Math.floor(Date.now() / 1000)
        const endTime = Math.floor(campaignData.endDate.getTime() / 1000)

        const result = await contract.functions.create_campaign({
          token_address: campaignData.tokenAddress,
          name: shortString.encodeShortString(campaignData.name),
          description: shortString.encodeShortString(campaignData.description),
          image_url: shortString.encodeShortString(campaignData.image),
          reward_per_user: uint256.bnToUint256(campaignData.rewardPerUser),
          max_participants: campaignData.maxParticipants,
          start_time: startTime,
          end_time: endTime,
        })

        return result.campaign_id.toString()
      } catch (error) {
        console.error("Failed to create campaign:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [contract, address],
  )

  // Add a task to a campaign
  const addTask = useCallback(
    async (
      campaignId: string,
      task: {
        title: string
        description: string
        type: string
        verificationUrl?: string
      },
    ): Promise<string> => {
      if (!contract || !address) {
        throw new Error("Contract not initialized or wallet not connected")
      }

      setIsLoading(true)
      try {
        const result = await contract.functions.add_task({
          campaign_id: campaignId,
          title: shortString.encodeShortString(task.title),
          description: shortString.encodeShortString(task.description),
          task_type: shortString.encodeShortString(task.type),
          verification_url: shortString.encodeShortString(task.verificationUrl || ""),
        })

        return result.task_id.toString()
      } catch (error) {
        console.error("Failed to add task:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [contract, address],
  )

  // Join a campaign
  const joinCampaign = useCallback(
    async (campaignId: string): Promise<void> => {
      if (!contract || !address) {
        throw new Error("Contract not initialized or wallet not connected")
      }

      setIsLoading(true)
      try {
        await contract.functions.join_campaign({
          campaign_id: campaignId,
        })
      } catch (error) {
        console.error("Failed to join campaign:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [contract, address],
  )

  // Complete a task
  const completeTask = useCallback(
    async (campaignId: string, taskId: string): Promise<void> => {
      if (!contract || !address) {
        throw new Error("Contract not initialized or wallet not connected")
      }

      setIsLoading(true)
      try {
        await contract.functions.complete_task({
          campaign_id: campaignId,
          task_id: taskId,
        })
      } catch (error) {
        console.error("Failed to complete task:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [contract, address],
  )

  // Claim rewards
  const claimRewards = useCallback(
    async (campaignId: string): Promise<void> => {
      if (!contract || !address) {
        throw new Error("Contract not initialized or wallet not connected")
      }

      setIsLoading(true)
      try {
        await contract.functions.claim_rewards({
          campaign_id: campaignId,
        })
      } catch (error) {
        console.error("Failed to claim rewards:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [contract, address],
  )

  // Get a campaign by ID
  const getCampaign = useCallback(
    async (campaignId: string): Promise<Campaign | null> => {
      if (!contract) {
        throw new Error("Contract not initialized")
      }

      setIsLoading(true)
      try {
        const result = await contract.functions.get_campaign({
          campaign_id: campaignId,
        })

        if (!result.campaign) {
          return null
        }

        const [
          creator,
          tokenAddress,
          name,
          description,
          imageUrl,
          rewardPerUser,
          maxParticipants,
          participants,
          startTime,
          endTime,
          taskCount,
          isClosed,
        ] = result.campaign

        // Get tasks for this campaign
        const tasksResult = await contract.functions.get_campaign_tasks({
          campaign_id: campaignId,
        })

        const tasks: Task[] = tasksResult.tasks.map((task: any) => ({
          id: task[0].toString(),
          title: shortString.decodeShortString(task[1]),
          description: shortString.decodeShortString(task[2]),
          type: shortString.decodeShortString(task[3]) as any,
          verificationUrl: shortString.decodeShortString(task[4]),
        }))

        // Check if current user is participating
        let isParticipating = false
        let completedTasks: string[] = []

        if (address) {
          const participatingResult = await contract.functions.is_user_participating({
            campaign_id: campaignId,
            user: address,
          })

          isParticipating = participatingResult.is_participating

          if (isParticipating) {
            const completedTasksResult = await contract.functions.get_user_completed_tasks({
              campaign_id: campaignId,
              user: address,
            })

            completedTasks = completedTasksResult.task_ids.map((id: any) => id.toString())
          }
        }

        const status: "active" | "completed" | "upcoming" = isClosed
          ? "completed"
          : Date.now() / 1000 < startTime
            ? "upcoming"
            : "active"

        return {
          id: campaignId,
          name: shortString.decodeShortString(name),
          description: shortString.decodeShortString(description),
          image: shortString.decodeShortString(imageUrl),
          creator: creator.toString(),
          contractAddress: tokenAddress.toString(),
          status,
          participants: Number(participants),
          maxParticipants: Number(maxParticipants),
          reward: Number(uint256.uint256ToBN(rewardPerUser)),
          tasks,
          createdAt: new Date(Number(startTime) * 1000),
          endDate: new Date(Number(endTime) * 1000),
          isParticipating,
          completedTasks,
        }
      } catch (error) {
        console.error("Failed to get campaign:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [contract, address],
  )

  // Get all campaigns
  const getAllCampaigns = useCallback(async (): Promise<Campaign[]> => {
    if (!contract) {
      throw new Error("Contract not initialized")
    }

    setIsLoading(true)
    try {
      const result = await contract.functions.get_all_campaigns()
      const campaignIds = result.campaign_ids.map((id: any) => id.toString())

      const campaigns: Campaign[] = []
      for (const id of campaignIds) {
        try {
          const campaign = await getCampaign(id)
          if (campaign) {
            campaigns.push(campaign)
          }
        } catch (error) {
          console.error(`Error fetching campaign ${id}:`, error)
        }
      }

      return campaigns
    } catch (error) {
      console.error("Failed to get all campaigns:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [contract, getCampaign])

  // Get user campaigns
  const getUserCampaigns = useCallback(async (): Promise<Campaign[]> => {
    if (!contract || !address) {
      throw new Error("Contract not initialized or wallet not connected")
    }

    setIsLoading(true)
    try {
      const result = await contract.functions.get_user_campaigns({
        user: address,
      })

      const campaignIds = result.campaign_ids.map((id: any) => id.toString())

      const campaigns: Campaign[] = []
      for (const id of campaignIds) {
        try {
          const campaign = await getCampaign(id)
          if (campaign) {
            campaigns.push(campaign)
          }
        } catch (error) {
          console.error(`Error fetching campaign ${id}:`, error)
        }
      }

      return campaigns
    } catch (error) {
      console.error("Failed to get user campaigns:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [contract, address, getCampaign])

  return {
    contract: contract as Contract,
    isLoading,
    createCampaign,
    addTask,
    joinCampaign,
    completeTask,
    claimRewards,
    getCampaign,
    getAllCampaigns,
    getUserCampaigns,
  }
}

