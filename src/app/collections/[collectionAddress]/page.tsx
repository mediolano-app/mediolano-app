import { Metadata } from "next";
import CollectionDetails from "@/components/collection-details";

interface CollectionPageProps {
  params: Promise<{
    collectionAddress: string;
  }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collectionAddress } = await params;

  // Dynamic metadata based on address
  const title = `Collection ${collectionAddress.substring(0, 8)}... | IP Creator`;
  const description = "Explore this onchain IP collection.";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      siteName: "IP Creator",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    }
  };
}

export default async function Page({ params }: CollectionPageProps) {
  const { collectionAddress } = await params;
  return <CollectionDetails collectionAddress={collectionAddress} />;
}
