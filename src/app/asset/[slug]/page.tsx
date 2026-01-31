import { Metadata } from "next";
import CreatorAssetPage from "@/components/creator-asset";

interface AssetPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: AssetPageProps): Promise<Metadata> {
  const { slug } = await params;

  // TODO: Fetch real asset data here for richer SEO
  // For now, using dynamic slug in title
  const title = `IP ${slug.substring(0, 8)}...`
  const description = "View, share and remix Programmable IP"

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

export default function page({ params }: AssetPageProps) {
  return <CreatorAssetPage params={params} />;
}
