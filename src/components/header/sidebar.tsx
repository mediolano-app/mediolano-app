'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  BookOpen,
  Box,
  Layers,
  Grid2X2,
  IterationCcw,
  FileText,
  ArrowRightLeft,
  User,
  Grid,
  ChevronRight,
  Shield,
  Globe,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { ThemeToggle } from "@/components/header/theme-toggle"
import { Logo } from "@/components/header/logo"

const WalletConnect = dynamic(() => import("@/components/header/wallet-connect").then(mod => mod.WalletConnect), {
  ssr: false,
});

const navigationItems = [
  {
    title: 'Create',
    items: [
      { title: 'Create Panel', href: '/create', icon: BookOpen },
      { title: 'Create Collections', href: '/create/collection', icon: Box },
      { title: 'Create IP', href: '/create/asset', icon: Layers },
      { title: 'IP Templates', href: '/create/templates', icon: Grid2X2 },
      { title: 'Remix IP', href: '/create/remix', icon: IterationCcw },
    ],
  },
  {
    title: 'Onchain Portfolio',
    items: [
      { title: 'IP Portfolio', href: '/portfolio', icon: FileText },
      { title: 'My Collections', href: '/portfolio/collections', icon: Grid },
      { title: 'My IP Assets', href: '/portfolio/assets', icon: Grid },
      { title: 'My Activities', href: '/portfolio/activities', icon: Grid2X2 },
      { title: 'Transfer Assets', href: '/transfer', icon: ArrowRightLeft },
      { title: 'Account Settings', href: '/account', icon: User },
    ],
  },
  {
    title: 'Explore',
    items: [
      { title: 'Collections', href: '/collections', icon: Grid },
      { title: 'IP Assets', href: '/assets', icon: Grid },
      { title: 'Community Activities', href: '/activities', icon: Grid2X2 },
    ],
  },
  {
    title: 'Support',
    items: [
      { title: 'Documentation', href: '/docs', icon: HelpCircle },
    ],
  },
]

const appFeatures = [
  { title: 'Immutable Protection', description: 'IP authorship 181 countries', icon: Shield },
  { title: 'Censorship Resistance', description: 'Onchain and decentralized', icon: Globe },
]

export function MobileSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden relative glass">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      {/* Deep Glassmorphism Background */}
      <SheetContent side="right" className="w-full sm:w-[380px] p-0 border-l bg-card backdrop-blur-3xl shadow-2xl">
        <VisuallyHidden.Root>
          <SheetTitle>IP Creator Nav</SheetTitle>
        </VisuallyHidden.Root>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-start p-6 pt-5 pb-2">
            <div className="scale-90 origin-left opacity-90 hover:opacity-100 transition-opacity" onClick={() => setIsOpen(false)}>
              <Logo />
            </div>
          </div>

          <ScrollArea className="flex-1 px-6">
            <div className="flex flex-col space-y-4">

              {/* Wallet & Theme */}
              <div className="flex flex-col gap-4 mt-4">
                <div className="p-1 bg-white/5 rounded-xl border border-white/10 shadow-sm backdrop-blur-md">
                  <WalletConnect />
                </div>
                <div className="flex items-right justify-end px-3 py-2">

                  <ThemeToggle />
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-4">
                {navigationItems.map((section) => (
                  <div key={section.title} className="space-y-3">
                    <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] pl-3">
                      {section.title}
                    </h3>
                    <div className="flex flex-col space-y-1">
                      {section.items.map((item) => {
                        // Check active state more permissively for docs subpages
                        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                        const Icon = item.icon

                        return (
                          <Button
                            key={item.href}
                            variant="ghost"
                            onClick={() => handleNavigation(item.href)}
                            className={cn(
                              "w-full justify-between h-11 px-3 rounded-lg transition-all duration-300 group",
                              isActive
                                ? "bg-primary/10 text-foreground font-medium"
                                : "hover:bg-white/5 text-foreground/60 hover:text-foreground/90"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={cn(
                                "h-4 w-4 transition-colors",
                                isActive ? "text-primary" : "text-foreground/40 group-hover:text-foreground/80"
                              )} />
                              <span className="text-[15px]">{item.title}</span>
                            </div>
                            {isActive && (
                              <div className="w-1 h-4 bg-primary rounded-full" />
                            )}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                {appFeatures.map((feature, i) => (
                  <div key={i} className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                    <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center">
                      <feature.icon className="h-3.5 w-3.5 text-foreground/80" />
                    </div>
                    <div>
                      <h4 className="font-medium text-xs text-foreground/90 mb-0.5">{feature.title}</h4>
                      <p className="text-[10px] text-foreground/50 leading-tight">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-xl">
            <Button
              size="lg"
              className="w-full rounded-xl font-medium shadow-xl shadow-black/5"
              onClick={() => handleNavigation('/create')}
            >
              Start Creating
              <ChevronRight className="ml-2 h-4 w-4 opacity-70" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}