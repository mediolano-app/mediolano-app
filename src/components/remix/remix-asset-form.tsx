"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAccount, useContract, useSendTransaction, useProvider } from "@starknet-react/core"
import { useRouter } from "next/navigation"
import { Abi, num, hash } from "starknet"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    FileText,
    Globe,
    Layers
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
import { licenseTypes, geographicScopes } from "@/types/asset"
import { cn, shortenAddress } from "@/lib/utils"

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

interface RemixAssetFormProps {
    nftAddress: string
    tokenId: number
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        geographicScope: "worldwide",
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
        if (originalLicense.includes("MIT")) return "custom"
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
                    { trait_type: "License", value: formData.license },
                    { trait_type: "Commercial Use", value: formData.allowCommercial ? "True" : "False" },
                    { trait_type: "Remixed From", value: `${nftAddress}` },
                    {
                        trait_type: "Geographic Scope",
                        value: formData.geographicScope === "custom" || formData.geographicScope === "other" || formData.geographicScope === "eu"
                            ? `${formData.geographicScope} - ${formData.territory}`
                            : formData.geographicScope
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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const transferSelector = hash.getSelectorFromName("Transfer");

                // @ts-ignore
                if (receipt.events) {
                    // @ts-ignore
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    if (assetLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (assetError || !originalAsset) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-4 p-8 glass-card max-w-md mx-auto">
                    <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertDescription className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold">Asset Not Found</h1>
                    <p className="text-muted-foreground">Original asset could not be loaded or network issue.</p>
                    <Link href="/">
                        <Button className="glass-button">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column - Original Asset Reference */}
            <div className="lg:col-span-4 space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="glass-card overflow-hidden">
                        <div className="p-6 border-b border-white/5 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <GitBranch className="h-4 w-4" />
                                    Original Asset
                                </div>
                                <Link href={`/asset/${nftAddress}-${tokenId}`} target="_blank">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 rounded-full">
                                        <ExternalLink className="h-4 w-4" />
                                        <span className="sr-only">View Original</span>
                                    </Button>
                                </Link>
                            </div>
                            <h2 className="font-bold text-xl line-clamp-1">{originalAsset.name}</h2>
                        </div>

                        <div className="aspect-square relative bg-white/5">
                            <Image
                                src={originalAsset.image || "/placeholder.svg"}
                                alt={originalAsset.name || "Asset"}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 33vw"
                            />
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">License Model</span>
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">
                                        {/* Correctly traversing attributes for license type */}
                                        {originalAsset.attributes?.find(a => a.trait_type === "License Type")?.value || originalAsset.licenseType || 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            <Alert className="glass bg-primary/10 border-primary/20">
                                <Info className="h-4 w-4 text-primary" />
                                <AlertDescription className="text-xs text-primary/80 ml-2">
                                    Remixes automatically attribute the original creator.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Column - Remix Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-8 space-y-8"
            >

                {/* Collection Selection */}
                <div className="glass-card p-6 md:p-8 space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Layers className="h-5 w-5 text-primary" />
                            Destination Collection
                        </h3>
                        <p className="text-sm text-muted-foreground">Where should this remix live?</p>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="collection" className="sr-only">Select Collection</Label>
                            <Select
                                value={selectedCollectionId}
                                onValueChange={setSelectedCollectionId}
                            >
                                <SelectTrigger className="h-12 bg-white/5 border-white/10 focus:ring-primary/50">
                                    <SelectValue placeholder="Select a collection..." />
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
                        </div>
                        <Button variant="outline" size="icon" className="h-12 w-12 shrink-0 glass-button" asChild title="Create New Collection">
                            <Link href="/create/collection" target="_blank">
                                <Plus className="h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Remix Type Selection */}
                <div className="glass-card p-6 md:p-8 space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <GitBranch className="h-5 w-5 text-primary" />
                            Remix Type
                        </h3>
                        <p className="text-sm text-muted-foreground">How have you modified the work?</p>
                    </div>

                    <RadioGroup
                        value={formData.remixType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, remixType: value }))}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        {remixTypes.map((type) => (
                            <Label
                                key={type.id}
                                htmlFor={type.id}
                                className={cn(
                                    "cursor-pointer relative overflow-hidden rounded-xl border-2 p-4 transition-all hover:bg-white/5",
                                    formData.remixType === type.id
                                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                                        : "border-transparent bg-white/5 hover:border-white/20"
                                )}
                            >
                                <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                                <div className="space-y-3">
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                                        formData.remixType === type.id ? "bg-primary text-primary-foreground" : "bg-white/10"
                                    )}>
                                        <type.icon className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="font-semibold text-sm">{type.name}</div>
                                        <p className="text-xs text-muted-foreground leading-snug">{type.description}</p>
                                    </div>
                                </div>
                            </Label>
                        ))}
                    </RadioGroup>
                </div>

                {/* File Upload */}
                <div className="glass-card p-6 md:p-8 space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Upload className="h-5 w-5 text-primary" />
                                Upload Your Remix
                            </h3>
                            <Badge variant="secondary" className="font-normal text-xs bg-white/10 text-muted-foreground">Optional</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">If skipped, we&apos;ll use the original asset image.</p>
                    </div>

                    <div
                        className={cn(
                            "border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ease-in-out",
                            dragActive ? "border-primary bg-primary/10 scale-[1.01]" : "border-white/10 bg-white/5 hover:border-white/20",
                            uploadedFile ? "border-green-500/50 bg-green-500/5" : ""
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        {uploadedFile ? (
                            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                {uploadedFile.type.startsWith("image/") || uploadedFile.type.startsWith("img") ? (
                                    <div className="relative h-48 w-full max-w-[300px] mx-auto rounded-lg overflow-hidden border border-white/10 shadow-lg mb-4">
                                        <Image
                                            src={uploadedFile.previewUrl}
                                            alt={uploadedFile.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                                        <CheckCircle className="h-8 w-8" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium text-lg">{uploadedFile.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                                <Button type="button" variant="outline" onClick={() => setUploadedFile(null)} className="glass-button">
                                    Replace File
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                    <Upload className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="font-medium text-lg">Drag & Drop your file</p>
                                    <p className="text-sm text-muted-foreground">Supports images, audio, video, documents</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    id="file-upload"
                                    onChange={(e) => handleFileUpload(e.target.files)}
                                    accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
                                />
                                <Button type="button" variant="secondary" asChild className="glass-button">
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        Browse Files
                                    </label>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Remix Details */}
                <div className="glass-card p-6 md:p-8 space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Remix Details
                        </h3>
                    </div>

                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter remix name"
                                className="bg-white/5 border-white/10 focus:ring-primary/50 h-11"
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
                                className="bg-white/5 border-white/10 focus:ring-primary/50 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags <span className="text-muted-foreground font-normal">(comma separated)</span></Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                                placeholder="remix, cyber, abstract..."
                                className="bg-white/5 border-white/10 focus:ring-primary/50 h-11"
                            />
                        </div>
                    </div>
                </div>

                {/* License Configuration */}
                <div className="glass-card p-6 md:p-8 space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            License Configuration
                        </h3>
                        <p className="text-sm text-muted-foreground">Define how others can use your remix.</p>
                    </div>

                    <div className="grid gap-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>License Type</Label>
                                <Select
                                    value={formData.license}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, license: value }))}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10 focus:ring-primary/50 h-11">
                                        <SelectValue placeholder="Select license" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {licenseTypes.map((license) => (
                                            <SelectItem key={license.id} value={license.id}>
                                                <span className="font-medium">{license.name}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Geographic Scope</Label>
                                <Select
                                    value={formData.geographicScope}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, geographicScope: value }))}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10 focus:ring-primary/50 h-11">
                                        <SelectValue placeholder="Select scope" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {geographicScopes.map((scope) => (
                                            <SelectItem key={scope.value} value={scope.value}>
                                                {scope.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {(formData.geographicScope === "other" || formData.geographicScope === "custom" || formData.geographicScope === "eu") && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="territory">Specific Territory</Label>
                                <Input
                                    id="territory"
                                    placeholder="e.g. Germany, France, Japan..."
                                    value={formData.territory}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, territory: e.target.value }))}
                                    className="bg-white/5 border-white/10 focus:ring-primary/50"
                                />
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fieldOfUse">Field of Use</Label>
                                <Input
                                    id="fieldOfUse"
                                    placeholder="e.g. Medical, Gaming..."
                                    value={formData.fieldOfUse}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, fieldOfUse: e.target.value }))}
                                    className="bg-white/5 border-white/10 focus:ring-primary/50 h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="licenseDuration">Duration</Label>
                                <Input
                                    id="licenseDuration"
                                    placeholder="e.g. Perpetual, 5 years..."
                                    value={formData.licenseDuration}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, licenseDuration: e.target.value }))}
                                    className="bg-white/5 border-white/10 focus:ring-primary/50 h-11"
                                />
                            </div>
                        </div>

                        {/* Collapsible Advanced Section or simple divider */}
                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="grantBack" className="text-xs uppercase tracking-wider text-muted-foreground">Grant-back Clause</Label>
                                    <Input
                                        id="grantBack"
                                        placeholder="Conditions for improvements..."
                                        value={formData.grantBack}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, grantBack: e.target.value }))}
                                        className="bg-white/5 border-white/10 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="aiRights" className="text-xs uppercase tracking-wider text-muted-foreground">AI & Data Policy</Label>
                                    <Input
                                        id="aiRights"
                                        placeholder="AI Training allowed/prohibited..."
                                        value={formData.aiRights}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, aiRights: e.target.value }))}
                                        className="bg-white/5 border-white/10 focus:ring-primary/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Section */}
                {/* Submit Section */}
                <div className="glass-card p-6 flex flex-col sm:flex-row gap-6 items-center justify-between z-20 backdrop-blur-xl border-primary/20 shadow-2xl">
                    <div className="text-sm">
                        <p className="text-muted-foreground">
                            <span className="text-green-500">Mediolano Protocol + IP Creator = Zero fees</span>
                            <br />
                            Estimated transaction cost: <span className="font-medium text-foreground">0.001 STRK</span>
                        </p>
                    </div>

                    <div className="flex gap-4 w-full sm:w-auto">

                        <Button
                            onClick={handleSubmit}
                            disabled={!isFormValid()}
                            className="flex-1 sm:flex-none min-w-[160px] shadow-lg hover:shadow-primary/20 transition-all font-semibold"
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Create Remix
                        </Button>
                    </div>
                </div>

            </motion.div>

            <MintSuccessDrawer
                isOpen={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                step={creationStep}
                progress={progress}
                mintResult={mintResult}
                assetTitle={formData.name}
                assetDescription={formData.description}
                assetType={`Remix of ${originalAsset.id && originalAsset.id.includes('-') ? shortenAddress(originalAsset.id.split('-')[0]) : originalAsset.name}`}
                error={mintError}
                onConfirm={handleConfirmTransaction}
                cost="0.001 STRK"
                previewImage={drawerPreviewImage}
                data={{
                    "Remix Type": remixTypes.find(t => t.id === formData.remixType)?.name || "Unknown",
                    "License": licenseTypes.find(l => l.id === formData.license)?.name || "Unknown",
                    "Collection": selectedCollection?.name || "Unknown"
                }}
            />
        </div>
    )
}
