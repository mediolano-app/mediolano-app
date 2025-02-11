'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Wallet, Copyright, FileText, Banknote, BookOpen, Users, Phone, User, Award, Settings, Briefcase, LayoutDashboard } from 'lucide-react'
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
import { ThemeToggle } from "@/components/header/ThemeToggle"


const WalletBarM = dynamic(() => import('@/components/header/WalletBarM'), { ssr: false })

const navigationItems = [
  {
    title: 'Programmable IP',
    items: [
      { title: 'Register', href: '/new', icon: Copyright },
      { title: 'New IP', href: '/new/ip', icon: Copyright },
      { title: 'New Collection', href: '/new/collection', icon: Copyright },
      { title: 'Templates', href: '/register/templates', icon: FileText },
      { title: 'FAQ', href: '/faq', icon: BookOpen },
    ],
  },
  {
    title: 'Manage',
    items: [
      { title: 'Portfolio', href: '/portfolio', icon: FileText },
      { title: 'Dashboard', href: '/portfolio/dashboard', icon: LayoutDashboard },
      { title: 'Licensing', href: '/licensing', icon: FileText },
      { title: 'Transfer', href: '/transaction', icon: FileText },
    ],
  },
  {
    title: 'Monetize',
    items: [
      { title: 'Marketplace', href: '/marketplace', icon: Banknote },
      { title: 'Listing', href: '/listing', icon: Banknote },
      { title: 'Smart Transaction', href: '/', icon: FileText },
    ],
  },
]

const userMenuItems = [
  { title: 'My Account', href: '/account', icon: User },
  { title: 'My IP\'s', href: '/portfolio', icon: Copyright },
  { title: 'Rewards', href: '/rewards', icon: Award },
  { title: 'Settings', href: '/settings', icon: Settings },
  { title: 'Business', href: '/business', icon: Briefcase },
  
]

const appFeatures = [
  { title: 'Blockchain-Powered', description: 'Secure your intellectual property authorship with blockchain technology.' },
  { title: 'Global Market', description: 'Connect with potential buyers and licensees worldwide.' },
  { title: 'Programmable Licensing', description: 'Create permissionless licensing agreements.' },
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
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto">
      <VisuallyHidden.Root>
        <SheetTitle>
          Dapp Menu
        </SheetTitle>
      </VisuallyHidden.Root>
        <nav className="flex flex-col space-y-4 mt-4">


        <div className='mt-10'>
          {/*<Button
              variant="outline"
              size="lg"
              className="w-full justify-start"
              onClick={handleWalletConnect}
            >
              <Wallet className="mr-2 h-5 w-5" />
              {isWalletConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
            </Button>*/}
            
            <WalletBarM />
        </div>



          <Accordion type="single" collapsible className="w-full">
            {navigationItems.map((section, index) => (
              <AccordionItem value={`item-${index}`} key={section.title}>
                <AccordionTrigger className="text-lg font-semibold">{section.title}</AccordionTrigger>
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
            <h2 className="mb-2 font-semibold text-lg">Account</h2>
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
            <h3 className="mb-4 font-semibold">Dapp Features</h3>
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
            <h2 className="font-semibold text-xl">Get Started</h2>
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => handleNavigation('/new')}
            >
              Register Your IP
            </Button>
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => handleNavigation('/portfolio')}
            >
              Open Portfolio
            </Button>
          </div>



          <Separator className="my-4" />

          <ThemeToggle />






        </nav>







      </SheetContent>
    </Sheet>
  )
}