"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, FileText } from "lucide-react"
import Link from "next/link"  
import { AssetPreview } from "@/components/asset-creation/asset-preview"
import { AssetFormCore } from "@/components/asset-creation/asset-form-core"
import { LicensingOptions } from "@/components/asset-creation/licensing-options"
import { TemplateSpecificFields } from "@/components/asset-creation/template-specific-fields"
import { TemplateInfoCard } from "@/components/asset-creation/template-info-card"
import { Card, CardContent } from "@/components/ui/card"
import { useAssetForm } from "@/hooks/use-asset-form"
import { templates, getTemplateById } from "@/lib/templates"

export default function CreateAssetPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  // Initialize form
  const { formState, updateFormField, handleFileChange, canSubmit } = useAssetForm()

  // Get selected template
  const selectedTemplate = getTemplateById(formState.assetType)

  const handleTemplateChange = (templateId: string) => {
    updateFormField("assetType", templateId)
    // Clear metadata fields when changing template
    updateFormField("metadataFields", {})
  }

  const handleSubmit = async () => {
    if (!canSubmit()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to success page
    router.push("/create2/asset/success")
  }

  return (
    <div className="min-h-screen">


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
              <AssetPreview formState={formState} template={selectedTemplate} />
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
            <LicensingOptions formState={formState} updateFormField={updateFormField} />

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button onClick={handleSubmit} disabled={!canSubmit() || isSubmitting} size="lg" className="px-8">
                {isSubmitting ? "Creating Asset..." : "Create Asset"}
              </Button>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Template Info */}
              {selectedTemplate && <TemplateInfoCard template={selectedTemplate} />}

              {/* Live Preview */}
              <AssetPreview formState={formState} template={selectedTemplate} />

              {/* Help Card */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Need Help?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn more about creating and protecting your intellectual property assets.
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
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
