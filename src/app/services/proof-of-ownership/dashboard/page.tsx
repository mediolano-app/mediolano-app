import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, ExternalLink, Shield, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import AssetGrid from "@/app/services/proof-of-ownership/components/asset-grid"
import { getUserAssets } from "@/app/services/proof-of-ownership/lib/mock-data"
import OwnershipStats from "@/app/services/proof-of-ownership/components/ownership-stats"

export default function DashboardPage() {
  // In a real app, you would fetch this data from an API
  const assets = getUserAssets()

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ownership Dashboard</h1>
          <p className="text-muted-foreground">Manage your verified intellectual property assets</p>
        </div>
        <Button asChild>
          <Link href="/register">
            <Plus className="mr-2 h-4 w-4" /> Register New Asset
          </Link>
        </Button>
      </div>

      {/* Ownership Verification Banner */}
      <Card className="mb-8 border-primary/30 bg-primary/5 dark:bg-primary/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Proof of Ownership Service</h2>
              <p className="text-muted-foreground">
                Your intellectual property is protected in 181 countries under The Berne Convention with blockchain
                verification. Download certificates or verify ownership anytime.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button className="gap-2" asChild>
                <Link href="/verify">
                  <CheckCircle2 className="h-4 w-4" /> Verify Ownership
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <OwnershipStats />

      {/* Ownership Certificates Section */}
      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Ownership Certificates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assets.slice(0, 3).map((asset) => (
            <Card key={asset.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge
                    variant={asset.id === "asset1" ? "default" : asset.id === "asset2" ? "secondary" : "outline"}
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
                <CardDescription>Registered on {asset.registrationDate}</CardDescription>
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
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-white" />
                      <span className="text-xs text-white">70 years protection</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Transaction Hash:</span>
                    <span className="font-mono truncate max-w-[150px]">
                      {asset.transactionHash.substring(0, 10)}...
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Block Number:</span>
                    <span className="font-mono">{asset.blockNumber}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/assets/${asset.id}`}>
                    <Shield className="mr-1 h-3 w-3" /> View Proof
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-3 w-3" /> Certificate
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline" asChild>
            <Link href="/certificates">View All Certificates</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          </TabsList>
          <div className="mt-2 sm:mt-0">
            <Button variant="outline" size="sm" asChild>
              <Link href="/blockchain-records">
                <ExternalLink className="mr-2 h-4 w-4" /> View Blockchain Records
              </Link>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <AssetGrid assets={assets} showVerificationStatus={true} />
        </TabsContent>
        <TabsContent value="verified">
          <AssetGrid assets={assets.filter((_, index) => index % 3 !== 2)} showVerificationStatus={true} />
        </TabsContent>
        <TabsContent value="pending">
          <AssetGrid assets={assets.filter((_, index) => index % 3 === 2)} showVerificationStatus={true} />
        </TabsContent>
        <TabsContent value="expiring">
          <AssetGrid assets={assets.filter((_, index) => index % 5 === 0)} showVerificationStatus={true} />
        </TabsContent>
      </Tabs>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Verification Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Activity</CardTitle>
            <CardDescription>Recent ownership verification events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Digital Mona Lisa",
                  event: "Ownership Verified",
                  date: "2 days ago",
                  verifier: "External User",
                },
                {
                  title: "Blockchain Symphony",
                  event: "Certificate Downloaded",
                  date: "1 week ago",
                  verifier: "You",
                },
                {
                  title: "Code Repository Alpha",
                  event: "Blockchain Verification",
                  date: "2 weeks ago",
                  verifier: "Starknet Explorer",
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.event}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{activity.verifier}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ownership Protection Status */}
        <Card>
          <CardHeader>
            <CardTitle>Ownership Protection Status</CardTitle>
            <CardDescription>Current status of your intellectual property protection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-400">10 Assets Fully Protected</p>
                  <p className="text-sm text-green-700 dark:text-green-500">
                    These assets have complete blockchain verification and legal protection
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-400">2 Assets Pending Verification</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-500">
                    These assets are awaiting final blockchain confirmation
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Protection Coverage</h4>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "83%" }}></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">10/12 Assets</span>
                  <span className="text-xs font-medium">83% Protected</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/protection-status">
                <Shield className="mr-2 h-4 w-4" /> View Detailed Protection Status
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
