"use client"

import { Shield } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"

export default function HeroSection() {
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Use refs to store particle positions consistently
  const particlePositions = useRef(
    Array(6)
      .fill(0)
      .map(() => ({
        top: `${20 + 60 * 0.5}%`,
        left: `${20 + 60 * 0.5}%`,
        duration: 2 + 1,
      })),
  )

  useEffect(() => {
    setIsMounted(true)

    // Only calculate random positions after mounting
    particlePositions.current = Array(6)
      .fill(0)
      .map(() => ({
        top: `${20 + Math.random() * 60}%`,
        left: `${20 + Math.random() * 60}%`,
        duration: 2 + Math.random() * 2,
      }))

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="relative min-h-[80vh] flex items-center pb-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.1),transparent_70%)]"></div>

      {/* Animated background grid */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate={isMounted ? "visible" : "hidden"}
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-blue/10 text-primary px-4 py-2 rounded-full mb-6"
            >
              <Shield className="h-4 w-4" color="blue" />
              <span className="text-sm font-medium">Powered on Starknet</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Seamless Intellectual Property Tokenization for The Integrity Web
            </motion.h1>
          </motion.div>

          {/* Right content - 3D IP Showcase */}
          {isMounted && (
            <motion.div
              className="flex-1 relative mt-12 lg:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative w-full max-w-[280px] md:max-w-[400px] mx-auto aspect-square">
                {/* Central platform */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-secondary/20 to-blue/20 rounded-full flex items-center justify-center z-10 border border-blue/30"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(var(--primary-rgb),0.2)",
                      "0 0 40px rgba(var(--primary-rgb),0.4)",
                      "0 0 20px rgba(var(--primary-rgb),0.2)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Shield className="h-12 w-12 md:h-16 md:w-16 text-blue-600" />
                </motion.div>

                {/* Orbiting IP assets */}
                <div className="absolute inset-0">
                  {/* Orbit paths */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                      className="text-blue/50"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="35%"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                      className="text-blue/50"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="25%"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                      className="text-blue/50"
                    />
                  </svg>

                  {/* Orbit 1 - Music */}
                  <div className="absolute top-1/2 left-1/2 w-[90%] h-[90%] -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className="absolute"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      style={{
                        width: "100%",
                        height: "100%",
                        transformOrigin: "center",
                      }}
                    >
                      <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2"
                        animate={{ rotate: -360 }} // Counter-rotate to keep orientation
                        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        style={{ transformOrigin: "center" }}
                      >
                        <div className="bg-blue/10 p-2 rounded-lg border border-blue/20 shadow-lg">
                          <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-primary"
                            >
                              <path d="M9 18V5l12-2v13"></path>
                              <circle cx="6" cy="18" r="3"></circle>
                              <circle cx="18" cy="16" r="3"></circle>
                            </svg>
                          </div>
                          <div className="mt-1 text-[10px] md:text-xs font-medium text-center">Music</div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Orbit 2 - Art */}
                  <div className="absolute top-1/2 left-1/2 w-[70%] h-[70%] -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className="absolute"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      style={{
                        width: "100%",
                        height: "100%",
                        transformOrigin: "center",
                      }}
                    >
                      <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2"
                        animate={{ rotate: 360 }} // Counter-rotate to keep orientation
                        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        style={{ transformOrigin: "center" }}
                      >
                        <div className="bg-blue/10 p-2 rounded-lg border border-secondary/20 shadow-lg">
                          <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-secondary"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                              <line x1="9" y1="9" x2="9.01" y2="9"></line>
                              <line x1="15" y1="9" x2="15.01" y2="9"></line>
                            </svg>
                          </div>
                          <div className="mt-1 text-[10px] md:text-xs font-medium text-center">Artwork</div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Orbit 3 - Code */}
                  <div className="absolute top-1/2 left-1/2 w-[50%] h-[50%] -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className="absolute"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      style={{
                        width: "100%",
                        height: "100%",
                        transformOrigin: "center",
                      }}
                    >
                      <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2"
                        animate={{ rotate: -360 }} // Counter-rotate to keep orientation
                        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        style={{ transformOrigin: "center" }}
                      >
                        <div className="bg-blue/10 p-2 rounded-lg border border-blue/20 shadow-lg">
                          <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-primary"
                            >
                              <polyline points="16 18 22 12 16 6"></polyline>
                              <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                          </div>
                          <div className="mt-1 text-[10px] md:text-xs font-medium text-center">Software</div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Additional orbiting items - Only show on larger screens */}
                  {!isMobile && (
                    <>
                      <div className="absolute top-1/2 left-1/2 w-[85%] h-[85%] -translate-x-1/2 -translate-y-1/2">
                        <motion.div
                          className="absolute"
                          initial={{ rotate: 45 }} // Start at 45 degrees
                          animate={{ rotate: 45 - 360 }} // Full rotation maintaining the offset
                          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          style={{
                            width: "100%",
                            height: "100%",
                            transformOrigin: "center",
                          }}
                        >
                          <motion.div
                            className="absolute top-0 left-1/2 -translate-x-1/2"
                            animate={{ rotate: 360 - 45 }} // Counter-rotate to keep orientation
                            transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            style={{ transformOrigin: "center" }}
                          >
                            <div className="bg-blue/10 p-1.5 rounded-lg border border-secondary/20 shadow-lg">
                              <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-secondary"
                                >
                                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                </svg>
                              </div>
                              <div className="mt-0.5 text-[10px] font-medium text-center">Video</div>
                            </div>
                          </motion.div>
                        </motion.div>
                      </div>

                      <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] -translate-x-1/2 -translate-y-1/2">
                        <motion.div
                          className="absolute"
                          initial={{ rotate: 180 }} // Start at 180 degrees
                          animate={{ rotate: 180 + 360 }} // Full rotation maintaining the offset
                          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          style={{
                            width: "100%",
                            height: "100%",
                            transformOrigin: "center",
                          }}
                        >
                          <motion.div
                            className="absolute top-0 left-1/2 -translate-x-1/2"
                            animate={{ rotate: -180 - 360 }} // Counter-rotate to keep orientation
                            transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            style={{ transformOrigin: "center" }}
                          >
                            <div className="bg-blue/10 p-1.5 rounded-lg border border-blue/20 shadow-lg">
                              <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-primary"
                                >
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                  <line x1="16" y1="13" x2="8" y2="13"></line>
                                  <line x1="16" y1="17" x2="8" y2="17"></line>
                                  <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                              </div>
                              <div className="mt-0.5 text-[10px] font-medium text-center">Document</div>
                            </div>
                          </motion.div>
                        </motion.div>
                      </div>
                    </>
                  )}
                </div>

                {/* Floating particles - Reduced for mobile */}
                {particlePositions.current.slice(0, isMobile ? 3 : 6).map((particle, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-blue/60"
                    style={{
                      top: particle.top,
                      left: particle.left,
                    }}
                    animate={{
                      y: [0, isMobile ? -5 : -10, 0],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: particle.duration,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Scroll indicator - hidden on mobile */}
        {isMounted && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center hidden md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-blue/30 rounded-full flex justify-center p-1"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <motion.div
                className="w-1.5 h-1.5 bg-primary rounded-full"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

