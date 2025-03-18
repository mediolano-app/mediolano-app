"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Star, TrendingUp, Users } from "lucide-react"

// Mock data for creators
const creators = [
  {
    id: 1,
    name: "Elena Rodriguez",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Digital Artist",
    assetsCount: 47,
    followers: 2.8,
    rating: 4.9,
    featured: true,
    verified: true,
  },
  {
    id: 2,
    name: "Marcus Chen",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Music Producer",
    assetsCount: 32,
    followers: 1.5,
    rating: 4.7,
    featured: false,
    verified: true,
  },
  {
    id: 3,
    name: "Sophia Williams",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Software Developer",
    assetsCount: 18,
    followers: 0.9,
    rating: 4.8,
    featured: false,
    verified: true,
  },
  {
    id: 4,
    name: "James Peterson",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Filmmaker",
    assetsCount: 24,
    followers: 1.2,
    rating: 4.6,
    featured: true,
    verified: false,
  },
]

// Mock data for organizations
const organizations = [
  {
    id: 1,
    name: "CreativeTech Studios",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Media Production",
    assetsCount: 124,
    followers: 8.5,
    rating: 4.9,
    featured: true,
    verified: true,
  },
  {
    id: 2,
    name: "Harmonic Innovations",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Music Publishing",
    assetsCount: 87,
    followers: 5.2,
    rating: 4.8,
    featured: true,
    verified: true,
  },
  {
    id: 3,
    name: "CodeCraft Solutions",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Software Development",
    assetsCount: 56,
    followers: 3.7,
    rating: 4.7,
    featured: false,
    verified: true,
  },
  {
    id: 4,
    name: "Visual Narratives",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Film Production",
    assetsCount: 42,
    followers: 2.9,
    rating: 4.6,
    featured: false,
    verified: false,
  },
]

export default function StartUserShowcaseSection() {
  const [activeTab, setActiveTab] = useState<"creators" | "organizations">("creators")
  const [hoveredUser, setHoveredUser] = useState<number | null>(null)

  const handleTabChange = (tab: "creators" | "organizations") => {
    setActiveTab(tab)
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Users</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Meet the creators and organizations protecting their intellectual property with Mediolano
            </p>
          </motion.div>
        </div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center p-1 bg-muted rounded-lg">
            <Button
              variant={activeTab === "creators" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabChange("creators")}
              className="rounded-md"
            >
              <Users className="h-4 w-4 mr-2" />
              Creators
            </Button>
            <Button
              variant={activeTab === "organizations" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabChange("organizations")}
              className="rounded-md"
            >
              <Shield className="h-4 w-4 mr-2" />
              Organizations
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(activeTab === "creators" ? creators : organizations).map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: user.id * 0.1 }}
              whileHover={{ y: -8 }}
              onHoverStart={() => setHoveredUser(user.id)}
              onHoverEnd={() => setHoveredUser(null)}
              className="h-full"
            >
              <Card
                className={`h-full border-border transition-all duration-300 hover:shadow ${
                  hoveredUser === user.id ? "border-primary/50" : ""
                }`}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-20 w-20 border-2 border-primary/20">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-1">{user.name}</h3>
                  <p className="text-sm text-foreground/70 mb-4">{user.role}</p>

                  {user.featured && (
                    <Badge variant="outline" className="mb-4 border-amber-500 text-amber-500">
                      <Star className="h-3 w-3 mr-1 fill-amber-500" /> Featured
                    </Badge>
                  )}

                  <div className="grid grid-cols-3 gap-2 w-full mb-4">
                    <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
                      <span className="text-lg font-bold">{user.assetsCount}</span>
                      <span className="text-xs text-foreground/70">Assets</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
                      <span className="text-lg font-bold">{user.followers}k</span>
                      <span className="text-xs text-foreground/70">Followers</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
                      <span className="text-lg font-bold">{user.rating}</span>
                      <span className="text-xs text-foreground/70">Rating</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full active:scale-95 transition-transform">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button variant="outline" className="active:scale-95 transition-transform">
            View All {activeTab === "creators" ? "Creators" : "Organizations"}
            <TrendingUp className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

