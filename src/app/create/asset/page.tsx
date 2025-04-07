"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Image,
  Info,
  Link2,
  Loader2,
  Music,
  Shield,
  Upload,
  X,
  Code,
  Zap,
  File,
  Globe2,
  Box,
  NotepadText,
  Clapperboard,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TagInput } from "@/components/TagInput"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { Abi } from "starknet";
import { abi } from "@/abis/abi";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface Asset {
  title: string;
  description: string;
  author: string;
  type: string;
  mediaUrl: string;
  externalUrl: string;
  tags: string[];
  license: string;
  limited: boolean;
  totalSupply: number;
  collection: string;
  version: string;
}

const types = [
  { id: "1", name: "3D Model" },
  { id: "2", name: "AI Model" },
  { id: "3", name: "Artwork" },
  { id: "4", name: "Audio" },
  { id: "5", name: "Document" },
  { id: "6", name: "Literary" },
  { id: "7", name: "Publication" },
  { id: "8", name: "RWA" },
  { id: "9", name: "Software" },
  { id: "10", name: "Video" },
  { id: "11", name: "Other" },
];

const licenses = [
  { id: "1", name: "All Rights Reserved" },
  { id: "2", name: "Creative Commons" },
  { id: "3", name: "MIT License" },
  { id: "4", name: "GNU General Public License" },
];

const collections = [
  { id: "1", name: "Programmable IP Collection" },
];

// Define the form schema with zod
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(100),
  author: z.string().min(2, { message: "Author name must be at least 2 characters" }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(1000),
  type: z.enum(["3d-model", "ai-model", "artwork", "audio", "document", "literary", "post", "rwa", "software", "video", "other"]),
  collection: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  mediaUrl: z.string().url().optional().or(z.literal("")),
  externalUrl: z.string().url().optional().or(z.literal("")),
  licenseType: z.enum(["all-rights", "creative-commons", "open-source", "custom"]),
  licenseDetails: z.string().optional(),
  version: z.string().optional(),
  commercialUse: z.boolean().default(false),
  modifications: z.boolean().default(false),
  attribution: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

// Mock file type icons
const fileTypeIcons = {
  "image/jpeg": Image,
  "image/png": Image,
  "image/gif": Image,
  "video/mp4": FileText,
  "audio/mpeg": Music,
  "application/pdf": FileText,
  "text/plain": FileText,
  "application/zip": FileText,
  "application/json": Code,
  "text/javascript": Code,
  "text/html": Code,
  "text/css": Code,
  default: FileText,
}

// Mock blockchain data
const mockBlockchainData = {
  gas: 0.000342,
  gasPrice: "0.01 STRK",
  totalFee: "0.01 STRK",
  network: "Starknet",
  contractAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  estimatedConfirmationTime: "< 10 seconds",
  walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export default function CreateIPPage() {

  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("details")

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({})
  const [formProgress, setFormProgress] = useState(33)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<"waiting" | "processing" | "success" | "error">("waiting")
  const [useMediaUrl, setUseMediaUrl] = useState(false)
  {/*}
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newCollection, setNewCollection] = useState("")
  const [isNewCollection, setIsNewCollection] = useState(false)
    */}

  const [asset, setAsset] = useState<Asset>({
    title: "",
    description: "",
    author: "",
    type: "",
    mediaUrl: "",
    externalUrl: "",
    tags: [],
    license: "",
    limited: false,
    totalSupply: 1,
    collection: "MIP Collection",
    version: "1",
  });
  
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCollection, setNewCollection] = useState("");
  const [isNewCollection, setIsNewCollection] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address } = useAccount();
  const { contract } = useContract({
    abi: abi as Abi,
    address:
      "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0",
  });

  const { send, error: transactionError } = useSendTransaction({
    calls:
      contract && address
        ? [contract.populate("mint_item", [address, ipfsHash])]
        : undefined,
  });

  const handleMintNFT = async () => {
    if (!ipfsHash) {
      toast({ title: "Error", description: "Error creating metadata." });
      return;
    }
    try {
      send();
      toast({
        title: "Success",
        description: "Confirm your Mint on your wallet.",
      });
    } catch (error) {
      console.log("mint error", transactionError);
      toast({ title: "Error", description: "Error minting asset." });
    }
  };

  useEffect(() => {
    if (ipfsHash) {
      handleMintNFT();
    }
  }, [ipfsHash]);


  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Prevent the default browser behavior
      event.preventDefault()

      console.error("Unhandled promise rejection in create page:", event.reason)

      // Show a toast notification with more specific information
      let errorMessage = "An unexpected error occurred. Please try again."

      if (event.reason && typeof event.reason === "object") {
        if ("message" in event.reason) {
          errorMessage = `Error: ${(event.reason as Error).message}`
        }
      }

      toast({
        title: "Unexpected Error",
        description: errorMessage,
        variant: "destructive",
      })
    }

    // Add event listener for unhandled rejections
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    // Add event listener for uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.error("Uncaught error:", event.error)
      event.preventDefault()
    }
    window.addEventListener("error", handleError)

    // Clean up
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("error", handleError)
    }
  }, [toast])

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      externalUrl: "",
      type: "artwork",
      collection: "",
      tags: [],
      mediaUrl: "",
      licenseType: "all-rights",
      licenseDetails: "",
      version: "1.0",
      commercialUse: false,
      modifications: false,
      attribution: true,
    },
    mode: "onChange",
  })

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Update progress based on tab
    if (value === "details") setFormProgress(33)
    else if (value === "assets") setFormProgress(66)
    else if (value === "rights") setFormProgress(100)
  }

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files)
        setUploadedFiles((prev) => [...prev, ...newFiles])

        // Create preview URLs for images
        newFiles.forEach((file) => {
          try {
            if (file.type.startsWith("image/")) {
              const url = URL.createObjectURL(file)
              setPreviewUrls((prev) => ({ ...prev, [file.name]: url }))
            }
          } catch (fileError) {
            console.error("Error creating preview URL:", fileError)
          }
        })

        // Simulate upload progress
        simulateUploadProgress()
      }
    } catch (error) {
      console.error("Error handling file upload:", error)
      toast({
        title: "Upload Error",
        description: "There was a problem uploading your files. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle drag and drop uploads
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    try {
      e.preventDefault()

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const newFiles = Array.from(e.dataTransfer.files)
        setUploadedFiles((prev) => [...prev, ...newFiles])

        // Create preview URLs for images
        newFiles.forEach((file) => {
          try {
            if (file.type.startsWith("image/")) {
              const url = URL.createObjectURL(file)
              setPreviewUrls((prev) => ({ ...prev, [file.name]: url }))
            }
          } catch (fileError) {
            console.error("Error creating preview URL:", fileError)
          }
        })

        // Simulate upload progress
        simulateUploadProgress()
      }
    } catch (error) {
      console.error("Error handling file drop:", error)
      toast({
        title: "Upload Error",
        description: "There was a problem with the dropped files. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Simulate file upload progress
  const simulateUploadProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  // Remove a file from the uploaded files
  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName))

    // Revoke object URL if it exists
    if (previewUrls[fileName]) {
      URL.revokeObjectURL(previewUrls[fileName])
      setPreviewUrls((prev) => {
        const newUrls = { ...prev }
        delete newUrls[fileName]
        return newUrls
      })
    }
  }

  // Get file icon based on mime type
  const getFileIcon = (mimeType: string) => {
    const IconComponent = fileTypeIcons[mimeType as keyof typeof fileTypeIcons] || fileTypeIcons.default
    return <IconComponent className="h-5 w-5" />
  }

  // Open file selection dialog
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Handle collection selection
  const handleCollectionChange = (value: string) => {
    if (value === "new") {
      setIsNewCollection(true)
      form.setValue("collection", "")
    } else {
      setIsNewCollection(false)
      form.setValue("collection", value)
    }
  }














  // Handle review submission
  const handleReviewSubmit = async () => {
    try {
      // Validate form
      const validationResult = await form.trigger()
      if (!validationResult) {
        toast({
          title: "Data Validation Error",
          description: "Please check the form for errors and try again.",
          variant: "destructive",
        })
        return
      }

      // Apply the final collection name if using a new collection
      if (isNewCollection && newCollection) {
        form.setValue("collection", newCollection)
      }

      // Open the drawer for review
      setIsDrawerOpen(true)
    } catch (error) {
      console.error("Error during data submission:", error)
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please contact our support.",
        variant: "destructive",
      })
    }
  }





  // Navigate to next tab
  const goToNextTab = async () => {
    try {
      if (activeTab === "details") {
        // Validate details tab fields
        const isValid = await form.trigger(["title", "author", "description", "externalUrl"])
        if (isValid) {
          setActiveTab("assets")
          setFormProgress(66)
        } else {
          toast({
            title: "Please complete all required fields",
            description: "Fill in all required information before proceeding.",
            variant: "destructive",
          })
        }
      } else if (activeTab === "assets") {
        // Check if either files are uploaded or media URL is provided
        if (uploadedFiles.length === 0 && useMediaUrl && !form.getValues("mediaUrl")) {
          toast({
            title: "Missing Assets",
            description: "Please upload files or provide a media URL.",
            variant: "destructive",
          })
          return
        }

        // Validate media URL if provided and being used
        if (useMediaUrl && form.getValues("mediaUrl")) {
          const isValid = await form.trigger("mediaUrl")
          if (!isValid) {
            toast({
              title: "Invalid Media URL",
              description: "Please provide a valid URL for your media.",
              variant: "destructive",
            })
            return
          }
        }

        // Navigate to rights tab
        setActiveTab("rights")
        setFormProgress(100)
      }
    } catch (error) {
      console.error("Error navigating to next tab:", error)
      toast({
        title: "Navigation Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Navigate to previous tab
  const goToPrevTab = () => {
    if (activeTab === "assets") {
      setActiveTab("details")
      setFormProgress(33)
    } else if (activeTab === "rights") {
      setActiveTab("assets")
      setFormProgress(66)
    }
  }









  // Handle transaction signing
  const handleSignTransaction = async () => {
    try {
      setIsSubmitting(true)
      setTransactionStatus("processing")

      // Simulate blockchain transaction processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Prepare data for storage with the mock transaction data
      const formData = form.getValues()
      const assetData = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        type: formData.type,
        collection: formData.collection,
        tags: formData.tags,
        mediaUrl: formData.mediaUrl,
        externalUrl: formData.externalUrl,
        licenseType: formData.licenseType,
        licenseDetails: formData.licenseDetails,
        version: formData.version || "1.0",
        commercialUse: formData.commercialUse,
        modifications: formData.modifications,
        attribution: formData.attribution,
        filesCount: uploadedFiles.length,
        transaction: {
          // hash: mockTransactionHash,
          // blockNumber: mockBlockNumber,
          timestamp: Date.now(),
          network: "Starknet",
          contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`,
        },
        registrationDate: Date.now(),
        protectionStatus: "Minting",
        protectionScope: "181 countries (Berne Convention)",
        protectionDuration: "50-70 years (based on jurisdiction)",
      }

      if (uploadedFiles.length > 0) {
        const base64String = await fileToBase64(uploadedFiles[0]);
        assetData.mediaUrl = base64String; 
        console.log(assetData.mediaUrl)
      }

      console.log(assetData)
      try {
        const response = await fetch("/api/forms-create-asset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(assetData),
        });
        if (!response.ok) {
          throw new Error("Failed to submit IP");
        }
  
        console.log("IP submitted successfully");
  
        const data = await response.json();
        const ipfs = data.uploadData.IpfsHash as string;
        setIpfsHash(ipfs);
        console.log("IPFS Hash:", ipfs);
  
      } catch (err) {
        console.error("Submission Error:", err);
        setError("Failed submitting or minting IP. Please try again.");
        toast({
          title: "Error",
          description:
            "Registration failed. Please contact our support team at mediolanoapp@gmail.com",
          action: <ToastAction altText="OK">OK</ToastAction>,
        });
      } finally {
        setIsSubmitting(false);
      }

      try {
        // Store mock transaction data for later use
        localStorage.setItem("lastRegisteredIP", JSON.stringify(assetData))
      } catch (storageError) {
        console.error("Error storing data in localStorage:", storageError)
        // Continue even if localStorage fails
      }

      // Update transaction status to success
      setTransactionStatus("success")

      // Simulate success message after transaction is processed
      setTimeout(() => {
        try {
          //setIsDrawerOpen(false)

          toast({
            title: "Programmable IP Ready",
            description: `Your asset "${formData.title}" is ready to be minted onchain.`,
          })

          // Wrap the router navigation in a try/catch to handle any navigation errors
          try {
            // Use a small delay before navigation to ensure state updates are complete
            setTimeout(() => {
              router.push("/portfolio")
            }, 99999)
          } catch (navigationError) {
            console.error("Navigation error:", navigationError)
            // If navigation fails, at least the user has seen the success message
          }
        } catch (redirectError) {
          console.error("Error during redirect:", redirectError)
        }
      }, 2000)
    } catch (error) {
      console.error("Error signing transaction:", error)
      setTransactionStatus("error")

      toast({
        title: "Transaction Failed",
        description: "There was an error processing your transaction. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Prepare tag list from string
  const handleSetTags = (newTags: string[]) => {
    form.setValue("tags", newTags)
  }











  return (
    <div className="container mx-auto px-4 py-6 bg-background shadow rounded-lg">
     
      <div className="flex items-center gap-2 mb-6">
        <Button variant="link" size="icon" asChild>
          <Link href="/create" title="Back to Create Programmable Intellectual Property">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create Programmable IP</h1>
      </div>

      <div className="mb-8">
        <Progress value={formProgress} className="h-1" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Details</span>
          <span>Assets</span>
          <span>Licensing</span>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          // Only open the drawer when explicitly submitting the form
          if (activeTab === "rights") {
            handleReviewSubmit()
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="assets">Media</TabsTrigger>
                <TabsTrigger value="rights">Licensing</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-1">
                      Title
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input id="title" placeholder="Enter the title of your IP" {...form.register("title")} />
                    {form.formState.errors.title && (
                      <p className="text-sm text-destructive">{form.formState.errors.title.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author" className="flex items-center gap-1">
                      Author
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input id="author" placeholder="Enter the author's name" {...form.register("author")} />
                    {form.formState.errors.author && (
                      <p className="text-sm text-destructive">{form.formState.errors.author.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center gap-1">
                      Description
                      <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your intellectual property"
                      className="min-h-[120px]"
                      {...form.register("description")}
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-destructive">{form.formState.errors.description.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="externalUrl" className="flex items-center gap-1">
                      External Url
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input id="externalUrl" placeholder="Enter a external Url link" {...form.register("externalUrl")} />
                    {form.formState.errors.externalUrl && (
                      <p className="text-sm text-destructive">{form.formState.errors.externalUrl.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label className="flex items-center gap-1">
                      IP Type
                      <span className="text-destructive">*</span>
                    </Label>
                    <RadioGroup
                      defaultValue={form.getValues("type")}
                      onValueChange={(value) => form.setValue("type", value as any, { shouldValidate: true })}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3d-model" id="3d-model" />
                        <Label htmlFor="3d-model" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          3D Model
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ai-model" id="ai-model" />
                        <Label htmlFor="ai-model" className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          AI Model
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="artwork" id="artwork" />
                        <Label htmlFor="artwork" className="flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          Artwork
                        </Label>
                      </div>
                       <div className="flex items-center space-x-2">
                        <RadioGroupItem value="audio" id="audio" />
                        <Label htmlFor="audio" className="flex items-center gap-2">
                          <Music className="h-4 w-4" />
                          Audio
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="document" id="document" />
                        <Label htmlFor="document" className="flex items-center gap-2">
                          <File className="h-4 w-4" />
                          Document
                        </Label>
                      </div>
                      
                     
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="literary" id="literary" />
                        <Label htmlFor="literary" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Literary
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="post" id="post" />
                        <Label htmlFor="Post / Publication" className="flex items-center gap-2">
                          <NotepadText className="h-4 w-4" />
                          Post / Publication
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rwa" id="rwa" />
                        <Label htmlFor="rwa" className="flex items-center gap-2">
                          <Globe2 className="h-4 w-4" />
                          RWA (Real World Asset)
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="software" id="software" />
                        <Label htmlFor="software" className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Software
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="video" id="video" />
                        <Label htmlFor="video" className="flex items-center gap-2">
                          <Clapperboard className="h-4 w-4" />
                          Video
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="flex items-center gap-2">
                          <Box className="h-4 w-4" />
                          Other
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2 mt-5">
                    <Label htmlFor="collection" className="flex items-center gap-1">
                      Collection (Preview)
                    </Label>
                    <Select value={form.getValues("collection")} onValueChange={handleCollectionChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select or create a collection" />
                      </SelectTrigger>
                      <SelectContent>
                        {collections.map((collection) => (
                          <SelectItem key={collection.id} value={collection.id}>
                            {collection.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="new">Create New Collection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isNewCollection && (
                    <div className="space-y-2">
                      <Label htmlFor="newCollection">New Collection Name</Label>
                      <Input
                        id="newCollection"
                        value={newCollection}
                        onChange={(e) => setNewCollection(e.target.value)}
                        placeholder="Enter new collection name"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="flex items-center gap-2">
                      Tags
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add tags to help others discover your IP. Press Enter or comma to add each tag.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <TagInput
                      tags={form.getValues("tags")}
                      setTags={handleSetTags}
                      placeholder="Type and press Enter to add tags..."
                      maxTags={10}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Assets Tab */}
              <TabsContent value="assets" className="space-y-4 mt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Button
                    type="button"
                    variant={!useMediaUrl ? "default" : "outline"}
                    onClick={() => setUseMediaUrl(false)}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                  <Button
                    type="button"
                    variant={useMediaUrl ? "default" : "outline"}
                    onClick={() => setUseMediaUrl(true)}
                    className="flex-1"
                  >
                    <Link2 className="h-4 w-4 mr-2" />
                    Use Media URL
                  </Button>
                </div>

                {!useMediaUrl ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Files</CardTitle>
                      <CardDescription>Upload the files that represent your intellectual property</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={openFileSelector}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Drag and drop files here</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          or click to browse files from your computer
                        </p>
                        <Input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          ref={fileInputRef}
                          multiple
                          onChange={handleFileUpload}
                        />
                        <Button type="button">Select Files</Button>
                      </div>

                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}

                      {uploadedFiles.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-medium mb-2">Uploaded Files ({uploadedFiles.length})</h4>
                          <div className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                                <div className="flex items-center gap-3">
                                  {getFileIcon(file.type)}
                                  <div>
                                    <p className="font-medium text-sm">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {(file.size / 1024).toFixed(1)} KB • {file.type || "Unknown type"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {previewUrls[file.name] && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        window.open(previewUrls[file.name], "_blank")
                                      }}
                                    >
                                      <Image className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeFile(file.name)
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>Supported file types: JPG, PNG, GIF, MP4, MP3, PDF, ZIP, and more.</p>
                        <p>Maximum file size: 100MB</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Media URL</CardTitle>
                      <CardDescription>Provide a URL to your media content</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="mediaUrl" className="flex items-center gap-1">
                            Media URL
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="flex">
                            <div className="relative flex-1">
                              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="mediaUrl"
                                placeholder="https://example.com/your-media-content"
                                className="pl-9"
                                {...form.register("mediaUrl")}
                              />
                            </div>
                            {form.watch("mediaUrl") && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="ml-2"
                                onClick={() => window.open(form.getValues("mediaUrl"), "_blank")}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          {form.formState.errors.mediaUrl && (
                            <p className="text-sm text-destructive">
                              {form.formState.errors.mediaUrl.message as string}
                            </p>
                          )}
                        </div>

                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>Media URL Guidelines</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              <li>Ensure the URL is publicly accessible</li>
                              <li>For images: use direct links to JPG, PNG, or WebP files</li>
                              <li>
                                For videos: use direct links or embedding URLs from platforms like Vimeo or YouTube
                              </li>
                              <li>For audio: use direct links to MP3 or WAV files</li>
                              <li>For documents: link to PDF or other document formats</li>
                            </ul>
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {uploadedFiles.length > 0 && previewUrls && Object.keys(previewUrls).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Image Previews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(previewUrls).map(([fileName, url]) => (
                          <div key={fileName} className="relative aspect-square rounded-md overflow-hidden border">
                            <img
                              src={url || "/placeholder.svg"}
                              alt={fileName}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Rights & Licensing Tab */}
              <TabsContent value="rights" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Rights & Licensing</CardTitle>
                    <CardDescription>
                      Define the rights and licensing terms for your intellectual property
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label htmlFor="version">IP Version</Label>
                      <Input id="version" placeholder="e.g., 1.0" {...form.register("version")} />
                      <p className="text-sm text-muted-foreground">
                        Version number to track updates to your intellectual property
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label htmlFor="license-type">License Type</Label>
                      <RadioGroup
                        defaultValue={form.getValues("licenseType")}
                        onValueChange={(value) => form.setValue("licenseType", value as any, { shouldValidate: true })}
                        className="grid gap-4"
                      >
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="all-rights" id="all-rights" className="mt-1" />
                          <div>
                            <Label htmlFor="all-rights" className="font-medium">
                              All Rights
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              You retain all rights to your work. Others must obtain your permission for any use.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="creative-commons" id="creative-commons" className="mt-1" />
                          <div>
                            <Label htmlFor="creative-commons" className="font-medium">
                              Creative Commons
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Allow others to use your work with certain restrictions like attribution or non-commercial
                              use.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="open-source" id="open-source" className="mt-1" />
                          <div>
                            <Label htmlFor="open-source" className="font-medium">
                              Open Source
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Allow others to use, modify, and distribute your work freely, typically for software.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="custom" id="custom" className="mt-1" />
                          <div>
                            <Label htmlFor="custom" className="font-medium">
                              Custom License
                            </Label>
                            <p className="text-sm text-muted-foreground">Define your own custom licensing terms.</p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="license-details">License Details</Label>
                      <Textarea
                        id="license-details"
                        placeholder="Enter additional license details or terms"
                        className="min-h-[120px]"
                        {...form.register("licenseDetails")}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">License Permissions</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="commercial-use">Commercial Use</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow others to use your IP for commercial purposes
                            </p>
                          </div>
                          <Checkbox
                            id="commercial-use"
                            checked={form.watch("commercialUse")}
                            onCheckedChange={(checked) => form.setValue("commercialUse", checked as boolean)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="modifications">Modifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow others to modify or create derivative works
                            </p>
                          </div>
                          <Checkbox
                            id="modifications"
                            checked={form.watch("modifications")}
                            onCheckedChange={(checked) => form.setValue("modifications", checked as boolean)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="attribution">Require Attribution</Label>
                            <p className="text-sm text-muted-foreground">
                              Require others to credit you when using your IP
                            </p>
                          </div>
                          <Checkbox
                            id="attribution"
                            checked={form.watch("attribution")}
                            onCheckedChange={(checked) => form.setValue("attribution", checked as boolean)}
                          />
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Important Information</AlertTitle>
                      <AlertDescription>
                        Your IP will be registered on the Starknet blockchain and protected under The Berne Convention
                        in 181 countries. This provides immutable proof of ownership with a timestamp.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-6">
              {activeTab !== "details" ? (
                <Button type="button" variant="outline" onClick={goToPrevTab}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              ) : (
                <div></div>
              )}

              {activeTab !== "rights" ? (
                <Button
                  type="button"
                  variant="default"
                  onClick={(e) => {
                    e.preventDefault()
                    goToNextTab()
                  }}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    handleReviewSubmit()
                  }}
                >
                  Review Registration
                </Button>
              )}
            </div>
          </div>

          
          
          
          
          
          
          
          
          
          
          
          <div>
            <Card className="sticky top-6 bg-muted/50">
              <CardHeader>
                <CardTitle>IP Summary</CardTitle>
                <CardDescription>Review your IP creation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch("title") && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Title</p>
                    <p className="text-sm text-muted-foreground">{form.watch("title")}</p>
                  </div>
                )}

                {form.watch("author") && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Author</p>
                    <p className="text-sm text-muted-foreground">{form.watch("author")}</p>
                  </div>
                )}

                {form.watch("type") && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">IP Type</p>
                    <p className="text-sm text-muted-foreground capitalize">{form.watch("type").replace("-", " ")}</p>
                  </div>
                )}

                {form.getValues("tags") && form.getValues("tags").length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {form.getValues("tags").map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Files</p>
                    <p className="text-sm text-muted-foreground">
                      {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""} uploaded
                    </p>
                  </div>
                )}

                {form.watch("mediaUrl") && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Media URL</p>
                    <p className="text-sm text-muted-foreground truncate">{form.watch("mediaUrl")}</p>
                  </div>
                )}

                {form.watch("licenseType") && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">License</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {form.watch("licenseType").replace("-", " ")}
                    </p>
                  </div>
                )}

                {form.watch("version") && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">IP Version</p>
                    <p className="text-sm text-muted-foreground">{form.watch("version")}</p>
                  </div>
                )}

                <Separator />

                <div className="space-y-1">
                  <p className="text-sm font-medium">Protection</p>
                  <p className="text-sm text-muted-foreground">
                    Your IP will be protected in 181 countries according to The Berne Convention
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Proof of Ownership</p>
                  <p className="text-sm text-muted-foreground">
                    Immutable timestamp on Starknet blockchain, settled on Ethereum
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">
                    Valid for 50-70 years, in accordance with legal jurisdiction
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Fees</p>
                  <p className="text-sm text-muted-foreground">Zero fees for registration</p>
                </div>
              </CardContent>
              <CardFooter>
                {activeTab === "rights" && (
                  <>
                  <Button
                    className="w-full"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      handleReviewSubmit()
                    }}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Register IP Asset
                  </Button>
                    {/*
                    <hr></hr>
                    <Button type="submit" disabled={isSubmitting || !address}>
                      {isSubmitting ? "Creating Asset..." : "Create Asset"}
                    </Button>
                    */}

                    </>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
















      {/* Transaction Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="overflow-auto">
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle>Create Your Asset</DrawerTitle>
            <DrawerDescription>
              Review the details and create your Programmable IP with immutable proof of ownership.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-6">
            {transactionStatus === "waiting" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Media Preview */}
                  <div className="md:col-span-1 flex justify-center">
                    <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border bg-muted">
                      {uploadedFiles.length > 0 && Object.keys(previewUrls).length > 0 ? (
                        <img
                          src={Object.values(previewUrls)[0] || "/background.jpg"}
                          alt="IP Preview"
                          className="object-cover w-full h-full"
                        />
                      ) : form.watch("mediaUrl") ? (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                          <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground text-center break-all">
                            {form.watch("mediaUrl")}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                          <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground text-center">No media preview available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main IP Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{form.watch("title") || "Untitled"}</h3>
                      <p className="text-sm text-muted-foreground">By {form.watch("author") || "Unknown"}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-sm text-muted-foreground">
                        {form.watch("description") || "No description provided."}
                      </p>
                    </div>

                    {form.getValues("tags") && form.getValues("tags").length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {form.getValues("tags").map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* IP Type and Version 
                  <div className="space-y-4">
                    
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-2">
                        {form.watch("ipType") === "artwork" ? (
                          <Image className="h-4 w-4 text-primary" />
                        ) : form.watch("ipType") === "music" ? (
                          <Music className="h-4 w-4 text-primary" />
                        ) : form.watch("ipType") === "software" ? (
                          <Code className="h-4 w-4 text-primary" />
                        ) : form.watch("ipType") === "ai-model" ? (
                          <Zap className="h-4 w-4 text-primary" />
                        ) : (
                          <FileText className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">IP Type</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {(form.watch("ipType") || "").replace("-", " ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">License Type</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {(form.watch("licenseType") || "").replace("-", " ")}
                        </p>
                      </div>
                    </div>

                    {form.watch("version") && (
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Info className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">IP Version</p>
                          <p className="text-sm text-muted-foreground">{form.watch("version")}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Upload className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Assets</p>
                        <p className="text-sm text-muted-foreground">
                          {uploadedFiles.length > 0
                            ? `${uploadedFiles.length} file${uploadedFiles.length !== 1 ? "s" : ""} uploaded`
                            : form.watch("mediaUrl")
                              ? "External media URL"
                              : "None"}
                        </p>
                      </div>
                    </div>
                  </div>
                      */}



                </div>

                <Separator />

                {/* License Permissions 
                <div>
                  <h3 className="text-lg font-medium mb-3">License Permissions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox id="review-commercial" checked={form.watch("commercialUse")} disabled />
                      <Label htmlFor="review-commercial" className="text-sm">
                        Commercial Use
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="review-modifications" checked={form.watch("modifications")} disabled />
                      <Label htmlFor="review-modifications" className="text-sm">
                        Modifications
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="review-attribution" checked={form.watch("attribution")} disabled />
                      <Label htmlFor="review-attribution" className="text-sm">
                        Attribution Required
                      </Label>
                    </div>
                  </div>
                </div>

                {form.watch("licenseDetails") && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">License Details</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">{form.watch("licenseDetails")}</p>
                    </div>
                  </div>
                )}

                <Separator />

                */}

                <Alert variant="default" className="bg-primary/5 border-primary/20">
                  <Shield className="h-4 w-4 text-primary" />
                  <AlertTitle>Intellectual Property Protection</AlertTitle>
                  <AlertDescription>
                    Your IP will be registered on the Starknet blockchain and protected under The Berne Convention in
                    181 countries. This provides immutable proof of ownership with a timestamp.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {transactionStatus === "processing" && (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <h3 className="text-lg font-medium mb-2">Minting Your IP Asset</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Please wait while your intellectual property is being registered on the Starknet blockchain. This
                  process creates an immutable record of your ownership.
                </p>
                <div className="w-full max-w-md mt-6 bg-muted p-4 rounded-md">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Transaction Status</span>
                      <span className="text-xs font-medium">Processing</span>
                    </div>
                    <Progress value={45} className="h-1 mt-2" />
                  </div>
                </div>
              </div>
            )}

            {transactionStatus === "success" && (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20 mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">{form.watch("title") || "Untitled"}</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                  Please confirm with your encrypted wallet to successfully register on
                  the blockchain with immutable proof of ownership.
                </p>

                <div className="w-full max-w-md bg-muted p-4 rounded-md mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Registration Date</span>
                      <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                    {/*
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Token ID</span>
                      <span className="text-sm font-medium">#{Math.floor(Math.random() * 1000000)}</span>
                    </div>*/}
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Powered on</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">Starknet</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <Link href="/create">
                  <Button variant="outline" className="w-full">
                    <Box className="h-4 w-4 mr-2" />
                    Register Another Programmable IP
                  </Button>
                  </Link>
                  <Link href="/portfolio">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Portfolio
                  </Button>
                  </Link>
                </div>
              </div>
            )}

            {transactionStatus === "error" && (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20 mb-4">
                  <X className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Creation Failed</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                  There was an error while registering your IP on the blockchain. This could be due to network
                  congestion or wallet connection issues.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setTransactionStatus("waiting")}>
                    Try Again
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsDrawerOpen(false)
                      toast({
                        title: "Registration Cancelled",
                        description: "You can try again later from the Create IP page.",
                      })
                    }}
                  >
                    Cancel Registration
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DrawerFooter className="border-t pt-4">
            {transactionStatus === "waiting" && (
              <>
                <Button
                  onClick={handleSignTransaction}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Mint Programmable IP
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2 mb-4">
                  By clicking "Mint Programmable IP", you confirm that you are the lawful owner of this intellectual
                  property and have the right to register it.
                </p>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </>
            )}

            {transactionStatus === "success" && (
              <DrawerClose asChild>
                <Button>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </DrawerClose>
            )}

            {transactionStatus === "error" && (
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

