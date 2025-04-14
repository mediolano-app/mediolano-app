import Link from "next/link"
import { ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6">
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl text-center font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Blockchain-Verified Proof of Ownership
              </h1>
              <p className="text-muted-foreground md:text-xl text-center">
                Secure your intellectual property with immutable blockchain evidence.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row items-center justify-center">
              <Button asChild size="lg">
                <Link href="/services/proof-of-ownership/create">
                  Create Proof of Ownership <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services/proof-of-ownership/verify">Verify Ownership</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
