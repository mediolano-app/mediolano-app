"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePublicAgreements } from "@/hooks/use-public-agreements"
import { formatDate } from "@/lib/utils"
import { Search, Filter, ExternalLink } from "lucide-react"

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { agreements, isLoading } = usePublicAgreements()

  const filteredAgreements = agreements.filter(
    (agreement) =>
      agreement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agreement.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Public Directory</h1>
        <p className="text-muted-foreground mt-1">Browse publicly available licensing agreements and their proofs</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search agreements..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredAgreements.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">No agreements found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgreements.map((agreement) => (
            <Card key={agreement.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1">{agreement.title}</CardTitle>
                  <Badge className="bg-green-500">Verified</Badge>
                </div>
                <CardDescription>
                  {agreement.type} • Completed {formatDate(agreement.completedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{agreement.description}</p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Parties:</span> {agreement.parties.length}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Transaction:</span>{" "}
                    <span className="font-mono text-xs truncate">
                      {agreement.transactionHash.slice(0, 10)}...{agreement.transactionHash.slice(-8)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link href={`/services/proof-of-licensing/agreements/${agreement.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(`https://starkscan.co/tx/${agreement.transactionHash}`, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

