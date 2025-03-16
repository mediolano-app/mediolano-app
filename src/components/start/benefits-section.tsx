"use client"

import { FileText, Coins, Shield, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export default function StartBenefitsSection() {
  const benefits = [
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Protect Your Creations",
      description:
        "Secure your intellectual property with blockchain-based proof of ownership that's recognized globally.",
    },
    {
      icon: <Coins className="h-12 w-12 text-primary" />,
      title: "Monetize Your Assets",
      description: "Create new revenue streams by licensing your IP with flexible, programmable terms.",
    },
    {
      icon: <FileText className="h-12 w-12 text-primary" />,
      title: "Total Sovereignty",
      description: "Maintain complete control over your intellectual property with customizable licensing options.",
    },
  ]

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="benefits" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits for Creators</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Mediolano empowers creators with tools to protect, manage, and monetize their intellectual property.
            </p>
          </motion.div>
        </div>

        {/* Mobile Scrollable Cards */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="snap-center flex-shrink-0 w-[85vw]"
            >
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl border border-border shadow-sm transition-all duration-300 hover:shadow hover:-translate-y-1">
                <motion.div
                  className="mb-6 p-4 rounded-full bg-primary/10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
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
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col items-center text-center"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.div
                className="mb-6 p-4 rounded-full bg-primary/10"
                animate={
                  hoveredIndex === index
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
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 p-8 rounded-2xl bg-gradient-to-br/30 from-primary/10 via-background to-secondary/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">The Berne Convention Protection</h3>
              <p className="text-foreground/80 mb-4">
                When you register your IP with Mediolano, it's automatically protected in 181 countries according to The
                Berne Convention for the Protection of Literary and Artistic Works, adopted in 1886.
              </p>
              <p className="text-foreground/80">
                This guarantees recognition of your authorship without the need for registration with WIPO (World
                Intellectual Property Organization).
              </p>
            </div>
            <div className="flex justify-center">
              <motion.div
                className="relative w-full max-w-md aspect-square"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <Globe className="h-24 w-24 text-primary/70" />
                  </motion.div>
                </div>
                <motion.div
                  className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-[15%] border-2 border-dashed border-secondary/30 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />

                {/* Floating country markers */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-primary"
                    style={{
                      top: `${30 + Math.random() * 40}%`,
                      left: `${30 + Math.random() * 40}%`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
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

