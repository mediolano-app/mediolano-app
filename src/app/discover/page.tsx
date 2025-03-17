import type { Metadata } from "next"
import AboutHero from "@/components/discover/AboutHero"
import Features from "@/components/discover/DiscoverFeatures"
import Resources from "@/components/discover/DiscoverResources"
import FAQ from "@/components/discover/DiscoverFAQ"
import DiscoverBenefitsCreators from "@/components/discover/DiscoverBenefitsCreators"
import DiscoverHero from "@/components/discover/DiscoverHero"
import DiscoverServicesCTA from "@/components/discover/DiscoverServicesCTA"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <DiscoverHero />
      <DiscoverBenefitsCreators />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">  
      <AboutHero />
      <FAQ />
      </div>
      
      <Features />


      <Resources />
    </div>
  )
}

