import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Briefcase, FileText, Zap, Users, Layers, Lock, Music, Palette, Video, Book, DollarSign, Repeat, Search, Key, ChevronRight, Bitcoin, CircleDollarSign } from 'lucide-react'
import { SharePopup } from '@/components/share-popup'
import { mockAssets, mockCollections } from '@/lib/mockData'
import { useState } from 'react'


export function MediolanoFeatures() {
    const features = [
      { icon: <Shield className="w-12 h-12 mb-4 text-primary" />, title: "IP Protection", description: "Secure your intellectual property on the blockchain" },
      { icon: <Briefcase className="w-12 h-12 mb-4 text-primary" />, title: "Portfolio Manager", description: "Manage all your IP assets in one place" },
      { icon: <FileText className="w-12 h-12 mb-4 text-primary" />, title: "IP Licensing", description: "Create and manage programmable licenses" },
      { icon: <Zap className="w-12 h-12 mb-4 text-primary" />, title: "Smart Transactions", description: "Execute IP transactions with smart contracts" },
      { icon: <Users className="w-12 h-12 mb-4 text-primary" />, title: "Collaboration Tools", description: "Work seamlessly with team members and partners" },
      { icon: <Layers className="w-12 h-12 mb-4 text-primary" />, title: "Unbeatable Cost", description: "literally a fraction of a cent to use" },
    ]
  
    return (
      <section className="py-8 mb-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-12">Powerful Features for Your IP</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center bg-background/90">
                <CardHeader>
                  <div className="flex justify-center">{feature.icon}</div>
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