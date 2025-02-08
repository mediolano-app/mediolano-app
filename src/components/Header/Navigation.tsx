'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Copyright, FileText, Banknote, BookOpen, Users, Phone, Grid2X2, List, GalleryVerticalEnd, ScrollText, ArrowLeftRight, BriefcaseBusiness, Globe, LayoutGrid, Zap, LayoutDashboard, Grid, Box } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navigationItems = [
  {
    title: 'New',
    items: [
      { title: 'Register', href: '/new', icon: Copyright },
      { title: 'Programmable IP', href: '/new/ip', icon: Box },
      { title: 'Collection', href: '/new/collection', icon: Grid },
      { title: 'IP Templates', href: '/register/templates', icon: FileText },
      { title: 'FAQ', href: '/faq', icon: BookOpen },
    ],
  },
  {
    title: 'Portcolio',
    items: [
      { title: 'Manage', href: '/portfolio', icon: GalleryVerticalEnd },
      { title: 'Dashboard', href: '/portfolio/dashboard', icon: LayoutDashboard },
      { title: 'Transfers', href: '/transfers', icon: ArrowLeftRight },
    ],
  },
  {
    title: 'Monetize',
    items: [
      { title: 'Monetize', href: '/monetize', icon: Banknote },
      { title: 'Licensing', href: '/licensing', icon: FileText },
      { title: 'Marketplace', href: '/marketplace', icon: LayoutGrid },
      { title: 'Listing', href: '/listing', icon: Globe },
      { title: 'Smart Transaction', href: '/', icon: FileText },
    ],
  },
  
]

export function Navigation() {
  const router = useRouter()

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <nav className="hidden md:flex md:flex-1 md:items-center md:justify-center space-x-1">
      {navigationItems.map((item) => (
        <DropdownMenu key={item.title}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10">
              {item.title}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {item.items.map((subItem) => (
              <DropdownMenuItem key={subItem.href} onClick={() => handleNavigation(subItem.href)}>
                <subItem.icon className="mr-2 h-4 w-4" />
                {subItem.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </nav>
  )
}