"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Music,
  Palette,
  FileText,
  Hexagon,
  Video,
  Award,
  MessageSquare,
  BookOpen,
  Building,
  Code,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Template {
  id: string
  name: string
  icon: string
  description: string
  examples: string[]
  fields: string[]
  popular: boolean
  color: string
}

interface TemplateCardProps {
  template: Template
  isSelected: boolean
  onSelect: () => void
}

export function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  // Map template icon string to the actual icon component
  const IconComponent = getIconComponent(template.icon)

  // Map color string to Tailwind color classes
  const colorClasses = getColorClasses(template.color)

  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer transition-all hover:shadow-md relative",
        isSelected ? "ring-2 ring-primary ring-offset-2" : "",
      )}
      onClick={onSelect}
    >
      {template.popular && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary/80 text-primary-foreground">Popular</Badge>
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2 rounded-full", colorClasses.bgLight)}>
            <IconComponent className={cn("h-6 w-6", colorClasses.text)} />
          </div>
          {isSelected && (
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>

        <h3 className="text-lg font-medium mb-2">{template.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{template.description}</p>
      </CardContent>
    </Card>
  )
}

// Helper function to get the icon component based on the icon name
function getIconComponent(iconName: string) {
  switch (iconName) {
    case "Music":
      return Music
    case "Palette":
      return Palette
    case "FileText":
      return FileText
    case "Hexagon":
      return Hexagon
    case "Video":
      return Video
    case "Award":
      return Award
    case "MessageSquare":
      return MessageSquare
    case "BookOpen":
      return BookOpen
    case "Building":
      return Building
    case "Code":
      return Code
    case "Settings":
      return Settings
    default:
      return FileText
  }
}

// Helper function to get Tailwind color classes based on the color name
function getColorClasses(color: string) {
  switch (color) {
    case "blue":
      return {
        bgLight: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
      }
    case "purple":
      return {
        bgLight: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800",
      }
    case "gray":
      return {
        bgLight: "bg-gray-100 dark:bg-gray-800/50",
        text: "text-gray-600 dark:text-gray-400",
        border: "border-gray-200 dark:border-gray-700",
      }
    case "teal":
      return {
        bgLight: "bg-teal-100 dark:bg-teal-900/30",
        text: "text-teal-600 dark:text-teal-400",
        border: "border-teal-200 dark:border-teal-800",
      }
    case "red":
      return {
        bgLight: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
      }
    case "amber":
      return {
        bgLight: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800",
      }
    case "sky":
      return {
        bgLight: "bg-sky-100 dark:bg-sky-900/30",
        text: "text-sky-600 dark:text-sky-400",
        border: "border-sky-200 dark:border-sky-800",
      }
    case "indigo":
      return {
        bgLight: "bg-indigo-100 dark:bg-indigo-900/30",
        text: "text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-200 dark:border-indigo-800",
      }
    case "emerald":
      return {
        bgLight: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800",
      }
    case "violet":
      return {
        bgLight: "bg-violet-100 dark:bg-violet-900/30",
        text: "text-violet-600 dark:text-violet-400",
        border: "border-violet-200 dark:border-violet-800",
      }
    case "slate":
      return {
        bgLight: "bg-slate-100 dark:bg-slate-800/50",
        text: "text-slate-600 dark:text-slate-400",
        border: "border-slate-200 dark:border-slate-700",
      }
    default:
      return {
        bgLight: "bg-gray-100 dark:bg-gray-800/50",
        text: "text-gray-600 dark:text-gray-400",
        border: "border-gray-200 dark:border-gray-700",
      }
  }
}
