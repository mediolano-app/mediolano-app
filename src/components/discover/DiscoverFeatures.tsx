"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Globe, Clock, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function DiscoverFeatures() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const features = [
    {
      icon: <Zap className="h-10 w-10 text-blue-600" />,
      title: "High-Speed & Low-Cost",
      description:
        "Leverage Starknet's unparalleled performance for fast and affordable tokenization of your intellectual property.",
    },
    {
      icon: <Globe className="h-10 w-10 text-blue-600" />,
      title: "Global Protection",
      description:
        "Automatically protect your IP in 181 countries according to The Berne Convention for the Protection of Literary and Artistic Works.",
    },
    {
      icon: <Clock className="h-10 w-10 text-blue-600" />,
      title: "Timestamped Ownership",
      description:
        "Your copyright will be timestamped for proof of ownership, valid for 50-70 years depending on legal jurisdiction.",
    },
    {
      icon: <Lock className="h-10 w-10 text-blue-600" />,
      title: "Permissionless Registration",
      description: "Anyone can register their Intellectual Property assets without barriers or gatekeepers.",
    },
  ]

  const [activeFeature, setActiveFeature] = useState<number | null>(null)

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="features" className="py-20 verflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mediolano's features</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Our platform offers unique advantages for creators and organizations looking to protect and monetize their
              intellectual property.
            </p>
          </motion.div>
        </div>

        {/* Mobile Scrollable Cards */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-8 no-scrollbar">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="snap-center flex-shrink-0 w-[85vw]"
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="h-full border-border hover:border-primary/50 transition-colors duration-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <motion.div
                    className="mb-4"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/80 text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Desktop Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              onHoverStart={() => setActiveFeature(index)}
              onHoverEnd={() => setActiveFeature(null)}
              whileHover={{ y: -8 }}
              className="active:scale-95 transition-transform"
            >
              <Card
                className={`h-full border-border transition-all duration-300 hover:shadow-md ${
                  activeFeature === index ? "border-primary/50 shadow-lg" : ""
                }`}
              >
                <CardHeader>
                  <motion.div
                    className="mb-4"
                    animate={
                      activeFeature === index
                        ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, -10, 10, -10, 0],
                          }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/80 text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

