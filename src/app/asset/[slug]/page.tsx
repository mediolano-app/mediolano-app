import CreatorAssetPage from "@/components/creator-asset";

interface AssetPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function page({ params }: AssetPageProps) {
  return <CreatorAssetPage params={params} />;
}
