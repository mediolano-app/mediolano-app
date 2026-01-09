// List of reported Collection IDs that should be hidden from the UI
export const REPORTED_COLLECTIONS: string[] = [
    "200"
]

// List of reported Asset IDs that should be hidden from the UI
// Asset ID format: "contractAddress-tokenId"
export const REPORTED_ASSETS: string[] = [
    "0x384627d22d01c369f542eb0f0a399417bbeec5998611160be6b73af6c91010a-1"
]

export function isCollectionReported(collectionId: string): boolean {
    return REPORTED_COLLECTIONS.includes(collectionId)
}

export function isAssetReported(assetId: string): boolean {
    return REPORTED_ASSETS.includes(assetId)
}
