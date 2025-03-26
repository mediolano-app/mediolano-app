"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgreementDetails } from "@/app/services/proof-of-licensing/components/agreement-details"
import { AgreementParties } from "@/app/services/proof-of-licensing/components/agreement-parties"
import { AgreementTerms } from "@/app/services/proof-of-licensing/components/agreement-terms"
import { AgreementProof } from "@/app/services/proof-of-licensing/components/agreement-proof"
import { useAgreement } from "@/hooks/use-agreement"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Share2 } from "lucide-react"

// Mock user data for the current user
const MOCK_USER = {
  name: "Demo User",
  walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
}

export default function AgreementPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { agreement, isLoading, signAgreement, finalizeAgreement } = useAgreement(params.id as string)

  const canSign = agreement?.parties.some(
    (party) =>
      party.walletAddress.toLowerCase() === MOCK_USER.walletAddress.toLowerCase() &&
      !agreement.signatures.some((sig) => sig.walletAddress.toLowerCase() === MOCK_USER.walletAddress.toLowerCase()),
  )

  const canFinalize =
    agreement?.status === "pending" &&
    agreement.signatures.length === agreement.parties.length &&
    agreement.createdBy.toLowerCase() === MOCK_USER.walletAddress.toLowerCase()

  const handleSign = async () => {
    try {
      await signAgreement()
      toast({
        title: "Agreement Signed",
        description: "You have successfully signed this agreement.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign agreement. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFinalize = async () => {
    try {
      await finalizeAgreement()
      toast({
        title: "Agreement Finalized",
        description: "The agreement has been finalized and proof of licensing has been generated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to finalize agreement. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied",
      description: "Agreement link copied to clipboard.",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!agreement) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Agreement Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The agreement you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button onClick={() => router.push("/agreements")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Agreements
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/agreements")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{agreement.title}</h1>
              <AgreementStatusBadge status={agreement.status} />
            </div>
            <p className="text-muted-foreground mt-1">
              {agreement.type} • Created on {new Date(agreement.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          {canSign && <Button onClick={handleSign}>Sign Agreement</Button>}
          {canFinalize && <Button onClick={handleFinalize}>Finalize Agreement</Button>}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="parties">Parties</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
          {agreement.status === "completed" && <TabsTrigger value="proof">Proof of Licensing</TabsTrigger>}
        </TabsList>

        <TabsContent value="details">
          <AgreementDetails agreement={agreement} />
        </TabsContent>

        <TabsContent value="parties">
          <AgreementParties agreement={agreement} />
        </TabsContent>

        <TabsContent value="terms">
          <AgreementTerms agreement={agreement} />
        </TabsContent>

        {agreement.status === "completed" && (
          <TabsContent value="proof">
            <AgreementProof agreement={agreement} />
          </TabsContent>
        )}
      </Tabs>
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

