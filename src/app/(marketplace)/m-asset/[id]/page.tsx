import { nfts } from "@/lib/mockMktData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function NFTPage({ params }: { params: { id: string } }) {
  const nft = nfts.find((n) => n.id === params.id)

  if (!nft) {
    return <div className="container mx-auto px-4 py-8">NFT not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{nft.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <Image
                src={nft.image || "/background.jpg"}
                alt={nft.name}
                width={600}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="flex-1">
              <p className="text-lg mb-2">
                Creator:{" "}
                <Link href={`/m-profile/${nft.creator}`} className="text-primary hover:underline">
                  {nft.creator}
                </Link>
              </p>
              <p className="text-lg mb-2">Collection: {nft.collection}</p>
              <p className="text-lg mb-2">Category: {nft.category}</p>
              <p className="text-2xl font-bold mb-4">
                Price: {nft.price} {nft.currency}
              </p>
              <Button size="lg">Buy Now</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

