import Image from "next/image"
import { items } from "@/lib/dataMktUserProfile"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function Items() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="aspect-square relative mb-2">
                <Image
                  src={item.image || "/background.jpg"}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <h3 className="font-semibold truncate">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.price} ETH</p>
              <Button className="w-full mt-2" variant="outline" size="sm">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button className="w-full" variant="outline">
        View More Items
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

