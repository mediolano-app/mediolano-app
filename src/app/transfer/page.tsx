"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Send, CheckCircle2, ArrowUpDown, X, Info, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { TransferAssetDialog } from "@/components/transfer-asset-dialog"
import { SelectedAssetDetails } from "@/components/selected-asset-details"
import ModularAssetList, { ModularAsset } from "@/components/assets/ModularAssetList"
import { usePortfolio } from "@/hooks/usePortfolio"

type SortOption = "name" | "value" | "date" | "collection"





export default function TransferPage() {
  const [searchQuery, setSearchQuery] = useState("")
  // Asset selection state
  const [selectedAssets, setSelectedAssets] = useState<ModularAsset[]>([])
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [filterCollection, setFilterCollection] = useState<string>("all")
  const [filterLicense, setFilterLicense] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [transferredAssets, setTransferredAssets] = useState<ModularAsset[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [batchMode, setBatchMode] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Remove unused toggleAssetSelection logic (selection is handled by ModularAssetList)

  const toggleBatchMode = () => {
    setBatchMode(!batchMode)
    // Clear selections when toggling batch mode
    setSelectedAssets([])
  }

  const handleTransferComplete = (newOwnerAddress: string, memo?: string) => {
    // Mark all selected assets as transferred
    setTransferredAssets([...transferredAssets, ...selectedAssets])
    setSelectedAssets([])
  }

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      // Toggle direction if clicking the same option
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new sort option with ascending direction
      setSortBy(option)
      setSortDirection("asc")
    }
  }

  // Use real wallet assets
  const { userAssets, isLoading, error } = usePortfolio();

  // Map userAssets to ModularAsset format
  const modularAssets: ModularAsset[] = userAssets.map((asset) => ({
    id: asset.id,
    name: asset.name,
    type: "NFT", // You may want to infer this from metadata
    balance: undefined, // If you have balance info, add it here
    image: asset.image,
    contractAddress: "0x1234567890abcdef", // Replace with real contract address if available
    tokenId: asset.id,
    collection: asset.collection,
    previewUrl: asset.image,
  }))

  // Filtering logic for search and collection filter
  const filteredAssets = modularAssets.filter((asset) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.collection && asset.collection.toLowerCase().includes(searchQuery.toLowerCase()))
    // Collection filter
    const matchesCollection = filterCollection === "all" || asset.collection === filterCollection
    return matchesSearch && matchesCollection
  })

  // Get unique collections for filters
  const collections = Array.from(new Set(modularAssets.map((asset) => asset.collection).filter((c): c is string => !!c)))

  // Get the currently selected asset (for single selection mode)
  const selectedAsset = selectedAssets.length === 1 ? selectedAssets[0] : null

  // Map ModularAsset to Asset type for SelectedAssetDetails (minimal mapping)
  function modularAssetToAsset(asset: ModularAsset) {
    return {
      id: asset.id,
      name: asset.name,
      creator: '',
      verified: false,
      image: asset.image || '',
      collection: asset.collection || '',
      licenseType: '',
      description: '',
      registrationDate: '',
      type: asset.type || 'NFT',
      acquired: '',
      value: '',
    }
  }

  // Calculate total value of selected assets (if you have value info)
  const totalSelectedValue =
    selectedAssets.length > 0
      ? selectedAssets
          .reduce((total, asset) => {
            // If you have value info, use it here
            return total
          }, 0)
          .toFixed(2) + " ETH"
      : "0 ETH"

  return (
    <div className="min-h-screen">

      <main className="container mx-auto p-4 py-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Button>
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column - Asset selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Select Assets to Transfer</h2>
                <p className="text-muted-foreground">
                  {batchMode ? "Select multiple assets to transfer in batch" : "Select an asset to transfer ownership"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={batchMode ? "default" : "outline"} size="sm" onClick={toggleBatchMode}>
                  {batchMode ? "Batch Mode: ON" : "Batch Mode: OFF"}
                </Button>
                <Badge variant="outline" className="w-fit">
                  {filteredAssets.length} Assets Available
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, creator, or collection..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Select value={filterCollection} onValueChange={setFilterCollection}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Collections</SelectItem>
                    {collections.map((collection) => (
                      <SelectItem key={collection} value={collection}>
                        {collection}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* License filter removed (no licenseTypes available) */}
              </div>
            </div>

            {/* Modular Asset List */}
            {isLoading ? (
              <div className="p-8 text-center">Loading assets...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <ModularAssetList
                assets={modularAssets}
                onSelectAssets={setSelectedAssets}
                initialSelected={[]}
                multiSelect={batchMode}
              />
            )}
          </div>

          {/* Right column - Selected asset details and transfer action */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {selectedAssets.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-xl font-medium">Select an Asset</h3>
                    <p className="text-muted-foreground">
                      Choose an asset from your collection to transfer ownership to another wallet.
                    </p>
                  </CardContent>
                </Card>
              ) : selectedAssets.length === 1 ? (
                <>
                  <SelectedAssetDetails asset={modularAssetToAsset(selectedAssets[0])} />
                  <Button className="w-full" size="lg" onClick={() => setIsTransferDialogOpen(true)}>
                    <Send className="mr-2 h-4 w-4" />
                    Transfer Asset
                  </Button>
                </>
              ) : (
                <>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Batch Transfer</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Selected Assets:</span>
                          <Badge>{selectedAssets.length}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Total Value:</span>
                          <span className="font-medium">{totalSelectedValue}</span>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto space-y-2 border rounded-md p-2">
                          {selectedAssets.map((asset) => (
                            <div key={asset.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded overflow-hidden">
                                  <Image
                                    src={asset.image || "/placeholder.svg"}
                                    alt={asset.name}
                                    width={24}
                                    height={24}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span className="truncate max-w-[120px]">{asset.name}</span>
                              </div>
                              <button
                                className="text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedAssets(selectedAssets.filter((a) => a.id !== asset.id))
                                }}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>Batch Transfer</AlertTitle>
                          <AlertDescription>
                            All selected assets will be transferred to the same recipient address.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                  <Button className="w-full" size="lg" onClick={() => setIsTransferDialogOpen(true)}>
                    <Send className="mr-2 h-4 w-4" />
                    Transfer {selectedAssets.length} Assets
                  </Button>
                </>
              )}

              {transferredAssets.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-3 font-medium">Recently Transferred</h3>
                    <div className="space-y-2">
                      {transferredAssets.map((asset) => (
                        <div key={asset.id} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm truncate">{asset.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Transfer Dialog */}
      {selectedAssets.length > 0 && (
        <TransferAssetDialog
          assetId={selectedAssets.length === 1 ? selectedAssets[0].id : `batch-${selectedAssets.length}`}
          assetName={
            selectedAssets.length === 1
              ? selectedAssets[0].name
              : `${selectedAssets.length} Assets`
          }
          currentOwner="0x9i8h7g6f5e4d3c2b1a" // This would come from the user's wallet in a real app
          isOpen={isTransferDialogOpen}
          onClose={() => setIsTransferDialogOpen(false)}
          onTransferComplete={handleTransferComplete}
        />
      )}
    </div>
  )
}
