'use client';

import { FeaturedHero } from "@/components/featured-hero"
import { MediolanoFrontpage } from "@/components/mediolano-frontpage";

export default function Home() {
  return (
    <div className="grid bg-background/30">
      <main className="flex flex-col row-start-2 p-6">
        <FeaturedHero />
        <MediolanoFrontpage />
      </main>
    </div>
  );
}
