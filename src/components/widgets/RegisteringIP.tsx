import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Briefcase, FileText, Zap, Users, Layers, Lock, Music, Palette, Video, Book, DollarSign, Repeat, Search, Key, ChevronRight, Bitcoin, CircleDollarSign } from 'lucide-react'
import { SharePopup } from '@/components/share-popup'
import { mockAssets, mockCollections } from '@/lib/mockData'
import { useState } from 'react'

function RegisteringIP() {
    const benefits = [
      { icon: <Lock className="w-8 h-8 text-primary" />, title: "Clear Ownership", description: "Establish indisputable ownership claims on the blockchain." },
      { icon: <Search className="w-8 h-8 text-primary" />, title: "Enhanced Discovery", description: "Make your IP easily discoverable on the market." },
      { icon: <Zap className="w-8 h-8 text-primary" />, title: "Active Control", description: "Maintain control on your assets." },
      { icon: <Layers className="w-8 h-8 text-primary" />, title: "Modular Assets", description: "Transform static IP into modular, programmable assets." },
    ]
  
    return (
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl mb-6">Registering IP on Mediolano</h2>
              <p className="text-lg mb-8">
                Transform your static intellectual property into dynamic, programmable digital assets. Mediolano's registration process empowers creators with unprecedented control and flexibility.
              </p>
              <Link href="/register">
                <Button size="lg">
                  Register Your IP
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <Card className="bg-background/90" key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      {benefit.icon}
                      <CardTitle>{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
  