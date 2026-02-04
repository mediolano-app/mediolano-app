// List of reported Collection IDs that should be hidden from the UI
// Collection ID format: "contractAddress"
export const REPORTED_COLLECTIONS: string[] = [
    "0x15303ad9002a780bbd34c84b2af673dbe16974d397be60f9c4fdc728cdcbac5"
]

// List of reported Asset IDs that should be hidden from the UI
// Asset ID format: "contractAddress-tokenId"
export const REPORTED_ASSETS: string[] = [
    "0x384627d22d01c369f542eb0f0a399417bbeec5998611160be6b73af6c91010a-1"
]

export function isCollectionReported(collectionAddress: string): boolean {
    if (!collectionAddress) return false;
    const normalized = collectionAddress.toLowerCase();
    return REPORTED_COLLECTIONS.some(addr => addr.toLowerCase() === normalized);
}

export function isAssetReported(assetId: string): boolean {
    if (!assetId) return false;
    const normalized = assetId.toLowerCase();
    return REPORTED_ASSETS.some(id => id.toLowerCase() === normalized);
}
