import { MobileSidebar } from "@/components/header/MobileSidebar"
import { MainNav } from "@/components/header/MainNav"
import { WalletConnect } from "@/components/header/WalletConnect"
import { ThemeToggle } from "@/components/header/ThemeToggle"
import { Logo } from "@/components/header/Logo"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/20 backdrop-blur supports-[backdrop-filter]:bg-background/30">
      
      <div className="container mx-auto flex items-center justify-between h-16">
        
        <div className="flex items-center md:hidden">
          <Logo />
        </div>
        
        <MainNav />
        
        <div className="flex items-center">
        
          <div className="">
            <WalletConnect />
          </div>          
          <MobileSidebar />

          <div className="hidden md:block">
            <ThemeToggle />
          </div>

        </div>

      </div>

    </header>
  )
}

