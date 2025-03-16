"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface FluidParticlesBackgroundProps {
  title?: string
  subtitle?: string
  particleCount?: number
  flowIntensity?: number
  colorScheme?: "rainbow" | "blues" | "purples" | "greens"
  particleSize?: { min: number; max: number }
  className?: string
}

// Simplified Perlin noise implementation
function createNoise() {
  const permutation = Array.from({ length: 256 }, (_, i) => i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[permutation[i], permutation[j]] = [permutation[j], permutation[i]]
  }

  const p = [...permutation, ...permutation]

  function fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  function lerp(t: number, a: number, b: number) {
    return a + t * (b - a)
  }

  function grad(hash: number, x: number, y: number) {
    const h = hash & 3
    const u = h === 0 ? x : h === 1 ? y : h === 2 ? -x : -y
    const v = h === 0 ? y : h === 1 ? -x : h === 2 ? y : -x
    return u + v
  }

  return {
    perlin2: (x: number, y: number) => {
      const X = Math.floor(x) & 255
      const Y = Math.floor(y) & 255

      x -= Math.floor(x)
      y -= Math.floor(y)

      const u = fade(x)
      const v = fade(y)

      const a = p[X] + Y
      const b = p[X + 1] + Y

      return (
        lerp(
          v,
          lerp(u, grad(p[a], x, y), grad(p[b], x - 1, y)),
          lerp(u, grad(p[a + 1], x, y - 1), grad(p[b + 1], x - 1, y - 1)),
        ) *
          0.5 +
        0.5
      )
    },
  }
}

// Color schemes
const COLOR_SCHEMES = {
  rainbow: (t: number) => {
    const r = Math.sin(t * 0.3) * 127 + 128
    const g = Math.sin(t * 0.3 + 2) * 127 + 128
    const b = Math.sin(t * 0.3 + 4) * 127 + 128
    return `rgba(${r}, ${g}, ${b}, 0.7)`
  },
  blues: (t: number) => {
    const b = Math.sin(t * 0.2) * 55 + 200
    return `rgba(100, 150, ${b}, 0.7)`
  },
  purples: (t: number) => {
    const r = Math.sin(t * 0.2) * 55 + 150
    const b = Math.sin(t * 0.2 + 2) * 55 + 200
    return `rgba(${r}, 100, ${b}, 0.7)`
  },
  greens: (t: number) => {
    const g = Math.sin(t * 0.2) * 55 + 200
    return `rgba(100, ${g}, 150, 0.7)`
  },
}

interface FluidParticle {
  x: number
  y: number
  size: number
  speed: number
  angle: number
  color: string
  opacity: number
  life: number
  maxLife: number
}

export default function FluidParticlesBackground({
  title = "Fluid Particles",
  subtitle = "Dynamic flowing animation",
  particleCount = 1500,
  flowIntensity = 0.0015,
  colorScheme = "rainbow",
  particleSize = { min: 1, max: 4 },
  className,
}: FluidParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const noise = createNoise()
  const colorFunc = COLOR_SCHEMES[colorScheme]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (!container) return

      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    resizeCanvas()

    // Initialize particles
    const particles: FluidParticle[] = Array.from({ length: particleCount }, () => {
      const size = Math.random() * (particleSize.max - particleSize.min) + particleSize.min
      const life = Math.random() * 100
      const maxLife = 100 + Math.random() * 150

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        speed: 0.1 + Math.random() * 1.5,
        angle: 0,
        color: colorFunc(Math.random() * 10),
        opacity: 0,
        life,
        maxLife,
      }
    })

    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.003

      // Clear with semi-transparent background for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        // Update particle life
        particle.life += 1
        if (particle.life > particle.maxLife) {
          particle.life = 0
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
          particle.color = colorFunc(time * 10 + Math.random() * 5)
        }

        // Calculate opacity based on life cycle (fade in and out)
        const lifeRatio = particle.life / particle.maxLife
        particle.opacity = lifeRatio < 0.2 ? lifeRatio * 5 : lifeRatio > 0.8 ? (1 - lifeRatio) * 5 : 1

        // Get noise value for this position and time
        const noiseX = noise.perlin2(particle.x * flowIntensity, particle.y * flowIntensity + time)

        const noiseY = noise.perlin2(particle.x * flowIntensity + 100, particle.y * flowIntensity + time + 100)

        // Calculate angle from noise
        particle.angle = Math.PI * 2 * noiseX

        // Move particle along the flow field
        particle.x += Math.cos(particle.angle) * particle.speed
        particle.y += Math.sin(particle.angle) * particle.speed

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.globalAlpha = particle.opacity * 0.7
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [particleCount, flowIntensity, particleSize, colorFunc, noise])

  return (
    <div className={cn("relative w-full h-screen overflow-hidden", "bg-white dark:bg-black", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg">{title}</h1>
          <Link
            href="https://kokonutui.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl md:text-2xl font-medium text-white/90 flex items-center justify-center"
          >
            {subtitle}
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

