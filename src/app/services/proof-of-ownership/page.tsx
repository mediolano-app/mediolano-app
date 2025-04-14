import Link from "next/link"
import { ArrowRight, Shield, Globe, Zap, FileCheck, Clock, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AssetTypeShowcase from "./components/asset-type-showcase"
import HeroSection from "./components/hero-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      {/* Features Section */}
      <section className="py-4 md:py-8">
        <div className="container px-4 md:px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-background/60">
              <CardHeader className="pb-2">
                <Shield className="h-12 w-12 mb-2 text-primary" />
                <CardTitle>Legal Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Ownership proof recognized in 181 countries according to The Berne Convention for the Protection of
                  Literary and Artistic Works
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/60">
              <CardHeader className="pb-2">
                <FileCheck className="h-12 w-12 mb-2 text-primary" />
                <CardTitle>Verifiable Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Generate tamper-proof ownership certificates with blockchain verification that can be shared or
                  presented as evidence
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/60">
              <CardHeader className="pb-2">
                <Clock className="h-12 w-12 mb-2 text-primary" />
                <CardTitle>Timestamped Records</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Immutable blockchain timestamps establish the exact moment of creation and registration for
                  indisputable proof
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/60">
              <CardHeader className="pb-2">
                <Globe className="h-12 w-12 mb-2 text-primary" />
                <CardTitle>Global Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Anyone worldwide can instantly verify your ownership claims through our public blockchain verification
                  portal
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/60">
              <CardHeader className="pb-2">
                <Zap className="h-12 w-12 mb-2 text-primary" />
                <CardTitle>Instant Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Register your intellectual property in minutes with our streamlined process and receive immediate
                  proof of ownership
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/60">
              <CardHeader className="pb-2">
                <LockKeyhole className="h-12 w-12 mb-2 text-primary" />
                <CardTitle>Secure Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Your original works are securely hashed and stored with encryption, ensuring privacy while maintaining
                  verifiability
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How Proof of Ownership Works
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Our simple three-step process secures your intellectual property on the blockchain
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create Your Asset</h3>
              <p className="text-muted-foreground">
                Upload your work and provide details about your intellectual property
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Blockchain Verification</h3>
              <p className="text-muted-foreground">
                We create a secure hash of your work and record it on the Starknet blockchain
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Receive Certificate</h3>
              <p className="text-muted-foreground">
                Download your proof of ownership certificate with blockchain verification details
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Types Section */}
      <section className="py-12 md:py-24 bg-background/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Protect Any Digital Asset</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Our Proof of Ownership service supports all types of intellectual property
            </p>
          </div>
          <AssetTypeShowcase />
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Secure Your Intellectual Property Today
            </h2>
            <p className="max-w-[700px] md:text-xl">
              Get blockchain-verified proof of ownership in minutes with our easy creation process
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg" variant="secondary">
                <Link href="/services/proof-of-ownership/create">
                  Create Proof of Ownership <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Link href="/services/proof-of-ownership/verify">Verify Ownership</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
