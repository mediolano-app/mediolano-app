'use client';

import { HeroSlider } from "@/components/hero-slider"
import { useGetAllCollections } from "@/hooks/use-collection"

export default function Home() {
  const { collections } = useGetAllCollections();

  return (
    <div className="grid bg-background/30">
      <main className="flex flex-col row-start-2 p-6">
        <HeroSlider collections={collections} />
      </main>
    </div>
  );
}
