import type { Metadata } from "next"
import Resources from "@/components/discover/DiscoverResources"
import DiscoverBenefitsCreators from "@/components/discover/DiscoverBenefitsCreators"
import DiscoverHero from "@/components/discover/DiscoverHero"
import StartFeatures from "@/components/discover/StartFeatures"
import DiscoverServicesCTA from "@/components/discover/DiscoverServicesCTA"
import DiscoverFeatures from "@/components/discover/DiscoverFeatures"
import DiscoverFAQ from "@/components/discover/DiscoverFAQ"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <DiscoverHero />
      <DiscoverBenefitsCreators />
      
      <DiscoverFeatures />      
      <DiscoverFAQ />
      <DiscoverServicesCTA />

      <Resources />
    </div>
  )
}

