"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, DollarSign, Globe, Users, FileText, Handshake, Zap } from "lucide-react"

const monetizationOptions = [
  {
    title: "Smart Transaction",
    description: "Set up automated royalty payments and revenue sharing.",
    icon: Zap,
  },
  {
    title: "List on Marketplaces",
    description: "Sell your NFT on popular marketplaces.",
    icon: Globe,
  },
  {
    title: "IP Crowdfunding",
    description: "Raise funds for your IP project through crowdfunding.",
    icon: Users,
  },
  {
    title: "IP Syndication",
    description: "License your IP for use in various media channels.",
    icon: DollarSign,
  },
  {
    title: "IP Commission",
    description: "Offer your IP for commissioned works.",
    icon: FileText,
  },
  {
    title: "IP License Agreement",
    description: "Create custom licensing agreements for your IP.",
    icon: Handshake,
  },
]

export function MonetizationOptions({ nftId }: { nftId: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {monetizationOptions.map((option, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <option.icon className="h-5 w-5" />
              {option.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{option.description}</CardDescription>
            <Button className="mt-4 w-full" onClick={() => console.log(`${option.title} for NFT ${nftId}`)}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

