"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Send, Shield, GitBranch, Activity as ActivityIcon, ArrowRight } from "lucide-react"
import Link from "next/link"
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
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const Icon = getActivityIcon(activity.type)
  const colors = getActivityColor(activity.type)
  const timeAgo = formatTimeAgo(activity.timestamp)

  return (
    <Card className="group hover:shadow-lg hover:border-primary/20 transition-all duration-300 glass-card overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <Link
          href={`/assets/${activity.assetId}`}
          className="relative w-full sm:w-24 h-32 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted/50 group-hover:shadow-md transition-all duration-300"
        >
          <Image
            src={activity.assetImage || `/placeholder.svg?height=96&width=96&text=${activity.assetName}`}
            alt={activity.assetName}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src="/placeholder.svg" alt={activity.user} />
                <AvatarFallback className="text-xs">
                  {activity.user.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <AddressLink
                  address={activity.user}
                  showFull={true}
                  className="font-medium text-sm block truncate"
                >
                  {activity.user}
                </AddressLink>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge className={`${colors.badge} border-0 h-5 gap-1 px-1.5`}>
                    <Icon className="h-3 w-3" />
                    <span className="capitalize text-[10px] font-medium">{activity.type}</span>
                  </Badge>
                  <span>•</span>
                  <span>{timeAgo}</span>
                </div>
              </div>
            </div>

            {activity.price && (
              <Badge variant="outline" className="font-mono text-xs h-6 bg-primary/5 border-primary/20">
                {activity.price}
              </Badge>
            )}
          </div>

          <div className="space-y-1.5">
            <Link
              href={`/assets/${activity.assetId}`}
              className="font-semibold hover:text-primary transition-colors line-clamp-1 block leading-tight"
            >
              {activity.assetName}
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{activity.details}</p>
          </div>

          <div className="flex items-center justify-end pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 text-xs font-medium group/btn hover:bg-primary/10 hover:text-primary"
              asChild
            >
              <Link href={`/assets/${activity.assetId}`}>
                <span>View Asset</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
