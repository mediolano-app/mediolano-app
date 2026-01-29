"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAccount, useContract, useSendTransaction, useProvider } from "@starknet-react/core"
import { useRouter } from "next/navigation"
import { Abi, num, hash } from "starknet"
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
    Loader2,
    Plus,
    ExternalLink,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useAsset } from "@/hooks/use-asset"
import { useGetCollections } from "@/hooks/use-collection"
import { useIpfsUpload } from "@/hooks/useIpfs"
import { ipCollectionAbi } from "@/abis/ip_collection"
import { COLLECTION_CONTRACT_ADDRESS } from "@/lib/constants"
import { MintSuccessDrawer, MintDrawerStep } from "@/components/mint-success-drawer"
import { IMintResult } from "@/hooks/use-create-asset"

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
    const [creationStep, setCreationStep] = useState<MintDrawerStep>("idle")
    const [progress, setProgress] = useState(0)
    const [transactionHash, setTransactionHash] = useState<string | null>(null)
    const [mintError, setMintError] = useState<string | null>(null)
    const [mintResult, setMintResult] = useState<IMintResult | null>(null)

    // For Review Preview
    const [drawerPreviewImage, setDrawerPreviewImage] = useState<string | null>(null)

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
        // Extended License
        territory: "",
        fieldOfUse: "",
        licenseDuration: "perpetual",
        grantBack: "",
        aiRights: "",
    })

    // Hooks
    const { uploadToIpfs, uploadMetadataToIpfs, progress: uploadProgress } = useIpfsUpload()

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

    // Minting Logic
    const handleSubmit = () => {
        setMintError(null);
        setMintResult(null);
        setCreationStep("idle");

        // Prepare preview for Review
        if (uploadedFile) {
            setDrawerPreviewImage(uploadedFile.previewUrl);
        } else if (originalAsset?.image) {
            setDrawerPreviewImage(originalAsset.image);
        } else {
            setDrawerPreviewImage(null);
        }

        setIsDrawerOpen(true);
    };

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
            setCreationStep("uploading")
            setProgress(0)

            // 1. Prepare Metadata UI Logic (Reuse existing flow)
            let finalMetadataUrl = "";

            const metadataBase = {
                name: formData.name,
                description: formData.description,
                attributes: [
                    ...(originalAsset?.attributes || []),
                    { trait_type: "Remix Type", value: remixTypes.find(t => t.id === formData.remixType)?.name || "Remix" },
                    { trait_type: "Original Asset", value: `${nftAddress}-${tokenId}` },
                    { trait_type: "Original Creator", value: originalAsset?.creator?.name || originalAsset?.creator?.address || "Unknown" },
                    { trait_type: "Original Asset Address", value: nftAddress },
                    { trait_type: "License", value: licenseOptions.find(l => l.id === formData.license)?.name || "Unknown" },
                    { trait_type: "Commercial Use", value: formData.allowCommercial ? "True" : "False" },
                    { trait_type: "Remixed From", value: `${nftAddress}` },
                    {
                        trait_type: "Geographic Scope",
                        value: formData.territory ? `Restricted - ${formData.territory}` : "Worldwide"
                    },
                    { trait_type: "License Duration", value: formData.licenseDuration || "Perpetual" },
                    { trait_type: "Field of Use", value: formData.fieldOfUse || "Unrestricted" },
                    { trait_type: "Grant-back Clause", value: formData.grantBack || "None" },
                    { trait_type: "AI & Data Mining Policy", value: formData.aiRights || "Unspecified" }
                ],
                tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
                licenseType: formData.license,
            }

            if (uploadedFile) {
                const { metadataUrl } = await uploadToIpfs(uploadedFile.file, metadataBase)
                finalMetadataUrl = metadataUrl;
            } else {
                const metadataNoFile = {
                    ...metadataBase,
                    image: originalAsset?.image || "",
                };
                const { metadataUrl } = await uploadMetadataToIpfs(metadataNoFile);
                finalMetadataUrl = metadataUrl;
            }

            setCreationStep("processing")
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
            // Wait logic is handled, but drawer stays in processing until we verify

            if (provider) {
                await provider.waitForTransaction(tx.transaction_hash);

                const receipt = await provider.getTransactionReceipt(tx.transaction_hash);
                let mintedId = "";
                // @ts-ignore
                const tokenMintedSelector = hash.getSelectorFromName("TokenMinted");
                const transferSelector = hash.getSelectorFromName("Transfer");

                // @ts-ignore
                if (receipt.events) {
                    // @ts-ignore
                    const event = receipt.events.find((e: any) =>
                        e.keys?.[0] === transferSelector ||
                        e.keys?.[0] === tokenMintedSelector
                    );

                    if (event) {
                        if (event.keys?.[0] === tokenMintedSelector && event.data && event.data.length >= 4) {
                            // TokenMinted: data[2] is low part of token_id
                            const low = event.data[2];
                            mintedId = num.toBigInt(low).toString();
                        } else if (event.keys.length > 2) {
                            // Transfer (ERC721): usually keys[3] is token_id
                            if (event.keys[3]) {
                                mintedId = parseInt(event.keys[3], 16).toString();
                            }
                        }
                    }
                }

                setMintResult({
                    transactionHash: tx.transaction_hash,
                    tokenId: mintedId || "Unknown",
                    collectionId: selectedCollection.id.toString(),
                    assetSlug: mintedId ? `${selectedCollection.nftAddress}-${mintedId}` : ""
                });

                setCreationStep("success");
                setProgress(100);
                toast({
                    title: "Remix Minted Successfully!",
                    description: "Your remix is now on the blockchain.",
                });
            } else {
                setCreationStep("success");
                setProgress(100);
            }

        } catch (error) {
            console.error("Minting failed", error)
            setMintError(error instanceof Error ? error.message : "Failed to create remix")
            toast({
                title: "Transaction Failed",
                description: error instanceof Error ? error.message : "Failed to create remix",
                variant: "destructive",
            })
        }
    }

    // Effect to sync generic progress with upload progress if uploading
    useEffect(() => {
        if (creationStep === "uploading") {
            setProgress(uploadProgress)
        }
    }, [uploadProgress, creationStep])


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
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <GitBranch className="h-5 w-5" />
                                    Original Asset
                                </div>
                                <Link href={`/asset/${nftAddress}-${tokenId}`} target="_blank">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <ExternalLink className="h-4 w-4" />
                                        <span className="sr-only">View Original</span>
                                    </Button>
                                </Link>
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
                                <h2 className="font-semibold line-clamp-1">{originalAsset.name}</h2>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">License: {originalAsset.licenseType || 'Unknown'}</h4>
                                <Badge variant="outline">This license allows remixing with proper attribution.</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attribution Notice */}
                    <Alert className="glass-card">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            Your remix will automatically include attribution to the original asset and creator.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>

            {/* Right Column - Remix Form */}
            <div className="lg:col-span-2 space-y-8 bg-card/20 no-border rounded-xl p-4">

                {/* Collection Selection */}
                <Card className="glass-card">
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
                                        {collectionsLoading && (
                                            <div className="p-2 text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading...
                                            </div>
                                        )}
                                        {!collectionsLoading && collections.length === 0 && (
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
                <Card className="glass-card">
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
                <Card className="glass-card">
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
                <Card className="glass-card">
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
                <Card className="glass-card">
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

                        {/* Specific Territory */}
                        <div className="space-y-2">
                            <Label htmlFor="territory" className="text-sm font-medium">Specific Territory (Optional)</Label>
                            <Input
                                id="territory"
                                placeholder="Worldwide if left empty, or e.g. Germany, France..."
                                value={formData.territory}
                                onChange={(e) => setFormData((prev) => ({ ...prev, territory: e.target.value }))}
                            />
                        </div>

                        {/* Field of Use */}
                        <div className="space-y-2">
                            <Label htmlFor="fieldOfUse" className="text-base font-medium">Field of Use</Label>
                            <Textarea
                                id="fieldOfUse"
                                placeholder="Specify industries or applications (e.g. Medical devices)..."
                                value={formData.fieldOfUse}
                                onChange={(e) => setFormData((prev) => ({ ...prev, fieldOfUse: e.target.value }))}
                                className="resize-none"
                            />
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <Label htmlFor="licenseDuration" className="text-base font-medium">License Duration</Label>
                            <Input
                                id="licenseDuration"
                                placeholder="e.g. Perpetual, 5 years, until 2030..."
                                value={formData.licenseDuration}
                                onChange={(e) => setFormData((prev) => ({ ...prev, licenseDuration: e.target.value }))}
                            />
                        </div>

                        {/* Advanced Clauses & AI */}
                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-medium text-base">Advanced Clauses</h4>

                            <div className="space-y-2">
                                <Label htmlFor="grantBack" className="text-base font-medium">Grant-back Clause</Label>
                                <Input
                                    id="grantBack"
                                    placeholder="e.g. Licensee must grant back rights to improvements..."
                                    value={formData.grantBack}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, grantBack: e.target.value }))}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Specify conditions for improvements made to the IP.
                                </p>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label htmlFor="aiRights" className="text-base font-medium">AI & Data Mining Policy</Label>
                                <Input
                                    id="aiRights"
                                    placeholder="e.g. No AI Training allowed, Zero Retention required..."
                                    value={formData.aiRights}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, aiRights: e.target.value }))}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Define rights regarding Artificial Intelligence training and data usage.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Section */}
                <Card className="glass-card">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                <p>
                                    Estimated cost: <span className="font-medium">0.001 STRK</span>
                                </p>
                                <p>Zero fees</p>
                            </div>

                            <div className="flex gap-2">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={`/collections/${nftAddress}`}>Cancel</Link>
                                </Button>

                                <Button onClick={handleSubmit} disabled={!isFormValid()} className="min-w-[120px]">
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Create Remix
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <MintSuccessDrawer
                isOpen={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                step={creationStep}
                progress={progress}
                mintResult={mintResult}
                assetTitle={formData.name}
                assetDescription={formData.description}
                assetType={`Remix of ${originalAsset.id}`}
                error={mintError}
                onConfirm={handleConfirmTransaction}
                cost="0.001 STRK"
                previewImage={drawerPreviewImage}
                data={{
                    "Remix Type": remixTypes.find(t => t.id === formData.remixType)?.name || "Unknown",
                    "License": licenseOptions.find(l => l.id === formData.license)?.name || "Unknown",
                    "Collection": selectedCollection?.name || "Unknown"
                }}
            />
        </div>
    )
}
