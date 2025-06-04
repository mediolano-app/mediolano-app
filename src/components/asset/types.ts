import { z } from "zod";

export const formSchema = z.object({
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
  externalUrl: z.string().url().optional().or(z.literal("")),
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

export interface Asset {
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

export type TransactionStatus = "waiting" | "processing" | "success" | "error";

export interface FileTypeIcon {
  [key: string]: React.ComponentType<{ className?: string }>;
}

export interface DetailsTabProps {
  isNewCollection: boolean;
  setIsNewCollection: (value: boolean) => void;
  newCollection: string;
  setNewCollection: (value: string) => void;
  setTags: (tags: string[]) => void;
}

export interface AssetsTabProps {
  useMediaUrl: boolean;
  setUseMediaUrl: (value: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
  previewUrls: { [key: string]: string };
  setPreviewUrls: (urls: { [key: string]: string }) => void;
  uploadProgress: number;
  setUploadProgress: (progress: number) => void;
}



export interface IPSummaryCardProps {
  formValues: FormValues;
  uploadedFiles: File[];
  activeTab: string;
  onRegisterClick: () => void;
}

export interface TransactionDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transactionStatus: TransactionStatus;
  setTransactionStatus: (status: TransactionStatus) => void;
  formValues: FormValues;
  uploadedFiles: File[];
  previewUrls: { [key: string]: string };
  handleSignTransaction: () => void;
}

export interface FormProgressNavigationProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  formValues: FormValues;
  uploadedFiles: File[];
  previewUrls: Record<string, string>;
  setTransactionStatus: (status: TransactionStatus) => void;
  onOpenChange: (open: boolean) => void;
} 