"use client"

import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, FileCheck, Globe, Zap } from "lucide-react"
import { useRef, useState, useEffect } from "react"

export default function StartStatsSection() {
  const stats = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      value: 10000,
      formattedValue: "10,000+",
      label: "Creators",
      description: "Artists and organizations protecting their work",
    },
    {
      icon: <FileCheck className="h-8 w-8 text-primary" />,
      value: 50000,
      formattedValue: "50,000+",
      label: "Assets Protected",
      description: "Intellectual property assets tokenized on our platform",
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      value: 181,
      formattedValue: "181",
      label: "Countries",
      description: "Global protection through the Berne Convention",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      value: 0.001,
      formattedValue: "0.001 ETH",
      label: "Average Cost",
      description: "Affordable tokenization for everyone",
    },
  ]

  return (
    <section id="stats" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mediolano in Numbers</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Our platform is growing rapidly, empowering creators around the world.
            </p>
          </motion.div>
        </div>

        {/* Mobile Scrollable Cards */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4">
          {stats.map((stat, index) => (
            <div key={index} className="snap-center flex-shrink-0 w-[85vw]">
              <AnimatedStatCard stat={stat} index={index} />
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <AnimatedStatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AnimatedStatCard({
  stat,
  index,
}: {
  stat: {
    icon: JSX.Element
    value: number
    formattedValue: string
    label: string
    description: string
  }
  index: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      const duration = 2000 // 2 seconds
      const frameDuration = 1000 / 60 // 60fps
      const totalFrames = Math.round(duration / frameDuration)
      let frame = 0

      const counter = setInterval(() => {
        frame++
        const progress = frame / totalFrames
        const currentCount = Math.round(stat.value * progress)

        if (frame === totalFrames) {
          clearInterval(counter)
          setCount(stat.value)
        } else {
          setCount(currentCount)
        }
      }, frameDuration)

      return () => clearInterval(counter)
    }
  }, [isInView, stat.value])

  const formattedCount =
    stat.value >= 1000 ? `${Math.floor(count / 1000)}k+` : stat.value < 1 ? count.toFixed(3) : count.toString()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <Card className="border-border hover:border-primary/30 transition-all duration-300 h-full bg-card/80 backdrop-blur-sm">
        <CardContent className="pt-6 text-center">
          <motion.div
            initial={{ scale: 1 }}
            whileInView={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            viewport={{ once: true }}
            className="inline-flex p-3 rounded-lg bg-primary/10 mb-4"
          >
            {stat.icon}
          </motion.div>
          <h3 className="text-3xl font-bold mb-1">
            {isInView ? (stat.value < 1 ? `${formattedCount} ETH` : formattedCount) : "0"}
          </h3>
          <p className="font-medium text-primary mb-2">{stat.label}</p>
          <p className="text-sm text-foreground/70">{stat.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

