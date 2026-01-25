'use client';

import { FeaturedHero } from "@/components/featured-hero"
import dynamic from "next/dynamic";

const MediolanoFrontpage = dynamic(() => import("@/components/mediolano-frontpage").then(mod => mod.MediolanoFrontpage), {
  ssr: true, // Keep it server rendered if possible for SEO, or false if it's purely interactive. 
  // Actually, for landing page content, we want SEO. 
  // dynamic with ssr: true (default) just splits the bundle.
});

export default function Home() {
  return (
    <div className="grid">
      <main className="flex flex-col row-start-2 p-6">
        <FeaturedHero />
        <MediolanoFrontpage />
      </main>
    </div>
  );
}
