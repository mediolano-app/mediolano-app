'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentAgreements } from "@/app/services/proof-of-licensing/components/recent-agreements"
import { StatsCards } from "@/app/services/proof-of-licensing/components/stats-cards"
import { HeroSection } from "@/app/services/proof-of-licensing/components/hero-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Platform Overview</h2>
          <StatsCards />
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Recent Agreements</h2>
            <Link href="/services/proof-of-licensing/agreements">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <RecentAgreements />
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Create New Agreement</CardTitle>
              <CardDescription>Start a new licensing agreement and invite parties to sign</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create customizable licensing agreements with flexible terms, royalty structures, and usage rights
                tailored to your intellectual property needs.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/services/proof-of-licensing/agreements/create">
                <Button>Get Started</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public Directory</CardTitle>
              <CardDescription>Browse the public directory of licensing agreements</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Explore publicly available licensing agreements and their associated proofs for transparency and
                verification purposes.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/directory">
                <Button variant="outline">Browse Directory</Button>
              </Link>
            </CardFooter>
          </Card>
        </section>
      </main>
    </div>
  )
}

