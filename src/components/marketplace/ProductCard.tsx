import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Eye } from "lucide-react"

interface NFTCardProps {
  id: string
  name: string
  image: string
  creator: string
  price: number
  currency: string
  collection: string
  category: string
  categoryLink: string
  likes?: number
  views?: number
}

export function NFTCard({
  id,
  name,
  image,
  creator,
  price,
  currency,
  collection,
  category,
  categoryLink,
  likes,
  views,
}: NFTCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          <Image
            src={image || "/background.jpg"}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="transition-transform hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 truncate">{name}</CardTitle>
        <p className="text-sm text-muted-foreground mb-1">
          by{" "}
          <Link href={`/m-profile/${creator}`} className="text-primary hover:underline">
            {creator}
          </Link>
        </p>
        <p className="text-sm text-muted-foreground mb-1">
          Category:{" "}
          <Link href={categoryLink} className="text-primary hover:underline">
            {category}
          </Link>
        </p>
        <p className="font-semibold">
          {price} {currency}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/nft/${id}`}>View</Link>
        </Button>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {likes !== undefined && (
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {likes}
            </span>
          )}
          {views !== undefined && (
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {views}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

