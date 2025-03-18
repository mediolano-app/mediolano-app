"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface FluidParticlesBackgroundProps {
  particleCount?: number
  flowIntensity?: number
  colorScheme?: "blues" | "purples" | "greens"
  className?: string
  gradient?: {
    from: string
    to: string
    direction?: "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl"
    opacity?: number
  }
  zIndex?: number
  subtle?: boolean
}

// Simple noise function
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

// Simple color schemes
const COLOR_SCHEMES = {
  blues: (t: number) => {
    const b = Math.sin(t * 0.2) * 30 + 200
    return `rgba(100, 150, ${b}, 0.3)`
  },
  purples: (t: number) => {
    const r = Math.sin(t * 0.2) * 30 + 150
    const b = Math.sin(t * 0.2 + 2) * 30 + 200
    return `rgba(${r}, 100, ${b}, 0.3)`
  },
  greens: (t: number) => {
    const g = Math.sin(t * 0.2) * 30 + 200
    return `rgba(100, ${g}, 150, 0.3)`
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
  particleCount = 800,
  flowIntensity = 0.0008,
  colorScheme = "blues",
  className,
  gradient,
  zIndex = -10,
  subtle = true,
}: FluidParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const noise = createNoise()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    // Initialize particles
    const particles: FluidParticle[] = Array.from({ length: particleCount }, () => {
      const size = subtle ? 0.5 + Math.random() * 1.5 : 1 + Math.random() * 3
      const life = Math.random() * 100
      const maxLife = 100 + Math.random() * 150

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        speed: subtle ? 0.1 + Math.random() * 0.5 : 0.1 + Math.random() * 1,
        angle: 0,
        color: COLOR_SCHEMES[colorScheme](Math.random() * 10),
        opacity: 0,
        life,
        maxLife,
      }
    })

    let animationId: number
    let time = 0

    const animate = () => {
      time += subtle ? 0.001 : 0.002

      // Clear with semi-transparent background for trail effect
      ctx.fillStyle = subtle ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        // Update particle life
        particle.life += 1
        if (particle.life > particle.maxLife) {
          particle.life = 0
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
          particle.color = COLOR_SCHEMES[colorScheme](time * 10 + Math.random() * 5)
        }

        // Calculate opacity based on life cycle (fade in and out)
        const lifeRatio = particle.life / particle.maxLife
        particle.opacity = lifeRatio < 0.2 ? lifeRatio * 5 : lifeRatio > 0.8 ? (1 - lifeRatio) * 5 : 1

        // Get noise value for this position and time
        const noiseX = noise.perlin2(particle.x * flowIntensity, particle.y * flowIntensity + time)

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

        // Draw particle with reduced opacity for subtle effect
        const finalOpacity = subtle ? particle.opacity * 0.4 : particle.opacity * 0.7
        ctx.globalAlpha = finalOpacity
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
  }, [particleCount, flowIntensity, colorScheme, subtle, noise])

  return (
    <div className={cn("fixed inset-0 overflow-hidden", "bg-white dark:bg-black", className)} style={{ zIndex }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {gradient && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${gradient.direction?.replace("to-", "to ") || "to right"}, ${gradient.from}, ${gradient.to})`,
            opacity: gradient.opacity || 0.6,
            zIndex: 1,
          }}
        />
      )}
    </div>
  )
}

