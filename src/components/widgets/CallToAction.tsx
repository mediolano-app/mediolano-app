import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function CallToAction() {
    return (
      <section className="py-20 rounded-lg shadow-lg bg-background/60 text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-6">Ready to leverage the power of tokenized intelligence on the global market?</h2>
          <p className="text-lg md:text-xl mb-8">Join Mediolano today and take control of your intellectual property on the Integrity Web.</p>
          <Link href="/register">
            <Button size="lg" variant="secondary">Get Started Now</Button>
          </Link>
        </div>
      </section>
    )
  }
  