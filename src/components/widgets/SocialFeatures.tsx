import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Briefcase, FileText, Zap, Users, Layers, Lock, Music, Palette, Video, Book, DollarSign, Repeat, Search, Key, ChevronRight, Bitcoin, CircleDollarSign } from 'lucide-react'
import { SharePopup } from '@/components/share-popup'
import { mockAssets, mockCollections } from '@/lib/mockData'
import { useState } from 'react'

export function SocialFeaturesSection() {
    const features = [
      { title: "Collaborative Workspaces", description: "Create and manage projects with team members and partners." },
      { title: "IP Marketplace", description: "Discover, buy, and sell intellectual property assets." },
      { title: "Community Forums", description: "Engage in discussions and share knowledge with other creators." },
      { title: "Expert Network", description: "Connect with IP professionals for advice and services." },
    ]
  
    return (
      <section className="py-20 mb-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Connect and Collaborate</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card className="bg-background/60" key={index}>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  