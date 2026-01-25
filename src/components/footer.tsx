"use client"
import Link from "next/link"
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
  Lock,
  Shield,
  Layers,
  Send,
  MessageSquare,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image";
import { useState } from "react";
import { ContactDialog } from "@/components/contact-dialog";

const features = [
  { icon: <Brain className="h-6 w-6" />, title: "Learn", description: "IP for the Integrity Web", link: "/discover" },
  { icon: <Box className="h-6 w-6" />, title: "Create", description: "Create Programmable IP", link: "/create" },
  { icon: <Layers className="h-6 w-6" />, title: "Explore", description: "Explorer IP collections", link: "/collections" },

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

  const [isContactOpen, setIsContactOpen] = useState(false)

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast({
      title: "Subscribed!",
      description: `You've successfully subscribed with ${data.email}`,
    })
  }

  return (

    <>
      <ContactDialog open={isContactOpen} onOpenChange={setIsContactOpen} />
      {/*<DappInfo/>*/}

      <footer className="text-foreground glass">
        <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8 pt-6">



            {/* Start */}
            <div className="lg:col-span-1">

              <h3 className="mb-6 text-sm font-semibold uppercase">Quick Links</h3>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-lg bg-accent/25 transition-all duration-300 ease-in-out hover:bg-accent mr-10 hover:scale-[1.02]"
                  >
                    <Link href={feature.link} className="block p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center ml-blue group-hover:bg-blue/40 transition-colors duration-300">
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
                  </div>
                ))}
              </div>
            </div>



















            {/* Navigation */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">


                <div>
                  <h4 className="mb-6 text-sm font-semibold uppercase">Programmable IP</h4>
                  <ul className="space-y-4">
                    <li><Link href="/create" className="flex items-center hover:underline"><Box className="w-4 h-4 mr-2 ml-blue" /> Create Panel </Link></li>
                    <li><Link href="/create/collection" className="flex items-center hover:underline"><Grid className="w-4 h-4 mr-2 ml-blue" /> Create Collection</Link></li>
                    <li><Link href="/create/asset" className="flex items-center hover:underline"><Box className="w-4 h-4 mr-2 ml-blue" /> Create IP Asset</Link></li>
                    <li><Link href="/create/templates" className="flex items-center hover:underline"><FileCode className="w-4 h-4 mr-2 ml-blue" /> IP Templates</Link></li>
                    <li><Link href="/transfer" className="flex items-center hover:underline"><ArrowRightLeft className="w-4 h-4 mr-2 ml-blue" />Transfer Assets</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-6 text-sm font-semibold uppercase">IP Templates</h3>
                  <ul className="space-y-4">
                    <li><Link href="/create/asset" className="flex items-center hover:underline"><FileCheck className="w-4 h-4 mr-2 ml-blue" /> General</Link></li>
                    <li><Link href="/create/templates/art" className="flex items-center hover:underline"><Palette className="w-4 h-4 mr-2 ml-blue" /> Artwork</Link></li>
                    <li><Link href="/create/templates/audio" className="flex items-center hover:underline"><BookMarked className="w-4 h-4 mr-2 ml-blue" /> Audio</Link></li>
                    <li><Link href="/create/templates/documents" className="flex items-center hover:underline"><FileIcon className="w-4 h-4 mr-2 ml-blue" /> Document</Link></li>
                    <li><Link href="/create/templates/nft" className="flex items-center hover:underline"><FileLock className="w-4 h-4 mr-2 ml-blue" /> NFT</Link></li>
                    <li><Link href="/create/templates/patents" className="flex items-center hover:underline"><ScrollText className="w-4 h-4 mr-2 ml-blue" /> Patent</Link></li>
                    <li><Link href="/create/templates/publications" className="flex items-center hover:underline"><BookIcon className="w-4 h-4 mr-2 ml-blue" /> Publication</Link></li>
                    <li><Link href="/create/templates/rwa" className="flex items-center hover:underline"><Globe2 className="w-4 h-4 mr-2 ml-blue" /> Real World Assets</Link></li>
                    <li><Link href="/create/templates/software" className="flex items-center hover:underline"><FileCode className="w-4 h-4 mr-2 ml-blue" /> Software</Link></li>
                    <li><Link href="/create/templates/video" className="flex items-center hover:underline"><Film className="w-4 h-4 mr-2 ml-blue" /> Video</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-6 text-sm font-semibold uppercase">Manage</h3>
                  <ul className="space-y-4">
                    <li><Link href="/portfolio" className="flex items-center hover:underline"><Book className="w-4 h-4 mr-2 ml-blue" />IP Portfolio</Link></li>
                    <li><Link href="/account" className="flex items-center hover:underline"><User className="w-4 h-4 mr-2 ml-blue" /> Account Setting</Link></li>
                  </ul>
                  <h3 className="mb-6 mt-6 text-sm font-semibold uppercase">Guidelines</h3>
                  <ul className="space-y-4">
                    <li><Link href="/docs/terms-of-use" className="flex items-center hover:underline"><Shield className="w-4 h-4 mr-2 ml-blue" /> Terms of Use</Link></li>
                    <li><Link href="/docs/community-guidelines" className="flex items-center hover:underline"><ShieldQuestion className="w-4 h-4 mr-2 ml-blue" /> Community</Link></li>
                    <li><Link href="/docs/privacy-policy" className="flex items-center hover:underline"><Shield className="w-4 h-4 mr-2 ml-blue" /> Privacy Policy</Link></li>
                    <li><Link href="/docs/compliance-guidelines" className="flex items-center hover:underline"><Shield className="w-4 h-4 mr-2 ml-blue" /> Compliance</Link></li>
                    <li><Link href="/docs/governance-charter" className="flex items-center hover:underline"><Shield className="w-4 h-4 mr-2 ml-blue" /> Governance</Link></li>
                    <li>
                      <Button variant="link" className="p-0 h-auto font-normal hover:underline flex items-center text-foreground" onClick={() => setIsContactOpen(true)}>
                        <MessageSquare className="w-4 h-4 mr-2 ml-blue" /> Contact Us
                      </Button>
                    </li>
                  </ul>
                </div>

              </div>
            </div>










            {/* Mediolano */}
            <div className="space-y-4 lg:col-span-1 bg-blue-600/10 p-4 rounded-lg">

              <Link href="/" className="flex items-center space-x-2">
                <span className="text-1xl font-bold animate-in fade-in slide-in-from-bottom-4 duration-500">
                  Programmable IP for the Integrity Web
                </span>
              </Link>

              <p className="text-muted-foreground mr-5">
                IP Creator empower creators, developers, business, AI agents and communities to assert ownership and share intellectual property.
              </p>
              <p className="text-muted-foreground mr-5">
                Integrating smart contracts with zero knowledge-proofs, IP Creator turns code, content, and culture into programmable, sovereign assets.</p><br></br>
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
          <div className="mt-16 grid max-w-full grid-cols-1 w-full gap-8 md:grid-cols-3">
            <Card className="bg-background/20">
              <CardHeader>
                <CardTitle>Join on X</CardTitle>
                <CardDescription>Interact and stay updated with the latest news and announcements.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Twitter className="h-8 w-8 ml-blue" />
                  <div>
                    <h4 className="text-sm font-semibold">@MediolanoApp</h4>
                    <p className="text-xs text-muted-foreground">Sharing freedom tech!</p>
                  </div>
                </div>
                <Button variant="outline" asChild className="w-full">
                  <Link href="https://twitter.com/MediolanoApp" target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-4 w-4" /> Join on X/Twitter
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* GitHub Repository Showcase */}
            <Card className="bg-background/20">
              <CardHeader>
                <CardTitle>Open-Source GitHub</CardTitle>
                <CardDescription>
                  Explore our open-source codebase and join our developer community.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Github className="h-8 w-8 ml-blue" />
                    <div>
                      <p className="text-xs text-muted-foreground">Cooking the Integrity Web</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Lock className="h-3 w-3" />
                      <span>Permissionless</span>
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

            <Card className="bg-background/20">
              <CardHeader>
                <CardTitle>Get involved</CardTitle>
                <CardDescription>
                  News, updates, discussions on the Integrity Web!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Send className="h-8 w-8 ml-blue" />
                    <div>
                      <p className="text-xs text-muted-foreground">Telegram community to stay on the loop.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>Social</span>
                    </Badge>

                  </div>
                </div>
                <Separator className="my-4" />
                <Button variant="outline" asChild className="w-full">
                  <Link href="https://t.me/integrityweb" target="_blank" rel="noopener noreferrer">
                    <Send className="mr-2 h-4 w-4" /> Join on Telegram
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>








          <Separator className="my-8" />

          {/* Bottom Bar */}
          <div className="mt-8 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Mediolano DAO &copy; 2026
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <Link href="https://mediolano.xyz/" className="hover:underline">
                Mediolano.xyz
              </Link>
            </div>
          </div>
        </div>
      </footer>

    </>
  )
}

