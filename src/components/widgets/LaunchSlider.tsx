"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EclipseIcon as Ethereum, Calendar, Users, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { bestLaunches } from "@/lib/mockLaunchData"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function LaunchSlider() {
  const [width, setWidth] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
    }
  }, [])

  const handleNext = () => {
    if (currentIndex < bestLaunches.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0) // Loop back to the first slide
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(bestLaunches.length - 1) // Loop to the last slide
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 5000) // Auto-advance every 5 seconds

    return () => clearInterval(interval)
  }, [currentIndex, handleNext]) // Added handleNext to dependencies

  return (
    <div className="relative overflow-hidden">
      <motion.div ref={carousel} className="cursor-grab overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="flex"
          animate={{ x: -currentIndex * (carousel.current?.offsetWidth || 0) }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <AnimatePresence initial={false}>
            {bestLaunches.map((launch, index) => (
              <motion.div
                key={launch.id}
                className="min-w-full px-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: index === currentIndex ? 1 : 0.8,
                  opacity: index === currentIndex ? 1 : 0.5,
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative aspect-video">
                    <img
                      src={launch.image || "/background.jpg"}
                      alt={launch.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <h2 className="text-3xl font-bold mb-2">{launch.name}</h2>
                      <p className="mb-4 text-lg line-clamp-2">{launch.description}</p>
                      <Badge variant="secondary" className="mb-2">
                        Launching {new Date(launch.launchDate).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-primary" />
                        <span>{new Date(launch.launchDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Ethereum className="w-5 h-5 mr-2 text-primary" />
                        <span>{launch.price} ETH</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-primary" />
                        <span>{launch.totalSupply.toLocaleString()} items</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold">{launch.creator}</span>
                      </div>
                    </div>
                    <Button className="w-full group">
                      View Collection
                      <ExternalLink className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
        onClick={handlePrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
        onClick={handleNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      <div className="flex justify-center mt-4">
        {bestLaunches.map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={`w-2 h-2 rounded-full mx-1 p-0 ${index === currentIndex ? "bg-primary" : "bg-muted"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

