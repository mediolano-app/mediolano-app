"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Flag, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"

interface ReportAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetId: string
  assetName: string
  assetCreator: string
}

const reportReasons = [
  { value: "copyright", label: "Copyright Infringement" },
  { value: "trademark", label: "Trademark Violation" },
  { value: "impersonation", label: "Impersonation" },
  { value: "fraud", label: "Fraudulent Content" },
  { value: "inappropriate", label: "Inappropriate Content" },
  { value: "spam", label: "Spam or Misleading" },
  { value: "other", label: "Other" },
]

export function ReportAssetDialog({ open, onOpenChange, assetId, assetName, assetCreator }: ReportAssetDialogProps) {
  const [step, setStep] = useState<"form" | "submitting" | "success">("form")
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
    email: "",
    agreeToPolicy: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.reason || !formData.description || !formData.agreeToPolicy) {
      return
    }

    setStep("submitting")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setStep("success")

    // Auto close after success
    setTimeout(() => {
      onOpenChange(false)
      setStep("form")
      setFormData({
        reason: "",
        description: "",
        email: "",
        agreeToPolicy: false,
      })
    }, 3000)
  }

  const handleClose = () => {
    if (step !== "submitting") {
      onOpenChange(false)
      setStep("form")
      setFormData({
        reason: "",
        description: "",
        email: "",
        agreeToPolicy: false,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-500" />
            Report Asset
          </DialogTitle>
          <DialogDescription>
            Report "{assetName}" by {assetCreator} for policy violations or legal issues.
          </DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Report *</Label>
              <Select
                value={formData.reason}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, reason: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {reportReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                placeholder="Please provide specific details about the violation, including any evidence or supporting information..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Contact Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                We may contact you for additional information about your report.
              </p>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                False reports may result in account restrictions. Please ensure your report is accurate and made in good
                faith.
              </AlertDescription>
            </Alert>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agree"
                checked={formData.agreeToPolicy}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToPolicy: checked as boolean }))}
                required
              />
              <Label htmlFor="agree" className="text-sm leading-5">
                I agree to the{" "}
                <a
                  href="/community-guidelines"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Community Guidelines
                </a>{" "}
                and confirm that this report is made in good faith. *
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.reason || !formData.description || !formData.agreeToPolicy}
                className="bg-red-600 hover:bg-red-700"
              >
                Submit Report
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "submitting" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center">
              <h3 className="font-semibold">Submitting Report</h3>
              <p className="text-sm text-muted-foreground">Please wait while we process your report...</p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-green-700">Report Submitted Successfully</h3>
              <p className="text-sm text-muted-foreground">
                Thank you for helping keep Mediolano safe. We'll review your report and take appropriate action if
                necessary.
              </p>
              <p className="text-xs text-muted-foreground">
                Report ID: #{assetId}-{Date.now().toString().slice(-6)}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
