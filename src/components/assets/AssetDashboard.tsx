"use client"

import { useState, useEffect } from "react"
import type { Asset } from "@/types/asset"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { AssetFilters, type AssetFilters as AssetFiltersType } from "./AssetFilters"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { Card } from "../ui/card"
import Link from "next/link"

export default function AssetDashboard({ initialAssets }: { initialAssets: Asset[] }) {
  const [assets, setAssets] = useState(initialAssets)
  const [filteredAssets, setFilteredAssets] = useState(initialAssets)
  const [isSaving, setIsSaving] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const categories = Array.from(new Set(assets.map((asset) => asset.category).filter(Boolean)))
  const collections = Array.from(new Set(assets.map((asset) => asset.collection).filter(Boolean)))

  const toggleVisibility = (id: string) => {
    setAssets((prevAssets) =>
      prevAssets.map((asset) => (asset.id === id ? { ...asset, isVisible: !asset.isVisible } : asset)),
    )
  }

  const handleFilterChange = (filters: AssetFiltersType) => {
    const filtered = assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        (filters.category === "all" || asset.category === filters.category) &&
        (filters.collection === "all" || asset.collection === filters.collection) &&
        (filters.visibility === "all" ||
          (filters.visibility === "visible" && asset.isVisible) ||
          (filters.visibility === "hidden" && !asset.isVisible)),
    )
    setFilteredAssets(filtered)
  }

  const saveChanges = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsDrawerOpen(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const confirmTransaction = async () => {
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Transaction confirmed",
        description: "Your asset visibility settings have been updated on-chain.",
      })
      setIsDrawerOpen(false)
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: "Failed to confirm the transaction. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    setFilteredAssets(assets)
  }, [assets])

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Asset Visibility Dashboard</h1>

      <Card className="p-8 bg-background/80 mb-20">
        <AssetFilters onFilterChange={handleFilterChange} categories={categories} collections={collections} />
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={asset.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:underline"
                    >
                      {asset.name}
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  </TableCell>
                  <TableCell>{asset.category && <Badge variant="secondary">{asset.category}</Badge>}</TableCell>
                  <TableCell>
                    {asset.collection && (
                      <Link
                        href={`https://opensea.io/collection/${asset.collection.toLowerCase().replace(/\s+/g, "-")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {asset.collection}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch checked={asset.isVisible} onCheckedChange={() => toggleVisibility(asset.id)} />
                  </TableCell>
                  <TableCell>
                    {asset.externalUrl && asset.tokenId && (
                      <Link
                        href={`${process.env.NEXT_PUBLIC_EXPLORER_URL || "https://sepolia.voyager.online"}/contract/${asset.externalUrl.split("/")[5]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View on Explorer
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <Button onClick={saveChanges} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Confirm Transaction</DrawerTitle>
            <DrawerDescription>
              You are about to update the visibility of your assets on-chain. This action cannot be undone.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <Button onClick={confirmTransaction}>Confirm Transaction</Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

