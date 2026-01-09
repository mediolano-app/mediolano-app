"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Collection } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

// Deterministic gradients based on index
const GRADIENTS = [
  "from-purple-500/20 to-blue-500/20",
  "from-green-500/20 to-cyan-500/20",
  "from-orange-500/20 to-pink-500/20",
  "from-blue-500/20 to-indigo-500/20",
  "from-rose-500/20 to-orange-500/20",
];

interface HeroSliderProps {
  collections: Collection[];
}

export function HeroSlider({ collections = [] }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Filter out collections without images or other criteria if needed
  const displayCollections = collections.slice(0, 4);

  const nextSlide = useCallback(() => {
    if (isTransitioning || displayCollections.length === 0) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % displayCollections.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning, displayCollections.length])

  const prevSlide = useCallback(() => {
    if (isTransitioning || displayCollections.length === 0) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + displayCollections.length) % displayCollections.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning, displayCollections.length])

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide || displayCollections.length === 0) return
      setIsTransitioning(true)
      setCurrentSlide(index)
      setTimeout(() => setIsTransitioning(false), 500)
    },
    [isTransitioning, currentSlide, displayCollections.length],
  )

  useEffect(() => {
    if (displayCollections.length === 0) return;
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [nextSlide, displayCollections.length])

  if (displayCollections.length === 0) {
    return null; // Or return a skeleton/placeholder
  }

  const currentCollection = displayCollections[currentSlide]
  const gradient = GRADIENTS[currentSlide % GRADIENTS.length];

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <Card className="border-0">
        <CardContent className="p-0">
          <div className={`relative h-[600px] md:h-[640px] bg-gradient-to-br ${gradient}`}>
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={currentCollection.image || "/placeholder.svg"}
                alt={currentCollection.name}
                fill
                className={`object-cover opacity-90 transition-all duration-500 ease-in-out ${isTransitioning ? "scale-105  opacity-80" : "scale-100 opacity-80"
                  }`}
                priority={currentSlide === 0}
                loading={currentSlide === 0 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent transition-all duration-500 ease-in-out ${isTransitioning ? "scale-105  opacity-80" : "scale-100 opacity-80"}`} />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center p-12">
              <div className="container mx-auto px-6 md:px-8">
                <div
                  className={`max-w-2xl transition-all duration-500 ease-in-out ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                    }`}
                >
                  <Badge className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
                    {currentCollection.type || "Collection"}
                  </Badge>

                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">
                    {currentCollection.name}
                  </h2>

                  <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed max-w-xl line-clamp-3">
                    {currentCollection.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-2 text-white/80">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm font-medium">{currentCollection.itemCount} Assets</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-white text-black hover:bg-white/90 font-semibold transition-all duration-300"
                    >
                      <Link href={`/collections/${currentCollection.id}`}>Explore Collection</Link>
                    </Button>
                  </div>

                </div>
              </div>
            </div>

            {/* Arrow Navigation */}
            {displayCollections.length > 1 && (
              <>
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
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dots Indicator */}
      {displayCollections.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          {displayCollections.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`h-2 rounded-full transition-all duration-300 hover:scale-125 disabled:opacity-50 ${index === currentSlide ? "bg-primary w-8" : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}


export function HeroSliderSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl h-[600px] md:h-[640px] bg-muted">
      <div className="absolute inset-0">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="relative h-full flex items-center p-12">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-2xl">
            <Skeleton className="h-6 w-24 mb-4 rounded-full" />

            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-12 w-1/2 mb-4" />

            <div className="space-y-2 mb-6">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-4/6" />
            </div>

            <div className="flex items-center gap-6 mb-8">
              <Skeleton className="h-6 w-32" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-12 w-48 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
