import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Agreement, Party, Signature } from "@/types/agreement"


interface AgreementDetailsProps {
  agreement: Agreement;
  description: string;
  status: string;
  createdAt: string | null
  parties: Party[];
  signatures: Signature[];
}

export function AgreementDetails({ agreement, description, parties, createdAt, status, signatures }: AgreementDetailsProps) {
    
    const getPartyNameByAddress = (walletAddress: string): string => {
      console.log("parties", parties)
      const party = parties.find(
        (p) => p.walletAddress == walletAddress,
      );
      return party?.name || walletAddress;
    };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agreement Description</CardTitle>
          <CardDescription>Overview and purpose of this licensing agreement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agreement Timeline</CardTitle>
          <CardDescription>Key events and milestones for this agreement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mr-4 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                1
              </div>
              <div>
                <h4 className="font-medium">Created</h4>
                <p className="text-sm text-muted-foreground">{new Date(createdAt).toLocaleString()}</p>
              </div>
            </div>

            {status !== "draft" && signatures.map((signature, index) => (
              <div key={signature.walletAddress} className="flex items-start">
                <div className="mr-4 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {index + 2}
                </div>
                <div>
                  <h4 className="font-medium">Signed by {getPartyNameByAddress(signature.walletAddress)}</h4>
                  <p className="text-sm text-muted-foreground">{new Date(Number(signature.timestamp)*1000).toLocaleString()}</p>
                </div>
              </div>
            ))}

            {status === "completed" && (
              <div className="flex items-start">
                <div className="mr-4 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  ✓
                </div>
                <div>
                  <h4 className="font-medium">Agreement Finalized</h4>
                  <p className="text-sm text-muted-foreground">{new Date(agreement.completedAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blockchain Information</CardTitle>
          <CardDescription>On-chain details for this agreement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Agreement ID</h4>
                <p className="font-mono text-sm break-all">{agreement.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Created By</h4>
                <p className="font-mono text-sm break-all">{agreement.createdBy}</p>
              </div>
            </div>

            {agreement.status === "completed" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Transaction Hash</h4>
                  <p className="font-mono text-sm break-all">{agreement.transactionHash}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Block Number</h4>
                  <p className="font-mono text-sm">{agreement.blockNumber}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

