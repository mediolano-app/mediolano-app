import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Briefcase, FileText, Zap, Users, Layers, Lock, Music, Palette, Video, Book, DollarSign, Repeat, Search, Key, ChevronRight, Bitcoin, CircleDollarSign } from 'lucide-react'
import { SharePopup } from '@/components/share-popup'
import { mockAssets, mockCollections } from '@/lib/dapp-data'
import { useState } from 'react'

export function ProgrammableIPSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Programmable IP Assets</h2>
            <p className="text-lg md:text-xl mb-6">
              Transform your intellectual property into dynamic, programmable assets on the blockchain. Mediolano's permissionless approach offers:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>Control and sovereignty over digital assets.</li>
              <li>Portfolio Management and IP Licensing</li>
              <li>Smart Transactions with Programmable IP</li>
              <li>Industry standards interoperability</li>
              <li>Direct exposure to the global market</li>
            </ul>
            <Link href="https://mediolano.app">
              <Button>Discover our vision</Button>
            </Link>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/background.jpg"
              alt="Programmable IP Assets Visualization"
              width={800}
              height={800}
              className="rounded-lg shadow"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
