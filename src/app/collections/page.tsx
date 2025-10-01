"use client";

import { useRouter } from "next/navigation";
import { CollectionsModular } from "@/components/collections/collections-modular";
import { FEATURED_COLLECTION_IDS } from "@/lib/constants";

/**
 * Collections Page
 *
 * Displays all IP collections from the MIP protocol on Starknet.
 * Uses the modular CollectionsModular component with advanced filtering capabilities.
 *
 * Features:
 * - Search collections by name, description, or symbol
 * - Filter by owner address, IP type, status, and metadata
 * - Sort by various criteria (name, date, items, value)
 * - Toggle between grid and list views
 * - Featured collections support
 */
export default function CollectionsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 mb-20">
      <div className="container py-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">
            Discover and explore Mediolano IP Collections on Starknet
          </p>
        </div>

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
  );
}

