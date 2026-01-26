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
  const title = `Collection ${collectionAddress.substring(0, 8)}... | Mediolano`;
  const description = "Explore this IP collection on Mediolano.";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      siteName: "Mediolano IP Creator",
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
