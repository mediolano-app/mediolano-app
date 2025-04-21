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



const mockAssets = [
  {
    id: "1",
    name: "Abstract Dimension #312",
    creator: "0xArtist",
    verified: true,
    image: "/placeholder.svg?height=500&width=400",
    collection: "Dimensions",
    licenseType: "Creative Commons",
    description: "An abstract digital artwork exploring dimensional concepts with vibrant colors.",
    registrationDate: "January 15, 2025",
    acquired: "February 10, 2025",
    value: "0.85 ETH",
  },
  {
    id: "2",
    name: "Cosmic Voyager #89",
    creator: "CryptoCreator",
    verified: true,
    image: "/placeholder.svg?height=400&width=400",
    collection: "Cosmic Series",
    licenseType: "Commercial Use",
    description: "A journey through cosmic landscapes with ethereal elements and celestial bodies.",
    registrationDate: "February 3, 2025",
    acquired: "March 1, 2025",
    value: "1.2 ETH",
  },
  {
    id: "3",
    name: "Digital Dreams #567",
    creator: "NFTMaster",
    verified: false,
    image: "/placeholder.svg?height=600&width=400",
    collection: "Dreamscape",
    licenseType: "Personal Use",
    description: "Surreal dreamscapes created through digital manipulation and AI enhancement.",
    registrationDate: "February 18, 2025",
    acquired: "February 20, 2025",
    value: "0.5 ETH",
  },
  {
    id: "4",
    name: "Pixel Paradise #42",
    creator: "DigitalArtist",
    verified: true,
    image: "/placeholder.svg?height=450&width=400",
    collection: "Pixel Art",
    licenseType: "Creative Commons",
    description: "Nostalgic pixel art scene depicting a tropical paradise with retro aesthetics.",
    registrationDate: "December 12, 2024",
    acquired: "January 5, 2025",
    value: "0.3 ETH",
  },
  {
    id: "5",
    name: "Neon Genesis #78",
    creator: "0xArtist",
    verified: true,
    image: "/placeholder.svg?height=380&width=400",
    collection: "Neon Collection",
    licenseType: "Commercial Use",
    description: "Cyberpunk-inspired artwork with neon elements and futuristic cityscapes.",
    registrationDate: "March 5, 2025",
    acquired: "March 10, 2025",
    value: "1.5 ETH",
  },
  {
    id: "6",
    name: "Quantum Realm #23",
    creator: "QuantumCreator",
    verified: false,
    image: "/placeholder.svg?height=520&width=400",
    collection: "Quantum Series",
    licenseType: "Personal Use",
    description: "Visualization of quantum physics concepts through abstract digital art.",
    registrationDate: "January 30, 2025",
    acquired: "February 15, 2025",
    value: "0.75 ETH",
  },
]

type SortOption = "name" | "value" | "date" | "collection"





export default function TransferPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [filterCollection, setFilterCollection] = useState<string>("all")
  const [filterLicense, setFilterLicense] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [transferredAssets, setTransferredAssets] = useState<string[]>([])
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

  const toggleAssetSelection = (assetId: string) => {
    if (selectedAssets.includes(assetId)) {
      setSelectedAssets(selectedAssets.filter((id) => id !== assetId))
    } else {
      if (!batchMode) {
        // In single selection mode, replace the selection
        setSelectedAssets([assetId])
      } else {
        // In batch mode, add to selection
        setSelectedAssets([...selectedAssets, assetId])
      }
    }
  }

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

  // Filter assets based on search query and filters
  const filteredAssets = mockAssets.filter((asset) => {
    // Filter out already transferred assets
    if (transferredAssets.includes(asset.id)) return false

    // Apply search filter
    const matchesSearch =
      searchQuery === "" ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.collection.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply collection filter
    const matchesCollection = filterCollection === "all" || asset.collection === filterCollection

    // Apply license filter
    const matchesLicense = filterLicense === "all" || asset.licenseType === filterLicense

    return matchesSearch && matchesCollection && matchesLicense
  })

  // Sort the filtered assets
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "value":
        // Extract numeric value from string like "0.85 ETH"
        const valueA = Number.parseFloat(a.value.split(" ")[0])
        const valueB = Number.parseFloat(b.value.split(" ")[0])
        comparison = valueA - valueB
        break
      case "date":
        // Simple string comparison for dates (in a real app, use proper date objects)
        comparison = new Date(a.acquired).getTime() - new Date(b.acquired).getTime()
        break
      case "collection":
        comparison = a.collection.localeCompare(b.collection)
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  // Get unique collections and license types for filters
  const collections = Array.from(new Set(mockAssets.map((asset) => asset.collection)))
  const licenseTypes = Array.from(new Set(mockAssets.map((asset) => asset.licenseType)))

  // Get the currently selected asset (for single selection mode)
  const selectedAsset = selectedAssets.length === 1 ? mockAssets.find((asset) => asset.id === selectedAssets[0]) : null

  // Calculate total value of selected assets
  const totalSelectedValue =
    selectedAssets.length > 0
      ? selectedAssets
          .reduce((total, id) => {
            const asset = mockAssets.find((a) => a.id === id)
            if (asset) {
              const value = Number.parseFloat(asset.value.split(" ")[0])
              return total + value
            }
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

                <Select value={filterLicense} onValueChange={setFilterLicense}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="License Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Licenses</SelectItem>
                    {licenseTypes.map((license) => (
                      <SelectItem key={license} value={license}>
                        {license}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Asset List */}
            <Card>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b bg-muted/50">
                  <div className="col-span-1"></div>
                  <div
                    className="col-span-5 flex items-center gap-1 cursor-pointer hover:text-primary"
                    onClick={() => toggleSort("name")}
                  >
                    Asset
                    <ArrowUpDown
                      className={`h-3.5 w-3.5 ${sortBy === "name" ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div
                    className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-primary"
                    onClick={() => toggleSort("collection")}
                  >
                    Collection
                    <ArrowUpDown
                      className={`h-3.5 w-3.5 ${sortBy === "collection" ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div
                    className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-primary"
                    onClick={() => toggleSort("date")}
                  >
                    Acquired
                    <ArrowUpDown
                      className={`h-3.5 w-3.5 ${sortBy === "date" ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div
                    className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-primary"
                    onClick={() => toggleSort("value")}
                  >
                    Value
                    <ArrowUpDown
                      className={`h-3.5 w-3.5 ${sortBy === "value" ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                </div>

                <ScrollArea className="h-[calc(100vh-400px)] min-h-[300px]">
                  {loading ? (
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b animate-pulse">
                          <div className="col-span-1 flex justify-center">
                            <div className="h-5 w-5 rounded-full bg-muted"></div>
                          </div>
                          <div className="col-span-5 flex items-center gap-3">
                            <div className="h-12 w-12 rounded bg-muted"></div>
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-muted rounded"></div>
                              <div className="h-3 w-24 bg-muted rounded"></div>
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center">
                            <div className="h-4 w-20 bg-muted rounded"></div>
                          </div>
                          <div className="col-span-2 flex items-center">
                            <div className="h-4 w-20 bg-muted rounded"></div>
                          </div>
                          <div className="col-span-2 flex items-center">
                            <div className="h-4 w-16 bg-muted rounded"></div>
                          </div>
                        </div>
                      ))
                  ) : filteredAssets.length === 0 ? (
                    <div className="p-8 text-center">
                      <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="font-medium">No assets found</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your filters or search criteria</p>
                    </div>
                  ) : (
                    sortedAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className={`grid grid-cols-12 gap-4 p-4 border-b hover:bg-muted/30 cursor-pointer transition-colors ${
                          selectedAssets.includes(asset.id) ? "bg-muted/50" : ""
                        }`}
                        onClick={() => toggleAssetSelection(asset.id)}
                      >
                        <div className="col-span-1 flex justify-center items-center">
                          <Checkbox
                            checked={selectedAssets.includes(asset.id)}
                            onCheckedChange={() => toggleAssetSelection(asset.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="col-span-5 flex items-center gap-3">
                          <div className="h-12 w-12 rounded overflow-hidden">
                            <Image
                              src={asset.image || "/placeholder.svg"}
                              alt={asset.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{asset.name}</p>
                            <p className="text-sm text-muted-foreground">by {asset.creator}</p>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center">
                          <Badge variant="outline">{asset.collection}</Badge>
                        </div>
                        <div className="col-span-2 flex items-center text-sm">{asset.acquired}</div>
                        <div className="col-span-2 flex items-center font-medium">{asset.value}</div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </div>
            </Card>
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
              ) : selectedAssets.length === 1 && selectedAsset ? (
                <>
                  <SelectedAssetDetails asset={selectedAsset} />
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
                          {selectedAssets.map((id) => {
                            const asset = mockAssets.find((a) => a.id === id)
                            if (!asset) return null
                            return (
                              <div key={id} className="flex items-center justify-between text-sm">
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
                                    toggleAssetSelection(id)
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )
                          })}
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
                      {transferredAssets.map((id) => {
                        const asset = mockAssets.find((a) => a.id === id)
                        if (!asset) return null
                        return (
                          <div key={id} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm truncate">{asset.name}</span>
                          </div>
                        )
                      })}
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
          assetId={selectedAssets.length === 1 ? selectedAssets[0] : `batch-${selectedAssets.length}`}
          assetName={
            selectedAssets.length === 1
              ? mockAssets.find((a) => a.id === selectedAssets[0])?.name || ""
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
