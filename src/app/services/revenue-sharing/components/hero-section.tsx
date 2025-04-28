import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-emerald-900 to-emerald-700 text-white py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Revolutionize Your IP Revenue Sharing</h1>
            <p className="text-xl mb-8 opacity-90">
              Tokenize, protect, and monetize your intellectual property with smart contract intelligence on Starknet
              blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-emerald-900 hover:bg-gray-100">
                <Link href="/register">Register Your IP</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-emerald-800">
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-4 -left-4 w-full h-full bg-emerald-500 rounded-lg"></div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-emerald-300 rounded-lg"></div>
              <div className="relative bg-white rounded-lg p-6 shadow-xl">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="IP Asset Visualization"
                  className="w-full h-auto rounded"
                />
                <div className="mt-4 text-emerald-900">
                  <h3 className="font-bold">Protected IP Asset</h3>
                  <p className="text-sm text-gray-600">Registered in 181 countries • Revenue sharing enabled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
