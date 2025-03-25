"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight, Save, Plus, Trash } from "lucide-react"

// Define the agreement form data structure
interface AgreementFormData {
  title: string
  type: string
  description: string
  parties: {
    id: string
    name: string
    walletAddress: string
    role: string
    email?: string
  }[]
  terms: {
    duration: string
    territory: string
    rights: string
    royalties: string
    termination: string
  }
}

// Mock user data for the current user
const MOCK_USER = {
  name: "Demo User",
  walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
}

export default function CreateAgreementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form data with mock user as licensor
  const [formData, setFormData] = useState<AgreementFormData>({
    title: "",
    type: "",
    description: "",
    parties: [
      // Default licensor (current user)
      {
        id: crypto.randomUUID(),
        name: MOCK_USER.name,
        walletAddress: MOCK_USER.walletAddress,
        role: "licensor",
        email: "",
      },
      // Default licensee (empty)
      {
        id: crypto.randomUUID(),
        name: "",
        walletAddress: "",
        role: "licensee",
        email: "",
      },
    ],
    terms: {
      duration: "",
      territory: "",
      rights: "",
      royalties: "",
      termination: "",
    },
  })

  // Form steps
  const steps = [
    { title: "Agreement Details", description: "Basic information about the agreement" },
    { title: "Parties", description: "Define the parties involved in this agreement" },
    { title: "Terms & Conditions", description: "Specify the terms of the licensing agreement" },
    { title: "Review & Create", description: "Review and finalize your agreement" },
  ]

  // Update form data for simple fields
  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Update terms data
  const updateTerm = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      terms: {
        ...prev.terms,
        [field]: value,
      },
    }))
  }

  // Update party data
  const updateParty = (index: number, field: string, value: string) => {
    const updatedParties = [...formData.parties]
    updatedParties[index] = {
      ...updatedParties[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      parties: updatedParties,
    }))
  }

  // Add a new party
  const addParty = () => {
    setFormData((prev) => ({
      ...prev,
      parties: [
        ...prev.parties,
        {
          id: crypto.randomUUID(),
          name: "",
          walletAddress: "",
          role: "witness",
          email: "",
        },
      ],
    }))
  }

  // Remove a party
  const removeParty = (index: number) => {
    // Don't allow removing if only 2 parties remain (licensor and licensee)
    if (formData.parties.length <= 2) return

    const updatedParties = [...formData.parties]
    updatedParties.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      parties: updatedParties,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random ID for the new agreement
      const agreementId = `agr-${crypto.randomUUID().slice(0, 8)}`

      // In a real implementation, this would send the data to the blockchain
      console.log("Creating agreement:", {
        ...formData,
        id: agreementId,
        status: "draft",
        createdAt: new Date().toISOString(),
        createdBy: MOCK_USER.walletAddress,
        signatures: [],
      })

      toast({
        title: "Agreement Created",
        description: "Your licensing agreement has been created successfully",
      })

      // Redirect to the agreements list page
      router.push("/agreements")
    } catch (error) {
      console.error("Error creating agreement:", error)
      toast({
        title: "Error",
        description: "Failed to create agreement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Navigation between steps
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  // Validate current step
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Agreement Details
        return !!formData.title && !!formData.type && !!formData.description
      case 1: // Parties
        return formData.parties.every((party) => !!party.name && !!party.walletAddress && !!party.role)
      case 2: // Terms
        return (
          !!formData.terms.duration &&
          !!formData.terms.territory &&
          !!formData.terms.rights &&
          !!formData.terms.royalties &&
          !!formData.terms.termination
        )
      default:
        return true
    }
  }

  // Format display values
  const formatValue = (value: string) => {
    if (!value) return ""
    return value.replace(/_/g, " ")
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => router.push("/agreements")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Agreements
        </Button>

        <h1 className="text-3xl font-bold">Create New Agreement</h1>
        <p className="text-muted-foreground mt-1">
          Define the details of your intellectual property licensing agreement
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 text-center ${index < steps.length - 1 ? "border-b-2" : ""} ${
                index < currentStep ? "border-primary" : "border-muted"
              } pb-2`}
            >
              <div
                className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  index < currentStep
                    ? "bg-primary text-primary-foreground"
                    : index === currentStep
                      ? "bg-primary/20 text-primary border border-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {index < currentStep ? "✓" : index + 1}
              </div>
              <div
                className={`text-sm font-medium ${index === currentStep ? "text-primary" : "text-muted-foreground"}`}
              >
                {step.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-1">{steps[currentStep].title}</h2>
        <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Agreement Details */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Agreement Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g., Software Development License Agreement"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Agreement Type</Label>
                <Select value={formData.type} onValueChange={(value) => updateField("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select agreement type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software License">Software License</SelectItem>
                    <SelectItem value="Content License">Content License</SelectItem>
                    <SelectItem value="Patent License">Patent License</SelectItem>
                    <SelectItem value="Trademark License">Trademark License</SelectItem>
                    <SelectItem value="Copyright License">Copyright License</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Describe the purpose and scope of this agreement"
                  rows={5}
                />
              </div>
            </div>
          )}

          {/* Step 2: Parties */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {formData.parties.map((party, index) => (
                <div key={party.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">
                      {party.role === "licensor"
                        ? "Licensor (You)"
                        : party.role === "licensee"
                          ? "Licensee"
                          : `Additional Party ${index - 1}`}
                    </h3>

                    {/* Only allow removing additional parties (not licensor/licensee) */}
                    {index >= 2 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeParty(index)}>
                        <Trash className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`party-name-${index}`}>Name</Label>
                      <Input
                        id={`party-name-${index}`}
                        value={party.name}
                        onChange={(e) => updateParty(index, "name", e.target.value)}
                        placeholder="Full name or company name"
                        disabled={index === 0} // Disable for licensor (current user)
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`party-wallet-${index}`}>Wallet Address</Label>
                      <Input
                        id={`party-wallet-${index}`}
                        value={party.walletAddress}
                        onChange={(e) => updateParty(index, "walletAddress", e.target.value)}
                        placeholder="0x..."
                        disabled={index === 0} // Disable for licensor (current user)
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`party-role-${index}`}>Role</Label>
                      <Select
                        value={party.role}
                        onValueChange={(value) => updateParty(index, "role", value)}
                        disabled={index < 2} // Disable for licensor and licensee
                      >
                        <SelectTrigger id={`party-role-${index}`}>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="licensor">Licensor</SelectItem>
                          <SelectItem value="licensee">Licensee</SelectItem>
                          <SelectItem value="witness">Witness</SelectItem>
                          <SelectItem value="advisor">Advisor</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`party-email-${index}`}>Email (Optional)</Label>
                      <Input
                        id={`party-email-${index}`}
                        type="email"
                        value={party.email || ""}
                        onChange={(e) => updateParty(index, "email", e.target.value)}
                        placeholder="email@example.com"
                        disabled={index === 0} // Disable for licensor (current user)
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addParty} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Party
              </Button>
            </div>
          )}

          {/* Step 3: Terms & Conditions */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">License Duration</Label>
                  <Select value={formData.terms.duration} onValueChange={(value) => updateTerm("duration", value)}>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select license duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1_year">1 Year</SelectItem>
                      <SelectItem value="2_years">2 Years</SelectItem>
                      <SelectItem value="3_years">3 Years</SelectItem>
                      <SelectItem value="5_years">5 Years</SelectItem>
                      <SelectItem value="10_years">10 Years</SelectItem>
                      <SelectItem value="perpetual">Perpetual</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="territory">Territory</Label>
                  <Select value={formData.terms.territory} onValueChange={(value) => updateTerm("territory", value)}>
                    <SelectTrigger id="territory">
                      <SelectValue placeholder="Select territory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worldwide">Worldwide</SelectItem>
                      <SelectItem value="north_america">North America</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rights">Licensed Rights</Label>
                <Textarea
                  id="rights"
                  value={formData.terms.rights}
                  onChange={(e) => updateTerm("rights", e.target.value)}
                  placeholder="Describe the specific rights being licensed (e.g., use, modify, distribute)"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="royalties">Royalties & Payments</Label>
                <Textarea
                  id="royalties"
                  value={formData.terms.royalties}
                  onChange={(e) => updateTerm("royalties", e.target.value)}
                  placeholder="Describe the royalty structure and payment terms"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="termination">Termination Conditions</Label>
                <Textarea
                  id="termination"
                  value={formData.terms.termination}
                  onChange={(e) => updateTerm("termination", e.target.value)}
                  placeholder="Describe the conditions under which this agreement may be terminated"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review & Create */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="font-medium">Agreement Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Title</div>
                    <div>{formData.title || "Not specified"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Type</div>
                    <div>{formData.type || "Not specified"}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Description</div>
                  <div className="whitespace-pre-line">{formData.description || "Not specified"}</div>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="font-medium">Parties</h3>
                <div className="space-y-3">
                  {formData.parties.map((party, index) => (
                    <div key={party.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 border-b last:border-b-0">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          {party.role.charAt(0).toUpperCase() + party.role.slice(1)}
                          {index === 0 ? " (You)" : ""}
                        </div>
                        <div>{party.name || "Not specified"}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Wallet Address</div>
                        <div className="font-mono text-xs truncate">{party.walletAddress || "Not specified"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="font-medium">Terms & Conditions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Duration</div>
                    <div>{formatValue(formData.terms.duration) || "Not specified"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Territory</div>
                    <div>{formatValue(formData.terms.territory) || "Not specified"}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Licensed Rights</div>
                  <div className="whitespace-pre-line">{formData.terms.rights || "Not specified"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Royalties & Payments</div>
                  <div className="whitespace-pre-line">{formData.terms.royalties || "Not specified"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Termination Conditions</div>
                  <div className="whitespace-pre-line">{formData.terms.termination || "Not specified"}</div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  By creating this agreement, you are initiating a blockchain-based licensing contract. Once created,
                  the agreement will be in draft status until all parties have signed it. As the creator, you will be
                  able to make changes while it's in draft status.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 0 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            ) : (
              <div></div> // Empty div to maintain flex spacing
            )}

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep} disabled={!validateCurrentStep()}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Agreement
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}

