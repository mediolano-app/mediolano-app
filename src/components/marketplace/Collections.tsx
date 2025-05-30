import Image from "next/image"
import { collections } from "@/lib/dataMktUserProfile"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function Collections() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Card key={collection.id}>
            <CardContent className="p-4">
              <div className="aspect-square relative mb-2">
                <Image
                  src={collection.image || "/background.jpg"}
                  alt={collection.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <h3 className="font-semibold truncate">{collection.name}</h3>
              <p className="text-sm text-muted-foreground">{collection.itemCount} items</p>
              <Button className="w-full mt-2" variant="outline" size="sm">
                View Collection
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button className="w-full" variant="outline">
        View More Collections
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

