  "use client";

import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useAccount } from "@starknet-react/core";
import { useState, FormEvent, useRef} from "react";
import { FilePlus, Lock, FileText, Coins, Shield, Globe, BarChart, Book, Music, Film, FileCode, Palette, File, ScrollText, Clock, ArrowRightLeft, ShieldCheck, Banknote, Globe2, FileLock, ArrowLeft, CornerUpLeft, Crown, Crosshair, LockOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const templatesIP = () => {

  const router = useRouter();
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();

  const templates = [
    { name: 'Art', icon: Palette, href: '/new/art', description: 'Paintings, Photography, Artworks' },
    { name: 'Documents', icon: File, href: '/new/document', description: 'Preserve documents on-chain' },  
    { name: 'Video', icon: Film, href: '/new/video', description: 'Movies, videocast, shows, video creations' }, 
    { name: 'Audio', icon: Music, href: '/new/audio', description: 'Music, podcasts, samplers, radio' },
    { name: 'NFT', icon: FileLock, href: '/new/nft', description: 'NFT oriented asset design' },
    { name: 'Patents', icon: ScrollText, href: '/new/patents', description: 'Secure inventions and innovations' },
    { name: 'Publications', icon: Book, href: '/new/publication', description: 'Articles, news, research, posts' },
    { name: 'RWA', icon: Globe2, href: '/new/rwa', description: 'Tokenize Real World Assets' },
    { name: 'Software', icon: FileCode, href: '/new/software', description: 'Safeguard code ownership' },
  ]


  
  return (
    <>

    <div className="container mx-auto px-4 py-8 mb-20">
      <main>


      <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl md:pl-6 font-bold">Programmable IP Templates</h1>
                <Link
                    href="/new"
                    title="Back to New Asset"
                    className="flex items-center text-sm font-medium text-muted-foreground hover:underline"
                >
                    <CornerUpLeft className="mr-2 h-4 w-4" />
                </Link>
            </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/30 text-foreground p-4 rounded-lg">

        <main className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {templates.map((template) => (
            <Link
              key={template.name}
              href={template.href}
              className="block group"
            >
              <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 text-foreground p-6 ">
                <div className="flex items-center mb-4">
                  <template.icon className="h-6 w-6 mr-3 text-blue-600" />
                  <h3 className="text-lg font-semibold">{template.name}</h3>
                </div>
                <p className="text-sm">{template.description}</p>
                <div className="mt-4 flex items-center text-indigo-600 group-hover:text-indigo-500">
                  <span className="text-sm font-medium">Create</span>
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-col items-left">
          <p className="mb-4">Need a different format?</p>
          <Link href="/create" title="Register your custom Programmable IP">
          <Button variant="outline" className="p-6 bg-blue-600 text-white text-lg">Register your custom IP</Button>
          </Link>
          </div>

      </main>

          

      </div>


        
      <Card className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/90 text-foreground p-8 rounded-lg shadow">

     
        <div className="">
          <h3 className="text-lg">Intellectual Property Onchain</h3>
          <h4 className="text-blue-600 text-sm">Unlock the future of the integrity web</h4>
          </div>

      <div className="mt-6">
        
          <ul className="space-y-6">
            <li className="flex items-start">
              <Lock className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Immutable Protection</h3>
                <p className="text-sm text-muted-foreground">Your IP is secured on blockchain, providing tamper-proof evidence of ownership.</p>
              </div>
            </li>
            <li className="flex items-start">
              <FileText className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Smart Licensing</h3>
                <p className="text-sm text-muted-foreground">Utilize smart contracts for intelligence licensing agreements, ensuring proper attribution.</p>
              </div>
            </li>
            <li className="flex items-start">
              <Coins className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Tokenized Monetization</h3>
                <p className="text-sm text-muted-foreground">Transform your IP into digital assets, enabling new revenue streams.</p>
              </div>
            </li>
            <li className="flex items-start">
              <Shield className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Enhanced Security</h3>
                <p className="text-sm text-muted-foreground">Benefit from blockchain's cryptographic security.</p>
              </div>
            </li>
            <li className="flex items-start">
              <Globe className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Global Reach</h3>
                <p className="text-sm text-muted-foreground">Adherence to world markets and unlock international reach.</p>
              </div>
            </li>
            <li className="flex items-start">
              <Crown className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Self Custody</h3>
                <p className="text-sm text-muted-foreground">Own and manage with digital assets with your encrypt wallet.</p>
              </div>
            </li>
            <li className="flex items-start">
              <Crosshair className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Real-Time Asset Tracking</h3>
                <p className="text-sm text-muted-foreground">Continuous monitoring for unauthorized use and infringement.</p>
              </div>
            </li>
            <li className="flex items-start">
              <LockOpen className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Permissionless Registration</h3>
                <p className="text-sm text-muted-foreground">Anyone can register their IP assets without restrictions, democratizing access to IP protection.</p>
              </div>
            </li>
          </ul>
        </div>
      
      
      


      
    </Card>

    </div>


    </main>
    </div>
      
    </>
  );
};

export default templatesIP;