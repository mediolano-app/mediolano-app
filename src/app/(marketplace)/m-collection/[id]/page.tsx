import { collections, nfts } from "@/lib/mockMktData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NFTCard } from "@/components/marketplace/ProductCard"
import Image from "next/image"
import Link from "next/link"

export default function CollectionPage({ params }: { params: { id: string } }) {
  const collection = collections.find((c) => c.id === params.id)
  const collectionNfts = nfts.filter((nft) => nft.collection === collection?.name)

  if (!collection) {
    return <div className="container mx-auto px-4 py-8">Collection not found</div>
  }

  const totalVolume = collectionNfts.reduce((sum, nft) => sum + nft.price, 0)
  const floorPrice = Math.min(...collectionNfts.map((nft) => nft.price))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Image
          src={collection.coverImage || "/background.jpg"}
          alt={collection.name}
          width={1200}
          height={400}
          className="w-full h-[300px] object-cover rounded-lg mb-4"
        />
        <h1 className="text-4xl font-bold mb-2">{collection.name}</h1>
        <p className="text-xl mb-4">
          Created by:{" "}
          <Link href={`/m-profile/${collection.creator}`} className="text-primary hover:underline">
            {collection.creator}
          </Link>
        </p>
        <p className="text-lg mb-4">{collection.description}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{collection.items}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Owners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{Math.floor(collection.items * 0.7)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Floor Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{floorPrice.toFixed(2)} ETH</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Total Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalVolume.toFixed(2)} ETH</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">NFTs in this Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectionNfts.map((nft) => (
          <NFTCard key={nft.id} {...nft} />
        ))}
      </div>
    </div>
  )
}

