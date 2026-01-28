"use client";
import { MobileSidebar } from "@/components/header/sidebar"
import { MainNav } from "@/components/header/nav"
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
const WalletConnect = dynamic(() => import("./header/wallet-connect").then(mod => mod.WalletConnect), {
  ssr: false,
});
import { NetworkSwitcher } from '@/components/header/network-switcher';
import { ThemeToggle } from "@/components/header/theme-toggle"
import { Logo } from "@/components/header/logo"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg">

      <div className="container mx-auto flex items-center justify-between h-16">

        <div className="flex items-center md:hidden">
          <Logo />
        </div>

        <MainNav />

        <div className="flex items-center">

          <div>
            <WalletConnect />
          </div>

          <MobileSidebar />

          <div className="mr-4 md:mr-0">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>

        </div>

      </div>

    </header>
  )
}

