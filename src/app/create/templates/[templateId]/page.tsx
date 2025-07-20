"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"

import { AssetPreview } from "@/components/asset-creation/asset-preview"
import { AssetConfirmation } from "@/components/asset-creation/asset-confirmation"
import { AssetFormCore } from "@/components/asset-creation/asset-form-core"
import { LicensingOptions } from "@/components/asset-creation/licensing-options"
import { TemplateInfoCard } from "@/components/asset-creation/template-info-card"
import { TemplateSpecificFields } from "@/components/asset-creation/template-specific-fields"
import { useAssetForm } from "@/hooks/use-asset-form"
import { templates, getTemplateById } from "@/lib/templates"

export default function CreateAssetFromTemplate() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.templateId as string

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMobilePreview, setShowMobilePreview] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Find the template
  const template = getTemplateById(templateId)

  // Initialize form with template-specific defaults
  const { formState, updateFormField, handleFileChange, canSubmit } = useAssetForm({
    assetType: templateId,
  })

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
    if (!canSubmit()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsComplete(true)
  }

  if (isComplete) {
    return <AssetConfirmation formState={formState} template={template} />
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
            />

            {/* Template-Specific Fields */}
            <TemplateSpecificFields template={template} formState={formState} updateFormField={updateFormField} />

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
              <TemplateInfoCard template={template} />

              {/* Live Preview */}
              <AssetPreview formState={formState} template={template} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
