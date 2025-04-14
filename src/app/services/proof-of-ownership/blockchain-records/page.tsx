import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, ExternalLink, Copy, Filter, Download, Shield } from "lucide-react"
import Link from "next/link"
import { getAllAssets } from "@/app/services/proof-of-ownership/lib/mock-data"

export default function BlockchainRecordsPage() {
  const assets = getAllAssets()

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blockchain Records</h1>
          <p className="text-muted-foreground">View and verify your intellectual property blockchain records</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search records..." className="pl-8 w-[200px] md:w-[300px]" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Blockchain Verification Records</CardTitle>
          <CardDescription>
            Complete record of all your intellectual property registrations on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Transaction Hash</TableHead>
                  <TableHead>Block Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.slice(0, 10).map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>{asset.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{asset.registrationDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs truncate max-w-[100px]">
                          {asset.transactionHash.substring(0, 10)}...
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{asset.blockNumber}</TableCell>
                    <TableCell>
                      <Badge
                        variant={asset.id.includes("5") ? "outline" : "default"}
                        className={
                          asset.id.includes("5")
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                            : ""
                        }
                      >
                        {asset.id.includes("5") ? "Pending" : "Verified"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/assets/${asset.id}`}>View</a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://explorer.starknet.io/tx/${asset.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-1 h-3 w-3" /> Explorer
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Verification</CardTitle>
            <CardDescription>How our proof of ownership system works</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              When you register an asset on Mediolano, we create a secure hash of your work and record it on the
              Starknet blockchain, which is then settled on Ethereum for maximum security.
            </p>
            <div className="space-y-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Asset Hashing</h3>
                  <p className="text-sm text-muted-foreground">
                    Your asset is securely hashed using SHA-256, creating a unique digital fingerprint
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Blockchain Registration</h3>
                  <p className="text-sm text-muted-foreground">
                    The hash is recorded on Starknet with a timestamp and your ownership information
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Ethereum Settlement</h3>
                  <p className="text-sm text-muted-foreground">
                    The record is settled on Ethereum L1 for maximum security and immutability
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">4</span>
                </div>
                <div>
                  <h3 className="font-medium">Certificate Generation</h3>
                  <p className="text-sm text-muted-foreground">
                    A verifiable certificate is generated with all blockchain details for your records
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legal Protection</CardTitle>
            <CardDescription>How blockchain records protect your intellectual property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Blockchain records provide strong evidence of ownership and creation date, which is crucial for
              intellectual property protection under The Berne Convention.
            </p>
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-medium">Immutable Timestamp</h3>
                <p className="text-sm text-muted-foreground">
                  The blockchain timestamp provides indisputable proof of when your work was registered, establishing
                  priority in case of disputes
                </p>
              </div>
              <div>
                <h3 className="font-medium">Global Recognition</h3>
                <p className="text-sm text-muted-foreground">
                  Blockchain records are increasingly recognized by courts and intellectual property offices worldwide
                </p>
              </div>
              <div>
                <h3 className="font-medium">Evidence in Disputes</h3>
                <p className="text-sm text-muted-foreground">
                  In case of copyright infringement, your blockchain record serves as strong evidence of your ownership
                  rights
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full" asChild>
                <Link href="/legal-protection">Learn More About Legal Protection</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
