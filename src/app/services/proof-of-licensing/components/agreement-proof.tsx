"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Agreement } from "@/types/agreement"
import { Download, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AgreementProofProps {
  agreement: Agreement
}

export function AgreementProof({ agreement }: AgreementProofProps) {
  const { toast } = useToast()

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    toast({
      title: "Download Started",
      description: "Your proof of licensing document is being generated.",
    })
  }

  const handleViewOnExplorer = () => {
    // In a real implementation, this would open the blockchain explorer
    window.open(`https://starkscan.co/tx/${agreement.transactionHash}`, "_blank")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Proof of Licensing</CardTitle>
          <CardDescription>Blockchain-verified proof of this licensing agreement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border rounded-lg bg-muted/30 text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M8 12L11 15L16 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Verified License</h3>
              <p className="text-muted-foreground">
                This licensing agreement has been cryptographically verified and recorded on the Starknet blockchain.
              </p>
            </div>

            <div className="grid gap-4 max-w-md mx-auto">
              <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
                <div className="font-medium text-right">Agreement ID:</div>
                <div className="font-mono text-left truncate">{agreement.id}</div>

                <div className="font-medium text-right">Transaction Hash:</div>
                <div className="font-mono text-left truncate">{agreement.transactionHash}</div>

                <div className="font-medium text-right">Block Number:</div>
                <div className="font-mono text-left">{agreement.blockNumber}</div>

                <div className="font-medium text-right">Timestamp:</div>
                <div className="text-left">{new Date(agreement.completedAt).toLocaleString()}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Proof
              </Button>
              <Button variant="outline" onClick={handleViewOnExplorer}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Explorer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification QR Code</CardTitle>
          <CardDescription>Scan to verify this license on the blockchain</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="p-4 bg-white rounded-lg">
            <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Simple QR code representation */}
              <rect x="10" y="10" width="80" height="80" fill="white" />
              <rect x="20" y="20" width="20" height="20" fill="black" />
              <rect x="60" y="20" width="20" height="20" fill="black" />
              <rect x="20" y="60" width="20" height="20" fill="black" />
              <rect x="45" y="45" width="10" height="10" fill="black" />
              <rect x="60" y="60" width="5" height="5" fill="black" />
              <rect x="70" y="60" width="10" height="5" fill="black" />
              <rect x="60" y="70" width="5" height="10" fill="black" />
              <rect x="70" y="70" width="5" height="5" fill="black" />
              <rect x="80" y="70" width="5" height="5" fill="black" />
              <rect x="70" y="80" width="10" height="5" fill="black" />
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

