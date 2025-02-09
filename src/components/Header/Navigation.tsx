'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Copyright, FileText, Banknote, BookOpen, Users, Phone, Grid2X2, List, GalleryVerticalEnd, ScrollText, ArrowLeftRight, BriefcaseBusiness, Globe, LayoutGrid, Zap, LayoutDashboard, Grid, Box, FileCode, Coins, Building, CircleDollarSign, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CubeIcon } from '@radix-ui/react-icons'

const navigationItems = [
  {
    title: 'New',
    items: [
      { title: 'Tokenization', href: '/new', icon: Box },
      { title: 'Programmable IP', href: '/new/ip', icon: Box },
      { title: 'New Collection', href: '/new/collection', icon: Grid },
      { title: 'From Templates', href: '/register/templates', icon: FileText },
      { title: 'Licensing', href: '/licensing', icon: FileCode },
      { title: 'Listing', href: '/listing', icon: Globe },
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
      { title: 'Licensing', href: '/licensing', icon: FileCode },
      { title: 'Listing', href: '/listing', icon: Globe },
      { title: 'Marketplace', href: '/marketplace', icon: LayoutGrid },
      { title: 'Smart Transaction', href: '/', icon: Coins },
    ],
  },
  {
    title: 'More',
    items: [
      { title: 'Business', href: '/business', icon: Building },
      { title: 'Rewards', href: '/rewards', icon: CircleDollarSign },
      { title: 'FAQ', href: '/faq', icon: BookOpen },
      { title: 'Support', href: '/support', icon: User },
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