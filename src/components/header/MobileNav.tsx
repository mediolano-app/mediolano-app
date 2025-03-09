"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Home,
  Rocket,
  LayoutDashboard,
  FileText,
  Bookmark,
  UserCircle,
  Shield,
  PlayCircle,
  Download,
  Zap,
  Briefcase,
  BarChart3,
  FileSignature,
  Tags,
  User,
} from "lucide-react"
import { WalletConnect } from "@/components/header/WalletConnect"
import { ThemeToggle } from "@/components/header/ThemeToggle"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const navigationItems = [
  {
    title: "Start",
    icon: PlayCircle,
    items: [
      { title: "Introduction", href: "/docs", icon: PlayCircle },
      { title: "Installation", href: "/docs/installation", icon: Download },
      { title: "Tokenization", href: "/docs/tokenization", icon: Zap },
    ],
  },
  {
    title: "Manage",
    icon: Briefcase,
    items: [
      { title: "Portfolio", href: "/manage/portfolio", icon: Briefcase },
      { title: "Assets Dashboard", href: "/manage/assets", icon: BarChart3 },
      { title: "Licensings", href: "/manage/licensings", icon: FileSignature },
      { title: "Listings", href: "/manage/listings", icon: Tags },
      { title: "Public Profile", href: "/manage/profile", icon: User },
    ],
  },
]

const features = [
  { title: "Tokenize IP", href: "/tokenize", icon: Rocket },
  { title: "Marketplace", href: "/marketplace", icon: LayoutDashboard },
  { title: "Documentation", href: "/docs", icon: FileText },
  { title: "Legal", href: "/legal", icon: Bookmark },
  { title: "Security", href: "/security", icon: Shield },
]

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px] pr-0">
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <MobileLink href="/" onOpenChange={setOpen}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </MobileLink>
            <Accordion type="single" collapsible className="w-full">
              {navigationItems.map((section) => (
                <AccordionItem value={section.title} key={section.title}>
                  <AccordionTrigger>
                    <section.icon className="mr-2 h-4 w-4" />
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2">
                      {section.items.map((item) => (
                        <MobileLink key={item.href} href={item.href} onOpenChange={setOpen} className="pl-4">
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </MobileLink>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
              <AccordionItem value="features">
                <AccordionTrigger>
                  <Rocket className="mr-2 h-4 w-4" />
                  Features
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2">
                    {features.map((feature) => (
                      <MobileLink key={feature.href} href={feature.href} onOpenChange={setOpen} className="pl-4">
                        <feature.icon className="mr-2 h-4 w-4" />
                        {feature.title}
                      </MobileLink>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <MobileLink href="/about" onOpenChange={setOpen}>
              <UserCircle className="mr-2 h-4 w-4" />
              About
            </MobileLink>
          </div>
        </ScrollArea>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <WalletConnect />
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">© 2023 Mediolano</span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps {
  href: string
  onOpenChange?: (open: boolean) => void
  className?: string
  children: React.ReactNode
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => onOpenChange?.(false)}
      className={cn("flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline", className)}
      {...props}
    >
      {children}
    </Link>
  )
}

