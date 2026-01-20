"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAccount, useContract, useSendTransaction, useProvider } from "@starknet-react/core"
import { useRouter } from "next/navigation"
import { Abi } from "starknet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    ArrowLeft,
    Upload,
    ImageIcon,
    Music,
    GitBranch,
    CheckCircle,
    Info,
    Sparkles,
    Clock,
    ExternalLink,
    Copy,
    Loader2,
    CheckCircle2,
    XCircle,
    Plus,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useAsset } from "@/hooks/use-asset"
import { useGetCollections } from "@/hooks/use-collection"
import { useIpfsUpload } from "@/hooks/useIpfs"
import { ipCollectionAbi } from "@/abis/ip_collection"
import { COLLECTION_CONTRACT_ADDRESS } from "@/services/constants"

const remixTypes = [
    {
        id: "derivative",
        name: "Derivative Work",
        description: "Create a new work based on the original",
        icon: GitBranch,
    },
    {
        id: "adaptation",
        name: "Adaptation",
        description: "Transform the work into a different medium or format",
        icon: ImageIcon,
    },
    {
        id: "transformation",
        name: "Transformation",
        description: "Significantly alter the original work",
        icon: Music,
    },
]

const licenseOptions = [
    {
        id: "property-rights",
        name: "Property Rights",
        description: "You own all rights to the work",
        allowCommercial: true,
        allowDerivatives: true,
    },
    {
        id: "cc-by",
        name: "Creative Commons BY",
        description: "Attribution required",
        allowCommercial: true,
        allowDerivatives: true,
    },
    {
        id: "cc-by-sa",
        name: "Creative Commons BY-SA",
        description: "Attribution + Share Alike",
        allowCommercial: true,
        allowDerivatives: true,
    },
    {
        id: "cc-by-nc",
        name: "Creative Commons BY-NC",
        description: "Attribution + Non-Commercial",
        allowCommercial: false,
        allowDerivatives: true,
    },
    {
        id: "mit",
        name: "MIT License",
        description: "Permissive open source license",
        allowCommercial: true,
        allowDerivatives: true,
    },
]

type TransactionStatus = "idle" | "uploading" | "preparing" | "signing" | "pending" | "success" | "error"

interface RemixAssetFormProps {
    nftAddress: string
    tokenId: number
}

// Helper to truncate long addresses
const formatAddress = (address?: string) => {
    if (!address) return "Unknown"
    // If it's short already, return as is
    if (address.length < 12) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function RemixAssetForm({ nftAddress, tokenId }: RemixAssetFormProps) {
    const router = useRouter()
    const { address } = useAccount()
    const { toast } = useToast()
    const { provider } = useProvider()

    // Data Fetching
    const { displayAsset: originalAsset, loading: assetLoading, error: assetError } = useAsset(
        nftAddress as `0x${string}`,
        tokenId
    )

    const { collections, loading: collectionsLoading } = useGetCollections(address)

    // Form states
    const [uploadedFile, setUploadedFile] = useState<{
        file: File,
        name: string,
        size: number,
        type: string,
        previewUrl: string
    } | null>(null)

    const [dragActive, setDragActive] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("idle")
    const [transactionHash, setTransactionHash] = useState("")
    const [progress, setProgress] = useState(0)
    const [copied, setCopied] = useState(false)
    const [selectedCollectionId, setSelectedCollectionId] = useState<string>("")

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        remixType: "",
        license: "",
        royaltyPercentage: [5],
        allowCommercial: true,
        requireAttribution: true,
        tags: "",
    })

    // Hooks
    const { uploadToIpfs, progress: uploadProgress } = useIpfsUpload()

    // Get selected collection
    const selectedCollection = useMemo(() =>
        collections.find(c => c.id.toString() === selectedCollectionId),
        [collections, selectedCollectionId]
    )

    const { contract } = useContract({
        abi: ipCollectionAbi as Abi,
        address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`,
    });

    const { sendAsync: mintAsset } = useSendTransaction({
        calls: [],
    });

    // Initial Population
    useEffect(() => {
        if (originalAsset) {
            setFormData((prev) => ({
                ...prev,
                name: `${originalAsset.name} - Remix`,
                description: `A remix of "${originalAsset.name}" by ${originalAsset.creator?.name || 'Unknown'}`,
                license: getCompatibleLicense(originalAsset.licenseType || ""),
                allowCommercial: originalAsset.licenseType?.includes("Commercial") || false,
            }))
        }
    }, [originalAsset])

    // Utility 
    const getCompatibleLicense = (originalLicense: string) => {
        if (originalLicense.includes("Creative Commons")) return "cc-by"
        if (originalLicense.includes("MIT")) return "mit"
        return "cc-by" // Default
    }

    // View Logic
    const handleFileUpload = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0]
            setUploadedFile({
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                previewUrl: URL.createObjectURL(file),
            })
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        handleFileUpload(e.dataTransfer.files)
    }

    const handleCopyHash = async () => {
        if (transactionHash) {
            try {
                await navigator.clipboard.writeText(transactionHash)
                setCopied(true)
                toast({
                    title: "Copied!",
                    description: "Transaction hash copied to clipboard",
                })
                setTimeout(() => setCopied(false), 2000)
            } catch (error) {
                console.error("Failed to copy:", error)
            }
        }
    }

    // Minting Logic
    const handleConfirmTransaction = async () => {
        if (!selectedCollection || !address || !contract) {
            toast({
                title: "Error",
                description: "Missing required information (collection, address, or contract).",
                variant: "destructive"
            });
            return;
        }

        try {
            setTransactionStatus("uploading")
            setProgress(0)

            // 1. Prepare Metadata
            // If new file uploaded, upload it. If not, use original image.
            let mediaUrl = originalAsset?.image || "";
            let mediaType = originalAsset?.type || "image";

            if (uploadedFile) {
                // Upload logic handled inside uploadToIpfs wrapper usually, 
                // but useIpfsUpload's 'uploadToIpfs' takes a file and returns { url, metadataUrl } 
                // Wait, useIpfsUpload.uploadToIpfs does both file and metadata. 
                // But if we have no file, useIpfsUpload might error or we need different logic.
                // Let's check useIpfsUpload signature. 
                // It takes (file: File, metadata: IpfsMetadata). 
                // If we don't have a file, we can't use `uploadToIpfs`.
                // We'll have to manually construct metadata and upload ONLY metadata if no file.
                // However, `useIpfsUpload` helper might be coupled. 
                // Assuming we can just call `uploadToIpfs` if file exists.
                // If NO file, we need a way to upload just JSON. 
                // For simplicity, let's assume we use `uploadToIpfs` if file exists, 
                // and if not, we try to create a dummy file or just use a separate 'uploadMetadata' if the hook exposes it.
                // Looking at previous view_file of `useIpfs`: `uploadMetadataToIpfs` IS exposed?
                // Step 106 view: `const { uploadToIpfs, progress: uploadProgress } = useIpfsUpload()` -> destructuring only `uploadToIpfs`.
                // I need to import `uploadMetadataToIpfs` too if it exists. Re-checking previous context...
                // Step 84 view of `useIpfs`: `export function useIpfsUpload() { ... const uploadMetadataToIpfs = ... return { uploadToIpfs, uploadMetadataToIpfs, ... } }`.
                // Yes, it exposes `uploadMetadataToIpfs`.
            }

            const metadataBase = {
                name: formData.name,
                description: formData.description,
                attributes: [
                    ...(originalAsset?.attributes || []),
                    { trait_type: "Remix Type", value: remixTypes.find(t => t.id === formData.remixType)?.name || "Remix" },
                    { trait_type: "Original Asset", value: `${nftAddress}-${tokenId}` },
                    { trait_type: "License", value: licenseOptions.find(l => l.id === formData.license)?.name || "Unknown" },
                    { trait_type: "Commercial Use", value: formData.allowCommercial ? "True" : "False" },
                    { trait_type: "Remixed From", value: `${nftAddress}` }
                ],
                tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
                licenseType: formData.license,
            }

            let finalMetadataUrl = "";

            if (uploadedFile) {
                const { metadataUrl } = await uploadToIpfs(uploadedFile.file, metadataBase)
                finalMetadataUrl = metadataUrl;
            } else {
                // We need to access uploadMetadataToIpfs from the hook
                // But destructuring above only got `uploadToIpfs`.
                // I'll fix hook destructuring below.
                // For now, assuming we have access (I will fix imports).

                // Construct metadata with original image
                const metadataNoFile = {
                    ...metadataBase,
                    image: originalAsset?.image || "",
                    // MIME type fallback?
                };

                // This call will fail if I don't update the hook destructuring in the component first.
                // I will assume I fix it.
                // @ts-ignore
                const { metadataUrl } = await uploadMetadataToIpfs(metadataNoFile);
                finalMetadataUrl = metadataUrl;
            }

            setTransactionStatus("signing")
            setProgress(50)

            console.log("Minting params:", {
                collection_id: selectedCollection.id.toString(),
                recipient: address,
                token_uri: finalMetadataUrl
            });

            // 2. Mint (Permissionless)
            // Using contract.populate to prepare call
            const contractCall = contract.populate("mint", [
                selectedCollection.id.toString(), // collection_id
                address,               // recipient
                finalMetadataUrl       // token_uri
            ]);

            const tx = await mintAsset([contractCall]);
            setTransactionHash(tx.transaction_hash);
            setTransactionStatus("pending"); // Waiting for confirmation

            // Wait for receipt
            if (provider) {
                await provider.waitForTransaction(tx.transaction_hash);
                setTransactionStatus("success");
                setProgress(100);
                toast({
                    title: "Remix Minted Successfully!",
                    description: "Your remix is now on the blockchain.",
                });
            } else {
                // Fallback if no provider to wait (shouldn't happen)
                setTransactionStatus("success");
                setProgress(100);
            }

        } catch (error) {
            console.error("Minting failed", error)
            setTransactionStatus("error")
            toast({
                title: "Transaction Failed",
                description: error instanceof Error ? error.message : "Failed to create remix",
                variant: "destructive",
            })
        }
    }

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false)
        setTransactionStatus("idle")
        setProgress(0)
        setTransactionHash("")
        setCopied(false)
    }

    const handleViewAsset = () => {
        if (selectedCollection) {
            router.push(`/collections/${selectedCollection.nftAddress}`)
        }
    }

    const isFormValid = () => {
        // file is now optional
        return formData.name && formData.description && formData.remixType && formData.license && selectedCollectionId
    }

    const getSelectedRemixType = () => {
        return remixTypes.find((type) => type.id === formData.remixType)
    }

    const getSelectedLicense = () => {
        return licenseOptions.find((license) => license.id === formData.license)
    }

    // Need to get uploadMetadataToIpfs from hook
    const { uploadMetadataToIpfs } = useIpfsUpload();

    // Effect to sync generic progress with upload progress if uploading
    useEffect(() => {
        if (transactionStatus === "uploading") {
            setProgress(uploadProgress)
        }
    }, [uploadProgress, transactionStatus])


    if (assetLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (assetError || !originalAsset) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Asset Not Found</h1>
                    <p className="text-muted-foreground">Original asset could not be loaded.</p>
                    <Link href="/">
                        <Button>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Original Asset Reference */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    {/* Original Asset Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GitBranch className="h-5 w-5" />
                                Original Asset
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="aspect-square relative bg-gradient-to-br from-muted/50 to-muted rounded-lg overflow-hidden">
                                <Image
                                    src={originalAsset.image || "/placeholder.svg"}
                                    alt={originalAsset.name || "Asset"}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                />
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold line-clamp-1">{originalAsset.name}</h3>
                                <div className="text-sm text-muted-foreground flex items-center gap-1 group">
                                    <span>by</span>
                                    {originalAsset.creator?.name ? (
                                        <span className="font-medium text-foreground">{originalAsset.creator.name}</span>
                                    ) : (
                                        <span className="font-mono bg-muted px-1 rounded" title={originalAsset.creator?.address}>
                                            {formatAddress(originalAsset.creator?.address)}
                                        </span>
                                    )}
                                </div>
                                <Badge variant="outline">{originalAsset.type || 'Asset'}</Badge>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">License</h4>
                                <Badge variant="secondary">{originalAsset.licenseType || 'Unknown'}</Badge>
                                <p className="text-xs text-muted-foreground">
                                    This license allows remixing with proper attribution.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attribution Notice */}
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            Your remix will automatically include attribution to the original creator.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>

            {/* Right Column - Remix Form */}
            <div className="lg:col-span-2 space-y-8">

                {/* Collection Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Destination Collection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="collection">Select Collection</Label>
                            <div className="flex gap-2">
                                <Select
                                    value={selectedCollectionId}
                                    onValueChange={setSelectedCollectionId}
                                >
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Select a collection" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {collections.map((collection) => (
                                            <SelectItem key={collection.id.toString()} value={collection.id.toString()}>
                                                {collection.name}
                                            </SelectItem>
                                        ))}
                                        {collections.length === 0 && (
                                            <div className="p-2 text-sm text-muted-foreground text-center">
                                                No collections found
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="icon" asChild>
                                    <Link href="/create/collection" target="_blank">
                                        <Plus className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Select an existing collection to mint your remix into, or create a new one.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Remix Type Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Remix Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={formData.remixType}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, remixType: value }))}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {remixTypes.map((type) => (
                                    <div key={type.id} className="flex items-center space-x-2">
                                        <RadioGroupItem value={type.id} id={type.id} />
                                        <Label htmlFor={type.id} className="flex-1 cursor-pointer">
                                            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <type.icon className="h-4 w-4" />
                                                    <span className="font-medium">{type.name}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{type.description}</p>
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* File Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Upload Your Remix
                            <span className="ml-2 text-sm text-muted-foreground font-normal">(Optional)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {uploadedFile ? (
                                <div className="space-y-4">
                                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                                    <div>
                                        <p className="font-medium">{uploadedFile.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <Button type="button" variant="outline" onClick={() => setUploadedFile(null)}>
                                        Remove File
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                                    <div>
                                        <p className="font-medium">Drop your file here or click to browse</p>
                                        <p className="text-sm text-muted-foreground">Supports images, audio, video, and documents</p>
                                        <p className="text-xs text-muted-foreground">If skipped, existing asset image will be used.</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="file-upload"
                                        onChange={(e) => handleFileUpload(e.target.files)}
                                        accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
                                    />
                                    <Button type="button" variant="outline" asChild>
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            Choose File
                                        </label>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Remix Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Remix Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter remix name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe your remix and how it relates to the original"
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (optional)</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                                placeholder="remix, derivative, art, music (comma separated)"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* License Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle>License Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>License Type</Label>
                            <Select
                                value={formData.license}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, license: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a license" />
                                </SelectTrigger>
                                <SelectContent>
                                    {licenseOptions.map((license) => (
                                        <SelectItem key={license.id} value={license.id}>
                                            <div>
                                                <div className="font-medium">{license.name}</div>
                                                <div className="text-xs text-muted-foreground">{license.description}</div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Section */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                <p>
                                    Estimated cost: <span className="font-medium">0.001 STRK</span>
                                </p>
                                <p>Includes minting fees</p>
                            </div>

                            <div className="flex gap-2">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={`/collections/${nftAddress}`}>Cancel</Link>
                                </Button>

                                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                                    <DrawerTrigger asChild>
                                        <Button onClick={() => setIsDrawerOpen(true)} disabled={!isFormValid()} className="min-w-[120px]">
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Create Remix
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent className="max-h-[90vh]">
                                        <div className="mx-auto w-full max-w-4xl">
                                            <DrawerHeader>
                                                <DrawerTitle className="flex items-center gap-2">
                                                    {transactionStatus === "idle" && <GitBranch className="h-5 w-5" />}
                                                    {transactionStatus === "uploading" && <Upload className="h-5 w-5 animate-pulse" />}
                                                    {transactionStatus === "signing" && <Loader2 className="h-5 w-5 animate-spin" />}
                                                    {transactionStatus === "pending" && <Loader2 className="h-5 w-5 animate-spin" />}
                                                    {transactionStatus === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                                    {transactionStatus === "error" && <XCircle className="h-5 w-5 text-red-500" />}

                                                    {transactionStatus === "idle" && "Review Your Remix"}
                                                    {transactionStatus === "uploading" && "Uploading Metadata..."}
                                                    {transactionStatus === "signing" && "Please Sign Transaction"}
                                                    {transactionStatus === "pending" && "Transaction Pending"}
                                                    {transactionStatus === "success" && "Remix Created Successfully!"}
                                                    {transactionStatus === "error" && "Transaction Failed"}
                                                </DrawerTitle>
                                                <DrawerDescription>
                                                    {transactionStatus === "idle" &&
                                                        "Review the details below and confirm to create your remix on the blockchain."}
                                                    {transactionStatus === "uploading" && "Storing metadata on IPFS."}
                                                    {transactionStatus === "signing" && "Please confirm the transaction in your wallet."}
                                                    {transactionStatus === "pending" && "Your remix is being created on the blockchain."}
                                                    {transactionStatus === "success" &&
                                                        "Your remix has been successfully minted and is now available."}
                                                </DrawerDescription>
                                            </DrawerHeader>

                                            <div className="p-4 pb-0 space-y-6">
                                                {/* Progress Bar */}
                                                {transactionStatus !== "idle" && (
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span>Progress</span>
                                                            <span>{progress.toFixed(0)}%</span>
                                                        </div>
                                                        <Progress value={progress} className="w-full" />
                                                    </div>
                                                )}

                                                {/* Transaction Hash */}
                                                {transactionHash && (
                                                    <div className="space-y-2">
                                                        <Label>Transaction Hash</Label>
                                                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                                            <code className="flex-1 text-sm font-mono truncate">{transactionHash}</code>
                                                            <Button size="sm" variant="ghost" onClick={handleCopyHash} className="h-8 w-8 p-0">
                                                                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                            </Button>
                                                            <Button size="sm" variant="ghost" asChild className="h-8 w-8 p-0">
                                                                <a
                                                                    href={`https://sepolia.voyager.online/tx/${transactionHash}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Review Content - Only show when idle */}
                                                {transactionStatus === "idle" && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* Remix Preview */}
                                                        <div className="space-y-4">
                                                            <h3 className="font-semibold">Your Remix</h3>
                                                            <Card>
                                                                <CardContent className="p-4 space-y-3">
                                                                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                                                                        {uploadedFile ? (
                                                                            uploadedFile.type.startsWith("image/") ? (
                                                                                <img
                                                                                    src={uploadedFile.previewUrl || "/placeholder.svg"}
                                                                                    alt="Remix preview"
                                                                                    className="max-w-full max-h-full object-contain"
                                                                                />
                                                                            ) : (
                                                                                <div className="text-center">
                                                                                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                                                                    <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
                                                                                </div>
                                                                            )
                                                                        ) : (
                                                                            <Image
                                                                                src={originalAsset.image || "/placeholder.svg"}
                                                                                alt="Remix preview from original"
                                                                                fill
                                                                                className="object-cover opacity-80"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium">{formData.name}</h4>
                                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                                            {formData.description}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Badge variant="outline">{getSelectedRemixType()?.name}</Badge>
                                                                        <Badge variant="secondary">{getSelectedLicense()?.name}</Badge>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Success Content */}
                                                {transactionStatus === "success" && (
                                                    <div className="text-center space-y-4">
                                                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                                                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold mb-2">Remix Created Successfully!</h3>
                                                            <p className="text-muted-foreground">
                                                                Your remix "{formData.name}" has been minted and is now available on the blockchain.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                <DrawerFooter className="px-0">
                                                    {transactionStatus === "idle" && (
                                                        <div className="flex w-full gap-2">
                                                            <Button onClick={handleConfirmTransaction} className="flex-1">
                                                                Confirm & Mint (0.001 STRK)
                                                            </Button>
                                                            <DrawerClose asChild>
                                                                <Button variant="outline" className="flex-1" onClick={handleCloseDrawer}>Cancel</Button>
                                                            </DrawerClose>
                                                        </div>
                                                    )}
                                                    {transactionStatus === "success" && (
                                                        <div className="flex w-full gap-2">
                                                            <Button onClick={handleViewAsset} className="flex-1">
                                                                View Collection
                                                            </Button>
                                                            <DrawerClose asChild>
                                                                <Button variant="outline" className="flex-1" onClick={handleCloseDrawer}>Close</Button>
                                                            </DrawerClose>
                                                        </div>
                                                    )}
                                                    {transactionStatus === "error" && (
                                                        <div className="flex w-full gap-2">
                                                            <Button onClick={handleConfirmTransaction} className="flex-1">
                                                                Try Again
                                                            </Button>
                                                            <DrawerClose asChild>
                                                                <Button variant="outline" className="flex-1" onClick={handleCloseDrawer}>Close</Button>
                                                            </DrawerClose>
                                                        </div>
                                                    )}
                                                </DrawerFooter>
                                            </div>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
