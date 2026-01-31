import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Briefcase, FileText, Zap, Users, Layers, Lock, Music, Palette, Video, Book, DollarSign, Repeat, Search, Key, ChevronRight, Bitcoin, CircleDollarSign } from 'lucide-react'
import { SharePopup } from '@/components/share-popup'
import { mockAssets, mockCollections } from '@/lib/dapp-data'
import { useState } from 'react'
import { LaunchSlider } from './LaunchSlider'



export function HeroStart() {
  const [activeFeature, setActiveFeature] = useState(0);
  const features = [
    { title: "Tokenize Your IP", description: "Convert your intellectual property into blockchain-based digital assets.", icon: <Shield className="w-12 h-12" /> },
    { title: "Smart Licensing", description: "Create and manage programmable licenses with ease.", icon: <FileText className="w-12 h-12" /> },
    { title: "Secure Transactions", description: "Execute IP transactions using smart contracts.", icon: <Lock className="w-12 h-12" /> },
    { title: "Global Marketplace", description: "Connect with creators and licensees worldwide.", icon: <Users className="w-12 h-12" /> },
  ];

  return (
    <section className="relative py-8 overflow-hidden mb-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-4 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
              Programmable IP for the Integrity Web
            </h1>
            <p className="text-xl mb-8 text-muted-foreground">
              Mediolano empowers creators to tokenize their IP using cutting-edge blockchain and Zero-Knowledge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Portfolio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

          </div>
          <div className="relative">
            <LaunchSlider />
          </div>
        </div>
      </div>
    </section>
  )
}