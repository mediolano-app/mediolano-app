'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Wallet, Copyright, FileText, Banknote, BookOpen, Users, Phone, User, Award, Settings, Briefcase, LayoutDashboard, Box, Grid, Gem, ArrowRightLeft, FileBadge, FileCheck, DollarSign, Grid2X2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import dynamic from 'next/dynamic';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ThemeToggle } from "@/components/header/theme-toggle"
import { WalletConnect } from "@/components/header/wallet-connect"

const WalletBarM = dynamic(() => import('@/components/header/walletbar-mobile'), { ssr: false })

const navigationItems = [
  {
    title: 'Start',
    items: [
      { title: 'Discover', href: '/discover', icon: BookOpen },
      { title: 'Create', href: '/create', icon: Box },
      { title: 'Create IP Collection', href: '/create/collection', icon: Grid2X2 },
      { title: 'Create IP Asset', href: '/create/asset', icon: DollarSign },
      { title: 'Create with IP Templates', href: '/create/templates', icon: Grid },
    ],
  },
  {
    title: 'Manage',
    items: [
      { title: 'Portfolio', href: '/portfolio', icon: FileText },
      { title: 'Collections', href: '/portfolio/collections', icon: Gem },
      { title: 'Dashboard', href: '/portfolio/dashboard', icon: LayoutDashboard },
      { title: 'Account', href: '/account', icon: User },
    ],
  },
  {
    title: 'Services',
    items: [

      { title: 'Proof of Ownership', href: '/services/proof-of-ownership', icon: FileBadge },
      { title: 'Proof of Licensing', href: '/services/proof-of-licensing', icon: FileCheck },
      { title: 'Transfer', href: '/transfer', icon: ArrowRightLeft },
      { title: 'Licensing', href: '/licensing', icon: FileText },
      { title: 'Listings', href: '/listing', icon: Banknote },
    ],
  },
]

const userMenuItems = [
  { title: 'My Account', href: '/account', icon: User },
  { title: 'Settings', href: '/settings', icon: Settings },
]

const appFeatures = [
  { title: 'Protection', description: 'Secure your intellectual property authorship in 181 countries.' },
  { title: 'Global Market', description: 'Connect with potential buyers and licensees worldwide.' },
  { title: 'Programmable IP', description: 'Create permissionless licensing agreements.' },
]

export function MobileSidebar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isWalletConnected, setIsWalletConnected] = React.useState(false)

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  const handleWalletConnect = () => {
    setIsWalletConnected(!isWalletConnected)
  }


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className='pr-4'>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto">
      <VisuallyHidden.Root>
        <SheetTitle>
          Mediolano Dapp
        </SheetTitle>
      </VisuallyHidden.Root>
        <nav className="flex flex-col space-y-4 mt-4">


        <div className='mt-2'>
          <WalletConnect />
        </div>


          <Accordion type="single" collapsible className="w-full">
            {navigationItems.map((section, index) => (
              <AccordionItem value={`item-${index}`} key={section.title}>
                <AccordionTrigger className="font-semibold">{section.title}</AccordionTrigger>
                <AccordionContent>
                  {section.items.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="w-full justify-start py-2 text-base"
                      onClick={() => handleNavigation(item.href)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.title}
                    </Button>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          

          

            

          <div>
          
            {userMenuItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start py-2 text-base"
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Button>
            ))}
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="mb-4">Dapp Features</h3>
            <div className="space-y-4">
              {appFeatures.map((feature, index) => (
                <div key={index} className="bg-blue-100/40 dark:bg-blue-900/40 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4 mb-20">
            <h2 className="">Get Started</h2>
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => handleNavigation('/create')}
            >
              Create
            </Button>
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => handleNavigation('/assets')}
            >
              Explore
            </Button>
          </div>



          <Separator className="my-4" />

          <ThemeToggle />






        </nav>







      </SheetContent>
    </Sheet>
  )
}