import { motion } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

const mockNFTCollections = [
    { id: 1, name: "Crypto Punks", image: "/placeholder.svg?height=100&width=100" },
    { id: 2, name: "Bored Apes", image: "/placeholder.svg?height=100&width=100" },
    { id: 3, name: "Azuki", image: "/placeholder.svg?height=100&width=100" },
    { id: 4, name: "Doodles", image: "/placeholder.svg?height=100&width=100" },
    { id: 5, name: "CloneX", image: "/placeholder.svg?height=100&width=100" },
  ]

export function CollectionsCarousel() {
  return (
    <>

    <div className="mt-16">
          <h3 className="mb-6 text-center text-lg font-semibold">IP Collections</h3>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {mockNFTCollections.map((collection) => (
                <CarouselItem
                  key={collection.id}
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <motion.div
                    className="p-1"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <img
                        src={collection.image || "/placeholder.svg"}
                        alt={collection.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                      />
                      <span className="text-xs sm:text-sm font-medium text-center">{collection.name}</span>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-center mt-4">
            {mockNFTCollections.map((_, index) => (
              <Button key={index} variant="ghost" size="sm" className="w-2 h-2 rounded-full mx-1 p-0">
                <span className="sr-only">Go to item {index + 1}</span>
              </Button>
            ))}
          </div>
        </div>
    
    </>
  )
}