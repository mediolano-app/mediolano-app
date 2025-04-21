"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Check, Eye, Image, Plus, Trash } from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Types and utilities
import type { Task, TaskType } from "@/app/services/airdrop-campaign/lib/types"
import { mockCreateCampaign } from "@/app/services/airdrop-campaign/lib/blockchain"

export default function CreateCampaignPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState("details")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "/background.jpg",
    maxParticipants: 1000,
    reward: 1,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  })

  // Task form state
  const [taskForm, setTaskForm] = useState<Task>({
    id: "",
    title: "",
    description: "",
    type: "social",
    verificationUrl: "",
  })

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue > 0) {
      setFormData((prev) => ({ ...prev, [name]: numValue }))
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, endDate: date }))
    }
  }

  // Task form handlers
  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTaskForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleTaskTypeChange = (value: string) => {
    setTaskForm((prev) => ({ ...prev, type: value as TaskType }))
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()

    if (!taskForm.title || !taskForm.description) {
      toast({
        title: "Missing task information",
        description: "Please provide a title and description for the task",
        variant: "destructive",
      })
      return
    }

    const newTask: Task = {
      ...taskForm,
      id: crypto.randomUUID(),
    }

    setTasks((prev) => [...prev, newTask])

    // Reset task form
    setTaskForm({
      id: "",
      title: "",
      description: "",
      type: "social",
      verificationUrl: "",
    })

    toast({
      title: "Task added",
      description: "Task has been added to your campaign",
    })
  }

  const handleRemoveTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    toast({
      title: "Task removed",
      description: "Task has been removed from your campaign",
    })
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Missing campaign name",
        description: "Please provide a name for your campaign",
        variant: "destructive",
      })
      setActiveTab("details")
      return
    }

    if (!formData.description.trim()) {
      toast({
        title: "Missing campaign description",
        description: "Please provide a description for your campaign",
        variant: "destructive",
      })
      setActiveTab("details")
      return
    }

    if (tasks.length === 0) {
      toast({
        title: "No tasks added",
        description: "Please add at least one task for your campaign",
        variant: "destructive",
      })
      setActiveTab("tasks")
      return
    }

    setIsSubmitting(true)

    try {
      const campaignData = {
        ...formData,
        tasks,
        status: "active",
        participants: 0,
        createdAt: new Date(),
      }

      const campaignId = await mockCreateCampaign(campaignData)

      toast({
        title: "Campaign created successfully",
        description: `Your campaign "${formData.name}" has been created`,
      })

      // Redirect to dashboard after successful creation
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to create campaign:", error)
      toast({
        title: "Failed to create campaign",
        description: "There was an error creating your campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completed = 0
    let total = 2 // Name and description are required

    if (formData.name.trim()) completed++
    if (formData.description.trim()) completed++
    if (tasks.length > 0) completed++

    total++ // Add tasks to total

    return Math.round((completed / total) * 100)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Create Airdrop Campaign</h1>
        </div>
        <Button variant="outline" onClick={() => setActiveTab("preview")} className="hidden md:flex items-center gap-2">
          <Eye className="h-4 w-4" /> Preview Campaign
        </Button>
      </div>

      <div className="mb-6">
        <Progress value={calculateCompletion()} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>Campaign Setup Progress</span>
          <span>{calculateCompletion()}% Complete</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Campaign Details</TabsTrigger>
            <TabsTrigger value="tasks">Tasks & Eligibility</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Campaign Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Define the core details of your NFT airdrop campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter a catchy name for your campaign"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Campaign Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what your campaign is about and why users should participate"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    A clear description helps users understand your campaign's purpose and increases participation.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Campaign Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      name="image"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={handleInputChange}
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add an eye-catching image that represents your campaign (recommended size: 1200x630px)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Parameters</CardTitle>
                <CardDescription>Set the parameters that define how your campaign will operate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Maximum Participants *</Label>
                    <Input
                      id="maxParticipants"
                      name="maxParticipants"
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={handleNumberChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      The maximum number of users who can participate in your campaign
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward">NFTs Per Participant *</Label>
                    <Input
                      id="reward"
                      name="reward"
                      type="number"
                      min="1"
                      value={formData.reward}
                      onChange={handleNumberChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of NFTs each eligible participant will receive
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Campaign End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={formData.endDate}
                        onSelect={handleDateChange}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">
                    The date when your campaign will end and NFTs will be distributed
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button type="button" onClick={() => setActiveTab("tasks")}>
                  Continue to Tasks
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Tasks</CardTitle>
                <CardDescription>Define tasks users must complete to be eligible for your airdrop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Task Form */}
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Add New Task</CardTitle>
                    <CardDescription>Create tasks for users to complete to qualify for your airdrop</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="taskTitle">Task Title *</Label>
                        <Input
                          id="taskTitle"
                          name="title"
                          placeholder="Follow on Twitter"
                          value={taskForm.title}
                          onChange={handleTaskInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="taskDescription">Task Description *</Label>
                        <Textarea
                          id="taskDescription"
                          name="description"
                          placeholder="Follow our official Twitter account to qualify for the airdrop"
                          value={taskForm.description}
                          onChange={handleTaskInputChange}
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="taskType">Task Type *</Label>
                          <Select value={taskForm.type} onValueChange={handleTaskTypeChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select task type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="social">Social Media</SelectItem>
                              <SelectItem value="community">Community</SelectItem>
                              <SelectItem value="transaction">Transaction</SelectItem>
                              <SelectItem value="referral">Referral</SelectItem>
                              <SelectItem value="quiz">Quiz/Survey</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="verificationUrl">Verification URL (Optional)</Label>
                          <Input
                            id="verificationUrl"
                            name="verificationUrl"
                            placeholder="https://twitter.com/username"
                            value={taskForm.verificationUrl}
                            onChange={handleTaskInputChange}
                          />
                        </div>
                      </div>

                      <Button type="button" onClick={handleAddTask} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Task
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Task List */}
                {tasks.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Added Tasks ({tasks.length})</h3>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"} Added
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{task.title}</h4>
                              <TaskTypeBadge type={task.type} />
                            </div>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                            {task.verificationUrl && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span>Verification URL:</span>
                                <span className="text-primary underline">{task.verificationUrl}</span>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTask(task.id)}
                            type="button"
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md bg-muted/50">
                    <p className="text-muted-foreground mb-2">No tasks added yet</p>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Add at least one task that users must complete to be eligible for your airdrop
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                  Back to Details
                </Button>
                <Button type="button" onClick={() => setActiveTab("preview")} disabled={tasks.length === 0}>
                  Continue to Preview
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Preview</CardTitle>
                <CardDescription>Review your campaign before creating it</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <div className="relative h-64 w-full">
                        <img
                          src={formData.image || "/placeholder.svg?height=400&width=600"}
                          alt={formData.name}
                          className="h-full w-full object-cover rounded-t-lg"
                        />
                        <Badge variant="default" className="absolute top-4 right-4">
                          active
                        </Badge>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-2xl">{formData.name || "Campaign Name"}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <Calendar className="h-4 w-4" />
                              Ends on {format(formData.endDate, "PPP")}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-6">
                          {formData.description || "Campaign description will appear here."}
                        </p>

                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium mb-2">Campaign Progress</h3>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <div className="flex items-center gap-1">
                                <span>0 participants</span>
                              </div>
                              <span className="text-muted-foreground">{formData.maxParticipants} max</span>
                            </div>
                            <Progress value={0} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Campaign Tasks</CardTitle>
                        <CardDescription>Tasks users must complete to be eligible</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {tasks.length > 0 ? (
                          <div className="space-y-4">
                            {tasks.map((task) => (
                              <div key={task.id} className="border rounded-lg p-4">
                                <div className="space-y-1">
                                  <h3 className="font-medium">{task.title}</h3>
                                  <p className="text-sm text-muted-foreground">{task.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <TaskTypeBadge type={task.type} />
                                  </div>
                                </div>
                              </div>
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
                        <CardTitle>Campaign Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Campaign Name</div>
                          <div className="font-medium">{formData.name || "Not set"}</div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Maximum Participants</div>
                          <div className="font-medium">{formData.maxParticipants}</div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-1">NFTs Per Participant</div>
                          <div className="font-medium">{formData.reward}</div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-1">End Date</div>
                          <div className="font-medium">{format(formData.endDate, "PPP")}</div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Number of Tasks</div>
                          <div className="font-medium">{tasks.length}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                      <CardHeader>
                        <CardTitle>Ready to Launch?</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">
                          Review all details carefully before creating your campaign. Once created, your campaign will
                          be immediately visible to users.
                        </p>

                        <div className="space-y-2">
                          {!formData.name.trim() && (
                            <div className="flex items-center gap-2 text-sm text-destructive">
                              <span>• Campaign name is required</span>
                            </div>
                          )}
                          {!formData.description.trim() && (
                            <div className="flex items-center gap-2 text-sm text-destructive">
                              <span>• Campaign description is required</span>
                            </div>
                          )}
                          {tasks.length === 0 && (
                            <div className="flex items-center gap-2 text-sm text-destructive">
                              <span>• At least one task is required</span>
                            </div>
                          )}
                          {formData.name.trim() && formData.description.trim() && tasks.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <Check className="h-4 w-4" />
                              <span>Your campaign is ready to launch!</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab("tasks")}>
                  Back to Tasks
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || tasks.length === 0 || !formData.name.trim() || !formData.description.trim()}
                >
                  {isSubmitting ? "Creating..." : "Create Campaign"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}

// Helper component for task type badges
function TaskTypeBadge({ type }: { type: string }) {
  let color = "bg-primary/10 text-primary hover:bg-primary/20"

  switch (type) {
    case "social":
      color = "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      break
    case "community":
      color = "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      break
    case "transaction":
      color = "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      break
    case "referral":
      color = "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
      break
    case "quiz":
      color = "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20"
      break
  }

  return (
    <Badge variant="outline" className={`${color} border-0 text-xs`}>
      {type}
    </Badge>
  )
}

