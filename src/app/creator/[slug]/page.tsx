import { redirect } from "next/navigation"

export default async function CreatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/creator/${slug}/collections`)
}
