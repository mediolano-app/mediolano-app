"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader } from "lucide-react";
import { AssetPreview } from "@/components/asset-creation/asset-preview";
import { AssetFormCore } from "@/components/asset-creation/asset-form-core";
import { LicensingOptions } from "@/components/asset-creation/licensing-options";
import { TemplateSpecificFields } from "@/components/asset-creation/template-specific-fields";
import { TemplateInfoCard } from "@/components/asset-creation/template-info-card";
import { Card, CardContent } from "@/components/ui/card";
import { useAssetForm } from "@/hooks/use-asset-form";
import { templates, getTemplateById } from "@/lib/templates";
import { useIpfsUpload } from "@/hooks/useIpfs";
import { useCreateAsset } from "@/hooks/use-create-asset";
import { useAccount } from "@starknet-react/core";
import { useToast } from "@/hooks/use-toast";
import {
  useGetCollections,
  useIsCollectionOwner,
} from "@/hooks/use-collection";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateCollectionView from "@/components/collections/create-collection";
import { MintSuccessDrawer } from "@/components/mint-success-drawer";
import { IMintResult } from "@/hooks/use-create-asset";
import { normalizeStarknetAddress } from "@/lib/utils";

export default function CreateAssetPage() {
  const { toast } = useToast();
  const [openCollection, setOpenCollection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showSuccessDrawer, setShowSuccessDrawer] = useState(false);
  const [mintResult, setMintResult] = useState<IMintResult | null>(null);
  const { address: walletAddress } = useAccount();
  const { uploadToIpfs, loading: upload_loading } = useIpfsUpload();
  const { createAsset, isCreating } = useCreateAsset();
  const { checkOwnership } = useIsCollectionOwner();
  // Initialize form
  const { formState, updateFormField, handleFileChange, canSubmit } =
    useAssetForm();
  const {
    collections,
    loading: collection_loading,
    error: collection_error,
    reload,
  } = useGetCollections(walletAddress);

  // Get selected template
  const selectedTemplate = getTemplateById(formState.assetType);

  const handleTemplateChange = (templateId: string) => {
    updateFormField("assetType", templateId);
    // Clear metadata fields when changing template
    updateFormField("metadataFields", {});
  };

  const handleSubmit = async () => {
    // Only proceed if wallet is connected
    if (!walletAddress) {
      return;
    }
    if (!canSubmit()) return;
    setLoading(true);

    // Create metadata object (in production, this would be uploaded to IPFS)
    const metadata = {
      name: formState.title,
      description: formState.description,
      external_url: "",
      attributes: [
        { trait_type: "Type", value: formState.assetType },
        { trait_type: "License", value: formState.licenseType },
        {
          trait_type: "Geographic Scope",
          value: formState.geographicScope,
        },
        { trait_type: "Tags", value: formState.tags.join(", ") },
      ],
    };

    const collectionNftAddress = collections.find(collection => parseInt(collection.id.toString()) === parseInt(formState?.collection))?.nftAddress;

    const contractHex = collectionNftAddress
      ? normalizeStarknetAddress(String(collectionNftAddress))
      : "N/A";

    try {
      //Extra Check for collection ownership
      const isOwner = await checkOwnership(
        formState.collection,
        walletAddress as string
      );
      if (!isOwner) {
        throw new Error("You are not the owner of this collection");
      }
      //Upload media and metadata.
      const result = await uploadToIpfs(formState?.mediaFile as File, metadata);
      //Then make contract call.

      const mintResult = await createAsset({
        collection_id: formState?.collection,
        recipient: walletAddress as string,
        token_uri: result?.metadataUrl,
        collection_nft_address: contractHex,
      });

      // Show success drawer with mint result
      setMintResult(mintResult);
      setShowSuccessDrawer(true);

      // Show success toast
      toast({
        title: "🎉 Asset Minted Successfully!",
        description: "Your Programmable IP has been registered on the blockchain.",
      });
    } catch (error) {
      console.error("Error minting asset:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to mint Programmable IP",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <>
      {openCollection && (
        <Dialog open={openCollection} onOpenChange={setOpenCollection}>
          <DialogContent className="max-w-none overflow-y-auto w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] max-h-none p-0 gap-0 border-0 shadow-2xl">
            <CreateCollectionView isModalMode={true} />
          </DialogContent>
        </Dialog>
      )}
      <div className="min-h-screen bg-background/70 text-foreground pb-20">
        {/* Mobile Preview Modal */}
        {showMobilePreview && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden">
            <div className="fixed inset-x-4 top-4 bottom-4 bg-background border rounded-lg shadow-lg overflow-auto">
              <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
                <h2 className="font-semibold">Preview</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobilePreview(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="p-4">
                <AssetPreview
                  formState={formState}
                  template={selectedTemplate}
                />
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
                refetchCollections={reload}
                collectionError={collection_error}
                isLoadingCollections={collection_loading}
                collections={collections || []}
                openCollectionModal={() => setOpenCollection(true)}
                formState={formState}
                updateFormField={updateFormField}
                handleFileChange={handleFileChange}
                templates={templates}
                selectedTemplate={selectedTemplate}
                onTemplateChange={handleTemplateChange}
                showTemplateSelector={true}
              />

              {/* Template-Specific Fields */}
              {selectedTemplate && (
                <TemplateSpecificFields
                  template={selectedTemplate}
                  formState={formState}
                  updateFormField={updateFormField}
                />
              )}

              {/* Licensing Options */}
              <LicensingOptions
                formState={formState}
                updateFormField={updateFormField}
              />

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !canSubmit() ||
                    isCreating ||
                    upload_loading ||
                    !walletAddress ||
                    !formState.collection ||
                    loading
                  }
                  size="lg"
                  className="px-8"
                >
                  {loading && <Loader className="animate-spin h-5 w-" />}
                  {loading ? isCreating ? "Creating Asset..." : "Performing Checks" : "Create Asset"}
                </Button>
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Template Info */}
                {selectedTemplate && (
                  <TemplateInfoCard template={selectedTemplate} />
                )}

                {/* Live Preview */}
                <AssetPreview
                  formState={formState}
                  template={selectedTemplate}
                />

                {/* Help Card */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Need Help?
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Learn more about creating and protecting your intellectual
                      property assets.
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

      {/* Mint Success Drawer */}
      {mintResult && (
        <MintSuccessDrawer
          isOpen={showSuccessDrawer}
          onOpenChange={setShowSuccessDrawer}
          mintResult={mintResult}
          assetTitle={formState.title}
          assetDescription={formState.description}
          assetType={selectedTemplate?.name}
        />
      )}
    </>
  );
}
