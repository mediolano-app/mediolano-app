"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, ArrowRight, FileText, Music, Video, Code, PenTool, DollarSign } from "lucide-react"

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    type: "tokenization",
    user: {
      name: "Elena Rodriguez",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    asset: {
      name: "Digital Renaissance",
      type: "artwork",
    },
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "purchase",
    user: {
      name: "Marcus Chen",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    asset: {
      name: "Harmonic Synthesis",
      type: "music",
    },
    price: "0.25 ETH",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "license",
    user: {
      name: "CreativeTech Studios",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    asset: {
      name: "Quantum Code Library",
      type: "software",
    },
    time: "1 day ago",
  },
  {
    id: 4,
    type: "tokenization",
    user: {
      name: "James Peterson",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    asset: {
      name: "Cinematic Sequences",
      type: "video",
    },
    time: "2 days ago",
  },
  {
    id: 5,
    type: "purchase",
    user: {
      name: "Sophia Williams",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    asset: {
      name: "Abstract Dimensions",
      type: "artwork",
    },
    price: "0.45 ETH",
    time: "3 days ago",
  },
]

// Asset type icons
const assetTypeIcons = {
  music: <Music className="h-5 w-5" />,
  software: <Code className="h-5 w-5" />,
  artwork: <PenTool className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  document: <FileText className="h-5 w-5" />,
}

// Activity type icons and colors
const activityTypeInfo = {
  tokenization: {
    icon: <Shield className="h-5 w-5" />,
    color: "bg-primary text-primary-foreground",
    label: "Tokenized",
  },
  purchase: {
    icon: <DollarSign className="h-5 w-5" />,
    color: "bg-green-500 text-white",
    label: "Purchased",
  },
  license: {
    icon: <FileText className="h-5 w-5" />,
    color: "bg-blue-500 text-white",
    label: "Licensed",
  },
}

export default function StartActivityFeedSection() {
  const [hoveredActivity, setHoveredActivity] = useState<number | null>(null)

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Activity</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Stay updated with the latest transactions and tokenizations on the platform
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredActivity(activity.id)}
              onHoverEnd={() => setHoveredActivity(null)}
            >
              <Card
                className={`border-border transition-all duration-300 hover:shadow-md ${
                  hoveredActivity === activity.id ? "border-primary/50" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="relative mr-4">
                      <Avatar>
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 p-1 rounded-full ${activityTypeInfo[activity.type as keyof typeof activityTypeInfo].color}`}
                      >
                        {activityTypeInfo[activity.type as keyof typeof activityTypeInfo].icon}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-medium">{activity.user.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {activityTypeInfo[activity.type as keyof typeof activityTypeInfo].label}
                        </Badge>
                      </div>

                      <div className="flex items-center text-sm text-foreground/70">
                        <span>
                          {activity.type === "purchase"
                            ? `Purchased ${activity.asset.name} for ${activity.price}`
                            : activity.type === "license"
                              ? `Licensed ${activity.asset.name}`
                              : `Tokenized ${activity.asset.name}`}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-xs text-foreground/60">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </div>

                        <div className="flex items-center text-xs">
                          <span className="mr-1">Asset Type:</span>
                          <div className="flex items-center text-primary">
                            {assetTypeIcons[activity.asset.type as keyof typeof assetTypeIcons]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button variant="outline" className="active:scale-95 transition-transform">
            View All Activity
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

