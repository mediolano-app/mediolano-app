"use client"

import { FileText, Coins, Shield, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"

export default function DiscoverBenefitsCreators() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Use refs for consistent particle positions
  const particlePositions = useRef(
    Array(8)
      .fill(0)
      .map(() => ({
        top: `${30 + 40 * 0.5}%`,
        left: `${30 + 40 * 0.5}%`,
      })),
  )

  useEffect(() => {
    setIsMounted(true)

    // Generate random positions after mounting
    particlePositions.current = Array(8)
      .fill(0)
      .map(() => ({
        top: `${30 + Math.random() * 40}%`,
        left: `${30 + Math.random() * 40}%`,
      }))
  }, [])

  const benefits = [
    {
      icon: <Shield className="h-12 w-12 text-white" />,
      title: "Protect Your Creations",
      description:
        "Secure your intellectual property with blockchain-based proof of ownership that's recognized globally.",
    },
    {
      icon: <Coins className="h-12 w-12 text-white" />,
      title: "Monetize Your Assets",
      description: "Create new revenue streams by licensing your IP with flexible, programmable terms.",
    },
    {
      icon: <FileText className="h-12 w-12 text-white" />,
      title: "Total Sovereignty",
      description: "Maintain complete control over your intellectual property with customizable licensing options.",
    },
  ]

  return (
    <section id="benefits" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className=" text-2xl md:text-4xl font-bold mb-8">More value to your content</h2>
            <p className="text-lg text-foreground/80 max-w-7xl mx-auto">
              Mediolano empowers creators and property owners with tools to protect, manage, and monetize digital assets.
            </p>
          </motion.div>
        </div>

        {/* Mobile Scrollable Cards */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: isMounted ? index * 0.1 : 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="snap-center flex-shrink-0 w-[85vw]"
            >
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl border border-border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <motion.div
                  className="mb-6 p-4 rounded-full bg-primary/10"
                  whileHover={isMounted ? { scale: 1.1, rotate: 5 } : {}}
                  whileTap={isMounted ? { scale: 0.95 } : {}}
                >
                  {benefit.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-foreground/80">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: isMounted ? index * 0.1 : 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col items-center text-center"
              onMouseEnter={() => isMounted && setHoveredIndex(index)}
              onMouseLeave={() => isMounted && setHoveredIndex(null)}
            >
              <motion.div
                className="mb-6 p-4 rounded-full bg-blue-600"
                animate={
                  hoveredIndex === index && isMounted
                    ? {
                        scale: [1, 1.1, 1.05],
                        rotate: [0, 5, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                {benefit.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-foreground/80">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-40 p-8 rounded-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              
              <p className="text-foreground/80 mb-4 text-lg">
              Mediolano provides seamless tokenization for Intellectual Property, leveraging Starknet’s unparalleled high-speed, low-cost and smart contract intelligence for digital assets - - a groundbreaking solution to empower creators, collectors and organizations to protect and monetize their IP assets.
              </p>
              <p className="text-foreground/80 mb-4 text-lg">
              Registering Intellectual Property on Mediolano means the asset is automatically tokenize and protected in 181 countries, according to The Berne Convention for the Protection of Literary and Artistic Works, adopted in 1886, which guarantees recognition of the authorship of IP without the need for registration with WIPO (World Intellectual Property Organization).
              </p>
              <p className="text-foreground/80 text-lg">
              With Mediolano anyone can permissionless register their Intellectual Property assets -- such as artwork, video, music, literacy, AI model, software and other work of authorship. The copyright will be time stamped for your proof of ownership and valid for 50-70 years, according to the legal jurisdiction.
              </p>
            </div>
            <div className="flex justify-center">
              <motion.div
                className="relative w-full max-w-md aspect-square"
                whileHover={isMounted ? { scale: 1.05 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={
                      isMounted
                        ? {
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0, -5, 0],
                          }
                        : {}
                    }
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <Globe className="h-24 w-24 text-blue-600" />
                  </motion.div>
                </div>
                <motion.div
                  className="absolute inset-0 border-2 border-dashed border-blue/30 rounded-full"
                  animate={isMounted ? { rotate: 360 } : {}}
                  transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-[15%] border-2 border-dashed border-blue/30 rounded-full"
                  animate={isMounted ? { rotate: -360 } : {}}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />

                {/* Floating country markers - Only render on client */}
                {isMounted &&
                  particlePositions.current.map((position, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-blue"
                      style={{
                        top: position.top,
                        left: position.left,
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2 + (i % 2) * 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

