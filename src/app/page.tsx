'use client';

import { HeroSlider, HeroSliderSkeleton } from "@/components/hero-slider"
import { MediolanoFrontpage } from "@/components/mediolano-frontpage";
import { useGetAllCollections } from "@/hooks/use-collection"

export default function Home() {
  const { collections, loading } = useGetAllCollections();

  return (
    <div className="grid bg-background/30">
      <main className="flex flex-col row-start-2 p-6">
        {loading ? (
          <HeroSliderSkeleton />
        ) : (
          <HeroSlider collections={collections} />
        )}
        <MediolanoFrontpage />
      </main>
    </div>
  );
}
