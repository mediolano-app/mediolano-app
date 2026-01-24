"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Music, Video, Code, PenTool, Heart, Eye, Shield, ExternalLink } from "lucide-react"

// Mock data for featured assets
const featuredAssets = {
  trending: [
    {
      id: 1,
      title: "Harmonic Synthesis",
      creator: "AudioLabs",
      type: "music",
      image: "/placeholder.svg?height=300&width=300",
      likes: 342,
      views: 1205,
      price: "0.25 STRK",
      badge: "New",
    },
    {
      id: 2,
      title: "Quantum Code Library",
      creator: "TechFoundry",
      type: "software",
      image: "/placeholder.svg?height=300&width=300",
      likes: 189,
      views: 876,
      price: "1.2 STRK",
      badge: "Featured",
    },
    {
      id: 3,
      title: "Digital Renaissance",
      creator: "ArtisticVisions",
      type: "artwork",
      image: "/placeholder.svg?height=300&width=300",
      likes: 421,
      views: 1567,
      price: "0.75 STRK",
    },
    {
      id: 4,
      title: "Cinematic Sequences",
      creator: "VisualNarratives",
      type: "video",
      image: "/placeholder.svg?height=300&width=300",
      likes: 267,
      views: 982,
      price: "0.5 STRK",
      badge: "Popular",
    },
  ],
  newest: [
    {
      id: 5,
      title: "Neural Network Patterns",
      creator: "AICreatives",
      type: "software",
      image: "/placeholder.svg?height=300&width=300",
      likes: 112,
      views: 543,
      price: "0.8 STRK",
      badge: "New",
    },
    {
      id: 6,
      title: "Ambient Soundscapes",
      creator: "SonicWaves",
      type: "music",
      image: "/placeholder.svg?height=300&width=300",
      likes: 98,
      views: 412,
      price: "0.15 STRK",
      badge: "New",
    },
    {
      id: 7,
      title: "Abstract Dimensions",
      creator: "DigitalCanvas",
      type: "artwork",
      image: "/placeholder.svg?height=300&width=300",
      likes: 156,
      views: 678,
      price: "0.45 STRK",
      badge: "New",
    },
    {
      id: 8,
      title: "Documentary Series: Origins",
      creator: "TruthLens",
      type: "video",
      image: "/placeholder.svg?height=300&width=300",
      likes: 87,
      views: 321,
      price: "0.35 STRK",
      badge: "New",
    },
  ],
  popular: [
    {
      id: 9,
      title: "Epic Orchestral Suite",
      creator: "SymphonyStudios",
      type: "music",
      image: "/placeholder.svg?height=300&width=300",
      likes: 532,
      views: 2341,
      price: "1.5 STRK",
      badge: "Popular",
    },
    {
      id: 10,
      title: "Cybersecurity Framework",
      creator: "SecureLogic",
      type: "software",
      image: "/placeholder.svg?height=300&width=300",
      likes: 478,
      views: 1876,
      price: "2.0 STRK",
      badge: "Popular",
    },
    {
      id: 11,
      title: "Hyperrealism Collection",
      creator: "VisionaryArts",
      type: "artwork",
      image: "/placeholder.svg?height=300&width=300",
      likes: 621,
      views: 2789,
      price: "1.8 STRK",
      badge: "Popular",
    },
    {
      id: 12,
      title: "Animated Short: Beyond",
      creator: "PixelDreams",
      type: "video",
      image: "/placeholder.svg?height=300&width=300",
      likes: 498,
      views: 2156,
      price: "1.2 STRK",
      badge: "Popular",
    },
  ],
}

// Asset type icons
const assetTypeIcons = {
  music: <Music className="h-5 w-5" />,
  software: <Code className="h-5 w-5" />,
  artwork: <PenTool className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  document: <FileText className="h-5 w-5" />,
}

export default function StartFeaturedAssetsSection() {
  const [activeTab, setActiveTab] = useState("trending")
  const [hoveredAsset, setHoveredAsset] = useState<number | null>(null)

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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured IP Assets</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Discover unique intellectual property assets from creators around the world
            </p>
          </motion.div>
        </div>

        <Tabs defaultValue="trending" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="trending" className="text-sm md:text-base">
                Trending
              </TabsTrigger>
              <TabsTrigger value="newest" className="text-sm md:text-base">
                Newest
              </TabsTrigger>
              <TabsTrigger value="popular" className="text-sm md:text-base">
                Popular
              </TabsTrigger>
            </TabsList>
          </div>

          {Object.entries(featuredAssets).map(([category, assets]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {assets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (asset.id % 4) * 0.1 }}
                    whileHover={{ y: -8 }}
                    onHoverStart={() => setHoveredAsset(asset.id)}
                    onHoverEnd={() => setHoveredAsset(null)}
                    className="h-full"
                  >
                    <Card className="overflow-hidden h-full glass-card hover:border-primary/50 transition-all duration-300 hover:shadow-md">
                      <div className="relative aspect-square overflow-hidden bg-muted/30">
                        <img
                          src={asset.image || "/placeholder.svg"}
                          alt={asset.title}
                          className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                        />
                        {asset.badge && (
                          <Badge
                            className={`absolute top-3 left-3 ${asset.badge === "New"
                                ? "bg-green-500"
                                : asset.badge === "Popular"
                                  ? "bg-orange-500"
                                  : "bg-primary"
                              }`}
                          >
                            {asset.badge}
                          </Badge>
                        )}
                        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm p-1.5 rounded-md">
                          {assetTypeIcons[asset.type as keyof typeof assetTypeIcons]}
                        </div>

                        {/* Overlay on hover */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredAsset === asset.id ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center"
                        >
                          <Button className="active:scale-95 transition-transform">
                            View Details
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg line-clamp-1">{asset.title}</h3>
                        </div>
                        <p className="text-sm text-foreground/70 mb-2">by {asset.creator}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <div className="flex space-x-3 text-sm text-foreground/60">
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-1 text-red-500" />
                            {asset.likes}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1 text-blue-500" />
                            {asset.views}
                          </div>
                        </div>
                        <div className="flex items-center font-medium text-primary">
                          <Shield className="h-4 w-4 mr-1" />
                          {asset.price}
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center mt-10">
                <Button variant="outline" className="active:scale-95 transition-transform">
                  View All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Assets
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  )
}

