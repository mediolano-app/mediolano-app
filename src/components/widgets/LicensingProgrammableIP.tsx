import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Briefcase, FileText, Zap, Users, Layers, Lock, Music, Palette, Video, Book, DollarSign, Repeat, Search, Key, ChevronRight, Bitcoin, CircleDollarSign } from 'lucide-react'
import { SharePopup } from '@/components/share-popup'
import { mockAssets, mockCollections } from '@/lib/mockData'
import { useState } from 'react'



export function LicensingProgrammableIP() {
    const features = [
      { icon: <Music className="w-8 h-8 text-primary" />, title: "Music", description: "Music and compositions tokenization opens new opportunities for artists" },
      { icon: <Palette className="w-8 h-8 text-primary" />, title: "Art", description: "Register and control how your digital art is used and monetized" },
      { icon: <Video className="w-8 h-8 text-primary" />, title: "Video", description: "Manage distribution rights and revenue sharing" },
      { icon: <Book className="w-8 h-8 text-primary" />, title: "Publishing", description: "Set up flexible licensing terms for your written content." },
      { icon: <DollarSign className="w-8 h-8 text-primary" />, title: "RWA", description: "Explore the unique potential of Programmable IP for Real World Assets" },
      { icon: <Repeat className="w-8 h-8 text-primary" />, title: "Property Rights", description: "Easily trade or transfer partial or full rights to your IP." },
    ]
  
    return (
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-6">Licensing Programmable IP</h2>
          <p className="text-xl text-center mb-12">Empower artists to take control of their IP with flexible, programmable licensing options.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card className="bg-background/60" key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/licensing">
              <Button size="lg">
                New Licensing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }