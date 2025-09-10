export type ReportContentType = "asset" | "collection" | "user"

export interface ReportMetadata {
  contentType: ReportContentType
  contentId: string
  contentName: string
  contentCreator?: string
  userWallet?: string
  reporterId?: string
  timestamp: string
}

export interface ReportFormData {
  reason: string
  description: string
  email: string
  agreeToPolicy: boolean
}

export interface ReportSubmissionData extends ReportFormData, ReportMetadata {}

export interface ReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentType: ReportContentType
  contentId: string
  contentName: string
  contentCreator?: string
}

export const reportReasons = [
  { value: "copyright", label: "Copyright Infringement" },
  { value: "trademark", label: "Trademark Violation" },
  { value: "impersonation", label: "Impersonation" },
  { value: "fraud", label: "Fraudulent Content" },
  { value: "inappropriate", label: "Inappropriate Content" },
  { value: "spam", label: "Spam or Misleading" },
  { value: "harassment", label: "Harassment or Abuse" },
  { value: "illegal", label: "Illegal Content" },
  { value: "other", label: "Other" },
]