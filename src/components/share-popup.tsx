'use client'

import { useState } from 'react'
import { Share2, X, Twitter, Facebook, Linkedin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SharePopupProps {
  title: string
  url: string
}

export function SharePopup({ title, url }: SharePopupProps) {
  const [isOpen, setIsOpen] = useState(false)

  const shareLinks = [
    { name: 'Twitter', icon: Twitter, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { name: 'Facebook', icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>
            Share this {title} on your favorite social media platforms.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-2">
          {shareLinks.map((link) => (
            <Button
              key={link.name}
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => window.open(link.url, '_blank')}
            >
              <link.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

