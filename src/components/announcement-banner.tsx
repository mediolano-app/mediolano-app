"use client"

import { Rocket, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="w-full flex justify-center mt-6 mb-2 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="group relative inline-flex items-center gap-2 p-[1px] rounded-full overflow-hidden shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-shadow duration-300">
        {/* Gradient Border Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 group-hover:opacity-100 animate-[spin_4s_linear_infinite] w-[200%] h-[200%] -left-1/2 -top-1/2" />

        <div className="relative flex items-center gap-3 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-white/10">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
            <Rocket className="h-3.5 w-3.5" />
          </span>

          <span className="text-sm font-medium text-foreground/90">
            IP Creator now live on Starknet Mainnet <span className="text-muted-foreground ml-1">(for testing)</span>
          </span>

          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
