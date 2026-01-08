'use client';

import StartHero from "@/components/discover/start-hero";
import { HeroSlider } from "@/components/hero-slider"
import { MediolanoFeatures } from "@/components/mediolano-features"

export default function Home() {
  return (
    <div className="grid bg-background/30">
      <main className="flex flex-col row-start-2 p-6">
        <MediolanoFeatures />
      </main>
    </div>
  );
}
