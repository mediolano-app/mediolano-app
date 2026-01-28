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
  Grid2X2,
  Grid2X2Icon,
  Grid3X3,
  IterationCwIcon,
  IterationCcw,
  Activity,
  Boxes,
  BookOpen,
} from "lucide-react"
import { Logo } from "@/components/header/logo"

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex items-center space-x-4">

      <Logo />

      <NavigationMenu>
        <NavigationMenuList>

          {/* EXPLORE */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent/0 hover:bg-accent/50 data-[state=open]:bg-accent/50 text-foreground/80 hover:text-foreground">
              <Layers className="mr-2 h-4 w-4" />
              Explore
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/collections"
                    >
                      <Grid3X3 className="h-6 w-6 text-blue-600" />
                      <div className="mb-2 mt-4 text-lg font-medium">Collections</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Discover curated IP collections from top creators.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/assets"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none flex items-center">
                        <Boxes className="mr-2 h-4 w-4 text-blue-600" />
                        IP Assets</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Browse individual digital assets and tokenized IP.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/activities"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none flex items-center">
                        <Activity className="mr-2 h-4 w-4 text-blue-600" />
                        Community Activity</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Real-time chain events and transfers.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-background/10">
              <Rocket className="mr-2 h-4 w-4" />
              Create
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <div className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/create"
                    >
                      <Rocket className="h-6 w-6 text-blue-600" />
                      <div className="mb-2 mt-4 text-lg font-medium">Create Panel</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Tokenize and remix
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/create/collection"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Grid3X3 className="mr-2 h-4 w-4  text-blue-600" />
                      Collections
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Create a onchain collection
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/create/asset"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Box className="mr-2 h-4 w-4  text-blue-600" />
                      Programmable IP
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Create your Programmable IP
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/create/templates"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <FileCode className="mr-2 h-4 w-4  text-blue-600" />
                      IP Templates
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Create your IP using templates
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>



          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-background/10">
              <Boxes className="mr-2 h-4 w-4" />
              Portfolio
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/portfolio"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Boxes className="mr-2 h-4 w-4  text-blue-600" />
                      Portfolio
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Your onchain IP portfolio
                    </p>
                  </Link>
                </NavigationMenuLink>


                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/portfolio/assets"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Box className="mr-2 h-4 w-4  text-blue-600" />
                      My Assets
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Your onchain assets
                    </p>
                  </Link>
                </NavigationMenuLink>

                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/portfolio/collections"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Layers className="mr-2 h-4 w-4  text-blue-600" />
                      My Collections
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Your onchain collections
                    </p>
                  </Link>
                </NavigationMenuLink>

                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/portfolio/activities"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Activity className="mr-2 h-4 w-4  text-blue-600" />
                      Activities
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Track onchain history
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
                      Transfer
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Transfer assets
                    </p>
                  </Link>
                </NavigationMenuLink>

                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/create/remix"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <IterationCcw className="mr-2 h-4 w-4  text-blue-600" />
                      Remix
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      Remix IP
                    </p>
                  </Link>
                </NavigationMenuLink>



              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>


          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/docs" className={navigationMenuTriggerStyle() + " bg-background/10"}>
                <BookOpen className="mr-2 h-4 w-4" />
                Docs
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>



        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

