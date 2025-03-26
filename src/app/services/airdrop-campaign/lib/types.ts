export type TaskType = "social" | "community" | "transaction" | "referral" | "quiz"

export interface Task {
  id: string
  title: string
  description: string
  type: TaskType
  verificationUrl?: string
}

export type CampaignStatus = "active" | "completed" | "upcoming"

export interface Campaign {
  id: string
  name: string
  description: string
  image: string
  creator: string
  contractAddress: string
  status: CampaignStatus
  participants: number
  maxParticipants: number
  reward: number
  tasks: Task[]
  createdAt: Date
  endDate: Date
}

