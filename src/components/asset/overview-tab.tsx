import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileCheck, Box, Code, History, PlusCircle } from "lucide-react"

interface OverviewTabProps {
  asset: {
    description: string
    licenseTerms: string
    collection: string
    blockchain: string
    tokenStandard: string
    contract: string
    name: string
    image: string
    attributes: Array<{ trait_type: string; value: string }>
    id: string
    author: {
      name: string
    }
    licenseType: string
  }
  tokenOwnerAddress?: string
}

export function OverviewTab({ asset, tokenOwnerAddress }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-muted-foreground">{asset.description}</p>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <FileCheck className="h-8 w-8 text-primary" />
            <div>
              <h3 className="text-sm">License</h3>
              <p className="text-lg text-muted-foreground">{asset.licenseTerms}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Box className="h-8 w-8 text-primary" />
            <div>
              <h3 className="text-sm">IP Version</h3>
              <p className="text-lg text-muted-foreground">1</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Asset Information</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <dt className="text-sm text-muted-foreground">Collection</dt>
            <dd className="font-medium">{asset.collection}</dd>
          </div>
          <div className="rounded-lg border p-3">
            <dt className="text-sm text-muted-foreground">Blockchain</dt>
            <dd className="font-medium">{asset.blockchain}</dd>
          </div>
          <div className="rounded-lg border p-3">
            <dt className="text-sm text-muted-foreground">Token Standard</dt>
            <dd className="font-medium">{asset.tokenStandard}</dd>
          </div>
          <div className="rounded-lg border p-3">
            <dt className="text-sm text-muted-foreground">Contract</dt>
            <dd className="font-medium truncate" title={asset.contract}>
              {asset.contract}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="metadata">
            <AccordionTrigger className="py-4">
              <div className="flex items-center">
                <Code className="mr-2 h-4 w-4" />
                <span>Metadata</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <pre className="text-sm">
                  {JSON.stringify(
                    {
                      name: asset.name,
                      description: asset.description,
                      image: asset.image,
                      attributes: asset.attributes,
                      tokenId: asset.id,
                      author: asset.author.name,
                      licenseType: asset.licenseType,
                      licenseTerms: asset.licenseTerms,
                    },
                    null,
                    2,
                  )}
                </pre>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="history">
            <AccordionTrigger className="py-4">
              <div className="flex items-center">
                <History className="mr-2 h-4 w-4" />
                <span>History (Preview)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-2">
                <div className="flex items-start">
                  <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">License Updated</p>
                    <p className="text-sm">{tokenOwnerAddress?.slice(0,20)} updated</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <PlusCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-sm">{tokenOwnerAddress?.slice(0,20)} minted this asset</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
} 