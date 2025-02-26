import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getCollectionAssets } from "@/lib/mockAssetDashboard"

export function CollectionCarousel() {
  const assets = getCollectionAssets()

  return (
    <Card className="bg-background/30">
      <CardHeader>
        <CardTitle>More from the Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {assets.map((asset, index) => (
              <CarouselItem key={index} className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <Image
                        src={asset.imageUrl || "/placeholder.svg"}
                        alt={asset.title}
                        width={300}
                        height={300}
                        className="rounded-md object-cover"
                      />
                    </CardContent>
                  </Card>
                  <h3 className="mt-2 text-center font-semibold">{asset.title}</h3>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  )
}

