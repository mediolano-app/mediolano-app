"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Zap,
  Star,
  GitFork,
  Book,
  FileCheck,
  ScrollText,
  LayoutDashboard,
  Coins,
  Globe,
  LayoutGrid,
  FileCode,
  BookIcon,
  FileLock,
  Film,
  Palette,
  FileIcon,
  Globe2,
  UserRoundCheck,
  BookMarked,
  ShieldQuestion,
  Plus,
  Twitter,
  Grid,
  User,
  ArrowRightLeft,
  Cog,
  Brain,
  Box,
  Scroll,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image";
import DappInfo from './DappInfo';

const features = [
  { icon: <Brain className="h-6 w-6" />, title: "Discover", description: "IP for the Integrity Web", link: "/discover" },
  { icon: <Box className="h-6 w-6" />, title: "Tokenize IP", description: "Create New Programmable IP", link: "/new" },
  { icon: <LayoutGrid className="h-6 w-6" />, title: "Manage Assets", description: "Manage IP onchain", link: "/portfolio" },
  { icon: <ScrollText className="h-6 w-6" />, title: "Licensing Assets", description: "Register new license", link: "/licensing" },
]

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

export function Footer() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast({
      title: "Subscribed!",
      description: `You've successfully subscribed with ${data.email}`,
    })
  }

  return (

    <>
    <DappInfo/>

    <footer className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
        
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8 mt-8">

            
            
            {/* Start */}
            <div className="lg:col-span-1">

            <h3 className="mb-6 text-sm font-semibold uppercase">Quick Links</h3>
        
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="group relative overflow-hidden rounded-lg bg-accent/25 transition-all duration-300 ease-in-out hover:bg-accent mr-10"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Link href={feature.link} className="block p-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ml-blue group-hover:bg-primary/20 transition-colors duration-300">
                            {feature.icon}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium group-hover:text-primary transition-colors duration-300">
                              {feature.title}
                            </h4>
                            <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            
            
            
            
            













            {/* Navigation */}
            <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">


            <div>
                <h4 className="mb-6 text-sm font-semibold uppercase">Programmable IP</h4>
                <ul className="space-y-4">
                  <li><Link href="/create" className="flex items-center hover:underline"><FileCheck className="w-4 h-4 mr-2 ml-blue" /> Create IP</Link></li>
                  <li><Link href="/new/collection" className="flex items-center hover:underline"><Grid className="w-4 h-4 mr-2 ml-blue" /> Create Collection</Link></li>
                  <li><Link href="/new/templates" className="flex items-center hover:underline"><FileCode className="w-4 h-4 mr-2 ml-blue" /> IP Templates</Link></li>
                  <li><Link href="/portfolio" className="flex items-center hover:underline"><Book className="w-4 h-4 mr-2 ml-blue" /> Portfolio</Link></li>
                  <li><Link href="/licensing" className="flex items-center hover:underline"><ScrollText className="w-4 h-4 mr-2 ml-blue" /> Licensing</Link></li>
                  <li><Link href="/monetize" className="flex items-center hover:underline"><Coins className="w-4 h-4 mr-2 ml-blue" /> Monetize</Link></li>
                  <li><Link href="/transaction" className="flex items-center hover:underline"><Zap className="w-4 h-4 mr-2 ml-blue" /> Smart Transaction</Link></li>
                  <li><Link href="/marketplace" className="flex items-center hover:underline"><LayoutGrid className="w-4 h-4 mr-2 ml-blue" /> Marketplace</Link></li>
                </ul>
            </div>

                <div>
                <h3 className="mb-6 text-sm font-semibold uppercase">IP Templates</h3>
                <ul className="space-y-4">
                    <li><Link href="/create" className="flex items-center hover:underline"><FileCheck className="w-4 h-4 mr-2 ml-blue" /> Default</Link></li>
                    <li><Link href="/new/art" className="flex items-center hover:underline"><Palette className="w-4 h-4 mr-2 ml-blue" /> Art</Link></li>
                    <li><Link href="/new/document" className="flex items-center hover:underline"><FileIcon className="w-4 h-4 mr-2 ml-blue" /> Document</Link></li>
                    <li><Link href="/new/video" className="flex items-center hover:underline"><Film className="w-4 h-4 mr-2 ml-blue" /> Video</Link></li>
                    <li><Link href="/new/nft" className="flex items-center hover:underline"><FileLock className="w-4 h-4 mr-2 ml-blue" /> NFT</Link></li>
                    <li><Link href="/new/patent" className="flex items-center hover:underline"><ScrollText className="w-4 h-4 mr-2 ml-blue" /> Patent</Link></li>
                    <li><Link href="/new/publication" className="flex items-center hover:underline"><BookIcon className="w-4 h-4 mr-2 ml-blue" /> Publication</Link></li>
                    <li><Link href="/new/rwa" className="flex items-center hover:underline"><Globe2 className="w-4 h-4 mr-2 ml-blue" /> Real World Assets</Link></li> 
                    <li><Link href="/software" className="flex items-center hover:underline"><FileCode className="w-4 h-4 mr-2 ml-blue" /> Software</Link></li>
                </ul>
                </div>

                <div>
                <h3 className="mb-6 text-sm font-semibold uppercase">Manage</h3>
                <ul className="space-y-4">
                    <li><Link href="/portfolio/dashboard" className="flex items-center hover:underline"><LayoutDashboard className="w-4 h-4 mr-2 ml-blue" /> Assets Dashboard</Link></li>
                    <li><Link href="/account" className="flex items-center hover:underline"><User className="w-4 h-4 mr-2 ml-blue" /> My Account</Link></li>
                    <li><Link href="/transfers" className="flex items-center hover:underline"><ArrowRightLeft className="w-4 h-4 mr-2 ml-blue" /> Transactions</Link></li>
                    <li><Link href="/settings" className="flex items-center hover:underline"><Cog className="w-4 h-4 mr-2 ml-blue" /> Settings</Link></li>
                </ul>
                </div>
                
            </div>
            </div>










            {/* Mediolano */}
            <div className="space-y-4 lg:col-span-1 bg-blue-600/10 p-4 rounded-lg">
            <Link href="/" className="flex items-center space-x-2">
                <motion.span
                className="text-1xl font-bold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                >
                Programmable IP for the Integrity Web
                </motion.span>
            </Link>
            <p className="text-muted-foreground mr-5">
            Seamlessly tokenize intellectual property leveraging Starknet’s unparalleled high-speed, low-cost (fraction of a cent) and smart contract intelligence for digital assets.
            Mediolano empower creators, collectors and organizations with permissionless Programmable IP services using blockchain and zero-knowledge.
                proofs.
            </p><br></br>
            <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
          
                <Link href="/" className="flex items-center space-x-2">
                <div>
                    <Image
                    className="hidden dark:block"
                    src="/mediolano-logo-dark.png"
                    alt="dark-mode-image"
                    width={140}
                    height={33}
                    />
                    <Image
                    className="block dark:hidden"
                    src="/mediolano-logo-light.svg"
                    alt="light-mode-image"
                    width={140}
                    height={33}
                    />
                    </div>
                    
                    <span className="hidden font-bold sm:inline-block">
                    </span>
                </Link>

                <Link href="/" className="flex items-center space-x-2">
                <div>
                    <Image
                    className="hidden dark:block"
                    src="/Starknet-Dark.svg"
                    alt="dark-mode-image"
                    width={140}
                    height={33}
                    />
                    <Image
                    className="block dark:hidden"
                    src="/Starknet-Light.svg"
                    alt="light-mode-image"
                    width={140}
                    height={33}
                    />
                    </div>
                    
                    <span className="hidden font-bold sm:inline-block">
                    </span>
                </Link>


                </div>
            </div>
            </div>



            



            </div>



            {/* Twitter Showcase */}
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Join our community on X</CardTitle>
                <CardDescription>Interact and stay updated with the latest news and announcements from Mediolano.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Twitter className="h-8 w-8 ml-blue" />
                  <div>
                    <h4 className="text-sm font-semibold">@MediolanoApp</h4>
                    <p className="text-xs text-muted-foreground">Official Mediolano Twitter</p>
                  </div>
                </div>
                <Button variant="outline" asChild className="w-full">
                  <Link href="https://twitter.com/MediolanoApp" target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-4 w-4" /> Follow on X/Twitter
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* GitHub Repository Showcase */}
            <Card>
              <CardHeader>
                <CardTitle>Open-Source on GitHub</CardTitle>
                <CardDescription>
                  Explore our open-source codebase and join our developer community.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Github className="h-8 w-8 ml-blue" />
                    <div>
                      <h4 className="text-sm font-semibold">mediolano-app</h4>
                      <p className="text-xs text-muted-foreground">Core smart contracts, APIs, dApps</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>14</span>
                    </Badge>
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <GitFork className="h-3 w-3" />
                      <span>23</span>
                    </Badge>
                  </div>
                </div>
                <Separator className="my-4" />
                <Button variant="outline" asChild className="w-full">
                  <Link href="https://github.com/mediolano-app" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" /> View on GitHub
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>








        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            &copy; 2025 Mediolano. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Link href="/faq" className="hover:underline">
              FAQ
            </Link>
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="hover:underline">
              Cookie Policy
            </Link>
            
          </div>
        </div>
      </div>
    </footer>
    
    </>
  )
}

