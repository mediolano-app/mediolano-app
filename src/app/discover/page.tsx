import type { Metadata } from "next"
import DiscoverResources from "@/components/discover/discover-resources"
import DiscoverBenefitsCreators from "@/components/discover/discover-benefits"
import DiscoverHero from "@/components/discover/discover-hero"
import DiscoverFeatures from "@/components/discover/discover-features"
import DiscoverFAQ from "@/components/discover/discover-faq"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <DiscoverHero />
      <DiscoverBenefitsCreators />
      <DiscoverFeatures />      
      <DiscoverFAQ />
      <DiscoverResources />
    </div>
  )
}

