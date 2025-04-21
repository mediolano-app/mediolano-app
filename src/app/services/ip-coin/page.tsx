import { HeroSection } from "@/app/services/ip-coin/components/hero-section"
import { FeaturedContent } from "@/app/services/ip-coin/components/featured-content"
import { HowItWorks } from "@/app/services/ip-coin/components/how-it-works"

export default function IPCoin() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <FeaturedContent />
      <HowItWorks />
    </div>
  )
}
