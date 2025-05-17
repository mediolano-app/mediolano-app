"use client"

import { useState, useEffect } from "react"
import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, FileCheck, DollarSign, Send } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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
import { TransferAssetDialog } from "@/components/transfer-asset-dialog"

import { IPTypeInfo } from "@/components/ip-type-info"
import { determineIPType, fetchIPFSMetadata, getKnownCids, AssetType } from "@/utils/ipfs"

interface AssetPageProps {
  params: {
    id: string
  }
}

interface AssetOwner {
  name: string;
  address: string;
  avatar: string;
  verified: boolean;
  acquired: string;
}

interface TransferHistoryItem {
  event: string;
  from: string;
  to: string;
  date: string;
  memo?: string;
}

/**
 * Determine the IP type dynamically
 * @param {string} id 
 * @param {string|null} ipfsCid 
 * @param {string} name 
 * @returns {Promise<string>} 
 */
async function determineAssetType(id: string, ipfsCid: string | null, name: string): Promise<string> {
  // if there exists an IPFS CID, get the metadata
  if (ipfsCid) {
    try {
      const metadata = await fetchIPFSMetadata(ipfsCid);
      if (metadata) {
        // Use determineIPType func to detect the type in metadata-based 
        const detectedType = determineIPType(metadata);
        console.log(detectedType);
        if (detectedType) {
          return detectedType;
        }
      }
    } catch (error) {
      console.error("Error fetching IPFS metadata for type detection:", error);
    }
  }
  
  // second try, try to infer the type from the name
  const lowerName = name.toLowerCase();
  if (lowerName.includes("audio") || lowerName.includes("music") || lowerName.includes("sound")) return "Audio";
  if (lowerName.includes("art") || lowerName.includes("painting")) return "Art";
  if (lowerName.includes("video") || lowerName.includes("film")) return "Video";
  if (lowerName.includes("software") || lowerName.includes("code") || lowerName.includes("app")) return "Software";
  if (lowerName.includes("patent") || lowerName.includes("invention")) return "Patents";
  if (lowerName.includes("post") || lowerName.includes("article") || lowerName.includes("blog")) return "Posts";
  if (lowerName.includes("book") || lowerName.includes("publication")) return "Publications";
  
  // if there isn't determined it yet, use fallback based on the id
  const numId = parseInt(id, 10);
  const types = [
    "Art", "Software", "Audio", "Video", "Patents", 
    "Posts", "Documents", "Publications", "RWA", "NFT"
  ];
  return types[numId % types.length];
}


/**
 * Retrieve data, IPFS CDI if exists
 * @param {string} id 
 * @returns {Promise<AssetType>} 
 */
async function getAssetData(id: string): Promise<AssetType> {
  const knownCids = getKnownCids()
  const ipfsCid = knownCids[id] || null
  
  // Determine the name that will be search
  const assetName = `Digital IP Asset #${id}`;
  
  // Determine the type dynamically 
  const assetType = await determineAssetType(id, ipfsCid, assetName);
  console.log(assetType);
  const mockAsset: AssetType = {
    id,
    name: assetName,
    creator: {
      name: "0xArtist",
      address: "0x1a2b3c4d5e6f7g8h9i0j",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      bio: "Digital artist specializing in abstract and futuristic designs. Creating programmable IP assets since 2023.",
      website: "https://artist-portfolio.com",
    },
    owner: {
      name: "CollectorDAO",
      address: "0x9i8h7g6f5e4d3c2b1a",
      avatar: "/background.jpg",
      verified: true,
      acquired: "February 10, 2025",
    },
    description:
      "This digital asset represents intellectual property with programmable licensing terms. The creator has established specific usage rights and royalty structures that are encoded directly into the asset.",
    image: "/placeholder.svg?height=600&width=600",
    createdAt: "March 15, 2025",
    collection: "Programmable IP",
    blockchain: "Ethereum",
    tokenStandard: "ERC-721",
    licenseType: "Creative Commons",
    licenseTerms: "CC BY-NC-SA 4.0",
    contract: "0x1234...5678",
    attributes: [
      { trait_type: "Style", value: "Abstract" },
      { trait_type: "Medium", value: "Digital" },
      { trait_type: "Colors", value: "Vibrant" },
      { trait_type: "Theme", value: "Futuristic" },
      { trait_type: "Resolution", value: "4K" },
    ],
    licenseInfo: {
      type: "Creative Commons",
      terms: "CC BY-NC-SA 4.0",
      allowCommercial: false,
      allowDerivatives: true,
      requireAttribution: true,
      royaltyPercentage: 5,
    },
    type: assetType, // change to use the new form of search IP type dynamically
  }

  if (ipfsCid) {
    mockAsset.ipfsCid = ipfsCid;
  }

  return mockAsset;
}


export default function AssetPage({ params }: AssetPageProps) {
  const { id } = params
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [asset, setAsset] = useState<AssetType | null>(null)

  const [assetOwner, setAssetOwner] = useState<AssetOwner>({
    name: "CollectorDAO",
    address: "0x9i8h7g6f5e4d3c2b1a",
    avatar: "/background.jpg",
    verified: true,
    acquired: "February 10, 2025",
  })
  const [transferHistory, setTransferHistory] = useState<TransferHistoryItem[]>([
    {
      event: "Transferred",
      from: "0xArtist",
      to: "CollectorDAO",
      date: "February 10, 2025",
      memo: "Initial acquisition",
    },
  ])

  useEffect(() => {
    async function loadAsset() {
      setIsLoading(true)
      try {
        const data = await getAssetData(id)
        setAsset(data)
        
        if (data.owner) {
          setAssetOwner(data.owner as AssetOwner)
        }
      } catch (error) {
        console.error("Error loading asset:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadAsset()
  }, [id])

  const handleTransferComplete = (newOwnerAddress: string, memo?: string) => {
    if (!asset) return;
    
    const newOwner: AssetOwner = {
      name: `0x${newOwnerAddress.substring(2, 6)}...${newOwnerAddress.substring(newOwnerAddress.length - 4)}`,
      address: newOwnerAddress,
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
      acquired: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    }

    setAssetOwner(newOwner)

    setAsset({
      ...asset,
      owner: newOwner
    })

    setTransferHistory([
      {
        event: "Transferred",
        from: asset.owner?.name || assetOwner.name,
        to: newOwner.name,
        date: newOwner.acquired,
        memo: memo || "",
      },
      ...transferHistory,
    ])
  }

  if (isLoading || !asset) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto p-4 py-8 max-w-8xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse space-y-4">
              <div className="h-12 w-48 bg-muted rounded"></div>
              <div className="h-4 w-64 bg-muted rounded"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto p-4 py-8 max-w-8xl">
        <Link href="/assets">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            View collection
          </Button>
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left column - Image */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="relative overflow-hidden rounded-xl border bg-muted/20">
                <Image
                  src={asset.image || "/placeholder.svg"}
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
                {asset.ipfsCid && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="bg-background/80">
                      IPFS
                    </Badge>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {asset.attributes && asset.attributes.map((attr, index) => (
                  <Badge key={index} variant="outline" className="bg-background">
                    {attr.trait_type}: {attr.value}
                  </Badge>
                ))}
              </div>

              {/* IP Type Info (IP Template) Component */}
              <div className="mt-6">
                <IPTypeInfo asset={asset} />
              </div>
            </div>
          </div>
          

          {/* Right column - Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{asset.name}</h1>
                  <p className="text-muted-foreground">
                    Created by <span className="font-medium text-foreground">{asset.creator.name}</span> •{" "}
                    {asset.createdAt}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                      <Badge variant="outline" className="ml-1">
                        #{asset.id}
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Twitter</DropdownMenuItem>
                    <DropdownMenuItem>Facebook</DropdownMenuItem>
                    <DropdownMenuItem>LinkedIn</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Copy Link</DropdownMenuItem>
                    {asset.ipfsCid && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <a
                            href={`https://gateway.pinata.cloud/ipfs/${asset.ipfsCid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center w-full"
                          >
                            View on IPFS
                          </a>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Button className="flex-1">License This Asset</Button>
                <Button variant="outline" className="flex-1">
                  View on Explorer
                </Button>
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
                          <h3 className="font-medium">License</h3>
                          <p className="text-sm text-muted-foreground">{asset.licenseTerms}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex items-center gap-3">
                        <DollarSign className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-medium">Royalties</h3>
                          <p className="text-sm text-muted-foreground">
                            {asset.licenseInfo.royaltyPercentage}% Creator Fee
                          </p>
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
                      {asset.ipfsCid && (
                        <div className="rounded-lg border p-3">
                          <dt className="text-sm text-muted-foreground">IPFS CID</dt>
                          <dd className="font-medium truncate" title={asset.ipfsCid}>
                            {asset.ipfsCid}
                          </dd>
                        </div>
                      )}
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
                                  owner: asset.owner.name,
                                  licenseType: asset.licenseType,
                                  licenseTerms: asset.licenseTerms,
                                  ...(asset.ipfsCid && { ipfsCid: asset.ipfsCid }),
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
                            <span>History</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 p-2">
                            {transferHistory.map((item, index) => (
                              <div key={index} className="flex items-start">
                                <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Send className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{item.event}</p>
                                  <p className="text-sm text-muted-foreground">{item.date}</p>
                                  <p className="text-sm">
                                    From {item.from} to {item.to}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <div className="flex items-start">
                              <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <PlusCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Created</p>
                                <p className="text-sm text-muted-foreground">{asset.createdAt}</p>
                                <p className="text-sm">By {asset.creator.name}</p>
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
                        <Button variant="outline" size="sm">
                          Download License
                        </Button>
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
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle>Current Owner</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => setIsTransferDialogOpen(true)}
                      >
                        <Send className="h-4 w-4" />
                        Transfer Asset
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={asset.owner?.avatar || "/placeholder.svg"} alt={asset.owner?.name || ""} />
                          <AvatarFallback>{(asset.owner?.name || "").substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{asset.owner?.name}</h3>
                            {asset.owner?.verified && <Badge variant="secondary">Verified</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">Acquired on {asset.owner?.acquired}</p>
                          <p className="text-sm font-mono truncate">{asset.owner?.address}</p>
                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                            <Button variant="outline" size="sm">
                              Message
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
                          <AvatarImage src={asset.creator?.avatar || "/placeholder.svg"} alt={asset.creator?.name || ""} />
                          <AvatarFallback>{(asset.creator?.name || "").substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{asset.creator?.name}</h3>
                            {asset.creator?.verified && <Badge variant="secondary">Verified</Badge>}
                          </div>
                          <p className="text-sm font-mono truncate mb-2">{asset.creator?.address}</p>
                          <p className="text-sm text-muted-foreground">{asset.creator?.bio}</p>

                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Creator Links</h4>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="h-8">
                                <Globe className="mr-2 h-4 w-4" />
                                Website
                              </Button>
                              <Button variant="outline" size="sm" className="h-8">
                                <Twitter className="mr-2 h-4 w-4" />
                                Twitter
                              </Button>
                              <Button variant="outline" size="sm" className="h-8">
                                <Instagram className="mr-2 h-4 w-4" />
                                Instagram
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ownership History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {transferHistory.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Send className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {item.event} to {item.to}
                              </p>
                              <p className="text-sm text-muted-foreground">{item.date}</p>
                              <p className="text-sm">From {item.from}</p>
                              {item.memo && <p className="text-sm italic mt-1 text-muted-foreground">"{item.memo}"</p>}
                            </div>
                          </div>
                        ))}
                        <div className="flex items-start">
                          <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <PlusCircle className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Created</p>
                            <p className="text-sm text-muted-foreground">{asset.createdAt}</p>
                            <p className="text-sm">By {asset.creator?.name}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Transfer Asset Dialog */}
      <TransferAssetDialog
        assetId={asset.id}
        assetName={asset.name}
        currentOwner={asset.owner?.address || ""}
        isOpen={isTransferDialogOpen}
        onClose={() => setIsTransferDialogOpen(false)}
        onTransferComplete={handleTransferComplete}
      />
    </div>
  )
}

function Code({ className, ...props }: ComponentProps<"svg">) {
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

function History({ className, ...props }: ComponentProps<"svg">) {
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

function PlusCircle({ className, ...props }: ComponentProps<"svg">) {
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

function Globe({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
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

function Twitter({ className, ...props }: ComponentProps<"svg">) {
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

function Instagram({ className, ...props }: ComponentProps<"svg">) {
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