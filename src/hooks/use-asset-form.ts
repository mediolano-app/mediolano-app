"use client"

import { useState, useCallback } from "react"

export interface AssetFormState {
  // Basic fields
  title: string
  description: string
  externalUrl: string
  tags: string[]
  collection: string
  collectionName?: string
  assetType: string
  creator: string

  // Media
  mediaFile?: File | null
  mediaPreviewUrl?: string | null
  featuredImage?: File | null
  featuredImagePreviewUrl?: string | null

  // Licensing
  licenseType: string
  customLicense: string
  geographicScope: string

  // Extended Licensing
  territory: string
  fieldOfUse: string
  licenseDuration: string
  grantBack: string // Changed to string for custom input
  aiRights: string // Merged AI field

  // Template-specific metadata
  metadataFields: Record<string, unknown>
}

const initialState: AssetFormState = {
  title: "",
  description: "",
  externalUrl: "",
  tags: [],
  collection: "",
  collectionName: "",
  assetType: "general",
  creator: "",
  mediaFile: null,
  mediaPreviewUrl: null,
  licenseType: "all-rights-reserved",
  customLicense: "",
  geographicScope: "worldwide",

  // Extended Licensing Defaults
  territory: "",
  fieldOfUse: "",
  licenseDuration: "perpetual",
  grantBack: "",
  aiRights: "",
  metadataFields: {},
}

export function useAssetForm(defaultValues?: Partial<AssetFormState>) {
  const [formState, setFormState] = useState<AssetFormState>({
    ...initialState,
    ...defaultValues,
  })

  const updateFormField = useCallback((field: string, value: unknown) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleFileChange = useCallback((file: File | null) => {
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setFormState((prev) => ({
        ...prev,
        mediaFile: file,
        mediaPreviewUrl: previewUrl,
      }))
    } else {
      setFormState((prev) => ({
        ...prev,
        mediaFile: null,
        mediaPreviewUrl: null,
      }))
    }
  }, [])

  const handleFeaturedImageChange = useCallback((file: File | null) => {
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setFormState((prev) => ({
        ...prev,
        featuredImage: file,
        featuredImagePreviewUrl: previewUrl,
      }))
    } else {
      setFormState((prev) => ({
        ...prev,
        featuredImage: null,
        featuredImagePreviewUrl: null,
      }))
    }
  }, [])

  const canSubmit = useCallback(() => {
    return !!(formState.title && formState.description && formState.mediaFile)
  }, [formState.title, formState.description, formState.mediaFile])

  return {
    formState,
    updateFormField,
    handleFileChange,
    handleFeaturedImageChange,
    canSubmit,
  }
}
