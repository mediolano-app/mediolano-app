import Image from "next/image"
import Link from "next/link"
import { getNFTById } from "@/lib/mockupPortfolioData"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ExternalLink, Share2, Heart, Clock, Tag, Sparkles } from "lucide-react"
import { RelatedNFTs } from "@/app/portfolio/components/related-nfts"

export default function NFTDetailPage({ params }: { params: { id: string } }) {
  const nft = getNFTById(params.id)

  if (!nft) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">NFT Not Found</h1>
        </div>
        <p>The NFT you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{nft.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="relative aspect-square rounded-xl overflow-hidden border group">
            <Image
              src={nft.image || "/placeholder.svg"}
              alt={nft.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {nft.rarity && (
              <div className="absolute top-4 left-4">
                <Badge className="px-3 py-1 text-sm bg-background/80 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 mr-1" />
                  {nft.rarity}
                </Badge>
              </div>
            )}
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">Properties</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {nft.attributes?.map((attr, index) => (
                  <div key={index} className="border rounded-lg p-3 text-center hover:border-primary transition-colors">
                    <p className="text-xs text-primary uppercase font-medium">{attr.trait_type}</p>
                    <p className="font-medium truncate">{attr.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">{nft.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-muted-foreground">{nft.collection.name}</p>
                  <Badge variant="outline">{nft.tokenId}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground">{nft.description}</p>
          </div>

          <Tabs defaultValue="price">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="price">Price</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="price" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Price</p>
                      <p className="text-3xl font-bold">{nft.price} ETH</p>
                      <p className="text-sm text-muted-foreground">≈ ${(nft.price * 3500).toLocaleString()}</p>
                    </div>
                    <div>
                      <Button className="px-8">Buy Now</Button>
                    </div>
                  </div>

                  {nft.lastSale && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">Last Sale</p>
                      <p className="font-medium">{nft.lastSale.price} ETH</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(nft.lastSale.date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Price History</h3>
                  <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">Price chart visualization</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Transaction History</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">Listed for sale</p>
                          <p className="text-sm text-muted-foreground">by 0x1a92...3e56</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{nft.price} ETH</p>
                        <p className="text-sm text-muted-foreground flex items-center justify-end">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {nft.lastSale && (
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="font-medium">Sold</p>
                            <p className="text-sm text-muted-foreground">to 0x7b43...9f21</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{nft.lastSale.price} ETH</p>
                          <p className="text-sm text-muted-foreground flex items-center justify-end">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(nft.lastSale.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium">Minted</p>
                          <p className="text-sm text-muted-foreground">by 0x3f67...8c12</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">-</p>
                        <p className="text-sm text-muted-foreground flex items-center justify-end">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(nft.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Contract Address</p>
                      <p className="font-medium flex items-center">
                        0x1a92...3e56
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Token ID</p>
                      <p className="font-medium">{nft.tokenId.replace("#", "")}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Token Standard</p>
                      <p className="font-medium">ERC-721</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Chain</p>
                      <p className="font-medium">Ethereum</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(nft.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Creator Royalty</p>
                      <p className="font-medium">2.5%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">More from this collection</h2>
        <RelatedNFTs collectionId={nft.collection.id} currentNftId={nft.id} />
      </div>
    </div>
  )
}

