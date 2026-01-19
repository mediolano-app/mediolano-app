import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileCheck, Box, Code, History, PlusCircle } from "lucide-react"
import { AssetDetail, DisplayAsset } from "@/hooks/use-asset"

interface OverviewTabProps {
  asset: AssetDetail | DisplayAsset
}

export function OverviewTab({ asset }: OverviewTabProps) {
  const isDisplayAsset = (asset: AssetDetail | DisplayAsset): asset is DisplayAsset => {
    return 'licenseTerms' in asset;
  };

  // Get display values based on asset type
  const getDisplayValues = () => {
    if (isDisplayAsset(asset)) {
      return {
        name: asset.name,
        description: asset.description,
        image: asset.image,
        attributes: asset.attributes,
        id: asset.id,
        licenseTerms: asset.licenseTerms,
        collection: asset.collection,
        blockchain: asset.blockchain,
        tokenStandard: asset.tokenStandard,
        contract: asset.contract,
        author: asset.author,
        licenseType: asset.licenseType,
        owner: asset.owner.address,
        version: asset.version,
      };
    }
    return {
      name: asset.name,
      description: asset.description || "",
      image: asset.image || "/placeholder.svg",
      attributes: asset.attributes || [],
      id: asset.id,
      licenseTerms: "Not specified",
      collection: asset.collectionName || "Not specified",
      blockchain: "Starknet",
      tokenStandard: "ERC-721",
      contract: asset.nftAddress,
      author: { name: asset.owner || "Unknown" },
      licenseType: "Not specified",
      owner: asset.owner || "Unknown",
      version: "1.0",
    };
  };

  const displayValues = getDisplayValues();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-muted-foreground">{displayValues.description}</p>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <FileCheck className="h-8 w-8 text-primary" />
            <div>
              <h3 className="text-sm">License</h3>
              <p className="text-lg capitalize text-muted-foreground">{displayValues.licenseTerms}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Box className="h-8 w-8 text-primary" />
            <div>
              <h3 className="text-sm">IP Version</h3>
              <p className="text-lg text-muted-foreground">{displayValues.version}</p>
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
            <dd className="font-medium">{displayValues.collection}</dd>
          </div>
          <div className="rounded-lg border p-3">
            <dt className="text-sm text-muted-foreground">Blockchain</dt>
            <dd className="font-medium">{displayValues.blockchain}</dd>
          </div>
          <div className="rounded-lg border p-3">
            <dt className="text-sm text-muted-foreground">Token Standard</dt>
            <dd className="font-medium">{displayValues.tokenStandard}</dd>
          </div>
          <div className="rounded-lg border p-3">
            <dt className="text-sm text-muted-foreground">Contract</dt>
            <dd className="font-medium truncate" title={displayValues.contract}>
              {displayValues.contract}
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
                      name: displayValues.name,
                      description: displayValues.description,
                      image: displayValues.image,
                      attributes: displayValues.attributes,
                      tokenId: displayValues.id,
                      author: displayValues.author.name,
                      licenseType: displayValues.licenseType,
                      licenseTerms: displayValues.licenseTerms,
                    },
                    null,
                    2,
                  )}
                </pre>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>


        </Accordion>
      </div>
    </div>
  )
} 