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
  Sparkles,
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
  { icon: <Plus className="h-6 w-6" />, title: "Create", description: "Create Programmable IP", link: "/create" },
  { icon: <Layers className="h-6 w-6" />, title: "Collections", description: "Explore IP collections", link: "/collections" },
  { icon: <Box className="h-6 w-6" />, title: "IP Assets", description: "Explore IP assets", link: "/assets" },

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

  return (
    <>
      <ContactDialog open={isContactOpen} onOpenChange={setIsContactOpen} />
      <footer className="w-full bg-background/40 backdrop-blur-xl border-t border-background/50">
        <div className="container mx-auto px-6 py-12 md:py-16">

          {/* Top Feature Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.link}
                className="group flex flex-col items-center p-4 rounded-xl bg-accent/5 hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="mb-3 p-3 rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                <p className="text-xs text-muted-foreground text-center group-hover:text-muted-foreground/80">{feature.description}</p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

            {/* Brand & Socials - Spans 4 columns */}
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-4">
                <Link href="/" className="inline-block">
                  <div className="flex items-center gap-2">
                    <Image
                      className="hidden dark:block"
                      src="/mediolano-logo-dark.png"
                      alt="Mediolano"
                      width={160}
                      height={40}
                    />
                    <Image
                      className="block dark:hidden"
                      src="/mediolano-logo-light.svg"
                      alt="Mediolano"
                      width={160}
                      height={40}
                    />
                  </div>
                </Link>
                <p className="text-muted-foreground leading-relaxed text-sm max-w-sm">
                  Programmable IP for the Integrity Web. Empowering creators, developers, and AI agents to assets ownership and share intellectual property securely.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <Link href="/" passHref>
                    <Image
                      className="hidden dark:block opacity-80 hover:opacity-100 transition-opacity"
                      src="/Starknet-Dark.svg"
                      alt="Starknet"
                      width={120}
                      height={30}
                    />
                    <Image
                      className="block dark:hidden opacity-80 hover:opacity-100 transition-opacity"
                      src="/Starknet-Light.svg"
                      alt="Starknet"
                      width={120}
                      height={30}
                    />
                  </Link>
                </div>
              </div>

              {/* Social Links Compact */}
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="h-9 gap-2" asChild>
                  <Link href="https://x.com/MediolanoApp" target="_blank">
                    <Twitter className="h-4 w-4 text-blue-400" />
                    <span>X</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="h-9 gap-2" asChild>
                  <Link href="https://github.com/mediolano-app" target="_blank">
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="h-9 gap-2" asChild>
                  <Link href="https://t.me/integrityweb" target="_blank">
                    <Send className="h-4 w-4 text-blue-500" />
                    <span>Telegram</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Navigation Lists - Spans 8 columns (2+3+3) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Programmable IP */}
              <div className="space-y-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">Programmable IP</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="/create" className="flex items-center gap-2 hover:text-primary transition-colors"><Box className="w-3.5 h-3.5" /> Create Panel</Link></li>
                  <li><Link href="/create/collection" className="flex items-center gap-2 hover:text-primary transition-colors"><Grid className="w-3.5 h-3.5" /> Create Collection</Link></li>
                  <li><Link href="/create/asset" className="flex items-center gap-2 hover:text-primary transition-colors"><Box className="w-3.5 h-3.5" /> Create IP Asset</Link></li>
                  <li><Link href="/create/remix" className="flex items-center gap-2 hover:text-primary transition-colors"><Sparkles className="w-3.5 h-3.5" /> Create Remix</Link></li>
                  <li><Link href="/transfer" className="flex items-center gap-2 hover:text-primary transition-colors"><ArrowRightLeft className="w-3.5 h-3.5" /> Transfer Assets</Link></li>
                  <li><Link href="/activities" className="flex items-center gap-2 hover:text-primary transition-colors"><Scroll className="w-3.5 h-3.5" /> Community Activities</Link></li>
                  <li className="pt-2 border-t border-border/50"></li>
                  <li><Link href="/portfolio" className="flex items-center gap-2 hover:text-primary transition-colors"><User className="w-3.5 h-3.5" /> IP Portfolio</Link></li>
                  <li><Link href="/account" className="flex items-center gap-2 hover:text-primary transition-colors"><Cog className="w-3.5 h-3.5" /> Account Settings</Link></li>
                </ul>
              </div>

              {/* Templates */}
              <div className="space-y-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">IP Templates</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="/create/templates" className="flex items-center gap-2 hover:text-primary transition-colors"><LayoutDashboard className="w-3.5 h-3.5" /> Templates Panel</Link></li>
                  <li><Link href="/create/asset" className="flex items-center gap-2 hover:text-primary transition-colors"><FileCheck className="w-3.5 h-3.5" /> General</Link></li>
                  <li><Link href="/create/templates/art" className="flex items-center gap-2 hover:text-primary transition-colors"><Palette className="w-3.5 h-3.5" /> Artwork</Link></li>
                  <li><Link href="/create/templates/audio" className="flex items-center gap-2 hover:text-primary transition-colors"><BookMarked className="w-3.5 h-3.5" /> Audio</Link></li>
                  <li><Link href="/create/templates/documents" className="flex items-center gap-2 hover:text-primary transition-colors"><FileIcon className="w-3.5 h-3.5" /> Document</Link></li>
                  <li><Link href="/create/templates/nft" className="flex items-center gap-2 hover:text-primary transition-colors"><FileLock className="w-3.5 h-3.5" /> NFT</Link></li>
                  <li><Link href="/create/templates/video" className="flex items-center gap-2 hover:text-primary transition-colors"><Film className="w-3.5 h-3.5" /> Video</Link></li>
                </ul>
              </div>

              {/* Resources */}
              <div className="space-y-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">Resources</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="/docs/" className="flex items-center gap-2 hover:text-primary transition-colors"><Book className="w-3.5 h-3.5" /> Documentation</Link></li>
                  <li><Link href="/docs/dapp-guide" className="flex items-center gap-2 hover:text-primary transition-colors"><Brain className="w-3.5 h-3.5" /> Dapp Guide</Link></li>
                  <li><Link href="/docs/user-guide" className="flex items-center gap-2 hover:text-primary transition-colors"><Brain className="w-3.5 h-3.5" /> User Guide</Link></li>
                  <li><Link href="/docs/mediolano-dao" className="flex items-center gap-2 hover:text-primary transition-colors"><Globe className="w-3.5 h-3.5" /> DAO</Link></li>
                  <li><Link href="/docs/faq" className="flex items-center gap-2 hover:text-primary transition-colors"><ShieldQuestion className="w-3.5 h-3.5" /> FAQ</Link></li>
                  <li className="pt-2 border-t border-border/50"></li>
                  <li><Link href="/docs/terms-of-use" className="hover:text-primary transition-colors">Terms of Use</Link></li>
                  <li><Link href="/docs/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li>
                    <button
                      onClick={() => setIsContactOpen(true)}
                      className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Contact Us
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Separator className="my-12 opacity-50" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2026 Mediolano DAO</p>
            <div className="flex items-center gap-6">
              <Link href="https://mediolano.xyz/" target="_blank" className="hover:text-foreground transition-colors">Mediolano.xyz</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

