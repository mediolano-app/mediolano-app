import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon, Globe, FileText, Boxes, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import type { AssetFormState } from "@/hooks/use-asset-form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CollectionSummary { id: string | number | bigint; name: string }

interface AssetBasicInfoProps {
    formState: AssetFormState
    updateFormField: (field: string, value: any) => void
    handleFileChange: (file: File | null) => void
    collections: CollectionSummary[]
    isLoadingCollections?: boolean
    collectionError?: unknown
    refetchCollections?: () => void
    openCollectionModal?: () => void
}

export function AssetBasicInfo({
    formState,
    updateFormField,
    handleFileChange,
    collections,
    isLoadingCollections,
    collectionError,
    refetchCollections,
    openCollectionModal
}: AssetBasicInfoProps) {
    const [isDragOver, setIsDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFileChange(files[0])
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFileChange(files[0])
        }
    }

    const removeFile = () => {
        handleFileChange(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const selectedCollection = (collectionId: string) =>
        collections.find((c) => String(c.id) === String(collectionId))

    return (
        <Card className="glass">

            <CardContent className="space-y-6 mt-4">

                {/* 1. Name */}
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium">Name <span className="text-destructive">*</span></Label>
                    <Input
                        id="title"
                        placeholder="e.g. Cosmic Dreams #01"
                        value={formState.title}
                        onChange={(e) => updateFormField("title", e.target.value)}
                        className="h-12 text-base"
                    />
                </div>

                {/* 2. Description */}
                <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium">Description <span className="text-destructive">*</span></Label>
                    <Textarea
                        id="description"
                        placeholder="Describe your asset in detail..."
                        value={formState.description}
                        onChange={(e) => updateFormField("description", e.target.value)}
                        rows={4}
                        className="resize-none text-base"
                    />
                </div>

                {/* 3. Image (Media Upload) */}
                <div className="space-y-3">
                    <Label className="text-base font-medium">Asset Image <span className="text-destructive">*</span></Label>

                    {formState.mediaFile ? (
                        <div className="relative group overflow-hidden rounded-xl border bg-muted/30">
                            {formState.mediaPreviewUrl && formState.mediaFile.type.startsWith("image/") ? (
                                <div className="relative aspect-video w-full">
                                    <Image
                                        src={formState.mediaPreviewUrl}
                                        alt="Preview"
                                        fill
                                        className="object-contain"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button variant="destructive" size="sm" onClick={removeFile}>
                                            <X className="h-4 w-4 mr-2" /> Remove
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 p-6">
                                    <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                        <ImageIcon className="h-8 w-8" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate text-lg">{formState.mediaFile.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {(formState.mediaFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={removeFile}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group hover:border-primary/50 hover:bg-primary/5",
                                "border-muted-foreground/20"
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-base font-medium mb-1">Drop your image here</h3>
                            <p className="text-muted-foreground mb-4 text-xs">
                                Supports JPG, PNG, GIF, WEBP. Max 100MB.
                            </p>
                            <Button variant="outline" size="sm" className="rounded-full px-6">Browse Files</Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleFileSelect}
                                accept="*/*"
                            />
                        </div>
                    )}
                </div>

                {/* 4. Collection */}
                <div className="space-y-2">
                    <Label className="text-base font-medium flex items-center gap-2">
                        <Boxes className="h-4 w-4 text-muted-foreground" />
                        Collection <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={formState.collection}
                        onValueChange={(e) => {
                            updateFormField("collection", e)
                            updateFormField("collectionName", selectedCollection(e)?.name ?? "")
                        }}
                        disabled={isLoadingCollections && !collections?.length}
                    >
                        <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select Collection" />
                        </SelectTrigger>
                        <SelectContent>
                            {isLoadingCollections ? (
                                <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                                    <RotateCcw className="h-4 w-4 animate-spin" />
                                    <span>Loading...</span>
                                </div>
                            ) : collectionError ? (
                                <div className="flex flex-col gap-2 px-4 py-2 text-sm text-red-500">
                                    <p>Failed to load.</p>
                                    <Button variant="outline" size="sm" onClick={refetchCollections}>Retry</Button>
                                </div>
                            ) : collections?.length > 0 ? (
                                collections.map((collection) => (
                                    <SelectItem key={collection.id} value={String(collection.id)}>
                                        {collection.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="flex p-3 flex-col gap-2">
                                    <p className="text-sm text-muted-foreground">No collections found.</p>
                                    <Button variant="outline" size="sm" onClick={openCollectionModal}>
                                        + Create New Collection
                                    </Button>
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* 5. External URL */}
                <div className="space-y-2">
                    <Label htmlFor="externalUrl" className="text-base font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        External URL
                    </Label>
                    <Input
                        id="externalUrl"
                        placeholder="https://yoursite.com/item/123"
                        value={formState.externalUrl || ""}
                        onChange={(e) => updateFormField("externalUrl", e.target.value)}
                        className="h-12 text-base"
                    />
                    <p className="text-xs text-muted-foreground">
                        Link to your website or the detailed project page for this asset.
                    </p>
                </div>

            </CardContent>
        </Card>
    )
}
