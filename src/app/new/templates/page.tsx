  "use client";

import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useAccount } from "@starknet-react/core";
import { useState, FormEvent, useRef} from "react";
import { FilePlus, Lock, FileText, Coins, Shield, Globe, BarChart, Book, Music, Film, FileCode, Palette, File, ScrollText, Clock, ArrowRightLeft, ShieldCheck, Banknote, Globe2, FileLock } from 'lucide-react'
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


    <h1 className="text-4xl font-bold text-center mb-8">IP Templates</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="">

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-1xl mb-8">
          Register with a template:
        </h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {templates.map((template) => (
            <Link
              key={template.name}
              href={template.href}
              className="block group"
            >
              <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 text-foreground p-6 ">
                <div className="flex items-center mb-4">
                  <template.icon className="h-6 w-6 mr-3 text-blue-500" />
                  <h3 className="text-lg font-semibold">{template.name}</h3>
                </div>
                <p className="text-sm">{template.description}</p>
                <div className="mt-4 flex items-center text-indigo-600 group-hover:text-indigo-500">
                  <span className="text-sm font-medium">Open</span>
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-col items-left">
          <p className="text-sm">Looking for something else?</p>
          <Link href="/new/asset" title="Register your custom Programmable IP">
          <Button variant="outline" className="mt-4">Register Your Custom Programmable IP</Button>
          </Link>
          </div>

      </main>

          

      </div>


        
      <div className="text-card-foreground rounded-lg">

      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
        <CardHeader>
          <CardTitle>Blockchain IP Registration Features</CardTitle>
          <CardDescription>Secure, transparent, and efficient. Easy register your intellectual property with templates.</CardDescription>
        </CardHeader>
        <CardContent>
      <div>
        
          <ul className="space-y-6">
            <li className="flex items-start">
              <Lock className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Immutable Protection</h3>
                <p className="text-sm text-muted-foreground">Your IP is securely stored on the blockchain, providing tamper-proof evidence of ownership and creation date.</p>
              </div>
            </li>
            <li className="flex items-start">
              <FileText className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Smart Licensing</h3>
                <p className="text-sm text-muted-foreground">Utilize smart contracts for automated licensing agreements, ensuring proper attribution and compensation.</p>
              </div>
            </li>
            <li className="flex items-start">
              <Coins className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Tokenized Monetization</h3>
                <p className="text-sm text-muted-foreground">Transform your IP into digital assets, enabling fractional ownership and new revenue streams.</p>
              </div>
            </li>
            <li className="flex items-start">
              <Shield className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Enhanced Security</h3>
                <p className="text-sm text-muted-foreground">Benefit from blockchain's cryptographic security, protecting your IP from unauthorized access and tampering.</p>
              </div>
            </li>
            <li className="flex items-start">
              <Globe className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Global Accessibility</h3>
                <p className="text-sm text-muted-foreground">Access and manage your IP rights from anywhere in the world, facilitating international collaborations and licensing.</p>
              </div>
            </li>
            <li className="flex items-start">
              <BarChart className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Analytics and Insights</h3>
                <p className="text-sm text-muted-foreground">Gain valuable insights into your IP portfolio's performance and market trends through blockchain-powered analytics.</p>
              </div>
            </li>
          </ul>
        </div>
      
      </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost">Need help?</Button>
        </CardFooter>
      </Card>


      
    </div>

    </div>


    </main>
    </div>
      
    </>
  );
};

export default templatesIP;