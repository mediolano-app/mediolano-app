"use client"

import { useRef, useState, useEffect } from "react"
import { mediolanoFeatures } from "@/lib/mediolano-featured"
import { Sparkles, Smartphone, Zap } from "lucide-react"
import Image from "next/image"

export function MediolanoFeatures() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const icons = [Sparkles, Smartphone, Zap]

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.children[0]?.clientWidth || 0
      const gap = 12 // gap-3 = 12px
      const index = Math.round(scrollLeft / (cardWidth + gap))
      setActiveIndex(Math.min(index, mediolanoFeatures.length - 1))
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return
    const card = scrollRef.current.children[index] as HTMLElement
    card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }

  return (
    <div className="relative w-full flex flex-col">
      <div
        ref={scrollRef}
        className="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 px-2 py-3 md:gap-6 md:px-8"
      >
        {mediolanoFeatures.map((feature, index) => {
          const Icon = icons[index]
          return (
            <div key={feature.id} className="snap-center shrink-0 w-[90vw] md:w-[435px] h-[600px] flex flex-col">
              <div
                className={`relative flex-1 rounded-3xl overflow-hidden p-8 flex flex-col justify-between shadow-md border-2 border-transparent animate-border-gradient`}
                style={{
                  backgroundImage: `linear-gradient(135deg, ${index === 0 ? "#14b8a6, #a855f7" : index === 1 ? "#a855f7, #f97316" : "#14b8a6, #3b82f6, #f97316"
                    })`,
                  backgroundSize: "200% 200%",
                }}
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src={feature.bgImage || "/placeholder.svg"}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                  {/* Gradient overlay matching card colors */}
                  <div className={`absolute inset-0 ${feature.gradient} opacity-85`} />
                </div>

                {/* Content layer above background */}
                <div className="relative z-10 flex justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-flex shadow-xl">
                    <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
                  </div>
                </div>

                <div className="relative z-10 space-y-3">
                  <h2 className="text-3xl md:text-4xl font-bold text-white text-balance leading-tight">
                    {feature.title}
                  </h2>
                  <p className="text-xs md:text-sm text-white/90 text-pretty leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2 justify-center pb-6">
        {mediolanoFeatures.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
              }`}
            aria-label={`Go to feature ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
