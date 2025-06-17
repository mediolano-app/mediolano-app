"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Image,
  Music,
  Code,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { Abi } from "starknet";
import { abi } from "@/abis/abi";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { fileToBase64 } from "@/utils/utils";
import { TransactionDrawer } from "@/components/create-ip/TransactionDrawer";
import { DetailsTab } from "@/components/create-ip/DetailsTab";
import { AssetsTab } from "@/components/create-ip/AssetsTab";
import { RightsTab } from "@/components/create-ip/RightsTab";
import { SummaryCard } from "@/components/create-ip/SummaryCard";

interface Asset {
  title: string;
  mediaUrl: string;
  license: string;
  limited: boolean;
  totalSupply: number;

  name: string;
  author: string;
  description: string;
  type: string;
  template: string;
  collection: string;
  tags: string[];
  image: string;
  externalUrl: string;
  licenseType: string;
  licenseDetails: string;
  licenseDuration: string;
  licenseTerritory: string;
  commercialUse: boolean;
  modifications: boolean;
  attribution: boolean;
  registrationDate: string;
  version: string;
}

// const types = [
//   { id: "1", name: "3D Model" },
//   { id: "2", name: "AI Model" },
//   { id: "3", name: "Artwork" },
//   { id: "4", name: "Audio" },
//   { id: "5", name: "Document" },
//   { id: "6", name: "Literary" },
//   { id: "7", name: "Publication" },
//   { id: "8", name: "RWA" },
//   { id: "9", name: "Software" },
//   { id: "10", name: "Video" },
//   { id: "11", name: "Other" },
// ];

// const licenses = [
//   { id: "1", name: "All Rights Reserved" },
//   { id: "2", name: "Creative Commons" },
//   { id: "3", name: "MIT License" },
//   { id: "4", name: "GNU General Public License" },
// ];

const collections = [{ id: "1", name: "IP Collection" }];

// Define the form schema with zod
const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100),
  author: z
    .string()
    .min(2, { message: "Author name must be at least 2 characters" })
    .max(100),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000),
  type: z.enum([
    "3d-model",
    "ai-model",
    "artwork",
    "audio",
    "document",
    "literary",
    "nft",
    "post",
    "rwa",
    "software",
    "video",
    "other",
  ]),
  collection: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  mediaUrl: z.string().url().optional().or(z.literal("")),
  externalUrl: z.string().default(""),
  licenseType: z.enum([
    "all-rights",
    "creative-commons",
    "open-source",
    "custom",
  ]),
  licenseDetails: z.string().optional(),
  licenseDuration: z.string().optional(),
  licenseTerritory: z.string().optional(),
  version: z.string().optional(),
  commercialUse: z.boolean().default(false),
  modifications: z.boolean().default(false),
  attribution: z.boolean().default(true),
});

export type FormValues = z.infer<typeof formSchema>;

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
};

// need to pull blockchain data
// const mockBlockchainData = {
//   gas: 0.000342,
//   gasPrice: "0.01 STRK",
//   totalFee: "0.01 STRK",
//   network: "Starknet",
//   contractAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
//   estimatedConfirmationTime: "< 10 seconds",
//   walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
// };


export default function CreateIPPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("details");

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});
  const [formProgress, setFormProgress] = useState(33);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    "waiting" | "processing" | "success" | "error"
  >("waiting");
  const [useMediaUrl, setUseMediaUrl] = useState(false);
  {
    /*}
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newCollection, setNewCollection] = useState("")
  const [isNewCollection, setIsNewCollection] = useState(false)
    */
  }

  const [asset, setAsset] = useState<Asset>({
    title: "", //name
    name: "", // <-- Add this line to satisfy the Asset interface
    author: "",
    description: "",
    type: "",
    template: "",
    mediaUrl: "",
    externalUrl: "",
    tags: [],
    license: "",
    limited: false,
    totalSupply: 1,
    collection: "MIP Collection",
    version: "1",
    image: "",
    licenseType: "all-rights",
    licenseDetails: "",
    licenseDuration: "50 years",
    licenseTerritory: "Worldwide",
    commercialUse: false,
    modifications: false,
    attribution: true,
    registrationDate: new Date().toISOString(),
  });







  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCollection, setNewCollection] = useState("");
  const [isNewCollection, setIsNewCollection] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`;

  const { address } = useAccount();
  const { contract } = useContract({
    abi: abi as Abi,
    address: CONTRACT_ADDRESS,
  });

const buildCalls = () =>
  contract && address && ipfsHash
    ? [contract.populate("mint_item", [address, ipfsHash])]
    : undefined;

const { send, error: transactionError } = useSendTransaction({
  calls: buildCalls(),
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
      console.log("mint error", transactionError, error);
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
      event.preventDefault();

      console.error(
        "Unhandled promise rejection in create page:",
        event.reason
      );

      // Show a toast notification with more specific information
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (event.reason && typeof event.reason === "object") {
        if ("message" in event.reason) {
          errorMessage = `Error: ${(event.reason as Error).message}`;
        }
      }

      toast({
        title: "Unexpected Error",
        description: errorMessage,
        variant: "destructive",
      });
    };

    // Add event listener for unhandled rejections
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Add event listener for uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.error("Uncaught error:", event.error);
      event.preventDefault();
    };
    window.addEventListener("error", handleError);

    // Clean up
    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleError);
    };
  }, [toast]);

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
      licenseDuration: "50 years",
      licenseTerritory: "Worldwide",
      version: "1",
      commercialUse: false,
      modifications: false,
      attribution: true,
    },
    mode: "onChange",
  });

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Update progress based on tab
    if (value === "details") setFormProgress(33);
    else if (value === "assets") setFormProgress(66);
    else if (value === "rights") setFormProgress(100);
  };

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);
        setUploadedFiles((prev) => [...prev, ...newFiles]);

        // Create preview URLs for images
        newFiles.forEach((file) => {
          try {
            if (file.type.startsWith("image/")) {
              const url = URL.createObjectURL(file);
              setPreviewUrls((prev) => ({ ...prev, [file.name]: url }));
            }
          } catch (fileError) {
            console.error("Error creating preview URL:", fileError);
          }
        });

        // Simulate upload progress
        simulateUploadProgress();
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
      toast({
        title: "Upload Error",
        description:
          "There was a problem uploading your files. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle drag and drop uploads
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    try {
      e.preventDefault();

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const newFiles = Array.from(e.dataTransfer.files);
        setUploadedFiles((prev) => [...prev, ...newFiles]);

        // Create preview URLs for images
        newFiles.forEach((file) => {
          try {
            if (file.type.startsWith("image/")) {
              const url = URL.createObjectURL(file);
              setPreviewUrls((prev) => ({ ...prev, [file.name]: url }));
            }
          } catch (fileError) {
            console.error("Error creating preview URL:", fileError);
          }
        });

        // Simulate upload progress
        simulateUploadProgress();
      }
    } catch (error) {
      console.error("Error handling file drop:", error);
      toast({
        title: "Upload Error",
        description:
          "There was a problem with the dropped files. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Simulate file upload progress
  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Remove a file from the uploaded files
  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));

    // Revoke object URL if it exists
    if (previewUrls[fileName]) {
      URL.revokeObjectURL(previewUrls[fileName]);
      setPreviewUrls((prev) => {
        const newUrls = { ...prev };
        delete newUrls[fileName];
        return newUrls;
      });
    }
  };

  // Get file icon based on mime type
  const getFileIcon = (mimeType: string) => {
    const IconComponent =
      fileTypeIcons[mimeType as keyof typeof fileTypeIcons] ||
      fileTypeIcons.default;
    return <IconComponent className="h-5 w-5" />;
  };

  // Open file selection dialog
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle collection selection
  const handleCollectionChange = (value: string) => {
    if (value === "new") {
      setIsNewCollection(true);
      form.setValue("collection", "");
    } else {
      setIsNewCollection(false);
      form.setValue("collection", value);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    try {
      // Validate form
      const validationResult = await form.trigger();
      if (!validationResult) {
        toast({
          title: "Data Validation Error",
          description: "Please check the form for errors and try again.",
          variant: "destructive",
        });
        return;
      }

      // Apply the final collection name if using a new collection
      if (isNewCollection && newCollection) {
        form.setValue("collection", newCollection);
      }

      // Open the drawer for review
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Error during data submission:", error);
      toast({
        title: "Submission Error",
        description:
          "An unexpected error occurred. Please contact our support.",
        variant: "destructive",
      });
    }
  };

  // Navigate to next tab
  const goToNextTab = async () => {
    try {
      if (activeTab === "details") {
        // Validate details tab fields
        const isValid = await form.trigger([
          "title",
          "author",
          "description",
          "externalUrl",
        ]);
        if (isValid) {
          setActiveTab("assets");
          setFormProgress(66);
        } else {
          toast({
            title: "Please complete all required fields",
            description: "Fill in all required information before proceeding.",
            variant: "destructive",
          });
        }
      } else if (activeTab === "assets") {
        // Check if either files are uploaded or media URL is provided
        if (
          uploadedFiles.length === 0 &&
          useMediaUrl &&
          !form.getValues("mediaUrl")
        ) {
          toast({
            title: "Missing Assets",
            description: "Please upload files or provide a media URL.",
            variant: "destructive",
          });
          return;
        }

        // Validate media URL if provided and being used
        if (useMediaUrl && form.getValues("mediaUrl")) {
          const isValid = await form.trigger("mediaUrl");
          if (!isValid) {
            toast({
              title: "Invalid Media URL",
              description: "Please provide a valid URL for your media.",
              variant: "destructive",
            });
            return;
          }
        }

        // Navigate to rights tab
        setActiveTab("rights");
        setFormProgress(100);
      }
    } catch (error) {
      console.error("Error navigating to next tab:", error);
      toast({
        title: "Navigation Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Navigate to previous tab
  const goToPrevTab = () => {
    if (activeTab === "assets") {
      setActiveTab("details");
      setFormProgress(33);
    } else if (activeTab === "rights") {
      setActiveTab("assets");
      setFormProgress(66);
    }
  };

  // Handle transaction signing
  const handleSignTransaction = async () => {
    try {
      setIsSubmitting(true);
      setTransactionStatus("processing");

      // Simulate blockchain transaction processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Prepare data for storage with the mock transaction data
      const formData = form.getValues();
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
          contractAddress: CONTRACT_ADDRESS,
        },
        registrationDate: Date.now(),
        protectionStatus: "Minting",
        protectionScope: "181 countries (Berne Convention)",
        protectionDuration: "50-70 years (based on jurisdiction)",
      };

      if (uploadedFiles.length > 0) {
        const base64String = await fileToBase64(uploadedFiles[0]);
        assetData.mediaUrl = base64String;
        console.log(assetData.mediaUrl);
      }

      console.log(assetData);
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

      // try {
      //   // Store mock transaction data for later use
      //   localStorage.setItem("lastRegisteredIP", JSON.stringify(assetData))
      // } catch (storageError) {
      //   console.error("Error storing data in localStorage:", storageError)
      //   // Continue even if localStorage fails
      // }

      // Update transaction status to success
      setTransactionStatus("success");

      // Simulate success message after transaction is processed
      setTimeout(() => {
        try {
          //setIsDrawerOpen(false)

          toast({
            title: "Programmable IP Ready",
            description: `Your asset "${formData.title}" is ready to be minted onchain.`,
          });

          // Wrap the router navigation in a try/catch to handle any navigation errors
          try {
            // Use a small delay before navigation to ensure state updates are complete
            setTimeout(() => {
              router.push("/portfolio");
            }, 99999);
          } catch (navigationError) {
            console.error("Navigation error:", navigationError);
            // If navigation fails, at least the user has seen the success message
          }
        } catch (redirectError) {
          console.error("Error during redirect:", redirectError);
        }
      }, 2000);
    } catch (error) {
      console.error("Error signing transaction:", error);
      setTransactionStatus("error");

      toast({
        title: "Transaction Failed",
        description:
          "There was an error processing your transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Prepare tag list from string
  const handleSetTags = (newTags: string[]) => {
    form.setValue("tags", newTags);
  };

  return (
    <div className="container mx-auto px-8 py-6 bg-background shadow rounded-lg">
      {/*  Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="link" size="icon" asChild>
          <Link
            href="/create"
            title="Back to Create Programmable Intellectual Property"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create Programmable IP</h1>
      </div>

      {/*  Progress Bar */}
      <div className="mb-8">
        <Progress value={formProgress} className="h-1" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Details</span>
          <span>Assets</span>
          <span>Licensing</span>
        </div>
      </div>

      {/*  Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Only open the drawer when explicitly submitting the form
          if (activeTab === "rights") {
            handleReviewSubmit();
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="assets">Media</TabsTrigger>
                <TabsTrigger value="rights">Licensing</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4 mt-4">
                <DetailsTab
                  form={form}
                  collections={collections}
                  isNewCollection={isNewCollection}
                  newCollection={newCollection}
                  onNewCollectionChange={setNewCollection}
                  onCollectionChange={handleCollectionChange}
                  onSetTags={handleSetTags}
                />
              </TabsContent>

              {/* Assets Tab */}
              <TabsContent value="assets" className="space-y-4 mt-4">
                <AssetsTab
                  form={form}
                  useMediaUrl={useMediaUrl}
                  setUseMediaUrl={setUseMediaUrl}
                  uploadedFiles={uploadedFiles}
                  previewUrls={previewUrls}
                  uploadProgress={uploadProgress}
                  fileInputRef={fileInputRef}
                  onFileUpload={handleFileUpload}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onOpenFileSelector={openFileSelector}
                  onRemoveFile={removeFile}
                  getFileIcon={getFileIcon}
                />
              </TabsContent>

              {/* Rights & Licensing Tab */}
              <TabsContent value="rights" className="space-y-4 mt-4">
                <RightsTab form={form} />
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
                    e.preventDefault();
                    goToNextTab();
                  }}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleReviewSubmit();
                  }}
                >
                  Review Registration
                </Button>
              )}
            </div>
          </div>

          <div>
            <SummaryCard
              form={form}
              uploadedFiles={uploadedFiles}
              activeTab={activeTab}
              onReviewSubmit={(e) => {
                e.preventDefault();
                handleReviewSubmit();
              }}
            />
          </div>
        </div>
      </form>

      {/* Transaction Drawer */}
      <TransactionDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        form={form}
        uploadedFiles={uploadedFiles}
        previewUrls={previewUrls}
        transactionStatus={transactionStatus}
        onSignTransaction={handleSignTransaction}
      />
    </div>
  );
}
