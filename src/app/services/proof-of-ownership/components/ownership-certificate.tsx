import Image from "next/image"
import { Shield, CheckCircle2 } from "lucide-react"
import type { Asset } from "@/app/services/proof-of-ownership/lib/types"

interface OwnershipCertificateProps {
  asset: Asset
}

export default function OwnershipCertificate({ asset }: OwnershipCertificateProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Certificate Header */}
      <div className="bg-primary/10 p-4 text-center border-b">
        <div className="flex justify-center mb-2">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-bold text-lg">Certificate of Ownership</h3>
        <p className="text-xs text-muted-foreground">Mediolano Blockchain Verification</p>
      </div>

      {/* Certificate Content */}
      <div className="p-4 space-y-4">
        {/* Asset Preview */}
        <div className="aspect-square relative bg-muted rounded-md overflow-hidden mb-2">
          {asset.type === "artwork" || asset.type === "video" ? (
            <Image src={asset.thumbnailUrl || "/placeholder.svg"} alt={asset.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-primary/30"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Asset Details */}
        <div className="space-y-2 text-center">
          <h4 className="font-medium text-sm">{asset.title}</h4>
          <p className="text-xs text-muted-foreground">
            {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} • {asset.fileType}
          </p>
        </div>

        {/* Verification Details */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Registration Date:</span>
            <span className="font-medium">{asset.registrationDate}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Owner:</span>
            <span className="font-medium">{asset.owner.name}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Asset ID:</span>
            <span className="font-mono">{asset.id}</span>
          </div>
        </div>

        {/* Verification Stamp */}
        <div className="flex items-center justify-center gap-2 p-2 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-xs font-medium text-green-600 dark:text-green-400">Blockchain Verified</span>
        </div>

        {/* QR Code Placeholder */}
        <div className="flex justify-center pt-2">
          <div className="h-24 w-24 bg-muted rounded-md flex items-center justify-center">
            <p className="text-xs text-muted-foreground">QR Code</p>
          </div>
        </div>
      </div>
    </div>
  )
}
