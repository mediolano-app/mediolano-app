"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import {
  Eye,
  FileCheck,
  Calendar,
  DollarSign,
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
  XCircle,
} from "lucide-react"

interface AssetPreviewProps {
  formState: any
  template: { id: string; name: string; icon: string; color: string }
}

export function AssetPreview({ formState, template }: AssetPreviewProps) {
  // Get the icon component based on template icon string
  const getIconComponent = (iconName: string) => {
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

  const IconComponent = getIconComponent(template.icon)

  // Get color classes for the template
  const getColorClasses = (color: string) => {
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
      case "teal":
        return {
          bgLight: "bg-teal-50 dark:bg-teal-950/30",
          text: "text-teal-600 dark:text-teal-400",
          border: "border-teal-200 dark:border-teal-800",
        }
      // Add other color cases here
      default:
        return {
          bgLight: "bg-gray-50 dark:bg-gray-900/30",
          text: "text-gray-600 dark:text-gray-400",
          border: "border-gray-200 dark:border-gray-700",
        }
    }
  }

  const colorClasses = getColorClasses(template.color)

  // Get license status display
  const getLicenseStatus = (allowed: boolean) => {
    return allowed ? (
      <div className="flex items-center gap-1">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span>Allowed</span>
      </div>
    ) : (
      <div className="flex items-center gap-1">
        <XCircle className="h-4 w-4 text-red-500" />
        <span>Not Allowed</span>
      </div>
    )
  }

  return (
    <Card className="border-dashed">
      <CardHeader className={`${colorClasses.bgLight} pb-3`}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className={colorClasses.text} />
            <span>Asset Preview</span>
          </div>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={formState.mediaPreviewUrl || "/placeholder.svg"}
            alt="Asset preview"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
          {formState.collection && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-primary/80 text-primary-foreground">{formState.collection}</Badge>
            </div>
          )}
          {formState.isExplicit && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive">Explicit</Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <h2 className="text-xl font-bold">{formState.title || "Untitled Asset"}</h2>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{new Date().toLocaleDateString()}</span>
            <Badge className="ml-2" variant="outline">
              {template.name}
            </Badge>
          </div>

          <Separator className="my-3" />

          <p className="text-sm line-clamp-3 mb-4">{formState.description || "No description provided."}</p>

          {formState.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {formState.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="my-3" />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <FileCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>License</span>
              </div>
              <Badge variant="outline">{formState.licenseTerms}</Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Royalty</span>
              </div>
              <span>{formState.royaltyPercentage}%</span>
            </div>
          </div>

          <Separator className="my-3" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Commercial Use</p>
              {getLicenseStatus(formState.allowCommercial)}
            </div>
            <div>
              <p className="font-medium">Derivatives</p>
              {getLicenseStatus(formState.allowDerivatives)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
