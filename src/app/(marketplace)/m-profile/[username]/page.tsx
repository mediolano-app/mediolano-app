import { users, nfts, collections } from "@/lib/mockMktData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NFTCard } from "@/components/marketplace/ProductCard"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Twitter, Instagram, Globe } from "lucide-react"

// Mock data for new sections
const userCollections = collections.filter((collection) => collection.creator === "alice_nft")
const userActivity = [
  { id: "1", type: "Sale", item: "Cosmic Dream #1", price: 0.5, date: "2023-05-01" },
  { id: "2", type: "Purchase", item: "Pixel Punk #3", price: 0.3, date: "2023-04-28" },
  { id: "3", type: "Bid", item: "Nature's Beauty", price: 0.2, date: "2023-04-25" },
]
const userListings = nfts.filter((nft) => nft.creator === "alice_nft").slice(0, 3)

export default function UserProfile({ params }: { params: { username: string } }) {
  const user = users.find((u) => u.username === params.username)
  const userNfts = nfts.filter((nft) => nft.creator === params.username)

  if (!user) {
    return <div className="container mx-auto px-4 py-8">User not found</div>
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-64 md:h-80">
        <Image
          src={user.coverImage || "/background.jpg?height=400&width=1200"}
          alt="Cover Image"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 -mt-20 mb-12 relative z-10">
          <Image
            src={user.avatar || "/background.jpg"}
            alt={user.name}
            width={200}
            height={200}
            className="rounded-full border-4 border-background"
          />
          <div className="text-center md:text-left md:pb-4">
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            <p className="text-xl text-muted-foreground mb-4">@{user.username}</p>
            <div className="flex justify-center md:justify-start space-x-4">
              {user.twitter && (
                <Link href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </Button>
                </Link>
              )}
              {user.instagram && (
                <Link href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon">
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </Button>
                </Link>
              )}
              {user.website && (
                <Link href={user.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Website</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <p className="text-lg">{user.bio}</p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">User's NFTs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userNfts.map((nft) => (
              <NFTCard key={nft.id} {...nft} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">User's Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCollections.map((collection) => (
              <Card key={collection.id}>
                <CardHeader>
                  <CardTitle>{collection.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={collection.coverImage || "/background.jpg"}
                    alt={collection.name}
                    width={500}
                    height={300}
                    className="w-full h-auto rounded-lg"
                  />
                  <p className="mt-2">Items: {collection.items}</p>
                  <Link href={`/collection/${collection.id}`} className="text-primary hover:underline">
                    View Collection
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {userActivity.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <p className="font-semibold">
                      {activity.type}: {activity.item}
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                  <p className="font-semibold">{activity.price} ETH</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Current Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userListings.map((nft) => (
              <NFTCard key={nft.id} {...nft} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

