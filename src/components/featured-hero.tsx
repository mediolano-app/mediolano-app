"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { useFeaturedCollections } from "@/hooks/use-collection"
import type { Collection } from "@/lib/types"

// Deterministic gradients based on index
const GRADIENTS = [
    "from-purple-500/20 to-blue-500/20",
    "from-green-500/20 to-cyan-500/20",
    "from-orange-500/20 to-pink-500/20",
    "from-blue-500/20 to-indigo-500/20",
    "from-rose-500/20 to-orange-500/20",
];

export function FeaturedHero() {
    const { collections, loading } = useFeaturedCollections([7, 10, 11]);
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    // Auto-advance slide if we have collections
    useEffect(() => {
        if (collections.length === 0) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 6000)
        return () => clearInterval(interval)
    }, [collections.length, currentSlide]) // Added currentSlide to deps to ensure fresh state usage if needed, but nextSlide callback handles it.

    const nextSlide = useCallback(() => {
        if (collections.length === 0) return
        setIsTransitioning(true)
        setCurrentSlide((prev) => (prev + 1) % collections.length)
        setTimeout(() => setIsTransitioning(false), 500)
    }, [collections.length])

    const prevSlide = useCallback(() => {
        if (collections.length === 0) return
        setIsTransitioning(true)
        setCurrentSlide((prev) => (prev - 1 + collections.length) % collections.length)
        setTimeout(() => setIsTransitioning(false), 500)
    }, [collections.length])

    const goToSlide = useCallback(
        (index: number) => {
            if (isTransitioning || index === currentSlide || collections.length === 0) return
            setIsTransitioning(true)
            setCurrentSlide(index)
            setTimeout(() => setIsTransitioning(false), 500)
        },
        [isTransitioning, currentSlide, collections.length],
    )

    // Default "Welcome" Hero Content
    const DefaultHero = () => (
        <div className="container mx-auto relative overflow-hidden rounded-2xl">
            <Card className="border-0">
                <CardContent className="p-0">
                    <div className="relative h-[600px] md:h-[640px] bg-gradient-to-br from-gray-900/20 to-gray-800/20 flex items-center justify-center">
                        {/* Minimal abstract background */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-50"></div>
                            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent opacity-50"></div>
                        </div>

                        <div className="text-center p-8 max-w-3xl relative z-10">
                            <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                Mediolano.app
                            </Badge>
                            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight tracking-tight">
                                IP Creator
                            </h2>
                            <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-2xl mx-auto">
                                Create, share, and remix with permissionless ownership.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-white text-black hover:bg-white/90 font-bold px-8 h-12 text-base transition-all hover:scale-105"
                                >
                                    <Link href="/create/collection">Start Creating</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="text-white bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 font-semibold px-8 h-12 text-base backdrop-blur-sm transition-all hover:scale-105"
                                >
                                    <Link href="/collections">Explore Collections</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    // While loading, we show the Default Hero with a subtle loading indicator or just the Default Hero itself?
    // Showing the Default Hero immediately is faster perceived performance.
    // The user won't know we are looking for collections unless we tell them.
    // Let's just show Default Hero if loading or empty.
    // BUT, if we have collections, we want to show them.

    if (loading && collections.length === 0) {
        return <DefaultHero />
    }

    if (!loading && collections.length === 0) {
        return <DefaultHero />
    }

    const currentCollection = collections[currentSlide]
    const gradient = GRADIENTS[currentSlide % GRADIENTS.length];

    return (
        <div className="container mx-auto relative overflow-hidden rounded-2xl">
            <Card className="border-0 shadow-2xl">
                <CardContent className="p-0">
                    <div className={`relative h-[600px] md:h-[640px] bg-gradient-to-br ${gradient}`}>
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <Image
                                src={currentCollection.image || "/placeholder.svg"}
                                alt={currentCollection.name}
                                fill
                                className={`object-cover opacity-90 transition-all duration-700 ease-in-out ${isTransitioning ? "scale-105 opacity-80 blur-sm" : "scale-100 opacity-80 blur-0"
                                    }`}
                                priority={true}
                                loading="eager"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent transition-all duration-500`} />
                        </div>

                        {/* Content */}
                        <div className="relative h-full flex items-center justify-center p-6 md:p-12">
                            <div className="container mx-auto px-4 md:px-8 text-center flex flex-col items-center">
                                <div
                                    className={`max-w-4xl transition-all duration-500 ease-in-out ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-3 mb-6">
                                        <Badge className="bg-white/20 text-white border-white/20 backdrop-blur-md px-3 py-1">
                                            Featured Collection
                                        </Badge>
                                        <Badge variant="outline" className="text-white border-white/30 backdrop-blur-md px-3 py-1">
                                            {currentCollection.type || "Mixed Media"}
                                        </Badge>
                                    </div>

                                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight tracking-tight drop-shadow-sm">
                                        {currentCollection.name}
                                    </h2>

                                    <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto line-clamp-3 drop-shadow-sm font-light">
                                        {currentCollection.description || "Discover this amazing collection on Mediolano."}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-center gap-8 mb-10">
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="p-3 bg-white/10 rounded-full backdrop-blur-md">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">Total Assets</p>
                                                <span className="text-xl font-bold">{currentCollection.itemCount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="bg-white text-black hover:bg-white/90 border-0 font-bold px-8 h-12 text-base transition-all hover:scale-105 hover:shadow-lg"
                                        >
                                            <Link href={`/collections/${currentCollection.nftAddress || currentCollection.id}`}>View Collection</Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="lg"
                                            variant="outline"
                                            className="text-white bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 font-semibold px-8 h-12 text-base backdrop-blur-sm transition-all hover:scale-105"
                                        >
                                            <Link href="/create/asset">Create Asset</Link>
                                        </Button>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Arrow Navigation */}
                        {collections.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={prevSlide}
                                    disabled={isTransitioning}
                                    className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/40 backdrop-blur-md h-14 w-14 rounded-full border border-white/10 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={nextSlide}
                                    disabled={isTransitioning}
                                    className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/40 backdrop-blur-md h-14 w-14 rounded-full border border-white/10 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </Button>
                            </>
                        )}

                        {/* Dots Indicator */}
                        {collections.length > 1 && (
                            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
                                {collections.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        disabled={isTransitioning}
                                        className={`transition-all duration-500 rounded-full ${index === currentSlide ? "w-12 h-3 bg-white" : "w-3 h-3 bg-white/40 hover:bg-white/60"}`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
