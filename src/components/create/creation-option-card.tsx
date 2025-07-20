"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  FolderPlus,
  FileText,
  Hexagon,
  Music,
  Video,
  ImageIcon,
  Code,
  FileCheck,
  TrendingUp,
  Star,
  Clock,
  Users,
  Shield,
  ChevronRight,
  Coins,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CreationOption {
  id: string
  title: string
  description: string
  icon: string
  href: string
  popular?: boolean
  trending?: boolean
  category: "primary" | "templates" | "advanced"
  gradient: string
  iconColor: string
  process: string[]
  benefits: string[]
  requirements: string[]
  timeEstimate: string
  complexity: "Beginner" | "Intermediate" | "Advanced"
  useCases: string[]
  ownershipRate: number
  popularity: string
}

interface CreationOptionCardProps {
  option: CreationOption
  isSelected: boolean
  onSelect: () => void
}

export function CreationOptionCard({ option, isSelected, onSelect }: CreationOptionCardProps) {
  const IconComponent = getIconComponent(option.icon)

  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group relative",
        isSelected ? "ring-2 ring-primary ring-offset-2 shadow-lg" : "",
      )}
      onClick={onSelect}
    >
      {/* Gradient top border */}
      <div className={cn("h-1 bg-gradient-to-r", option.gradient)} />

      {/* Badges */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        {option.popular && (
          <Badge className="gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 shadow-sm">
            <Star className="h-3 w-3" />
            Popular
          </Badge>
        )}
        {option.trending && (
          <Badge
            variant="outline"
            className="gap-1 border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 shadow-sm"
          >
            <TrendingUp className="h-3 w-3" />
            Trending
          </Badge>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "p-3 rounded-xl transition-transform group-hover:scale-110",
              getColorClasses(option.gradient).bgLight,
            )}
          >
            <IconComponent className={cn("h-7 w-7", option.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            {isSelected && (
              <div className="mb-2">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{option.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{option.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{option.timeEstimate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Coins className="h-3.5 w-3.5" />
            <span>Zero Fee</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>100% Ownership</span>
          </div>
          <Badge variant="outline" className="text-xs justify-self-end">
            {option.complexity}
          </Badge>
        </div>

        {/* Action Button */}
        <Link href={option.href} className="block">
          <Button
            className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
            size="lg"
          >
            Get Started
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function getIconComponent(iconName: string) {
  switch (iconName) {
    case "FolderPlus":
      return FolderPlus
    case "FileText":
      return FileText
    case "Hexagon":
      return Hexagon
    case "Music":
      return Music
    case "Video":
      return Video
    case "ImageIcon":
      return ImageIcon
    case "Code":
      return Code
    case "FileCheck":
      return FileCheck
    default:
      return FileText
  }
}

function getColorClasses(gradient: string) {
  switch (gradient) {
    case "from-blue-500 to-cyan-500":
      return { bgLight: "bg-blue-100 dark:bg-blue-900/30" }
    case "from-purple-500 to-pink-500":
      return { bgLight: "bg-purple-100 dark:bg-purple-900/30" }
    case "from-emerald-500 to-teal-500":
      return { bgLight: "bg-emerald-100 dark:bg-emerald-900/30" }
    case "from-orange-500 to-red-500":
      return { bgLight: "bg-orange-100 dark:bg-orange-900/30" }
    case "from-indigo-500 to-purple-500":
      return { bgLight: "bg-indigo-100 dark:bg-indigo-900/30" }
    case "from-pink-500 to-rose-500":
      return { bgLight: "bg-pink-100 dark:bg-pink-900/30" }
    case "from-slate-500 to-gray-500":
      return { bgLight: "bg-slate-100 dark:bg-slate-800/50" }
    case "from-violet-500 to-purple-500":
      return { bgLight: "bg-violet-100 dark:bg-violet-900/30" }
    default:
      return { bgLight: "bg-gray-100 dark:bg-gray-800/50" }
  }
}
