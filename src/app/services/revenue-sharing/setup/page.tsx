import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SetupRevenueForm from "@/app/services/revenue-sharing/components/setup-revenue-form"
import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import RevenueNavigation from "@/app/services/revenue-sharing/components/revenue-navigation"


export default function SetupRevenueSharing() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Setup Revenue Sharing</h1>
          <p className="text-gray-600">
            Configure how revenue will be distributed for your intellectual property asset
          </p>
        </div>

        <RevenueNavigation />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sharing Configuration</CardTitle>
                <CardDescription>
                  Define how revenue will be distributed among fractional owners of your IP asset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SetupRevenueForm />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Important Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <p className="text-sm text-amber-800">
                    Revenue is <span className="font-bold">not automatically distributed</span>. Fractional owners must
                    manually claim their share of the revenue through the platform.
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  Once you set up revenue sharing, your IP asset will be tokenized on Starknet blockchain, allowing
                  fractional ownership and revenue distribution according to the shares you define.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-emerald-600" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Revenue Generation</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600 mb-2">
                        Your IP asset generates revenue from various sources such as:
                      </p>
                      <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                        <li>NFT marketplace sales</li>
                        <li>Licensing fees</li>
                        <li>Streaming royalties</li>
                        <li>API usage fees</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>Revenue Allocation</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600">
                        Revenue is allocated to fractional owners based on their ownership percentage. The smart
                        contract holds the funds until they are claimed by the respective owners.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Claiming Process</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600">
                        Owners receive notifications when new revenue is available. They must visit the platform and
                        manually claim their share. Unclaimed revenue may expire after the claim period you set.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>Smart Contract Security</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600">
                        All revenue sharing is managed by audited smart contracts on Starknet, ensuring transparency,
                        security, and immutability of the revenue distribution process.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <span className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Transparent Distribution</span> - All revenue
                      allocations are recorded on the blockchain
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <span className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Flexible Ownership</span> - Easily adjust ownership
                      percentages and add new recipients
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <span className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Multiple Revenue Sources</span> - Collect and
                      distribute revenue from various channels
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <span className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Low Gas Fees</span> - Benefit from Starknet's
                      high-speed, low-cost transactions
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
