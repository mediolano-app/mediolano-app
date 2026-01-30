"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader, Settings2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AssetPreview } from "@/components/asset-creation/asset-preview";
import { AssetBasicInfo } from "@/components/asset-creation/asset-basic-info";
import { TemplateSelector } from "@/components/asset-creation/template-selector";
import { AssetDetails } from "@/components/asset-creation/asset-details";
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
import { MintSuccessDrawer, MintDrawerStep } from "@/components/mint-success-drawer";
import dynamic from "next/dynamic";

const CreateCollectionView = dynamic(() => import("@/components/collections/create-collection"), {
  loading: () => <div className="h-96 flex items-center justify-center">Loading...</div>
});
import { IMintResult } from "@/hooks/use-create-asset";
import { normalizeStarknetAddress } from "@/lib/utils";
import { useProvider } from "@starknet-react/core";
import { num, hash } from "starknet";

export default function CreateAssetPage() {
  const { toast } = useToast();
  const { provider } = useProvider();
  const [openCollection, setOpenCollection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Drawer State
  const [showSuccessDrawer, setShowSuccessDrawer] = useState(false);
  const [mintStep, setMintStep] = useState<MintDrawerStep>("idle");
  const [mintProgress, setMintProgress] = useState(0);
  const [mintError, setMintError] = useState<string | null>(null);
  const [drawerPreviewImage, setDrawerPreviewImage] = useState<string | null>(null);

  const [mintResult, setMintResult] = useState<IMintResult | null>(null);
  const [hasUserEditedCreator, setHasUserEditedCreator] = useState(false);
  const { address: walletAddress } = useAccount();
  const { uploadToIpfs, loading: upload_loading } = useIpfsUpload();
  const { createAsset, isCreating } = useCreateAsset();
  const { checkOwnership } = useIsCollectionOwner();
  // Initialize form
  const { formState, updateFormField, handleFileChange, handleFeaturedImageChange, canSubmit } =
    useAssetForm();
  const {
    collections,
    loading: collection_loading,
    error: collection_error,
    reload,
  } = useGetCollections(walletAddress);

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
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create an asset.",
        variant: "destructive",
      });
      return;
    }
    if (!canSubmit()) return;

    // Prepare Review State
    setMintStep("idle");
    setMintError(null);

    // Create local preview URL
    if (formState.mediaFile) {
      setDrawerPreviewImage(URL.createObjectURL(formState.mediaFile));
    } else {
      setDrawerPreviewImage(null);
    }

    // Open Drawer for Review
    setShowSuccessDrawer(true);
  };

  const handleConfirmMint = async () => {
    setLoading(true);

    // START DRAWER PROCESS
    setMintStep("uploading");
    setMintProgress(0);

    // Create metadata object (in production, this would be uploaded to IPFS)
    const metadata = {
      name: formState.title,
      description: formState.description,
      external_url: formState.externalUrl,
      image: "", // Will be filled by IPFS upload result
      attributes: [
        { trait_type: "Type", value: formState.assetType },
        { trait_type: "Creator", value: formState.creator },
        { trait_type: "License", value: formState.licenseType },
        {
          trait_type: "Geographic Scope",
          value: formState.geographicScope === "custom" || formState.geographicScope === "other" || formState.geographicScope === "eu"
            ? `${formState.geographicScope} - ${formState.territory}`
            : formState.geographicScope,
        },
        { trait_type: "License Duration", value: formState.licenseDuration || "Perpetual" },
        { trait_type: "Field of Use", value: formState.fieldOfUse || "Unrestricted" },
        { trait_type: "Grant-back Clause", value: formState.grantBack || "None" },
        { trait_type: "AI & Data Mining Policy", value: formState.aiRights || "Unspecified" },
        { trait_type: "Tags", value: formState.tags.join(", ") },
        // Add template specific fields as attributes
        ...Object.entries(formState.metadataFields).map(([key, value]) => ({
          trait_type: key,
          value: value
        }))
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
      setMintProgress(10);

      // Upload featured image if available, otherwise media file
      // Note: We need to handle this logic in useIpfsUpload or here
      const result = await uploadToIpfs(formState?.mediaFile as File, metadata);
      setMintProgress(50);

      // Then make contract call.
      setMintStep("processing");
      setMintProgress(60);

      const mintResultData = await createAsset({
        collection_id: formState?.collection,
        recipient: walletAddress as string,
        token_uri: result?.metadataUrl,
        collection_nft_address: contractHex,
      });

      if (mintResultData?.transactionHash) {
        // Wait for transaction to be accepted to get the event
        const receipt = await provider.waitForTransaction(mintResultData.transactionHash);

        const tokenMintedSelector = hash.getSelectorFromName("TokenMinted");

        // Default to a fallback if we can't parse
        let parsedId = mintResultData.tokenId || "0";

        if (receipt.isSuccess() && 'events' in receipt) {
          const events = receipt.events;
          const mintEvent = events.find(
            (e: any) => e.keys[0] === tokenMintedSelector
          );

          if (mintEvent && mintEvent.data) {
            // token_id is u256 at index 2 and 3 of data array
            // data layout: [collection_id_low, collection_id_high, token_id_low, token_id_high, ...]
            const low = mintEvent.data[2];
            parsedId = num.toBigInt(low).toString();
            console.log("Parsed Token ID:", parsedId);

            // Update mint result data with accurate ID
            mintResultData.tokenId = parsedId;
            mintResultData.assetSlug = `${contractHex}-${parsedId}`;
          }
        }
      }

      setMintProgress(90);

      // Show success drawer with mint result
      setMintResult(mintResultData);
      setMintStep("success");
      setMintProgress(100);

      // Show success toast
      toast({
        title: "🎉 IP Minted Successfully!",
        description: "Your Programmable IP is now onchain.",
      });
    } catch (error) {
      console.error("Error minting asset:", error);
      const errorMsg = error instanceof Error
        ? error.message
        : "Failed to mint Programmable IP";

      setMintError(errorMsg);

      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
      <div className="min-h-screen text-foreground pb-20">
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
            <div className="lg:col-span-3 space-y-8">

              <Accordion type="multiple" defaultValue={["basic-info"]} className="w-full space-y-4">

                {/* 1. Basic Information (Top Priority) */}
                <AccordionItem value="basic-info" className="glass">
                  <AccordionTrigger className="hover:no-underline px-4 py-4 text-xl font-semibold">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span>Asset Info</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-6 pt-2">
                    <AssetBasicInfo
                      formState={formState}
                      updateFormField={updateFormField}
                      handleFileChange={handleFileChange}
                      collections={collections || []}
                      isLoadingCollections={collection_loading}
                      collectionError={collection_error}
                      refetchCollections={reload}
                      openCollectionModal={() => setOpenCollection(true)}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* 2. Asset Type Selection */}
                <AccordionItem value="ip-type" className="glass">
                  <AccordionTrigger className="hover:no-underline px-4 py-4 text-xl font-semibold">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-5 w-5 text-primary" />
                      <span>IP Type</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-6 pt-2">
                    <TemplateSelector
                      templates={templates}
                      selectedTemplateId={formState.assetType}
                      onTemplateChange={handleTemplateChange}
                    />
                    {selectedTemplate && (
                      <div id="template-fields" className="pt-4 border-t mt-4">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-muted-foreground">
                          {selectedTemplate.name} Metadata
                        </h3>
                        <TemplateSpecificFields
                          template={selectedTemplate}
                          formState={formState}
                          updateFormField={updateFormField}
                        />
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* 3. Advanced Configuration */}
                <AccordionItem value="advanced-info" className="glass">
                  <AccordionTrigger className="hover:no-underline px-4 py-4 text-xl font-semibold">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-5 w-5 text-primary" />
                      <span>Advanced Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-6 pt-2 space-y-8">
                    {/* 3.1 Asset Details (Categorization) */}
                    <div id="asset-details" className="pt-2">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-muted-foreground">
                        Categorization
                      </h3>
                      <AssetDetails
                        formState={formState}
                        updateFormField={updateFormField}
                      />
                    </div>


                  </AccordionContent>
                </AccordionItem>

                {/* 4. Licensing Options */}
                <AccordionItem value="licensing" className="glass">
                  <AccordionTrigger className="hover:no-underline px-4 py-4 text-xl font-semibold">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-5 w-5 text-primary" />
                      <span>Programmable Licensing</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-6 pt-2">
                    <LicensingOptions
                      formState={formState}
                      updateFormField={updateFormField}
                    />
                  </AccordionContent>
                </AccordionItem>

              </Accordion>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
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
                  className="px-10 h-12 text-lg shadow-lg hover:shadow-xl transition-all rounded-full"
                >
                  {loading && <Loader className="animate-spin h-5 w-5 mr-2" />}
                  {loading ? (upload_loading ? "Uploading..." : isCreating ? "Minting..." : "Processing") : "Create Asset"}
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
                <Card className="glass-card">
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
      <MintSuccessDrawer
        isOpen={showSuccessDrawer}
        onOpenChange={setShowSuccessDrawer}
        step={mintStep}
        progress={mintProgress}
        mintResult={mintResult}
        assetTitle={formState.title}
        assetDescription={formState.description}
        assetType={selectedTemplate?.name}
        error={mintError}
        onConfirm={handleConfirmMint}
        cost="0.001 STRK" /* Estimate */
        previewImage={drawerPreviewImage}
        data={{
          "License Type": formState.licenseType,
          "Collection": collections.find(c => c.id.toString() === formState.collection)?.name || "Unknown",
        }}
      />
    </>
  );
}
