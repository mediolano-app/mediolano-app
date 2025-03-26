"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAgreements } from "@/hooks/use-agreements"
import { formatDate } from "@/lib/utils"
import { FileText, Users, Clock } from "lucide-react"

export function RecentAgreements() {
  const { agreements } = useAgreements({ limit: 3 })

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {agreements.map((agreement) => (
        <Card key={agreement.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="line-clamp-1">{agreement.title}</CardTitle>
              <AgreementStatusBadge status={agreement.status} />
            </div>
            <CardDescription>Created {formatDate(agreement.createdAt)}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{agreement.type}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{agreement.parties.length} Parties</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {agreement.signatures.length}/{agreement.parties.length} Signatures
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/agreements/${agreement.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function AgreementStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "draft":
      return <Badge variant="outline">Draft</Badge>
    case "pending":
      return <Badge variant="secondary">Pending Signatures</Badge>
    case "completed":
      return (
        <Badge variant="default" className="bg-green-500">
          Completed
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

