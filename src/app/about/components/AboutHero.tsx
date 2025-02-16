import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AboutHero() {
  return (
    <section className="space-y-6 mt-10">
      <div className="bg-background/40 p-8 rounded-lg">
      <h1 className="text-4xl text-center tracking-tighter sm:text-5xl md:text-6xl">Mediolano</h1>
      <p className="text-muted-foreground mx-auto text-lg mt-8">
      Mediolano provides seamless tokenization for Intellectual Property, leveraging Starknet’s unparalleled high-speed, low-cost and smart contract intelligence for digital assets - - a groundbreaking solution to empower creators, collectors and organizations to protect and monetize their IP assets.
      </p>
      <p className="text-muted-foreground mx-auto mt-8">
      Registering Intellectual Property on Mediolano means the asset is automatically tokenize and protected in 181 countries, according to The Berne Convention for the Protection of Literary and Artistic Works, adopted in 1886, which guarantees recognition of the authorship of IP without the need for registration with WIPO (World Intellectual Property Organization). 
      </p>
      <p className="text-muted-foreground mx-auto mt-8">
      With Mediolano anyone can permissionless register their Intellectual Property assets -- such as artwork, video, music, literacy, AI model, software and other work of authorship. The copyright will be time stamped for your proof of ownership and valid for 50-70 years, according to the legal jurisdiction. In addition to tokenization services for Programmable IP, Mediolano provides services to licensing Programmable IP with countless combinations and total sovereignty.

      </p>
      <div className="flex space-x-4 mt-10">
        
          <Link href="https://mediolano.app" target="_blank"><Button size="lg" variant="link">
          Learn more <ArrowRight className="ml-2 h-4 w-4" />
          </Button></Link>
      </div>
      </div>
    </section>
  )
}

