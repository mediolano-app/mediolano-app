"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Share2, Twitter, Facebook, Linkedin, Instagram, MessageCircle, Video } from "lucide-react"
import Link from "next/link"

export function ShareButton() {
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  const shareNetworks = [
    { name: "X", icon: Twitter, url: `https://twitter.com/intent/tweet?url=${shareUrl}` },
    { name: "Facebook", icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { name: "LinkedIn", icon: Linkedin, url: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}` },
    { name: "Instagram", icon: Instagram, url: `https://www.instagram.com/` },
    { name: "Threads", icon: MessageCircle, url: `https://www.threads.net/` },
    { name: "TikTok", icon: Video, url: `https://www.tiktok.com/` },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {shareNetworks.map((network) => (
          <DropdownMenuItem key={network.name} asChild>
            <Link href={network.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
              <network.icon className="mr-2 h-4 w-4" />
              <span>Share on {network.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

