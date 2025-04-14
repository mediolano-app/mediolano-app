import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Download, ExternalLink, Shield, Clock, CheckCircle2, QrCode } from "lucide-react"
import Link from "next/link"
import { getAllAssets } from "@/app/services/proof-of-ownership/lib/mock-data"
import Image from "next/image"

export default function CertificatesPage() {
  const assets = getAllAssets()

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ownership Certificates</h1>
          <p className="text-muted-foreground">Download and share proof of ownership certificates for your assets</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search certificates..." className="pl-8 w-[200px] md:w-[300px]" />
          </div>
          <Button variant="outline">
            <QrCode className="mr-2 h-4 w-4" /> Batch Generate
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Certificates</TabsTrigger>
          <TabsTrigger value="recent">Recently Generated</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.slice(0, 9).map((asset, index) => (
              <Card key={asset.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge
                      variant={asset.type === "artwork" ? "default" : asset.type === "music" ? "secondary" : "outline"}
                      className="mb-2"
                    >
                      {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">Verified</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{asset.title}</CardTitle>
                  <CardDescription>Certificate ID: CERT-{asset.id.toUpperCase()}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="aspect-[4/3] relative bg-muted rounded-md overflow-hidden mb-4">
                    {asset.type === "artwork" || asset.type === "video" ? (
                      <Image
                        src={asset.thumbnailUrl || "/placeholder.svg"}
                        alt={asset.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Shield className="h-16 w-16 text-primary/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-white" />
                          <span className="text-xs text-white">Registered: {asset.registrationDate}</span>
                        </div>
                        <div className="h-10 w-10 bg-white/90 rounded-md flex items-center justify-center">
                          <QrCode className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Owner:</span>
                      <span className="font-medium">{asset.owner.name}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Transaction Hash:</span>
                      <span className="font-mono truncate max-w-[150px]">
                        {asset.transactionHash.substring(0, 10)}...
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-3 w-3" /> Certificate
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-1 h-3 w-3" /> Verify
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.slice(0, 3).map((asset) => (
              <Card key={asset.id} className="overflow-hidden">
                {/* Similar content as above, but with only recent certificates */}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="default" className="mb-2">
                      {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">Verified</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{asset.title}</CardTitle>
                  <CardDescription>Generated: Today</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="aspect-[4/3] relative bg-muted rounded-md overflow-hidden mb-4">
                    <Image
                      src={asset.thumbnailUrl || "/placeholder.svg"}
                      alt={asset.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-white" />
                          <span className="text-xs text-white">Registered: {asset.registrationDate}</span>
                        </div>
                        <div className="h-10 w-10 bg-white/90 rounded-md flex items-center justify-center">
                          <QrCode className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-3 w-3" /> Certificate
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-1 h-3 w-3" /> Verify
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="shared">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.slice(3, 6).map((asset) => (
              <Card key={asset.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="mb-2">
                      {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Shared</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{asset.title}</CardTitle>
                  <CardDescription>Shared with: 3 recipients</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="aspect-[4/3] relative bg-muted rounded-md overflow-hidden mb-4">
                    <Image
                      src={asset.thumbnailUrl || "/placeholder.svg"}
                      alt={asset.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-white" />
                          <span className="text-xs text-white">Shared: 3 days ago</span>
                        </div>
                        <div className="h-10 w-10 bg-white/90 rounded-md flex items-center justify-center">
                          <QrCode className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-3 w-3" /> Certificate
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-1 h-3 w-3" /> Verify
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="expiring">
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No expiring certificates found.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Ownership certificates are valid for the entire protection period (70 years after publication).
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Certificate Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>About Ownership Certificates</CardTitle>
              <CardDescription>Understanding your proof of ownership documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Ownership certificates are blockchain-verified documents that prove you are the rightful owner of your
                intellectual property. Each certificate contains:
              </p>
              <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                <li>Unique certificate ID linked to the blockchain</li>
                <li>Asset details and registration timestamp</li>
                <li>Blockchain transaction hash for verification</li>
                <li>QR code for quick verification by third parties</li>
                <li>Legal protection information under The Berne Convention</li>
              </ul>
              <p className="text-muted-foreground">
                These certificates can be shared with clients, collaborators, or presented as evidence in legal
                proceedings to prove your ownership rights.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/certificate-guide">
                  <Shield className="mr-2 h-4 w-4" /> Learn More About Certificates
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certificate Verification</CardTitle>
              <CardDescription>How others can verify your ownership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Anyone can verify the authenticity of your ownership certificates through our public verification
                portal. Verification can be done in three ways:
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">QR Code Scan</h3>
                    <p className="text-sm text-muted-foreground">
                      Scan the QR code on the certificate for instant verification
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Certificate ID</h3>
                    <p className="text-sm text-muted-foreground">Enter the certificate ID on our verification portal</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Blockchain Check</h3>
                    <p className="text-sm text-muted-foreground">
                      Verify directly on the blockchain using the transaction hash
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/verify">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Go to Verification Portal
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
