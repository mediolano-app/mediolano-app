"use client";

import { useRouter } from "next/navigation";
import { CollectionsModular } from "@/components/collections/collections-modular";
import { FEATURED_COLLECTION_IDS } from "@/lib/constants";
import { HeroSlider } from "@/components/hero-slider";

/**
 * Collections Page
 *
 * Displays all IP collections from the MIP protocol on Starknet.
 * Uses the modular CollectionsModular component with advanced filtering capabilities.
 *
 * Features:
 * - Hero slider showcasing featured collections
 * - Search collections by name, description, or symbol
 * - Filter by owner address, IP type, status, and metadata
 * - Sort by various criteria (name, date, items, value)
 * - Toggle between grid and list views
 * - Featured collections support
 */
export default function CollectionsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto mb-20">
      <div className="container py-8">
        {/* Hero Slider */}
        <HeroSlider />

        {/* Page Description */}
        <div className="space-y-2 mt-8">
          <p className="text-muted-foreground">Explore IP Collections</p>
        </div>

        {/* Modular Collections Component with Advanced Filtering */}
        <div className="mt-8">
          <CollectionsModular
            enableFiltering={true}
            enableSorting={true}
            enableSearch={true}
            enableViewToggle={true}
            featuredCollectionIds={FEATURED_COLLECTION_IDS}
            initialFilters={{
              sortOption: "date-new",
              viewMode: "grid",
            }}
            onCollectionClick={(id) => {
              router.push(`/collections/${id}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
