"use client"

import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "price" | "sale" | "offer"
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Price Alert",
    message: "Bored Ape #7329 floor price increased by 15%",
    time: "5 minutes ago",
    read: false,
    type: "price",
  },
  {
    id: "2",
    title: "New Offer",
    message: "You received an offer of 12.5 ETH for CryptoPunk #3100",
    time: "2 hours ago",
    read: false,
    type: "offer",
  },
  {
    id: "3",
    title: "Sale Completed",
    message: "Your NFT Doodle #8147 was sold for 6.2 STRK",
    time: "1 day ago",
    read: true,
    type: "sale",
  },
]

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "price":
        return "💰"
      case "offer":
        return "🤝"
      case "sale":
        return "💎"
      default:
        return "ℹ️"
    }
  }

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showNotifications && !target.closest("[data-notifications]")) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showNotifications])

  return (
    <div className="relative" data-notifications>
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">{unreadCount}</Badge>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 top-12 w-80 z-50">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </div>
            <CardDescription>
              {notifications.length === 0 ? "No notifications" : `You have ${unreadCount} unread notifications`}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-auto">
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn("p-3 rounded-lg relative", notification.read ? "bg-muted/50" : "bg-muted")}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-2">
                    <div className="text-xl">{getTypeIcon(notification.type)}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 absolute top-2 right-2 opacity-50 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNotification(notification.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          {notifications.length > 0 && (
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">
                View all notifications
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  )
}

