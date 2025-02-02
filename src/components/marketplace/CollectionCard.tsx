import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CollectionCardProps {
  id: string
  name: string
  creator: string
  coverImage: string
  items: number
}

export function CollectionCard({ id, name, creator, coverImage, items }: CollectionCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48">
          <Image
            src={coverImage || "/background.jpg"}
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
        <p className="text-sm">{items} items</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="secondary" className="w-full">
          <Link href={`/m-collection/${id}`}>View Collection</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

