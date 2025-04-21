import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Tokenize Your Intellectual Property with IP COIN
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Create, connect, and earn from your content online. Post freely while minting and selling accrues value
                to you and your collectors.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              >
                <Link href="/services/ip-coin/create">Create Your IP Coin</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/services/ip-coin/explore">Explore IP Coins</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-blue-100 dark:from-blue-950/30 dark:to-blue-950/30 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-500/20 backdrop-blur-sm"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500"></div>
                    <div>
                      <p className="text-sm font-medium">Creator Name</p>
                      <p className="text-xs text-muted-foreground">@username</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Market Cap</p>
                    <p className="text-xs text-muted-foreground">$1,218</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Content Title</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    This is a sample of tokenized intellectual property content that demonstrates how your content would
                    appear on the platform.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Token Price</p>
                    <p className="text-xs text-muted-foreground">0.001 STRK</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  >
                    Buy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
