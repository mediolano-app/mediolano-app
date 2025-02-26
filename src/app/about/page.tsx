import type { Metadata } from "next"
import AboutHero from "./components/AboutHero"
import Features from "./components/Features"
import Resources from "./components/Resources"
import FAQ from "./components/FAQ"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <AboutHero />
      <FAQ />
      </div>
      <Features />
      <Resources />
    </div>
  )
}

