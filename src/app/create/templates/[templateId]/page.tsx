"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader, FileText } from "lucide-react"

import { AssetPreview } from "@/components/asset-creation/asset-preview"
import { AssetConfirmation } from "@/components/asset-creation/asset-confirmation"
import { AssetFormCore } from "@/components/asset-creation/asset-form-core"
import { LicensingOptions } from "@/components/asset-creation/licensing-options"
import { TemplateInfoCard } from "@/components/asset-creation/template-info-card"
import { TemplateSpecificFields } from "@/components/asset-creation/template-specific-fields"
import { useAssetForm } from "@/hooks/use-asset-form"
import { templates, getTemplateById } from "@/lib/templates"
import { useAccount } from "@starknet-react/core"
import { useToast } from "@/hooks/use-toast"
import { useIpfsUpload } from "@/hooks/useIpfs"
import { useCreateAsset, IMintResult } from "@/hooks/use-create-asset"
import { useGetCollections, useIsCollectionOwner } from "@/hooks/use-collection"
import { normalizeStarknetAddress } from "@/lib/utils"
import { MintSuccessDrawer } from "@/components/mint-success-drawer"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import CreateCollectionView from "@/components/collections/create-collection"
import { Card, CardContent } from "@/components/ui/card"

export default function CreateAssetFromTemplate() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const templateId = params.templateId as string
  const { address: walletAddress } = useAccount()

  // Hooks
  const { uploadToIpfs, loading: upload_loading } = useIpfsUpload()
  const { createAsset, isCreating } = useCreateAsset()
  const { checkOwnership } = useIsCollectionOwner()
  const {
    collections,
    loading: collection_loading,
    error: collection_error,
    reload,
  } = useGetCollections(walletAddress)

  // Local State
  const [loading, setLoading] = useState(false)
  const [showMobilePreview, setShowMobilePreview] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [hasUserEditedCreator, setHasUserEditedCreator] = useState(false)
  const [openCollection, setOpenCollection] = useState(false)
  const [showSuccessDrawer, setShowSuccessDrawer] = useState(false)
  const [mintResult, setMintResult] = useState<IMintResult | null>(null)

  // Find the template
  const template = getTemplateById(templateId)

  // Initialize form with template-specific defaults
  const { formState, updateFormField, handleFileChange, canSubmit } = useAssetForm({
    assetType: templateId,
  })

  // Auto-populate creator field with wallet address
  useEffect(() => {
    if (walletAddress && formState.creator === "" && !hasUserEditedCreator) {
      updateFormField("creator", walletAddress);
    }
  }, [walletAddress, updateFormField, hasUserEditedCreator]);

  const handleCreatorFieldChange = (field: "creator", value: string) => {
    if (field === "creator") {
      setHasUserEditedCreator(true);
    }
    updateFormField(field, value);
  };

  // Redirect if template not found
  useEffect(() => {
    if (!template) {
      router.push("/create/templates")
    }
  }, [template, router])

  if (!template) {
    return null
  }

  const handleTemplateChange = (newTemplateId: string) => {
    router.push(`/create/templates/${newTemplateId}`)
  }

  const handleSubmit = async () => {
    // Only proceed if wallet is connected
    if (!walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create an asset.",
        variant: "destructive",
      })
      return
    }

    if (!canSubmit()) return

    setLoading(true)

    try {
      // 1. Create metadata object
      const metadata = {
        name: formState.title,
        description: formState.description,
        external_url: "",
        attributes: [
          { trait_type: "Type", value: formState.assetType },
          { trait_type: "Creator", value: formState.creator },
          { trait_type: "License", value: formState.licenseType },
          { trait_type: "Geographic Scope", value: formState.geographicScope },
          { trait_type: "Template", value: template.name },
          { trait_type: "Tags", value: formState.tags.join(", ") },
          // Include template specific fields in attributes
          ...Object.entries(formState.metadataFields).map(([key, value]) => ({
            trait_type: key,
            value: String(value),
          })),
        ],
        // Also include raw template data for easier parsing if needed
        properties: {
          template_id: template.id,
          ...formState.metadataFields
        }
      }

      // 2. Get collection info
      const collectionNftAddress = collections.find(
        (c) => parseInt(c.id.toString()) === parseInt(formState.collection)
      )?.nftAddress

      const contractHex = collectionNftAddress
        ? normalizeStarknetAddress(String(collectionNftAddress))
        : "N/A"

      // 3. Extra Check for collection ownership
      const isOwner = await checkOwnership(
        formState.collection,
        walletAddress as string
      )

      if (!isOwner) {
        throw new Error("You are not the owner of this collection")
      }

      // 4. Upload media and metadata to IPFS
      const result = await uploadToIpfs(formState.mediaFile as File, metadata)

      // 5. Make contract call
      const mintTxApply = await createAsset({
        collection_id: formState.collection,
        recipient: walletAddress as string,
        token_uri: result?.metadataUrl,
        collection_nft_address: contractHex,
      })

      // 6. Handle success
      setMintResult(mintTxApply)
      setShowSuccessDrawer(true)
      setIsComplete(true) // Optional: switch to confirmation view if preferred outside of drawer

      toast({
        title: "IP Minted Successfully!",
        description: `Your ${template.name} asset has been registered on the blockchain.`,
      })

    } catch (error) {
      console.error("Error minting from template:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to mint asset",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isComplete && !showSuccessDrawer) {
    // If we want a full page success state, we can use this. 
    // For now, using the Drawer + keeping form visible (or could reset).
    // Let's rely on the Drawer for success feedback as per other pages.
  }

  return (
    <div className="min-h-screen">
      {/* Collection Creation Modal */}
      {openCollection && (
        <Dialog open={openCollection} onOpenChange={setOpenCollection}>
          <DialogContent className="max-w-none overflow-y-auto w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] max-h-none p-0 gap-0 border-0 shadow-2xl">
            <CreateCollectionView isModalMode={true} />
          </DialogContent>
        </Dialog>
      )}

      {/* Mint Success Drawer */}
      {mintResult && (
        <MintSuccessDrawer
          isOpen={showSuccessDrawer}
          onOpenChange={setShowSuccessDrawer}
          mintResult={mintResult}
          assetTitle={formState.title}
          assetDescription={formState.description}
          assetType={template.name}
        />
      )}

      {/* Mobile Preview Modal */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden">
          <div className="fixed inset-x-4 top-4 bottom-4 bg-background border rounded-lg shadow-lg overflow-auto">
            <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
              <h2 className="font-semibold">Preview</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowMobilePreview(false)}>
                ✕
              </Button>
            </div>
            <div className="p-4">
              <AssetPreview formState={formState} template={template} />
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto p-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Core Asset Form */}
            <AssetFormCore
              formState={formState}
              updateFormField={updateFormField}
              handleFileChange={handleFileChange}
              templates={templates}
              selectedTemplate={template}
              onTemplateChange={handleTemplateChange}
              showTemplateSelector={false}
              onCreatorFieldChange={handleCreatorFieldChange}
              // Collection props
              collections={collections || []}
              isLoadingCollections={collection_loading}
              collectionError={collection_error}
              refetchCollections={reload}
              openCollectionModal={() => setOpenCollection(true)}
            />

            {/* Template-Specific Fields */}
            <TemplateSpecificFields template={template} formState={formState} updateFormField={updateFormField} />

            {/* Licensing Options */}
            <LicensingOptions formState={formState} updateFormField={updateFormField} />

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                onClick={handleSubmit}
                disabled={
                  !canSubmit() ||
                  loading ||
                  isCreating ||
                  upload_loading ||
                  !walletAddress ||
                  !formState.collection
                }
                size="lg"
                className="px-8"
              >
                {loading && <Loader className="animate-spin h-5 w-5 mr-2" />}
                {loading
                  ? (upload_loading ? "Uploading..." : isCreating ? "Minting..." : "Processing")
                  : `Create ${template.name} Asset`
                }
              </Button>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Template Info */}
              <TemplateInfoCard template={template} />

              {/* Live Preview */}
              <AssetPreview formState={formState} template={template} />

              {/* Help Card */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Need Help?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn more about creating and protecting your intellectual
                    property assets with the {template.name} template.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                    View Documentation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
