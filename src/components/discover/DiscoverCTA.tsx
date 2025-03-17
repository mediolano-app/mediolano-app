"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Sparkles, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"

export default function DiscoverCTA() {
  const [isMounted, setIsMounted] = useState(false)

  // Use refs for consistent particle positions
  const particlePositions = useRef(
    Array(6)
      .fill(0)
      .map(() => ({
        top: `${20 + 60 * 0.5}%`,
        left: `${20 + 60 * 0.5}%`,
      })),
  )

  useEffect(() => {
    setIsMounted(true)

    // Generate random positions after mounting
    particlePositions.current = Array(6)
      .fill(0)
      .map(() => ({
        top: `${20 + Math.random() * 60}%`,
        left: `${20 + Math.random() * 60}%`,
      }))
  }, [])

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-border p-8 md:p-12 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isMounted ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Start Creating & Licensing Programmable IP</h2>
              <p className="text-foreground/80 mb-6">
                Unlock the full potential of your intellectual property with our powerful platform. Create, protect, and
                monetize your assets with just a few clicks.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Create Programmable IP</h3>
                    <p className="text-sm text-foreground/70">
                      Tokenize your intellectual property with customizable terms
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Protect Your Assets</h3>
                    <p className="text-sm text-foreground/70">Secure global protection across 181 countries</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">License & Monetize</h3>
                    <p className="text-sm text-foreground/70">Create new revenue streams with flexible licensing</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group active:scale-95 transition-transform">
                  Create New Asset
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="active:scale-95 transition-transform">
                  Explore Licensing
                </Button>
              </div>
            </motion.div>

            {isMounted && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="hidden md:block"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/5 rounded-full blur-3xl"></div>
                  <div className="relative flex justify-center items-center">
                    <motion.div
                      className="w-64 h-64 border-4 border-primary/20 rounded-full flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <motion.div
                        className="w-48 h-48 border-4 border-secondary/20 rounded-full flex items-center justify-center"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <motion.div
                          className="w-32 h-32 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Shield className="h-12 w-12 text-primary-foreground" />
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* Floating particles */}
                    {particlePositions.current.map((position, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-primary/60"
                        style={{
                          top: position.top,
                          left: position.left,
                        }}
                        animate={{
                          x: [0, (i % 3) * 10 - 10],
                          y: [0, (i % 2) * 10 - 5],
                          opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                          duration: 2 + (i % 3),
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

