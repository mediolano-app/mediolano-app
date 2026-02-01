
"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Send, Shield, GitBranch, Activity as ActivityIcon } from "lucide-react"
import { AddressLink } from "@/components/ui/address-link"
import Image from "next/image"
import { format } from "date-fns"

import { Activity } from "@/hooks/useActivities"

interface ActivityCardProps {
  activity: Activity
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "creation":
    case "mint":
      return Plus
    case "transfer":
      return Send
    case "license":
      return Shield
    case "remix":
      return GitBranch
    case "collection":
      return Plus
    default:
      return ActivityIcon
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case "creation":
    case "mint":
      return {
        badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20",
        icon: "text-emerald-600",
      }
    case "transfer":
      return {
        badge: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20",
        icon: "text-blue-600",
      }
    case "license":
      return {
        badge: "bg-violet-500/10 text-violet-600 border-violet-500/20 hover:bg-violet-500/20",
        icon: "text-violet-600",
      }
    case "remix":
      return {
        badge: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20",
        icon: "text-amber-600",
      }
    case "collection":
      return {
        badge: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20",
        icon: "text-purple-600",
      }
    default:
      return {
        badge: "bg-neutral-500/10 text-neutral-600 border-neutral-500/20 hover:bg-neutral-500/20",
        icon: "text-neutral-600",
      }
  }
}

const formatTimeAgo = (timestamp: string) => {
  try {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`
    return format(time, "MMM d")
  } catch (e) {
    return "Recent"
  }
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const Icon = getActivityIcon(activity.type)
  const colors = getActivityColor(activity.type)
  const timeAgo = formatTimeAgo(activity.timestamp)

  return (
    <Card className="group flex flex-col h-full overflow-hidden border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/20 hover:shadow-lg transition-all duration-300">

      {/* Header: User & Action - Timeline Feel */}
      <div className="flex items-center gap-3 p-4 pb-3 border-b border-border/10">
        <div className={`p-2 rounded-full flex-shrink-0 ${colors.badge.split(' ')[0]}`}>
          <Icon className={`h-4 w-4 ${colors.icon}`} />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <AddressLink
              address={activity.user}
              className="font-semibold text-sm hover:text-primary transition-colors truncate max-w-[120px]"
              showFull={false}
            />
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-xs text-muted-foreground font-medium">{timeAgo}</span>
          </div>
          <div className="text-xs text-muted-foreground capitalize">
            {activity.type === 'collection' ? 'Created Collection' : `Performed ${activity.type}`}
          </div>
        </div>
      </div>

      {/* Body: Full Width Image */}
      <div className="relative w-full aspect-square bg-muted/20 border-y border-border/10">
        <Image
          src={activity.assetImage || `/placeholder.svg?height=400&width=400&text=${activity.assetName}`}
          alt={activity.assetName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Footer: Metadata */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold tracking-tight text-base line-clamp-1 group-hover:text-primary transition-colors">
            {activity.assetName}
          </h4>
          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal opacity-70">
            #{activity.tokenId || '0'}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {activity.details}
        </p>
      </div>
    </Card>
  )
}
