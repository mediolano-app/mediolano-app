import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileCheck, Box, Code, History, PlusCircle, GitBranch, ArrowUpRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
        {/* Remix Notification */}
        {(() => {
          const originalAssetAttr = displayValues.attributes?.find((a: any) => a.trait_type === "Original Asset" || a.trait_type === "Remixed From");
          if (originalAssetAttr) {
            const originalId = originalAssetAttr.value;
            // Handle ID format if it's "address-tokenid" or just address
            const linkHref = originalId.includes("0x") ? (originalId.includes("-") ? `/assets/${originalId.replace("-", "/")}` : `#`) : `#`;
            // Note: Our routing seems to be /asset/[slug] usually if using ID. 
            // The attribute stored in remix form is `${nftAddress}-${tokenId}` or `${nftAddress}`.
            // If it is `${nftAddress}-${tokenId}`, simpler to link to /create/remix?asset=... or try to find the asset page.
            // But we don't have a guaranteed route for checking "original" if it's just an address.
            // Let's assume we link to the collection or do a search if we can't deep direct.
            // Actually, best effort: link to /collections/[address] if we can parse address.

            const address = originalId.split("-")[0];

            return (
              <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800">
                <GitBranch className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-700 dark:text-blue-300">Remix Asset</AlertTitle>
                <AlertDescription className="text-blue-600 dark:text-blue-400 flex items-center gap-2 mt-1">
                  This is a remix of an original asset.
                  {address && (
                    <Link href={`/asset/${originalId}`} className="font-medium underline underline-offset-4 hover:text-blue-800 dark:hover:text-blue-200 inline-flex items-center">
                      View Original Asset <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Link>
                  )}
                </AlertDescription>
              </Alert>
            )
          }
          return null;
        })()}

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