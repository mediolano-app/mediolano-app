"use client";

import { use, useEffect, useState } from "react"
import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, FileCheck, DollarSign, Users, Box } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useMIP } from "@/hooks/contracts/use-mip"
import { useReadContract } from "@starknet-react/core";
import { abi } from "@/abis/abi"
import { Abi } from "starknet"
import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import { CONTRACT_ADDRESS } from "@/lib/constants"
import { NFTMetadata } from "@/lib/types";
import { IPTypeInfo } from "@/components/ip-type-info";
//add this import to get the known Cids
import { getKnownCids } from "@/utils/ipfs";

interface AssetPageProps {
    params: Promise<{
      id: string
    }>
  }
  

  export default function AssetPage({ params }: AssetPageProps) {
    // Unwrap the params Promise using React.use()
    const resolvedParams = use(params)
    const { id } = resolvedParams

  const tokenId = id || 42;
    
const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
const { account, address } = useAccount();
const userAddress = address || "Loading";

//Add new consts to recognize the Cids 
const knownCids = getKnownCids();
const ipfsCid = knownCids[id] || null



// Read basic NFT information (name, symbol)
const { data: nftSymbol } = useReadContract({
    abi: abi as Abi,
    functionName: "symbol",
    address: CONTRACT_ADDRESS,
    args: [],
  });

  // Read token name
  const { data: nftName } = useReadContract({
    abi: abi as Abi,
    functionName: "name",
    address: CONTRACT_ADDRESS,
    args: [],
  });

  // Read token URI for metadata
  const { data: tokenURI } = useReadContract({
    abi: abi as Abi,
    functionName: "tokenURI",
    address: CONTRACT_ADDRESS,
    args: [tokenId],
  });

  // Read token owner
  const { data: tokenOwner } = useReadContract({
    abi: abi as Abi,
    functionName: "ownerOf",
    address: CONTRACT_ADDRESS,
    args: [tokenId],
  });



  const tokenOwnerAddress = account ? address?.slice(0, 66) : "Unknown";
  //console.log("Token Owner:", tokenOwnerAddress);

  // Fetch metadata when tokenURI changes
  useEffect(() => {
    const fetchMetadata = async () => {
      if (tokenURI) {
        try {
          const response = await fetch(tokenURI);
          const data = await response.json();
          setMetadata(data);
        } catch (error) {
          console.error('Error fetching metadata:', error);
        }
      }
    };

    fetchMetadata();
  }, [tokenURI]);
  
  
  const nftData = {
    title: metadata?.name || nftName || "Loading IP",
    description: metadata?.description || "",
    nftId: "NFT #" + tokenId,
    symbol: nftSymbol || "MIP",
    tokenId: tokenId.toString(),
    tokenURI: tokenURI || "",
    owner: tokenOwner || "",
    tokenStandard: "ERC721",
    collection: nftName || "MIP",
    creator: (metadata?.author || tokenOwner || "Unknown").toString(),
    imageUrl: metadata?.image || "/background.jpg",
    blockchain: "Starknet",
    contractAddress: CONTRACT_ADDRESS || "",
    ipfsUrl: tokenURI || "",
    externalUrl: metadata?.external_url || ""
  };

  // In a real application, you would fetch the NFT data based on the ID
  const asset = {
    id,
    name: metadata?.name || nftName || "Loading IP",
    creator: {
      name: (metadata?.author || tokenOwnerAddress || "Unknown").toString(),
      address: tokenOwnerAddress,
      avatar: metadata?.image || "/background.jpg",
      verified: true,
      bio: "Creator bio (Preview).",
      website: "https://ip.mediolano.app",
    },
    owner: {
      name: (metadata?.author || tokenOwnerAddress || "Unknown").toString(),
      address: tokenOwnerAddress,
      avatar: "/background.jpg",
      verified: true,
      acquired: "(Preview)",
    },
    description: metadata?.description || "",
    image: metadata?.image || "/background.jpg",
    createdAt: "(Preview)",
    collection: "MIP",
    blockchain: "Starknet",
    tokenStandard: "ERC-721",
    licenseType: metadata?.name || nftName,
    licenseTerms: "(Preview)",
    contract: CONTRACT_ADDRESS,
    attributes: [
      { trait_type: "Asset", value: "Programmable IP" },
      { trait_type: "Protection", value: "Proof of Onwership" },
    ],
    licenseInfo: {
      type: "(Preview)",
      terms: "(Preview)",
      allowCommercial: false,
      allowDerivatives: true,
      requireAttribution: true,
      royaltyPercentage: 5,
    },
    // add specification to display the correct information on IPTypeInfo
    ipfsCid: ipfsCid,
    type: id === "1" ? "Art":
          id === "2" ? "Software":
          id === "3" ? "Audio":
          id === "4" ? "Video":
          id === "5" ? "Patens": "NFT",

  }
  console.log(asset);

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto p-4 py-8 ">
        <Link href="/portfolio">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
             Portfolio
          </Button>
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
          
          {/* Left column - Image */}
          <div className="lg:col-span-3">
            <div className="top-24">
              <div className="relative overflow-hidden rounded-xl border bg-muted/20 p-2">
                <Image
                  src={asset.image || "/background.jpg"}
                  alt={asset.name}
                  width={600}
                  height={600}
                  className="w-full h-auto object-contain"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary/90 text-primary-foreground">{asset.collection}</Badge>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {asset.attributes.map((attr, index) => (
                  <Badge key={index} variant="outline" className="bg-background">
                    {attr.trait_type}: {attr.value}
                  </Badge>
                ))}
              </div>
            </div>

                <div className="mt-6">
                   <IPTypeInfo asset={asset} />
                  </div>



          </div>

          {/* Right column - Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-clip">{asset.name}</h1>
                  
                </div>
                
              </div>

             
              


            </div>

            <Tabs defaultValue="overview" className="mt-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="license">License</TabsTrigger>
                <TabsTrigger value="owner">Owner</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p className="text-muted-foreground">{asset.description}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 flex items-center gap-3">
                        <FileCheck className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="text-sm">License</h3>
                          <p className="text-lg text-muted-foreground">{asset.licenseTerms}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex items-center gap-3">
                        <Box className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="text-sm">IP Version</h3>
                          <p className="text-lg text-muted-foreground">
                            1</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator />

                  <div>
                    <h2 className="text-xl font-semibold mb-4">Asset Information</h2>
                    <dl className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border p-3">
                        <dt className="text-sm text-muted-foreground">Collection</dt>
                        <dd className="font-medium">{asset.collection}</dd>
                      </div>
                      <div className="rounded-lg border p-3">
                        <dt className="text-sm text-muted-foreground">Blockchain</dt>
                        <dd className="font-medium">{asset.blockchain}</dd>
                      </div>
                      <div className="rounded-lg border p-3">
                        <dt className="text-sm text-muted-foreground">Token Standard</dt>
                        <dd className="font-medium">{asset.tokenStandard}</dd>
                      </div>
                      <div className="rounded-lg border p-3">
                        <dt className="text-sm text-muted-foreground">Contract</dt>
                        <dd className="font-medium truncate" title={asset.contract}>
                          {asset.contract}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="metadata">
                        <AccordionTrigger className="py-4">
                          <div className="flex items-center">
                            <Code className="mr-2 h-4 w-4" />
                            <span>Metadata</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ScrollArea className="h-[200px] rounded-md border p-4">
                            <pre className="text-sm">
                              {JSON.stringify(
                                {
                                  name: asset.name,
                                  description: asset.description,
                                  image: asset.image,
                                  attributes: asset.attributes,
                                  tokenId: asset.id,
                                  creator: asset.creator.name,
                                  licenseType: asset.licenseType,
                                  licenseTerms: asset.licenseTerms,
                                },
                                null,
                                2,
                              )}
                            </pre>
                          </ScrollArea>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="history">
                        <AccordionTrigger className="py-4">
                          <div className="flex items-center">
                            <History className="mr-2 h-4 w-4" />
                            <span>History (Preview)</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 p-2">
                            <div className="flex items-start">
                              <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <FileCheck className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">License Updated</p>
                                {/*<p className="text-sm text-muted-foreground">Feb 20, 2025</p>*/}
                                <p className="text-sm">{tokenOwnerAddress?.slice(0,20)} updated</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <PlusCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Created</p>
                                {/*<p className="text-sm text-muted-foreground">Jan 15, 2025</p>*/}
                                <p className="text-sm">{tokenOwnerAddress?.slice(0,20)} minted this asset</p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </TabsContent>

              {/* License Tab */}
              <TabsContent value="license" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-semibold">{asset.licenseInfo.type}</h2>
                          <p className="text-muted-foreground">{asset.licenseInfo.terms}</p>
                        </div>
                        
                      </div>

                      <Separator className="my-4" />

                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h3 className="font-medium mb-3">License Terms</h3>
                          <ul className="space-y-3">
                            <li className="flex items-center">
                              <Badge
                                variant={asset.licenseInfo.allowCommercial ? "default" : "destructive"}
                                className="mr-2"
                              >
                                {asset.licenseInfo.allowCommercial ? "Allowed" : "Not Allowed"}
                              </Badge>
                              Commercial Use
                            </li>
                            <li className="flex items-center">
                              <Badge
                                variant={asset.licenseInfo.allowDerivatives ? "default" : "destructive"}
                                className="mr-2"
                              >
                                {asset.licenseInfo.allowDerivatives ? "Allowed" : "Not Allowed"}
                              </Badge>
                              Derivative Works
                            </li>
                            <li className="flex items-center">
                              <Badge
                                variant={asset.licenseInfo.requireAttribution ? "default" : "secondary"}
                                className="mr-2"
                              >
                                {asset.licenseInfo.requireAttribution ? "Required" : "Not Required"}
                              </Badge>
                              Attribution
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">Royalty Information</h3>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Royalty Percentage</span>
                                <span className="font-medium">{asset.licenseInfo.royaltyPercentage}%</span>
                              </div>
                              <Progress value={asset.licenseInfo.royaltyPercentage * 5} className="h-2" />
                            </div>

                            <p className="text-sm text-muted-foreground">
                              This asset requires a {asset.licenseInfo.royaltyPercentage}% royalty payment for
                              commercial use, payable to the original creator.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Create New License</CardTitle>
                      <CardDescription>Customize a license agreement for this digital asset</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="license-type">License Type</Label>
                            <Select defaultValue="custom">
                              <SelectTrigger id="license-type">
                                <SelectValue placeholder="Select license type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cc">Creative Commons</SelectItem>
                                <SelectItem value="commercial">Commercial License</SelectItem>
                                <SelectItem value="exclusive">Exclusive Rights</SelectItem>
                                <SelectItem value="custom">Custom License</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="duration">License Duration</Label>
                            <Select defaultValue="1year">
                              <SelectTrigger id="duration">
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30days">30 Days</SelectItem>
                                <SelectItem value="6months">6 Months</SelectItem>
                                <SelectItem value="1year">1 Year</SelectItem>
                                <SelectItem value="perpetual">Perpetual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Usage Rights</Label>
                          <div className="grid gap-2 md:grid-cols-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="commercial-use" />
                              <Label htmlFor="commercial-use" className="font-normal">
                                Commercial Use
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="derivatives" />
                              <Label htmlFor="derivatives" className="font-normal">
                                Create Derivatives
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="distribution" />
                              <Label htmlFor="distribution" className="font-normal">
                                Distribution Rights
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="sublicense" />
                              <Label htmlFor="sublicense" className="font-normal">
                                Sublicense Rights
                              </Label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="territory">Territory</Label>
                          <RadioGroup defaultValue="worldwide" className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="worldwide" id="worldwide" />
                              <Label htmlFor="worldwide" className="font-normal">
                                Worldwide
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="regional" id="regional" />
                              <Label htmlFor="regional" className="font-normal">
                                Regional
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="royalty">Royalty Percentage</Label>
                          <div className="flex items-center space-x-4">
                            <Input id="royalty" type="number" placeholder="5" min="0" max="100" className="w-24" />
                            <span>%</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Percentage of revenue that will be paid to the creator
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="terms">Additional Terms</Label>
                          <Textarea
                            id="terms"
                            placeholder="Enter any additional terms or conditions for this license"
                            className="min-h-[100px]"
                          />
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Preview License</Button>
                      <Button>Create License</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              {/* Owner Tab */}
              <TabsContent value="owner" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ownership</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={asset.owner.avatar} alt={asset.owner.name} />
                          <AvatarFallback>{asset.owner.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold truncate">{tokenOwnerAddress?.slice(0,20)}...</h3>
                            {/*asset.owner.verified && <Badge variant="secondary">Verified</Badge>*/}
                          </div>
                          
                          <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="h-8">
                                <Globe className="mr-2 h-4 w-4" />
                                Profile
                              </Button>

                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Creator</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={asset.creator.avatar} alt={asset.creator.name} />
                          <AvatarFallback>{asset.creator.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold truncate">{tokenOwnerAddress?.slice(0,20)}...</h3>
                            {/* asset.creator.verified && <Badge variant="secondary">Verified</Badge> */}
                          </div>
                          <p className="text-sm text-muted-foreground">{asset.creator.bio}</p>

                          <div className="mt-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="h-8">
                                <Globe className="mr-2 h-4 w-4" />
                                Profile
                              </Button>

                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ownership History (Preview)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm">Transferred</p>
                            <p className="text-sm text-muted-foreground">{asset.owner.acquired}</p>
                            <p className="text-sm">
                              From {tokenOwnerAddress?.slice(0,20)} to {tokenOwnerAddress?.slice(0,20)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <PlusCircle className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm">Created</p>
                            <p className="text-sm text-muted-foreground">{asset.createdAt}</p>
                            <p className="text-sm">By {tokenOwnerAddress?.slice(0,20)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>


            <div className="mt-6 flex flex-wrap gap-4">
                <Button disabled variant="outline" className="flex-1">Share</Button>
                <Button disabled variant="outline" className="flex-1">
                  View on Explorer
                </Button>
              </div>


          </div>
        </div>
      </main>
    </div>
  )
}

function Code({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function History({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  )
}

function PlusCircle({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  )
}

function Globe({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function Twitter({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

function Instagram({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}