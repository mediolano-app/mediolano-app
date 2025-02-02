import { nfts, categories } from "@/lib/mockMktData"
import { NFTCard } from "@/components/marketplace/ProductCard"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.name.toLowerCase() === params.slug.toLowerCase())
  const categoryNfts = nfts.filter((nft) => nft.category.toLowerCase() === params.slug.toLowerCase())

  if (!category) {
    return <div className="container mx-auto px-4 py-8">Category not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{category.name} NFTs</h1>

      <div className="flex justify-between items-center mb-8">
        <p className="text-lg">{categoryNfts.length} items</p>
        <div className="flex items-center space-x-4">
          <Select defaultValue="recent">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Link href="/search">Advanced Search</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoryNfts.map((nft) => (
          <NFTCard key={nft.id} {...nft} />
        ))}
      </div>

      {categoryNfts.length === 0 && <p className="text-center text-lg mt-8">No NFTs found in this category.</p>}
    </div>
  )
}

