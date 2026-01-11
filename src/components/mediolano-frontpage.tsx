import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import {
  Search,
  Filter,
  TrendingUp,
  Users,
  Zap,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PlusCircle,
  GitBranch,
  Activity,
  ArrowRight,
  Grid,
  Gem,
  Scroll,
} from "lucide-react"
import Link from "next/link"

export function MediolanoFrontpage() {

  const FeatureCard = ({ icon: Icon, title, description }: any) => (
    <div className="group p-6 rounded-2xl border bg-card backdrop-blur-sm hover:bg-card hover:shadow-sm transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-base">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )

  const features = [
    {
      icon: Gem,
      title: "Zero Fees Tokenization",
      description: "Mint with zero fees on IP Creator + Mediolano Protocol.",
    },
    {
      icon: Scroll,
      title: "Proof of Ownership",
      description: "Your copyright will be timestamped for proof of ownership, ensuring automatic protection.",
    },
    {
      icon: Shield,
      title: "Protect Your Creations",
      description: "Secure your intellectual property with blockchain-based proof of ownership.",
    },
    {
      icon: Users,
      title: "Global Network",
      description: "Connect and monetize your content worldwide without intermediaries",
    },
    {
      icon: Zap,
      title: "Total Sovereignty",
      description: "You control your assets, no centralized authority can take them down",
    },
    {
      icon: TrendingUp,
      title: "Censorship Resistance",
      description: "Immutable proof of ownership secured by decentralized technology",
    },
  ]


  return (
    <>

      <section className="container mx-auto space-y-10 mt-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">

          <h2 className="text-3xl md:text-5xl font-bold text-balance">Built for the Creator Economy</h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            Free tokenization to protect, showcase, and monetize your intellectual property
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>


      <section className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 mb-20">

        <Link href="/create/collection" className="group">
          <div className="relative overflow-hidden p-8 rounded-2xl border bg-card hover:bg-card/80 hover:shadow-sm transition-all duration-300 h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <Grid className="relative w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="relative text-xl font-semibold mb-2">Create Collection</h3>
            <p className="relative text-muted-foreground mb-4 leading-relaxed">
              See what creators are building right now
            </p>
            <div className="relative flex items-center text-primary font-medium">
              View Activity <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>


        <Link href="/create/asset" className="group">
          <div className="relative overflow-hidden p-8 rounded-2xl border bg-card hover:bg-card/80 hover:shadow-sm transition-all duration-300 h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <PlusCircle className="relative w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="relative text-xl font-semibold mb-2">Create IP Asset</h3>
            <p className="relative text-muted-foreground mb-4 leading-relaxed">
              Register your intellectual property on the blockchain
            </p>
            <div className="relative flex items-center text-primary font-medium">
              Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link href="/create/" className="group">
          <div className="relative overflow-hidden p-8 rounded-2xl border bg-card hover:bg-card/80 hover:shadow-sm transition-all duration-300 h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <GitBranch className="relative w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="relative text-xl font-semibold mb-2">Remix & Collaborate</h3>
            <p className="relative text-muted-foreground mb-4 leading-relaxed">
              Build upon existing IP with proper attribution
            </p>
            <div className="relative flex items-center text-primary font-medium">
              Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

      </section>



    </>
  );
}