"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCode, Music, Video, PenTool, Brain, Code, Globe, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function DiscoverServicesCTA() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const assetTypes = [
    { icon: <PenTool className="h-8 w-8 text-blue-500" />, name: "Artwork", link: "/create/artwork" },
    { icon: <Video className="h-8 w-8 text-blue-500" />, name: "Video", link: "/create/video" },
    { icon: <Music className="h-8 w-8 text-blue-500" />, name: "Audio", link: "/create/audio" },
    { icon: <FileCode className="h-8 w-8 text-blue-500" />, name: "Literary Works", link: "/create/literary" },
    { icon: <Brain className="h-8 w-8 text-blue-500" />, name: "AI Models", link: "/create/ai-model" },
    { icon: <Code className="h-8 w-8 text-blue-500" />, name: "Software", link: "/create/software" },
    { icon: <Globe className="h-8 w-8 text-blue-500" />, name: "RWA", link: "/create/rwa" },
    { icon: <Box className="h-8 w-8 text-blue-500" />, name: "Custom", link: "/create/asset" },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  }

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Now</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Mediolano provides comprehensive services for tokenizing and licensing your intellectual property.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isMounted ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-card rounded-2xl p-8 border border-border shadow-sm"
          >
            <h3 className="text-2xl font-bold mb-6">Tokenization Services</h3>
            <p className="text-foreground/80 mb-6">
              With Mediolano, anyone can permissionlessly register their Intellectual Property assets. Our platform
              leverages Starknet's technology to provide:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <div className="mr-3 mt-1 text-primary">•</div>
                <span>Secure, immutable proof of ownership</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 text-primary">•</div>
                <span>Timestamped registration valid for 50-70 years</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 text-primary">•</div>
                <span>Global protection across 181 countries</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 text-primary">•</div>
                <span>Low-cost, high-speed processing</span>
              </li>
            </ul>
            <Button>Tokenize Your IP</Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isMounted ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-card rounded-2xl p-8 border border-border shadow-sm"
          >
            <h3 className="text-2xl font-bold mb-6">Licensing Services</h3>
            <p className="text-foreground/80 mb-6">
              In addition to tokenization, Mediolano provides comprehensive services for licensing your Programmable IP
              with:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <div className="mr-3 mt-1 text-primary">•</div>
                <span>Customizable licensing terms and conditions</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 text-primary">•</div>
                <span>Automated royalty distribution</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 text-primary">•</div>
                <span>Transparent usage tracking</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 text-primary">•</div>
                <span>Complete sovereignty over your IP assets</span>
              </li>
            </ul>
            <Button>Explore Licensing</Button>
          </motion.div>
        </div>

        <div className="text-center mb-20 mt-40">
          <h3 className="text-2xl font-bold mb-4">Supported Asset Types</h3>
          <p className="text-foreground/80 max-w-2xl mx-auto mb-10">
            Mediolano supports a wide range of intellectual property assets, including:
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isMounted ? "show" : "hidden"}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          {assetTypes.map((asset, index) => (
            <motion.div key={index} variants={item}>
              <Link href={asset.link}>
                <Card className="border-border hover:border-blue-500 transition-all duration-300 hover:shadow-md h-full cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="mx-auto">{asset.icon}</div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardTitle className="text-base">{asset.name}</CardTitle>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

