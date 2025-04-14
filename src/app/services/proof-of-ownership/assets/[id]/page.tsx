import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Share2, FileText, Shield, Clock, Globe, CheckCircle2, LinkIcon, ExternalLink } from "lucide-react"
import { getAssetById } from "@/app/services/proof-of-ownership/lib/mock-data"
import LicenseOptions from "@/app/services/proof-of-ownership/components/license-options"
import OwnershipCertificate from "@/app/services/proof-of-ownership/components/ownership-certificate"
import BlockchainVerification from "@/app/services/proof-of-ownership/components/blockchain-verification"
import NewLicensingForm from "@/app/services/proof-of-ownership/components/new-licensing-form"

interface AssetPageProps {
  params: {
    id: string
  }
}

export default function AssetPage({ params }: AssetPageProps) {
  const asset = getAssetById(params.id)

  if (!asset) {
    notFound()
  }

  return (
    <div className="container py-10">
      {/* Proof of Ownership Banner - NEW PROMINENT SECTION */}
      <Card className="mb-8 border-primary/30 bg-primary/5 dark:bg-primary/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Verified Proof of Ownership</h2>
              <p className="text-muted-foreground">
                This intellectual property is protected in 181 countries under The Berne Convention. Immutable
                blockchain record created on {asset.registrationDate}.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button className="gap-2">
                <Download className="h-4 w-4" /> Download Certificate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-muted rounded-lg overflow-hidden mb-6">
            {asset.type === "artwork" && (
              <div className="relative aspect-video">
                <Image
                  src={asset.thumbnailUrl || "/placeholder.svg"}
                  alt={asset.title}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            {asset.type === "music" && (
              <div className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/30"></div>
                  </div>
                </div>
                <audio controls className="w-full max-w-md mt-4">
                  <source src="#" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            {asset.type === "video" && (
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <div className="text-white">Video preview placeholder</div>
              </div>
            )}
            {(asset.type === "literature" || asset.type === "software" || asset.type === "ai-model") && (
              <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
                <FileText className="h-16 w-16 mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Preview not available for this asset type</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{asset.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</Badge>
                <p className="text-sm text-muted-foreground">Registered on {asset.registrationDate}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Blockchain Verification Card - NEW SECTION */}
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary" />
                Blockchain Verification
              </CardTitle>
              <CardDescription>This asset's ownership is verified and secured on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <BlockchainVerification asset={asset} />
            </CardContent>
          </Card>

          <Tabs defaultValue="ownership">
            <TabsList className="mb-4">
              <TabsTrigger value="ownership">Ownership</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="licensing">Licensing</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            {/* Ownership tab is now first */}
            <TabsContent value="ownership">
              <Card>
                <CardHeader>
                  <CardTitle>Ownership Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <Shield className="h-10 w-10 text-primary" />
                      <div>
                        <h3 className="font-medium">Legal Protection</h3>
                        <p className="text-sm text-muted-foreground">
                          This asset is protected under The Berne Convention for the Protection of Literary and Artistic
                          Works, providing automatic copyright protection in 181 countries without requiring
                          registration.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <Clock className="h-5 w-5 mb-2 text-primary" />
                        <h3 className="font-medium">Protection Period</h3>
                        <p className="text-sm text-muted-foreground">70 years after publication</p>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <Globe className="h-5 w-5 mb-2 text-primary" />
                        <h3 className="font-medium">Jurisdiction</h3>
                        <p className="text-sm text-muted-foreground">181 countries worldwide</p>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <CheckCircle2 className="h-5 w-5 mb-2 text-primary" />
                        <h3 className="font-medium">Verification Status</h3>
                        <p className="text-sm text-muted-foreground">Verified & Active</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Owner Information</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 border rounded-lg">
                        <div className="flex-grow">
                          <p className="font-medium">{asset.owner.name}</p>
                          <p className="text-sm font-mono text-muted-foreground">{asset.owner.walletAddress}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Verify Owner
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">{asset.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <h3 className="font-medium mb-2">Metadata</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Asset ID</span>
                          <span className="font-mono text-sm">{asset.id}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Creation Date</span>
                          <span>{asset.creationDate}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">File Type</span>
                          <span>{asset.fileType}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">File Size</span>
                          <span>{asset.fileSize}</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Blockchain Information</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Transaction Hash</span>
                          <span className="font-mono text-sm truncate max-w-[200px]">{asset.transactionHash}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Block Number</span>
                          <span>{asset.blockNumber}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Network</span>
                          <span>Starknet</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="licensing">
              <Card>
                <CardHeader>
                  <CardTitle>Licensing Options</CardTitle>
                  <CardDescription>Available licensing options for this asset</CardDescription>
                </CardHeader>
                <CardContent>
                  <LicenseOptions assetId={asset.id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Asset History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {asset.history.map((event, index) => (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                        <div>
                          <p className="font-medium">{event.action}</p>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                          {event.details && <p className="text-sm mt-1">{event.details}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* New Licensing Form - ADDED SECTION */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Create New License</h2>
            <NewLicensingForm asset={asset} />
          </div>
        </div>

        <div>
          {/* Certificate Preview Card - ENHANCED */}
          <Card className="sticky top-20">
            <CardHeader className="text-center pb-2">
              <CardTitle>Proof of Ownership Certificate</CardTitle>
              <CardDescription>Official blockchain verification</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <OwnershipCertificate asset={asset} />
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download Certificate
              </Button>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" /> Verify on Blockchain
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
