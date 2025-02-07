import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Briefcase, FileText, Zap, Users, Layers, Lock, Music, Palette, Video, Book, DollarSign, Repeat, Search, Key, ChevronRight, Bitcoin, CircleDollarSign } from 'lucide-react'
import { SharePopup } from '@/components/share-popup'
import { mockAssets, mockCollections } from '@/lib/mockData'
import { useState } from 'react'


export function UserCollectionsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center mb-12">Featured User Collections</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCollections.map((collection) => (
            <Card key={collection.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-background/80">
              <div className="relative">
                <Image 
                  src={`/background.jpg`}
                  alt={collection.name} 
                  width={400} 
                  height={300} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <SharePopup 
                    title={`Check out the ${collection.name} collection on Mediolano`}
                    url={`/background.jpg`}
                  />
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{collection.name}</CardTitle>
                  <Badge variant="secondary">{collection.assets.length} Items</Badge>
                </div>
                <CardDescription>Owned by {collection.owner}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <Link href={`/collection/${collection.id}`}>
                  <Button variant="outline">View Collection</Button>
                </Link>
                <span className="text-sm text-muted-foreground">Last updated: {collection.lastUpdated}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="#">
            <Button size="lg">
              Explore All Collections
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}