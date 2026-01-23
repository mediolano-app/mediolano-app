"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  CheckCircle2,
  ArrowRight,
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
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Template {
  id: string
  name: string
  icon: string
  description: string
  color: string
  category: string
  features: string[]
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

  const isPopular = template.id === "audio" || template.id === "art" || template.id === "nft"

  return (
    <Card
      className={cn(
        "group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative border-2",
        isSelected
          ? "ring-2 ring-primary ring-offset-2 border-primary shadow-lg"
          : "border-border hover:border-primary/50",
      )}
      onClick={onSelect}
    >
      {/* Status Badges */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        {isPopular && (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        )}
      </div>

      <CardContent className="p-0">
        {/* Header with gradient background */}
        <div className={cn("p-6 pb-4 relative overflow-hidden", colorClasses.bgGradient)}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative flex items-start justify-between">
            <div className={cn("p-3 rounded-xl shadow-lg", colorClasses.iconBg)}>
              <IconComponent className={cn("h-6 w-6", colorClasses.iconColor)} />
            </div>
            {isSelected && (
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {template.category}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{template.description}</p>

          {/* Features Preview */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Features</h4>
            <div className="flex flex-wrap gap-1">
              {template.features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {template.features.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.features.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-4 pt-2 relative z-10">
            <Link href={`/create/templates/${template.id}`} onClick={(e) => e.stopPropagation()} className="block w-full">
              <Button className="w-full gap-2 transition-transform active:scale-[0.98]" size="sm">
                Use Template
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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
        bgGradient: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30",
        iconBg: "bg-white/90 dark:bg-blue-900/50",
        iconColor: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
      }
    case "purple":
      return {
        bgGradient: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30",
        iconBg: "bg-white/90 dark:bg-purple-900/50",
        iconColor: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800",
      }
    case "teal":
      return {
        bgGradient: "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/50 dark:to-teal-900/30",
        iconBg: "bg-white/90 dark:bg-teal-900/50",
        iconColor: "text-teal-600 dark:text-teal-400",
        border: "border-teal-200 dark:border-teal-800",
      }
    case "violet":
      return {
        bgGradient: "bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/50 dark:to-violet-900/30",
        iconBg: "bg-white/90 dark:bg-violet-900/50",
        iconColor: "text-violet-600 dark:text-violet-400",
        border: "border-violet-200 dark:border-violet-800",
      }
    case "red":
      return {
        bgGradient: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30",
        iconBg: "bg-white/90 dark:bg-red-900/50",
        iconColor: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
      }
    case "amber":
      return {
        bgGradient: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30",
        iconBg: "bg-white/90 dark:bg-amber-900/50",
        iconColor: "text-amber-600 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800",
      }
    case "sky":
      return {
        bgGradient: "bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950/50 dark:to-sky-900/30",
        iconBg: "bg-white/90 dark:bg-sky-900/50",
        iconColor: "text-sky-600 dark:text-sky-400",
        border: "border-sky-200 dark:border-sky-800",
      }
    case "indigo":
      return {
        bgGradient: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/30",
        iconBg: "bg-white/90 dark:bg-indigo-900/50",
        iconColor: "text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-200 dark:border-indigo-800",
      }
    case "emerald":
      return {
        bgGradient: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30",
        iconBg: "bg-white/90 dark:bg-emerald-900/50",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800",
      }
    case "gray":
      return {
        bgGradient: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/30",
        iconBg: "bg-white/90 dark:bg-gray-800/50",
        iconColor: "text-gray-600 dark:text-gray-400",
        border: "border-gray-200 dark:border-gray-700",
      }
    case "slate":
      return {
        bgGradient: "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30",
        iconBg: "bg-white/90 dark:bg-slate-800/50",
        iconColor: "text-slate-600 dark:text-slate-400",
        border: "border-slate-200 dark:border-slate-700",
      }
    default:
      return {
        bgGradient: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/30",
        iconBg: "bg-white/90 dark:bg-gray-800/50",
        iconColor: "text-gray-600 dark:text-gray-400",
        border: "border-gray-200 dark:border-gray-700",
      }
  }
}
