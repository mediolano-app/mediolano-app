'use client';
import { useState } from 'react';
import { Search, Info, Book, Copyright, FileText, Image, Music, Video, DollarSign, Clock, Gavel, Users, Lock, Cpu, LinkIcon, MoreVertical, Eye, Copy, FileSignature } from 'lucide-react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { type Abi } from "starknet";
import { abiLic } from '@/abis/abiLic';

const licensingAddress = "0x00e64180c1e71d9d776f6d88f90b7d3143e0c0bda0ea1058cd699ed02b240a95";

import { IPLicensing } from '@/components/IPLicening';
import IPList from '@/components/ux/IPList';

type IPItem = {
  id: string;
  title: string;
  type: string;
  owner: string;
}

const ipItems: IPItem[] = [
  { id: '1', title: 'Revolutionary AI Algorithm', type: 'Patent', owner: 'Tech Innovations Inc.' },
  { id: '2', title: 'Eco-Friendly Packaging Design', type: 'Trademark', owner: 'Green Solutions Ltd.' },
  { id: '3', title: 'Bestselling Novel "The Future is Now"', type: 'Copyright', owner: 'Jane Doe' },
]

// Mock data for previously registered IPs
const mockIPs = [
  { id: 1, name: "Novel: The Cosmic Journey", type: "Book", status: "Listed", price: "0.5 STRK", image: "/background.jpg" },
  { id: 2, name: "Song: Echoes of Tomorrow", type: "Music", status: "Sold", price: "0.2 STRK", image: "/background.jpg" },
  { id: 3, name: "Artwork: Nebula Dreams", type: "Image", status: "Listed", price: "1.5 STRK", image: "/background.jpg" },
  { id: 4, name: "Screenplay: The Last Frontier", type: "Text", status: "Draft", price: "N/A", image: "/background.jpg" },
  { id: 5, name: "Short Film: Beyond the Stars", type: "Video", status: "Transfer", price: "3 STRK", image: "/background.jpg" },
]

const Licensing = () => {

  const [selectedIP, setSelectedIP] = useState<IPItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    licenseeCompany: '',
    licenseeEmail: '',
    licenseType: 'exclusive',
    duration: '',
    terms: '',
  })

  const filteredItems = mockIPs.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  )


  const router = useRouter()

  const handleNavigation = (name: string) => {
    router.push('/licensing/view/1')
  }


  return (
    <>

      <div className="container mx-auto px-4 py-8 mt-10 mb-20">
        <h1 className="text-4xl font-bold text-center mb-8">Licensing (Preview)</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="text-card-foreground">
            <IPLicensing />
          </div>
          <div className="text-card-foreground">
            <IPList />
          </div>
        </div>
      </div>

    </>
  );
};
export default Licensing;