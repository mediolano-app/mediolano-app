"use client"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Rocket,
  LayoutDashboard,
  FileText,
  Bookmark,
  Shield,
  UserCircle,
  PlayCircle,
  Download,
  Zap,
  Briefcase,
  BarChart3,
  FileSignature,
  Tags,
  User,
  Box,
  Grid,
  Scroll,
  FileTextIcon,
  Diamond,
  FileCode,
  Layers,
  Gem,
  Blocks,
  Coins,
  BoxIcon,
  FileCode2,
  Gauge,
  Brain,
  LayoutGrid,
  ArrowRightLeft,
  Building,
  FileBadge,
} from "lucide-react"
import { Logo } from "@/components/header/Logo"

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex items-center space-x-4">
      
        <Logo />

      <NavigationMenu>
        <NavigationMenuList>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-background/30 backdrop-blur">
              <Rocket className="mr-2 h-4 w-4" />
              Start
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <div className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/discover"
                    >
                      <Brain className="h-6 w-6 text-blue-600" />
                      <div className="mb-2 mt-4 text-lg font-medium">Discover</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Programmable IP for the Integrity Web.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/create"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Box className="mr-2 h-4 w-4  text-blue-600" />
                      Create Asset
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Create a new Programmable IP or Collection.
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/portfolio"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <LayoutGrid className="mr-2 h-4 w-4  text-blue-600" />
                      Portfolio
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      View and manage your digital assets.
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/assets"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <FileCode className="mr-2 h-4 w-4  text-blue-600" />
                      Explore IP
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Discover and explore all available assets.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-background/30 backdrop-blur">
              <Layers className="mr-2 h-4 w-4" />
              Manage
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/portfolio"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Layers className="mr-2 h-4 w-4  text-blue-600" />
                      My Portfolio
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Total control over your assets onchain.
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/portfolio/dashboard"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4  text-blue-600" />
                      Assets Dashboard
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Advanced assets management.
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/transfer"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <ArrowRightLeft className="mr-2 h-4 w-4  text-blue-600" />
                      Transfer Asset
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Transfer your Programmable IP to another account.
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/licensing"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <FileCode2 className="mr-2 h-4 w-4  text-blue-600" />
                      Licensing
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Create new licensing agreements.
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/listing"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Bookmark className="mr-2 h-4 w-4  text-blue-600" />
                      Listings
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Sell, trade and tokenize your IP for marketplaces.
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/account"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Shield className="mr-2 h-4 w-4  text-blue-600" />
                      Account
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Manage your account settings and visibility.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
         
         
         
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-background/30 backdrop-blur">
              <Gem className="mr-2 h-4 w-4" />
              Services
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/monetize"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Gem className="mr-2 h-4 w-4  text-blue-600" />
                      Monetize
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Permissionless services to monetize Programmable IP (Preview) 
                    </p>
                  </Link>
                </NavigationMenuLink>
                
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/services/proof-of-ownership"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <FileBadge className="mr-2 h-4 w-4  text-blue-600" />
                      Proof of Ownership
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Verifiable ownership of a digital asset (Preview)
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/services/proof-of-licensing"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <FileSignature className="mr-2 h-4 w-4  text-blue-600" />
                      Proof of Licensing
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Create public proof of licensing agreements (Preview)
                    </p>
                  </Link>
                </NavigationMenuLink>

                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/services/revenue-sharing"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Rocket className="mr-2 h-4 w-4  text-blue-600" />
                      Revenue Sharing
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Share revenue and monetize your IP
                    </p>
                  </Link>
                </NavigationMenuLink>

                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/business"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Building className="mr-2 h-4 w-4  text-blue-600" />
                      Business Services
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Enterprise-grade services for organizations (Preview)
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/rewards"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Coins className="mr-2 h-4 w-4  text-blue-600" />
                      Rewards
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Mediolano token rewards (Preview)
                    </p>
                  </Link>
                </NavigationMenuLink>
                
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>



          
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

