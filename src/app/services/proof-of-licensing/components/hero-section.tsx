import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Decentralized Proof of IP Licensing
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Create, sign, and manage intellectual property licensing agreements on the Starknet blockchain with
              immutable proof and transparent verification.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/services/proof-of-licensing/agreements/create">
              <Button size="lg">Create Agreement</Button>
            </Link>
            <Link href="/services/proof-of-licensing/directory">
              <Button variant="outline" size="lg">
                Browse Directory
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

