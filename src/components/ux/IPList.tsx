'use client';

import { useState } from 'react';
import { Search, Info, Book, Copyright, FileText, Image, Music, Video, DollarSign, Clock, Gavel, Users, Lock, Cpu, LinkIcon, MoreVertical, Eye, Copy, FileSignature } from 'lucide-react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { type Abi } from "starknet";
import { abiLic } from '@/abis/abiLic';
import { Badge } from '../ui/badge';
import { useUserNFTs } from '@/hooks/useUserNft';

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
  { id: 1, name: "Novel: The Cosmic Journey", type: "Book", status: "Listed", price: "0.5 ETH", image: "/background.jpg" },
  { id: 2, name: "Song: Echoes of Tomorrow", type: "Music", status: "Sold", price: "0.2 ETH", image: "/background.jpg" },
  { id: 3, name: "Artwork: Nebula Dreams", type: "Image", status: "Listed", price: "1.5 ETH", image: "/background.jpg" },
  { id: 4, name: "Screenplay: The Last Frontier", type: "Text", status: "Draft", price: "N/A", image: "/background.jpg" },
  { id: 5, name: "Short Film: Beyond the Stars", type: "Video", status: "Transfer", price: "3 ETH", image: "/background.jpg" },
]

export default function IPList() {
  const router = useRouter();
  const { nfts, loading, error } = useUserNFTs();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNFTs = nfts.filter(nft =>
    nft.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigation = (tokenId: string) => {
    router.push(`/licensing/view/${tokenId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading NFTs: {error}
      </div>
    );
  }

  return (
    <>
      <div>
        <Badge className='mb-4'>Your Licensings</Badge>

        {/* <div className="space-y-4">
          {filteredNFTs.map((ip) => (
            <Card key={ip.id} className="hover:shadow transition-shadow duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 text-foreground">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-lg">{ip.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <Button variant="ghost" key={ip.id} onClick={() => handleNavigation(ip.name)}>View Details</Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Create New Listing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileSignature className="mr-2 h-4 w-4" />
                      <span>Create License</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <img src={ip.image} alt={ip.name} className="w-24 h-24 object-cover rounded-md" width="auto" height="auto" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{ip.type}</p>
                    <p className={`text-sm font-medium ${ip.status === "Listed" ? "text-green-500" :
                      ip.status === "Pending" ? "text-yellow-500" :
                        "text-gray-500"
                      }`}>
                      Status: {ip.status}
                    </p>
                    <p className="text-sm font-semibold mt-1">{ip.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div> */}
        <div className="space-y-4">
          {filteredNFTs.map((ip) => (
            <Card key={ip.id} className="hover:shadow transition-shadow duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 text-foreground">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-lg">{ip.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <Button variant="ghost" onClick={() => handleNavigation(ip.id.toString())}>
                        View Details
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Create New Listing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileSignature className="mr-2 h-4 w-4" />
                      <span>Create License</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <img src={ip.image} alt={ip.name} className="w-24 h-24 object-cover rounded-md" width="auto" height="auto" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{ip.type}</p>
                    <p className={`text-sm font-medium ${ip.status === "Listed" ? "text-green-500" :
                      ip.status === "Pending" ? "text-yellow-500" :
                        "text-gray-500"
                      }`}>
                      Status: {ip.status}
                    </p>
                    <p className="text-sm font-semibold mt-1">{ip.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}