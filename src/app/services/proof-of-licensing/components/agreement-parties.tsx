import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Agreement } from "@/types/agreement"
import { CheckCircle, Clock } from "lucide-react"

interface AgreementPartiesProps {
  agreement: Agreement
}

export function AgreementParties({ agreement }: AgreementPartiesProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agreement Parties</CardTitle>
          <CardDescription>Parties involved in this licensing agreement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {agreement.parties.map((party) => {
              const hasSigned = agreement.signatures.some(
                (sig) => sig.walletAddress.toLowerCase() === party.walletAddress.toLowerCase(),
              )

              return (
                <div
                  key={party.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{party.name}</h3>
                      <Badge variant="outline" className="capitalize">
                        {party.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">{party.walletAddress}</p>
                    {party.email && <p className="text-sm text-muted-foreground mt-1">{party.email}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {hasSigned ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium">Signed</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-5 w-5 text-amber-500" />
                        <span className="text-sm font-medium">Awaiting Signature</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Signatures</CardTitle>
          <CardDescription>Cryptographic signatures for this agreement</CardDescription>
        </CardHeader>
        <CardContent>
          {agreement.signatures.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-muted/50">
              <p className="text-muted-foreground">No signatures collected yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {agreement.signatures.map((signature) => (
                <div key={signature.id} className="p-4 border rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-medium">{signature.name}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{signature.walletAddress}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Signed on {new Date(signature.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Signature Hash</h4>
                    <p className="text-xs font-mono break-all bg-muted p-2 rounded">{signature.signatureHash}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

