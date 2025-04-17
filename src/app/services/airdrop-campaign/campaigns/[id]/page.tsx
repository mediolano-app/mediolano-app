"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Calendar, CheckCircle, Clock, Copy, ExternalLink, Share2, Users } from "lucide-react"
import type { Campaign, Task } from "@/app/services/airdrop-campaign/lib/types"
import { formatDate, truncateAddress } from "@/app/services/airdrop-campaign/lib/utils"
import { getCampaignById, mockParticipateInCampaign } from "@/app/services/airdrop-campaign/lib/data"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export default function CampaignDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isParticipating, setIsParticipating] = useState(false)
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [isJoining, setIsJoining] = useState(false)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        if (!params.id) {
          throw new Error("Campaign ID is missing")
        }

        const campaignData = await getCampaignById(params.id)
        setCampaign(campaignData)

        // Check if user is already participating
        const userParticipation = campaignData.participants > 0 && Math.random() > 0.7
        setIsParticipating(userParticipation)

        if (userParticipation) {
          // Simulate some completed tasks
          const completed = campaignData.tasks.filter(() => Math.random() > 0.5).map((task) => task.id)
          setCompletedTasks(completed)
        }
      } catch (error) {
        console.error("Failed to fetch campaign:", error)
        toast({
          title: "Error loading campaign",
          description: "There was a problem loading the campaign details",
          variant: "destructive",
        })
        // Instead of redirecting, set an error state that we can display
        setCampaign(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaign()
  }, [params.id])

  const handleTaskComplete = (taskId: string) => {
    if (!taskId) return

    setCompletedTasks((prev) => [...prev, taskId])
    toast({
      title: "Task completed",
      description: "You've successfully completed this task",
    })
  }

  const handleParticipate = async () => {
    if (!campaign) return

    setIsJoining(true)

    try {
      await mockParticipateInCampaign(campaign.id)
      setIsParticipating(true)
      toast({
        title: "Joined campaign",
        description: "You've successfully joined this campaign",
      })
    } catch (error) {
      console.error("Failed to participate:", error)
      toast({
        title: "Failed to join",
        description: "There was a problem joining this campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading campaign details...</p>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive">
          <AlertTitle>Campaign not found</AlertTitle>
          <AlertDescription>The campaign you're looking for doesn't exist or has been removed.</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    )
  }

  const progress = Math.round((campaign.participants / campaign.maxParticipants) * 100)
  const allTasksCompleted = isParticipating && completedTasks.length === campaign.tasks.length

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Campaign Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="relative h-64 w-full">
              <img
                src={campaign.image || "/placeholder.svg"}
                alt={campaign.name}
                className="h-full w-full object-cover"
              />
              <Badge
                variant={campaign.status === "active" ? "default" : "secondary"}
                className="absolute top-4 right-4"
              >
                {campaign.status}
              </Badge>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{campaign.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4" />
                    Ends on {formatDate(campaign.endDate)}
                  </CardDescription>
                </div>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{campaign.description}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Campaign Progress</h3>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{campaign.participants} participants</span>
                    </div>
                    <span className="text-muted-foreground">{campaign.maxParticipants} max</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="bg-muted p-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm font-medium">Reward</div>
                      <div className="text-lg font-bold">{campaign.reward} NFTs</div>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm font-medium">Tasks</div>
                      <div className="text-lg font-bold">{campaign.tasks.length} required</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Tasks</CardTitle>
              <CardDescription>Complete these tasks to be eligible for the airdrop</CardDescription>
            </CardHeader>
            <CardContent>
              {campaign.tasks.length > 0 ? (
                <div className="space-y-4">
                  {campaign.tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      isCompleted={completedTasks.includes(task.id)}
                      onComplete={() => handleTaskComplete(task.id)}
                      isParticipating={isParticipating}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">No tasks defined for this campaign</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Participation Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isParticipating ? (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>You're participating!</AlertTitle>
                    <AlertDescription>Complete all tasks to be eligible for the airdrop</AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tasks completed:</span>
                      <span className="font-medium">
                        {completedTasks.length} / {campaign.tasks.length}
                      </span>
                    </div>
                    <Progress value={(completedTasks.length / campaign.tasks.length) * 100} className="h-2" />
                  </div>

                  {allTasksCompleted && (
                    <Alert className="bg-primary/20 text-primary border-primary">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>All tasks completed!</AlertTitle>
                      <AlertDescription>
                        You're eligible to receive {campaign.reward} NFTs when the campaign ends
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    You haven't joined this campaign yet. Join now to participate in the airdrop!
                  </p>
                  <Button
                    className="w-full"
                    onClick={handleParticipate}
                    disabled={campaign.status !== "active" || isJoining}
                  >
                    {isJoining ? "Joining..." : "Join Campaign"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Creator</div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20"></div>
                  <div className="font-medium">{truncateAddress(campaign.creator)}</div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Contract Address</div>
                <div className="flex items-center gap-2">
                  <div className="font-medium">{truncateAddress(campaign.contractAddress)}</div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Created On</div>
                <div className="font-medium">{formatDate(campaign.createdAt)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface TaskItemProps {
  task: Task
  isCompleted: boolean
  onComplete: () => void
  isParticipating: boolean
}

function TaskItem({ task, isCompleted, onComplete, isParticipating }: TaskItemProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">{task.title}</h3>
          <p className="text-sm text-muted-foreground">{task.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {task.type}
            </Badge>
            {task.verificationUrl && (
              <Button variant="link" size="sm" className="h-auto p-0" asChild>
                <a
                  href={task.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <span className="text-xs">Verify</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </div>

        {isParticipating &&
          (isCompleted ? (
            <Button variant="outline" size="sm" className="gap-1" disabled>
              <CheckCircle className="h-4 w-4 text-primary" />
              Completed
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={onComplete}>
              Mark as Complete
            </Button>
          ))}
      </div>
    </div>
  )
}

