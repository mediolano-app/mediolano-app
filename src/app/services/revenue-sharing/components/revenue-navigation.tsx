"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Settings, History, Calendar, CreditCard, PlusCircle } from "lucide-react"

export default function RevenueNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/services/revenue-sharing/dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    },
    {
      title: "Management",
      href: "/services/revenue-sharing/management",
      icon: <Settings className="h-4 w-4 mr-2" />,
    },
    {
      title: "Setup",
      href: "/services/revenue-sharing/setup",
      icon: <PlusCircle className="h-4 w-4 mr-2" />,
    },
    {
      title: "Claim Revenue",
      href: "/services/revenue-sharing/claim",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
    },
    {
      title: "Distributions",
      href: "/services/revenue-sharing/distributions",
      icon: <History className="h-4 w-4 mr-2" />,
    },
    {
      title: "Schedule",
      href: "/services/revenue-sharing/schedule",
      icon: <Calendar className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "default" : "outline"}
          size="sm"
          asChild
          className={pathname === item.href ? "bg-emerald-600 hover:bg-emerald-700" : ""}
        >
          <Link href={item.href} className="flex items-center">
            {item.icon}
            {item.title}
          </Link>
        </Button>
      ))}
    </div>
  )
}
