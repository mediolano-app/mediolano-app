"use client"

import { useState, useCallback } from "react"

interface AssetFormState {
  // Basic fields
  title: string
  description: string
  tags: string[]
  collection: string
  assetType: string

  // Media
  mediaFile: File | null
  mediaPreviewUrl: string | null

  // Licensing
  licenseType: string
  customLicense: string
  geographicScope: string

  // Template-specific metadata
  metadataFields: Record<string, any>
}

const initialState: AssetFormState = {
  title: "",
  description: "",
  tags: [],
  collection: "",
  assetType: "general",
  mediaFile: null,
  mediaPreviewUrl: null,
  licenseType: "all-rights-reserved",
  customLicense: "",
  geographicScope: "worldwide",
  metadataFields: {},
}

export function useAssetForm(defaultValues?: Partial<AssetFormState>) {
  const [formState, setFormState] = useState<AssetFormState>({
    ...initialState,
    ...defaultValues,
  })

  const updateFormField = useCallback((field: string, value: any) => {
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

  const canSubmit = useCallback(() => {
    return !!(formState.title && formState.description && formState.mediaFile)
  }, [formState.title, formState.description, formState.mediaFile])

  return {
    formState,
    updateFormField,
    handleFileChange,
    canSubmit,
  }
}
