'use client';

import { HeroSlider } from "@/components/hero-slider"

export default function Home() {
  return (
    <div className="grid bg-background/30">
      <main className="flex flex-col row-start-2 p-6">
        <HeroSlider />
      </main>
    </div>
  );
}
