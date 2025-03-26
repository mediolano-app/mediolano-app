"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task, TaskType } from "@/app/services/airdrop-campaign/lib/types"
import { Plus } from "lucide-react"

interface TaskFormProps {
  onAddTask: (task: Task) => void
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [task, setTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    type: "social",
    verificationUrl: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTypeChange = (value: string) => {
    setTask((prev) => ({
      ...prev,
      type: value as TaskType,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!task.title || !task.description || !task.type) {
      return
    }

    onAddTask({
      ...task,
      id: crypto.randomUUID(),
    })

    // Reset form
    setTask({
      id: "",
      title: "",
      description: "",
      type: "social",
      verificationUrl: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-md p-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Follow on Twitter"
          value={task.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Task Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Follow our official Twitter account to qualify for the airdrop"
          value={task.description}
          onChange={handleChange}
          required
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Task Type</Label>
          <Select value={task.type} onValueChange={handleTypeChange}>
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
            value={task.verificationUrl}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Task
      </Button>
    </form>
  )
}

