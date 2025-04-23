"use client";

import type { NextPage } from "next";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { DollarSign, BarChart2, Users, Globe } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const monetizeIP: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();



  const [activeTab, setActiveTab] = useState('opportunities')

  const dummyOpportunities = [
    { id: 1, title: 'AI Algorithm Licensing', type: 'Copyright', potential: 'High', industry: 'Technology' },
    { id: 2, title: 'New paper for Zero-Knowledge', type: 'Creative Commons', potential: 'Medium', industry: 'Technology' },
    { id: 3, title: 'New sci-fi series review', type: 'License', potential: 'Very High', industry: 'Arts' },
  ]

  const dummyRoyalties = [
    { id: 1, title: 'AI Algorithm License', licensee: 'Mediolano', amount: 50000, date: '2023-05-15', contract: '0x...' },
    { id: 2, title: 'The Batman movie critic', licensee: 'Ambrosia.com.br', amount: 25000, date: '2021-05-10', contract: '0x...' },
    { id: 3, title: 'MindWave Trademark Use', licensee: 'SmartHome Solutions', amount: 10000, date: '2020-05-05', contract: '0x...' },
  ]


      

  return (
    <>
      <div className="flex justify-center flex-col" >

        <div className="flex justify-center mb-10 mt-10">
           <h1 className="text-2xl font-bold">Monetize Your Intellectual Property</h1>
        </div>  


      <div className="max-w-6xl mx-auto">

      <div className="space-y-8 mb-10">
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
          <CardHeader>
            <CardTitle>Licensing</CardTitle>
            <CardDescription>Grant rights to use your IP</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Create customized licensing agreements to allow others to use your intellectual property while maintaining ownership.</p>
            <Button variant="secondary">
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
          <CardHeader>
            <CardTitle>Customizable Licensing Agreements</CardTitle>
            <CardDescription>Tailored smart agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Smart contract intelligence allows the creation of tailored licensing agreements, ensuring that creators have full control over how and when their work is used.
            </p>
            <Button variant="secondary">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
          <CardHeader>
            <CardTitle>IP Smart Transaction (Escrow)</CardTitle>
            <CardDescription>Monetize your Programmable IP</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Secure transactions between IP sellers and buyers by allowing users to create, manage, and fulfill escrow orders.</p>
            <Button variant="secondary">
            Coming Soon
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
          <CardHeader>
            <CardTitle>IP Marketplace</CardTitle>
            <CardDescription>List your IP assets for trade</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Permissionless marketplace designed to provide monetization services with Programmable IP to generate more value for their digital assets</p>
            <Button variant="secondary">
              Under Development
            </Button>
          </CardContent>
        </Card>



        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
          <CardHeader>
            <CardTitle>IP Tickets </CardTitle>
            <CardDescription>Create and trade tickets for Programmable IP</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4"> Whether it's a film, an ebook, a podcast series, a survey, or a music concert, the NFT tickets will grant unique, verifiable access rights</p>
            <Button variant="secondary">
            Under Development
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
          <CardHeader>
            <CardTitle>IP Coin</CardTitle>
            <CardDescription>Permissionless comminties witu IP Ownership</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Empower users to monetize their intellectual property (IP) by creating their own ERC20-compliant tokens—referred to as "IP Coins". These tokens will represent fractional ownership or rights tied to the user's IP. Users will also be able to establish liquidity pools for their IP Coins on the Ekubo platform, allowing them to fragment and commercialize their IP through token sales.
            .</p>
            <Button variant="secondary">
            Under Development
            </Button>
          </CardContent>
        </Card>


        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
          <CardHeader>
            <CardTitle>IP Subscription Rights </CardTitle>
            <CardDescription>Create recurring subscription payments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Monetize assets efficiently while providing subscribers with flexible and transparent access to rights for commercial use.
            </p>
            <Button variant="secondary">
            Under Development
            </Button>
          </CardContent>
        </Card>



        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
          <CardHeader>
            <CardTitle>IP Crowdfunding</CardTitle>
            <CardDescription>Community funding monetization</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Enabling monetization with permissionless crowdfunding campaigns.
            </p>
            <Button variant="secondary">
            Under Development
            </Button>
          </CardContent>
        </Card>


        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
          <CardHeader>
            <CardTitle>IP Syndication</CardTitle>
            <CardDescription>Public or restricted syndication</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This service allows a group of people to purchase the rights to an intellectual property onchain.
            </p>
            <Button variant="secondary">
            Under Development
            </Button>
          </CardContent>
        </Card>

      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
          <CardHeader>
            <CardTitle>IP Royalties</CardTitle>
            <CardDescription>Earn royalties from your IP</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Automated royalty payments for creators and rights holders, ensuring fair compensation for their work.</p>
            <Button variant="secondary">
            Under Development
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
          <CardHeader>
            <CardTitle>Colab IP Collection</CardTitle>
            <CardDescription>Create and Monetize Colaborative IP Collections</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">'Enables multiple individuals to contribute creatively to an NFT collection with monetization rights.</p>
            <Button variant="secondary">
            Under Development
            </Button>
          </CardContent>
          </Card>


        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
          <CardHeader>
            <CardTitle>IP Airdrop</CardTitle>
            <CardDescription>Reward early adopters, contributors and community</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Cuild a community around a permissionless airdrop campaign</p>
            <Button variant="secondary">
            Under Development
            </Button>
          </CardContent>
        </Card>


        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
          <CardHeader>
            <CardTitle>IP Franchise</CardTitle>
            <CardDescription>Permissionless service for rights monetization</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Create a commercial framework for Programmable IP, allowing them to generate revenue through fees and/or royalties.
            .</p>
            <Button variant="secondary">
            Under Development
            </Button>
          </CardContent>
        </Card>


        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
          <CardHeader>
            <CardTitle>IP Club</CardTitle>
            <CardDescription>Permissionless comminties witu IP Ownership</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Establish unique spaces where participants can mint or purchase NFTs to join and gain access to exclusive features and benefits.
            .
            .</p>
            <Button variant="secondary">
            Under Development
            </Button>
          </CardContent>
        </Card>


      </div>
    </div>


      </div>






      </div>

      
    </>
  );
};

export default monetizeIP;
