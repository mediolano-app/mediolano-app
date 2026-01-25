"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { sendContact } from "@/actions/send-contact"
import { toast } from "sonner"
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
import { MessageSquare, CheckCircle, Loader2 } from "lucide-react"

interface ContactDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const contactSubjects = [
    { value: "support", label: "Support" },
    { value: "suggestion", label: "Suggestions" },
    { value: "information", label: "Informations" },
    { value: "partnership", label: "Partnership" },
    { value: "business", label: "Business" },
    { value: "other", label: "Other" },
]

export function ContactDialog({
    open,
    onOpenChange,
}: ContactDialogProps) {
    const [step, setStep] = useState<"form" | "submitting" | "success">("form")
    const [formData, setFormData] = useState({
        subject: "",
        name: "",
        email: "",
        message: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.subject || !formData.message || !formData.email || !formData.name) {
            return
        }

        setStep("submitting")

        try {
            const result = await sendContact({
                subject: formData.subject,
                name: formData.name,
                email: formData.email,
                message: formData.message,
            })

            if (result.success) {
                setStep("success")
                toast.success("Message sent successfully")

                // Auto close after success
                setTimeout(() => {
                    onOpenChange(false)
                    setStep("form")
                    setFormData({
                        subject: "",
                        name: "",
                        email: "",
                        message: "",
                    })
                }, 3000)
            } else {
                setStep("form")
                toast.error(
                    result.error || (
                        <div className="flex flex-col gap-1">
                            <span>Failed to send message.</span>
                            <span>Please try again later.</span>
                        </div>
                    )
                )
            }
        } catch (error) {
            console.error("Error sending message:", error)
            setStep("form")
            toast.error(
                <div className="flex flex-col gap-1">
                    <span>An unexpected error occurred.</span>
                    <span>Please try again later.</span>
                </div>
            )
        }
    }

    const handleClose = () => {
        if (step !== "submitting") {
            onOpenChange(false)
            setStep("form")
            setFormData({
                subject: "",
                name: "",
                email: "",
                message: "",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto w-[90vw] sm:max-w-[500px] p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-500" />
                        Contact Mediolano Team
                    </DialogTitle>
                    <DialogDescription className="break-words">
                        We'd love to hear from you! Send us your questions, suggestions, or proposals.
                    </DialogDescription>
                </DialogHeader>

                {step === "form" && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject *</Label>
                            <Select
                                value={formData.subject}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, subject: value }))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {contactSubjects.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                                id="message"
                                placeholder="How can we help you?"
                                value={formData.message}
                                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                                className="min-h-[100px]"
                                required
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!formData.subject || !formData.message || !formData.email || !formData.name}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Send Message
                            </Button>
                        </DialogFooter>
                    </form>
                )}

                {step === "submitting" && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <div className="text-center">
                            <h3 className="font-semibold">Sending Message</h3>
                            <p className="text-sm text-muted-foreground">Please wait while we send your message...</p>
                        </div>
                    </div>
                )}

                {step === "success" && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                        <div className="text-center space-y-2">
                            <h3 className="font-semibold text-green-700">Message Sent Successfully</h3>
                            <p className="text-sm text-muted-foreground">
                                Thank you for reaching out! We will get back to you as soon as possible.
                            </p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
