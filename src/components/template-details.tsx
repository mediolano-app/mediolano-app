"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
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
  CheckCircle,
  List,
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

interface TemplateDetailsProps {
  template: Template
}

export function TemplateDetails({ template }: TemplateDetailsProps) {
  // Map template icon string to the actual icon component
  const IconComponent = getIconComponent(template.icon)

  // Map color string to Tailwind color classes
  const colorClasses = getColorClasses(template.color)

  return (
    <Card>
      <CardHeader className={cn("pb-3", colorClasses.bgLight)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-full bg-background", colorClasses.border)}>
              <IconComponent className={cn("h-6 w-6", colorClasses.text)} />
            </div>
            <CardTitle className="text-xl">{template.name} Template</CardTitle>
          </div>
          {template.popular && <Badge className="bg-primary/80 text-primary-foreground">Popular</Badge>}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <p className="text-muted-foreground">{template.description}</p>

        <Separator />

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            Example Use Cases
          </h4>
          <ul className="grid grid-cols-2 gap-2">
            {template.examples.map((example, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
                {example}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <List className="h-4 w-4 text-muted-foreground" />
            Included Fields
          </h4>
          <ul className="grid grid-cols-2 gap-2">
            {template.fields.map((field, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
                {field}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div className={cn("rounded-md p-3 text-sm", colorClasses.bgLight, colorClasses.text)}>
          <p className="font-medium">Template Benefits</p>
          <p className="text-xs mt-1 opacity-90">
            This template is optimized for {template.name.toLowerCase()} IP registration, with specialized fields and
            metadata to ensure comprehensive protection of your intellectual property.
          </p>
        </div>
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
        bgLight: "bg-blue-50 dark:bg-blue-950/30",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
      }
    case "purple":
      return {
        bgLight: "bg-purple-50 dark:bg-purple-950/30",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800",
      }
    case "gray":
      return {
        bgLight: "bg-gray-50 dark:bg-gray-900/30",
        text: "text-gray-600 dark:text-gray-400",
        border: "border-gray-200 dark:border-gray-700",
      }
    case "teal":
      return {
        bgLight: "bg-teal-50 dark:bg-teal-950/30",
        text: "text-teal-600 dark:text-teal-400",
        border: "border-teal-200 dark:border-teal-800",
      }
    case "red":
      return {
        bgLight: "bg-red-50 dark:bg-red-950/30",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
      }
    case "amber":
      return {
        bgLight: "bg-amber-50 dark:bg-amber-950/30",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800",
      }
    case "sky":
      return {
        bgLight: "bg-sky-50 dark:bg-sky-950/30",
        text: "text-sky-600 dark:text-sky-400",
        border: "border-sky-200 dark:border-sky-800",
      }
    case "indigo":
      return {
        bgLight: "bg-indigo-50 dark:bg-indigo-950/30",
        text: "text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-200 dark:border-indigo-800",
      }
    case "emerald":
      return {
        bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800",
      }
    case "violet":
      return {
        bgLight: "bg-violet-50 dark:bg-violet-950/30",
        text: "text-violet-600 dark:text-violet-400",
        border: "border-violet-200 dark:border-violet-800",
      }
    case "slate":
      return {
        bgLight: "bg-slate-50 dark:bg-slate-900/30",
        text: "text-slate-600 dark:text-slate-400",
        border: "border-slate-200 dark:border-slate-700",
      }
    default:
      return {
        bgLight: "bg-gray-50 dark:bg-gray-900/30",
        text: "text-gray-600 dark:text-gray-400",
        border: "border-gray-200 dark:border-gray-700",
      }
  }
}
