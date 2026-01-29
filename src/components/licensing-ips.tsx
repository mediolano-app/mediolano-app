"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, ChevronLeft, ChevronRight, List, FileText, Send, BookOpen, Music, PaintbrushIcon as PaintBrush, Code, Lightbulb, CopyrightIcon as Trademark, Film, Gamepad2, Circle } from 'lucide-react'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { useIPLicensing } from '@/hooks/useIPLicensing'
import { useAccount } from '@starknet-react/core'
import { useUserNFTs } from '@/hooks/useUserNft'
import { type NFT as IP } from '@/hooks/useUserNft'
import Link from "next/link"
const steps = ["Select IP", "Licensing Details", "Review & Submit"]

// interface IP {
//   id: number;
//   name: string;
//   type: string;
//   description: string;
//   image?: string;
// }

// const mockIPs: IP[] = [
//   { id: 1, name: "Novel: The Blockchain Chronicles", type: "Literary Work", description: "A thrilling novel set in a world where blockchain technology governs society." },
//   { id: 2, name: "Song: Decentralized Harmony", type: "Musical Composition", description: "A groundbreaking musical piece exploring themes of decentralization and digital autonomy." },
//   { id: 3, name: "Painting: Digital Renaissance", type: "Artwork", description: "A stunning digital painting that blends classical art techniques with modern blockchain symbolism." },
//   { id: 4, name: "Software: CryptoAnalyzer Pro", type: "Software", description: "A powerful tool for analyzing cryptocurrency trends and predicting market movements." },
//   { id: 5, name: "Patent: Quantum Blockchain Algorithm", type: "Patent", description: "A revolutionary algorithm that combines quantum computing principles with blockchain technology." },
//   { id: 6, name: "Trademark: CryptoSecure", type: "Trademark", description: "A trusted brand name in the world of cryptocurrency security solutions." },
//   { id: 7, name: "Film: The Decentralized Dream", type: "Cinematographic Work", description: "A documentary exploring the impact of decentralized technologies on society." },
//   { id: 8, name: "Game: Crypto Conquest", type: "Video Game", description: "An immersive strategy game where players build and manage their own blockchain empires." },
//   { id: 9, name: "Sculpture: Blockchain Bust", type: "Artwork", description: "A physical representation of blockchain's impact, crafted in marble and embedded with digital elements." },
//   { id: 10, name: "Algorithm: Neural Crypto Network", type: "Software", description: "An AI-powered algorithm for optimizing cryptocurrency trading strategies." },
//   { id: 11, name: "Logo: Decentralized Future", type: "Trademark", description: "A sleek, modern logo representing the concept of a decentralized future." },
//   { id: 12, name: "Book: Ethereum Enigma", type: "Literary Work", description: "A comprehensive guide to understanding and developing on the Ethereum platform." },
// ]

const ITEMS_PER_PAGE = 5

interface LicensingDetails {
  licenseType: string;
  duration: string;
  territory: string;
  royaltyRate: string;
  upfrontFee: string;
  sublicensing: boolean;
  exclusivity: string;
  useRestrictions: string;
  terminationConditions: string;
  disputeResolution: string;
  additionalTerms: string;
}

interface FormData {
  selectedIP: IP | null;
  licensingDetails: LicensingDetails;
}

interface FormErrors {
  selectedIP?: string;
  licenseType?: string;
  territory?: string;
}

export function IPLicensing() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    selectedIP: null,
    licensingDetails: {
      licenseType: "",
      duration: "",
      territory: "",
      royaltyRate: "",
      upfrontFee: "",
      sublicensing: false,
      exclusivity: "",
      useRestrictions: "",
      terminationConditions: "",
      disputeResolution: "",
      additionalTerms: "",
    },
  })
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState({ success: false, message: "", txHash: "" })
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const { address } = useAccount();
  const { mintLicensingNft } = useIPLicensing();
  const { nfts } = useUserNFTs();

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = () => {
    if (validateStep()) {
      setIsConfirmDialogOpen(true)
    }
  }

  const confirmSubmission = async () => {
    if (!address || !formData.selectedIP) {
      toast({
        title: "Error",
        description: "Please connect your wallet and select an IP.",
        variant: "destructive"
      });
      return;
    }

    setIsConfirmDialogOpen(false);

    try {
      // Create license data JSON
      const licenseData = JSON.stringify({
        licenseType: formData.licensingDetails.licenseType,
        duration: formData.licensingDetails.duration,
        territory: formData.licensingDetails.territory,
        royaltyRate: formData.licensingDetails.royaltyRate,
        upfrontFee: formData.licensingDetails.upfrontFee,
        sublicensing: formData.licensingDetails.sublicensing,
        exclusivity: formData.licensingDetails.exclusivity,
        useRestrictions: formData.licensingDetails.useRestrictions,
        terminationConditions: formData.licensingDetails.terminationConditions,
        disputeResolution: formData.licensingDetails.disputeResolution,
        additionalTerms: formData.licensingDetails.additionalTerms,
        timestamp: Date.now(),
        licensee: address
      });

      // Create metadata for the license NFT
      const licenseMetadata = JSON.stringify({
        name: `License for ${formData.selectedIP.name}`,
        description: `IP License - ${formData.licensingDetails.licenseType}`,
        image: formData.selectedIP?.image || "/background.jpg",
        attributes: {
          ipId: formData.selectedIP.id,
          licenseType: formData.licensingDetails.licenseType,
          duration: formData.licensingDetails.duration,
          territory: formData.licensingDetails.territory,
          exclusivity: formData.licensingDetails.exclusivity
        }
      });

      // Call the smart contract to mint the license NFT
      const result = await mintLicensingNft(
        address,
        BigInt(formData.selectedIP.id), // Convert ID to bigint
        licenseMetadata,
        licenseData
      );

      setSubmissionStatus({
        success: true,
        message: "Your IP licensing request has been successfully submitted to the blockchain.",
        txHash: result.transaction_hash
      });

      toast({
        title: "Success!",
        description: "Your IP license has been created on the blockchain.",
      });

      // Store transaction hash
      const txHash = result.transaction_hash;
      setIsDrawerOpen(true);

      // You might want to add the transaction hash to the submission status
      setSubmissionStatus(prev => ({
        ...prev,
        txHash
      }));

    } catch (error) {
      console.error('Error creating license:', error);
      setSubmissionStatus({
        success: false,
        message: "Failed to create license. Please try again.",
        txHash: ""
      });

      toast({
        title: "Error",
        description: "Failed to create license. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateFormData = (stepData: Partial<FormData>) => {
    setFormData((prevData) => ({ ...prevData, ...stepData }))
  }

  const validateStep = (): boolean => {
    let stepErrors: FormErrors = {}
    switch (currentStep) {
      case 0:
        if (!formData.selectedIP) {
          stepErrors.selectedIP = "Please select an IP to license."
        }
        break
      case 1:
        const { licenseType, territory } = formData.licensingDetails
        if (!licenseType) stepErrors.licenseType = "License type is required."
        if (!territory) stepErrors.territory = "Territory is required."
        break
      case 2:
        // No validation needed for review step
        break
    }
    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const filteredIPs = nfts.filter(ip =>
    ip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ip.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredIPs.length / ITEMS_PER_PAGE)
  const paginatedIPs = filteredIPs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const renderSelectIPStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Select an Intellectual Property to License</h2>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search IPs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <RadioGroup
        value={formData.selectedIP?.id.toString()}
        onValueChange={(value) => {
          const selectedIP = nfts.find(ip => ip.id.toString() === value);
          if (selectedIP) {
            updateFormData({ selectedIP });
          }
        }}
        className="space-y-2"
      >
        {paginatedIPs.map((ip) => (
          <div key={ip.id} className="flex items-start space-x-2 p-3 rounded-lg border border-muted hover:bg-accent hover:text-accent-foreground">
            <RadioGroupItem value={ip.id.toString()} id={`ip-${ip.id}`} className="mt-1" />
            <Label htmlFor={`ip-${ip.id}`} className="flex-grow cursor-pointer">
              <div className="flex items-center space-x-2">
                {renderIPTypeIcon(ip.type)}
                <span className="font-medium">{ip.name}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">{ip.type}</div>
              <div className="text-sm mt-1">{ip.description}</div>
            </Label>
          </div>
        ))}
      </RadioGroup>
      {filteredIPs.length === 0 && (
        <p className="text-center text-muted-foreground">No matching IPs found.</p>
      )}
      {errors.selectedIP && <p className="text-sm text-destructive mt-2">{errors.selectedIP}</p>}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Previous</span>
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <span className="hidden md:inline">Next</span>
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  const renderLicensingDetailsStep = () => (
    <div className="space-y-4">


      {formData.selectedIP && (
        <div className="bg-muted p-4 rounded-md mb-4">
          <h3 className="font-semibold mb-2">Selected IP Information:</h3>
          <p><strong>Name:</strong> {formData.selectedIP.name}</p>
          <p><strong>Type:</strong> {formData.selectedIP.type}</p>
          <p><strong>Description:</strong> {formData.selectedIP.description}</p>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Set Licensing Details</h2>

      <div className="space-y-2">
        <Label htmlFor="licenseType">License Type <span className="text-destructive">*</span></Label>
        <Select
          onValueChange={(value) => updateFormData({ licensingDetails: { ...formData.licensingDetails, licenseType: value } })}
          value={formData.licensingDetails.licenseType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select license type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="exclusive">Exclusive</SelectItem>
            <SelectItem value="non-exclusive">Non-Exclusive</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
          </SelectContent>
        </Select>
        {errors.licenseType && <p className="text-sm text-destructive mt-1">{errors.licenseType}</p>}
        <p className="text-sm text-muted-foreground">Required: Please select a license type</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          name="duration"
          value={formData.licensingDetails.duration}
          onChange={(e) => updateFormData({ licensingDetails: { ...formData.licensingDetails, duration: e.target.value } })}
          placeholder="e.g., 2 years"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="territory">Territory <span className="text-destructive">*</span></Label>
        <Input
          id="territory"
          name="territory"
          value={formData.licensingDetails.territory}
          onChange={(e) => updateFormData({ licensingDetails: { ...formData.licensingDetails, territory: e.target.value } })}
          placeholder="e.g., Worldwide, North America"
        />
        {errors.territory && <p className="text-sm text-destructive mt-1">{errors.territory}</p>}
        <p className="text-sm text-muted-foreground">Required: Please specify the territory for this license</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="royaltyRate">Royalty Rate</Label>
        <Input
          id="royaltyRate"
          name="royaltyRate"
          value={formData.licensingDetails.royaltyRate}
          onChange={(e) => updateFormData({ licensingDetails: { ...formData.licensingDetails, royaltyRate: e.target.value } })}
          placeholder="e.g., 5%"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="upfrontFee">Upfront Fee</Label>
        <Input
          id="upfrontFee"
          name="upfrontFee"
          value={formData.licensingDetails.upfrontFee}
          onChange={(e) => updateFormData({ licensingDetails: { ...formData.licensingDetails, upfrontFee: e.target.value } })}
          placeholder="e.g., $10,000"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="sublicensing"
          checked={formData.licensingDetails.sublicensing}
          onCheckedChange={(checked) => updateFormData({ licensingDetails: { ...formData.licensingDetails, sublicensing: checked === true } })}
        />
        <Label htmlFor="sublicensing">Allow Sublicensing</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="exclusivity">Exclusivity</Label>
        <Select
          onValueChange={(value) => updateFormData({ licensingDetails: { ...formData.licensingDetails, exclusivity: value } })}
          value={formData.licensingDetails.exclusivity}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select exclusivity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fully-exclusive">Fully Exclusive</SelectItem>
            <SelectItem value="partially-exclusive">Partially Exclusive</SelectItem>
            <SelectItem value="non-exclusive">Non-Exclusive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="useRestrictions">Use Restrictions</Label>
        <Textarea
          id="useRestrictions"
          name="useRestrictions"
          value={formData.licensingDetails.useRestrictions}
          onChange={(e) => updateFormData({ licensingDetails: { ...formData.licensingDetails, useRestrictions: e.target.value } })}
          placeholder="Enter any use restrictions"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="terminationConditions">Termination Conditions</Label>
        <Textarea
          id="terminationConditions"
          name="terminationConditions"
          value={formData.licensingDetails.terminationConditions}
          onChange={(e) => updateFormData({ licensingDetails: { ...formData.licensingDetails, terminationConditions: e.target.value } })}
          placeholder="Enter termination conditions"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="disputeResolution">Dispute Resolution</Label>
        <Select
          onValueChange={(value) => updateFormData({ licensingDetails: { ...formData.licensingDetails, disputeResolution: value } })}
          value={formData.licensingDetails.disputeResolution}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select dispute resolution method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="arbitration">Arbitration</SelectItem>
            <SelectItem value="mediation">Mediation</SelectItem>
            <SelectItem value="litigation">Litigation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalTerms">Additional Terms</Label>
        <Textarea
          id="additionalTerms"
          name="additionalTerms"
          value={formData.licensingDetails.additionalTerms}
          onChange={(e) => updateFormData({ licensingDetails: { ...formData.licensingDetails, additionalTerms: e.target.value } })}
          placeholder="Enter any additional terms or conditions"
          rows={4}
        />
      </div>
    </div>
  )

  const renderReviewSubmitStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Review and Submit</h2>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Selected Intellectual Property</h3>
        <p>{formData.selectedIP?.name}</p>
        <p className="text-sm text-muted-foreground">{formData.selectedIP?.type}</p>
        <p className="text-sm">{formData.selectedIP?.description}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Licensing Details</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>License Type: {formData.licensingDetails.licenseType}</li>
          <li>Duration: {formData.licensingDetails.duration}</li>
          <li>Territory: {formData.licensingDetails.territory}</li>
          <li>Royalty Rate: {formData.licensingDetails.royaltyRate}</li>
          <li>Upfront Fee: {formData.licensingDetails.upfrontFee}</li>
          <li>Sublicensing: {formData.licensingDetails.sublicensing ? 'Allowed' : 'Not Allowed'}</li>
          <li>Exclusivity: {formData.licensingDetails.exclusivity}</li>
        </ul>
      </div>

      {formData.licensingDetails.useRestrictions && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Use Restrictions</h3>
          <p>{formData.licensingDetails.useRestrictions}</p>
        </div>
      )}

      {formData.licensingDetails.terminationConditions && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Termination Conditions</h3>
          <p>{formData.licensingDetails.terminationConditions}</p>
        </div>
      )}

      {formData.licensingDetails.disputeResolution && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Dispute Resolution</h3>
          <p>{formData.licensingDetails.disputeResolution}</p>
        </div>
      )}

      {formData.licensingDetails.additionalTerms && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Additional Terms</h3>
          <p>{formData.licensingDetails.additionalTerms}</p>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Please review the information above. If everything is correct, click the Submit button to proceed with the licensing process.
      </p>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return renderSelectIPStep()
      case 1:
        return renderLicensingDetailsStep()
      case 2:
        return renderReviewSubmitStep()
      default:
        return null
    }
  }

  const renderStepIndicator = () => (
    <div className="flex justify-between mb-4">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            index < currentStep ? "bg-primary text-primary-foreground" :
              index === currentStep ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
          )}>
            {index === 0 && <List className="h-5 w-5" />}
            {index === 1 && <FileText className="h-5 w-5" />}
            {index === 2 && <Send className="h-5 w-5" />}
          </div>
          <span className="text-xs mt-1 hidden md:inline">{step}</span>
        </div>
      ))}
    </div>
  )

  const renderIPTypeIcon = (type: string) => {
    switch (type) {
      case "Literary Work":
        return <BookOpen className="h-5 w-5 text-blue-600" />
      case "Musical Composition":
        return <Music className="h-5 w-5 text-blue-500" />
      case "Artwork":
        return <PaintBrush className="h-5 w-5 text-green-500" />
      case "Software":
        return <Code className="h-5 w-5 text-red-500" />
      case "Patent":
        return <Lightbulb className="h-5 w-5 text-yellow-500" />
      case "Trademark":
        return <Trademark className="h-5 w-5 text-indigo-500" />
      case "Cinematographic Work":
        return <Film className="h-5 w-5 text-pink-500" />
      case "Video Game":
        return <Gamepad2 className="h-5 w-5 text-orange-500" />
      default:
        return <Circle className="h-5 w-5 text-gray-500" />
    }
  }

  const renderDrawerContent = () => (
    <div className="p-4 space-y-4">
      {submissionStatus.success && (
        <>
          <div>
            <h3 className="font-semibold">Transaction Details</h3>
            <p className="text-sm break-all">
              Transaction Hash: {submissionStatus.txHash}
            </p>
            <Link
              href={`${process.env.NEXT_PUBLIC_EXPLORER_URL || "https://sepolia.voyager.online"}/tx/${submissionStatus.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              View on Explorer
            </Link>
          </div>
          <div>
            <h3 className="font-semibold">Selected IP</h3>
            <p>{formData.selectedIP?.name}</p>
          </div>
          <div>
            <h3 className="font-semibold">License Details</h3>
            <ul className="list-disc list-inside">
              <li>License Type: {formData.licensingDetails.licenseType}</li>
              <li>Duration: {formData.licensingDetails.duration}</li>
              <li>Territory: {formData.licensingDetails.territory}</li>
              <li>Royalty Rate: {formData.licensingDetails.royaltyRate}</li>
              <li>Upfront Fee: {formData.licensingDetails.upfrontFee}</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">IP Licensing Application</CardTitle>
        {renderStepIndicator()}
      </CardHeader>
      <CardContent className="px-4 sm:px-6">{renderStep()}</CardContent>
      <CardFooter className="flex justify-between px-4 sm:px-6">
        <Button onClick={handlePrevious} disabled={currentStep === 0}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext}>
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <Send className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Submit</span>
          </Button>
        )}
      </CardFooter>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{submissionStatus.success ? "License Created Successfully" : "Error"}</DrawerTitle>
            <DrawerDescription>{submissionStatus.message}</DrawerDescription>
          </DrawerHeader>
          {renderDrawerContent()}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this licensing request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmSubmission}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
