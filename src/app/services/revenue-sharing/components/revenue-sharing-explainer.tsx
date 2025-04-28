import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle } from "lucide-react"

export default function RevenueSharingExplainer() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>How Revenue Sharing Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Mediolano's revenue sharing system uses Starknet's smart contracts to distribute revenue to all fractional
            owners of an IP asset through a manual claiming process.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800">Manual Claiming Required</h4>
                <p className="text-sm text-amber-700">
                  Revenue is not automatically distributed. Fractional owners must manually claim their share of the
                  revenue through the platform.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Transparent Allocation</h4>
                <p className="text-sm text-gray-600">
                  Revenue is allocated according to ownership percentages and held in smart contracts until claimed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Blockchain Verification</h4>
                <p className="text-sm text-gray-600">
                  All revenue allocations and claims are recorded on the blockchain for transparency.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Multiple Revenue Sources</h4>
                <p className="text-sm text-gray-600">Collect revenue from marketplace sales, licensing, and more.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Claiming Process</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-gray-600 list-decimal pl-5">
            <li>
              <span className="font-medium">Revenue Generation:</span> Your IP asset generates revenue from various
              sources
            </li>
            <li>
              <span className="font-medium">Smart Contract Allocation:</span> Revenue is allocated to fractional owners
              based on their ownership percentage
            </li>
            <li>
              <span className="font-medium">Notification:</span> Owners receive notifications when new revenue is
              available to claim
            </li>
            <li>
              <span className="font-medium">Manual Claiming:</span> Owners must visit the platform to claim their share
              of the revenue
            </li>
            <li>
              <span className="font-medium">Blockchain Transfer:</span> Upon claiming, funds are transferred to the
              owner's wallet
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
              <span>NFT Marketplace Sales</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
              <span>Licensing Fees</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
              <span>Streaming Royalties</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
              <span>API Usage Fees</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
              <span>Adaptation Rights</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
