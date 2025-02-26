import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Briefcase, FileText, Zap, Users, Layers, Lock, Music, Palette, Video, Book, DollarSign, Repeat, Search, Key, ChevronRight, Bitcoin, CircleDollarSign } from 'lucide-react'
import { SharePopup } from '@/components/share-popup'
import { mockAssets, mockCollections } from '@/lib/mockData'
import { useState } from 'react'

export function HowItWorks() {
    const steps = [
      { icon: <Shield className="w-12 h-12 text-primary" />, title: "Secure Registration", description: "Register your IP on the blockchain with just a few clicks." },
      { icon: <Key className="w-12 h-12 text-primary" />, title: "Programmable IP", description: "Create programmable licenses for flexible monetization." },
      { icon: <Briefcase className="w-12 h-12 text-primary" />, title: "Portfolio Management", description: "Manage all your IP assets in one secure platform." },
      { icon: <CircleDollarSign className="w-12 h-12 text-primary" />, title: "Monetization", description: "Onchain opportunities for tokenized IP." },
    ]
  
    return (
      <section id="how-it-works" className="py-8 mb-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-12">How Mediolano Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="text-center bg-background/60">
                <CardHeader>
                  <div className="flex justify-center mb-4">{step.icon}</div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{step.description}</p>
                </CardContent>
                {index < steps.length - 1 && (
                  <div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }
  