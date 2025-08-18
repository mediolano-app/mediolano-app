import type { Metadata } from "next";
import { DiscoverPageClient } from "./discover-client";

export const metadata: Metadata = {
  title: "Discover - Mediolano",
  description: "Explore registered intellectual property assets and learn about the benefits of programmable IP on Starknet.",
};

export default function DiscoverPage() {
  return <DiscoverPageClient />;
}