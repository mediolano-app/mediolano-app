// src/lib/api.ts

import { AssetDetails } from '@/types/asset';

export async function getAssetDetails(assetId: string): Promise<AssetDetails> {
  // TODO: Implement actual API call
  // This is a placeholder implementation
  return {
    id: assetId,
    title: "Test Asset",
    author: "Sample Author",
    description: "Sample Description",
    collection: "MIP",
    type: "Custom",
    mediaUrl: "",
    externalUrl: "",
    licenseType: "",
    licenseDetails: "",
    licenseDuration: "",
    licenseTerritory: "",
    version: "0.1.2",
    commercialUse: false,
    modifications: false,
    attribution: false,
    registrationDate: "2025-06-01",
  };
}