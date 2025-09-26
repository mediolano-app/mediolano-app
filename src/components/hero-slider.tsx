"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Star, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const featuredCollections = [
  {
    id: 1,
    title: "Pixel Legends",
    description:
      "A groundbreaking collection of moments from Kalamaha's music journey",
    image: "/pixel-legends-cover.jpeg",
    type: "Photos",
    stats: {
      assets: 24,
      rating: 4.9,
    },
    gradient: "from-purple-500/20 to-blue-500/20",
    href: "/collections/pixel-legends",
  },
  {
    id: 2,
    title: "Fine art Moma",
    description: "A curated selection of modern art pieces from the Moma museum",
    image: "/fine-art-moma.jpg",
    type: "Art",
    stats: {
      assets: 18,
      rating: 4.8,
    },
    gradient: "from-green-500/20 to-cyan-500/20",
    href: "/collections/fine-art-moma",
  },
  {
    id: 3,
    title: "Hero Collectors",
    description: "Exclusive photography from digital collectibles from top artists",
    image: "/hero-collectors.jpg",
    type: "Photos",
    stats: {
      assets: 12,
      rating: 5.0,
    },
    gradient: "from-orange-500/20 to-pink-500/20",
    href: "/collections/neural-networks",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % featuredCollections.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning])

  const prevSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + featuredCollections.length) % featuredCollections.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning])

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return
      setIsTransitioning(true)
      setCurrentSlide(index)
      setTimeout(() => setIsTransitioning(false), 500)
    },
    [isTransitioning, currentSlide],
  )

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [nextSlide])

  const currentCollection = featuredCollections[currentSlide]

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <Card className="border-0">
        <CardContent className="p-0">
          <div className={`relative h-[600px] md:h-[640px] bg-gradient-to-br ${currentCollection.gradient}`}>
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={currentCollection.image || "/placeholder.svg"}
                alt={currentCollection.title}
                fill
                className={`object-cover opacity-90 transition-all duration-500 ease-in-out ${
                  isTransitioning ? "scale-105 opacity-80" : "scale-100 opacity-80"
                }`}
                priority={currentSlide === 0}
                loading={currentSlide === 0 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-background/0 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center p-12">
              <div className="container mx-auto px-6 md:px-8">
                <div
                  className={`max-w-2xl transition-all duration-500 ease-in-out ${
                    isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                  }`}
                >
                  <Badge className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
                    {currentCollection.type}
                  </Badge>

                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">
                    {currentCollection.title}
                  </h2>

                  <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed max-w-xl">
                    {currentCollection.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-2 text-white/80">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm font-medium">{currentCollection.stats.assets} Assets</span>
                    </div>
               
                  </div>

                  {/* Actions 
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-white text-black hover:bg-white/90 font-semibold transition-all duration-300"
                    >
                      <Link href={currentCollection.href}>Explore Collection</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-white/30 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm"
                    >
                      <Link href="/collections">View All Collections</Link>
                    </Button>
                  </div>*/}


                </div>
              </div>
            </div>

            {/* Arrow Navigation */}
            <Button
              variant="ghost"
              size="sm"
              onClick={prevSlide}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/30 backdrop-blur-sm h-12 w-12 p-0 transition-all duration-300 hover:scale-110 disabled:opacity-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextSlide}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/30 backdrop-blur-sm h-12 w-12 p-0 transition-all duration-300 hover:scale-110 disabled:opacity-50"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-3 mt-6">
        {featuredCollections.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`h-2 rounded-full transition-all duration-300 hover:scale-125 disabled:opacity-50 ${
              index === currentSlide ? "bg-primary w-8" : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
