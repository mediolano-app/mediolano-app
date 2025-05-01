"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAssetById } from "@/app/licensing/lib/mock-asset-data"
import { AlertCircle, Check, ChevronRight, Coins, FileQuestion, InfoIcon, Rocket } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { AssetTypeIcon } from "@/app/licensing/components/asset-type-icon"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LicenseTemplateSelector } from "@/app/licensing/components/license-template-selector"
import { Badge } from "@/components/ui/badge"

interface CreateLicenseFormProps {
  assetId: string
}

export function CreateLicenseForm({ assetId }: CreateLicenseFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const asset = getAssetById(assetId)
  const [isCreating, setIsCreating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("details")
  const [licenseDetails, setLicenseDetails] = useState({
    name: asset ? `License for ${asset.name}` : "",
    description: "",
    licenseeAddress: "",
    duration: "perpetual",
    commercialUse: true,
    derivativeWorks: false,
    attribution: true,
    territory: "worldwide",
    royaltyPercentage: "5",
    additionalTerms: "",
    termsAccepted: false,
  })
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  if (!asset) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-medium">Asset Not Found</h3>
          <p className="mt-2 text-center text-muted-foreground">The asset you are trying to license does not exist.</p>
          <Link href="/assets">
            <Button className="mt-4">Back to Assets</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLicenseDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setLicenseDetails((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setLicenseDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)

    // Apply template settings based on the selected template
    if (templateId === "commercial") {
      setLicenseDetails((prev) => ({
        ...prev,
        name: `Commercial License for ${asset.name}`,
        description: `Full commercial rights to use ${asset.name} in accordance with the terms specified.`,
        commercialUse: true,
        derivativeWorks: true,
        attribution: true,
        territory: "worldwide",
        royaltyPercentage: "10",
      }))
    } else if (templateId === "personal") {
      setLicenseDetails((prev) => ({
        ...prev,
        name: `Personal License for ${asset.name}`,
        description: `Non-commercial personal use license for ${asset.name}.`,
        commercialUse: false,
        derivativeWorks: false,
        attribution: true,
        territory: "worldwide",
        royaltyPercentage: "0",
      }))
    } else if (templateId === "derivative") {
      setLicenseDetails((prev) => ({
        ...prev,
        name: `Derivative Works License for ${asset.name}`,
        description: `License to create derivative works based on ${asset.name}.`,
        commercialUse: true,
        derivativeWorks: true,
        attribution: true,
        territory: "worldwide",
        royaltyPercentage: "7",
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!licenseDetails.termsAccepted) {
      toast({
        title: "Please accept the terms",
        description: "You must accept the terms to create a license",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    // Simulate blockchain transaction with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          toast({
            title: "License created successfully",
            description: "Your new license has been created on Starknet blockchain",
          })
          router.push("/assets")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const isFormValid = () => {
    return (
      licenseDetails.name.trim() !== "" &&
      licenseDetails.description.trim() !== "" &&
      licenseDetails.licenseeAddress.trim() !== ""
    )
  }

  const isTermsValid = () => {
    return true // All terms have default values
  }

  const getStepStatus = (step: string) => {
    if (step === "details") {
      return isFormValid() ? "complete" : "incomplete"
    } else if (step === "terms") {
      return isTermsValid() ? "complete" : "incomplete"
    }
    return "incomplete"
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
              <Image
                src={asset.image || `/placeholder.svg?height=48&width=48&text=${asset.assetType?.charAt(0) || "IP"}`}
                alt={asset.name}
                className="object-cover"
                fill
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{asset.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AssetTypeIcon type={asset.assetType || "Custom"} className="h-3.5 w-3.5" />
                <span>{asset.assetType || "Custom"}</span>
              </div>
            </div>
          </div>

          {asset.licenseInfo && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Current License: {asset.licenseInfo.type}</span>
              {asset.licenseInfo.version && <span className="text-muted-foreground">v{asset.licenseInfo.version}</span>}
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <div className="absolute left-0 top-[15px] w-full">
            <div className="mx-auto h-1 w-full bg-muted">
              <div
                className="h-1 bg-primary transition-all duration-300"
                style={{
                  width: activeTab === "details" ? "0%" : activeTab === "terms" ? "50%" : "100%",
                }}
              />
            </div>
          </div>

          <div className="relative z-10 flex justify-between">
            <StepIndicator
              step="1"
              label="Details"
              status={getStepStatus("details")}
              active={activeTab === "details"}
              onClick={() => setActiveTab("details")}
            />
            <StepIndicator
              step="2"
              label="Terms"
              status={getStepStatus("terms")}
              active={activeTab === "terms"}
              onClick={() => (isFormValid() ? setActiveTab("terms") : null)}
              disabled={!isFormValid()}
            />
            <StepIndicator
              step="3"
              label="Review"
              status={getStepStatus("review")}
              active={activeTab === "review"}
              onClick={() => (isFormValid() && isTermsValid() ? setActiveTab("review") : null)}
              disabled={!isFormValid() || !isTermsValid()}
            />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>License Information</CardTitle>
              <CardDescription>Basic information about the license you are creating</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <LicenseTemplateSelector
                assetType={asset.assetType || "Custom"}
                onSelect={handleTemplateSelect}
                selectedTemplate={selectedTemplate}
              />

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="license-name">License Name</Label>
                  <Input
                    id="license-name"
                    name="name"
                    value={licenseDetails.name}
                    onChange={handleInputChange}
                    placeholder="Enter license name"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="license-description">Description</Label>
                  <Textarea
                    id="license-description"
                    name="description"
                    value={licenseDetails.description}
                    onChange={handleInputChange}
                    placeholder="Describe the purpose of this license"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="licensee-address">Licensee Address</Label>
                  <Input
                    id="licensee-address"
                    name="licenseeAddress"
                    value={licenseDetails.licenseeAddress}
                    onChange={handleInputChange}
                    placeholder="0x..."
                    required
                  />
                  <p className="text-xs text-muted-foreground">The address that will receive this license</p>
                </div>

                <div className="grid gap-2">
                  <Label>License Duration</Label>
                  <RadioGroup
                    value={licenseDetails.duration}
                    onValueChange={(value) => handleSelectChange("duration", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="perpetual" id="perpetual" />
                      <Label htmlFor="perpetual">Perpetual (No expiration)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="limited" id="limited" />
                      <Label htmlFor="limited">Limited Time</Label>
                    </div>
                  </RadioGroup>

                  {licenseDetails.duration === "limited" && (
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="duration-value">Duration</Label>
                        <Input id="duration-value" name="durationValue" type="number" min="1" placeholder="1" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="duration-unit">Unit</Label>
                        <Select defaultValue="years">
                          <SelectTrigger id="duration-unit">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                            <SelectItem value="years">Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="button" onClick={() => setActiveTab("terms")} disabled={!isFormValid()} className="gap-2">
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="terms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>License Terms</CardTitle>
              <CardDescription>Define the terms and conditions of this license</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="commercial-use" className="flex items-center gap-2">
                        Commercial Use
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </Label>
                      <Switch
                        id="commercial-use"
                        checked={licenseDetails.commercialUse}
                        onCheckedChange={(checked) => handleSwitchChange("commercialUse", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Allows the licensee to use the IP for commercial purposes
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="derivative-works" className="flex items-center gap-2">
                        Derivative Works
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </Label>
                      <Switch
                        id="derivative-works"
                        checked={licenseDetails.derivativeWorks}
                        onCheckedChange={(checked) => handleSwitchChange("derivativeWorks", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Allows the licensee to create derivative works based on the IP
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="attribution" className="flex items-center gap-2">
                        Attribution Required
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </Label>
                      <Switch
                        id="attribution"
                        checked={licenseDetails.attribution}
                        onCheckedChange={(checked) => handleSwitchChange("attribution", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Requires the licensee to provide attribution to the original creator
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="territory">Territory</Label>
                    <Select
                      value={licenseDetails.territory}
                      onValueChange={(value) => handleSelectChange("territory", value)}
                    >
                      <SelectTrigger id="territory">
                        <SelectValue placeholder="Select territory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="worldwide">Worldwide</SelectItem>
                        <SelectItem value="us">United States Only</SelectItem>
                        <SelectItem value="eu">European Union Only</SelectItem>
                        <SelectItem value="asia">Asia Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="royalty">Royalty Percentage</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="royalty"
                        name="royaltyPercentage"
                        value={licenseDetails.royaltyPercentage}
                        onChange={handleInputChange}
                        type="number"
                        min="0"
                        max="100"
                      />
                      <span>%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Percentage of revenue that must be paid to the IP owner
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Label htmlFor="additional-terms">Additional Terms</Label>
                <Textarea
                  id="additional-terms"
                  name="additionalTerms"
                  value={licenseDetails.additionalTerms}
                  onChange={handleInputChange}
                  placeholder="Enter any additional terms or conditions..."
                  className="mt-2 min-h-32"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                Back
              </Button>
              <Button type="button" onClick={() => setActiveTab("review")} className="gap-2">
                Review License
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review License</CardTitle>
              <CardDescription>Review your license before creating it on the blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This is a preview of your license. Please review all details carefully before submitting.
                </AlertDescription>
              </Alert>

              <div className="rounded-md border">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                        <Image
                          src={
                            asset.image ||
                            `/placeholder.svg?height=64&width=64&text=${asset.assetType?.charAt(0) || "IP"}`
                          }
                          alt={asset.name}
                          className="object-cover"
                          fill
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-medium">{licenseDetails.name}</h3>
                        <p className="text-sm text-muted-foreground">{licenseDetails.description}</p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h4 className="font-medium">License Details</h4>
                        <ul className="mt-2 space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Source Asset:</span>
                            <span>{asset.name}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Licensee:</span>
                            <span className="font-mono">{licenseDetails.licenseeAddress.slice(0, 10)}...</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>{licenseDetails.duration === "perpetual" ? "Perpetual" : "Limited Time"}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Created:</span>
                            <span>{new Date().toLocaleDateString()}</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium">License Terms</h4>
                        <ul className="mt-2 space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Commercial Use:</span>
                            <span
                              className={
                                licenseDetails.commercialUse
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }
                            >
                              {licenseDetails.commercialUse ? "Allowed" : "Not Allowed"}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Derivative Works:</span>
                            <span
                              className={
                                licenseDetails.derivativeWorks
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }
                            >
                              {licenseDetails.derivativeWorks ? "Allowed" : "Not Allowed"}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Attribution:</span>
                            <span
                              className={
                                licenseDetails.attribution
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }
                            >
                              {licenseDetails.attribution ? "Required" : "Not Required"}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Territory:</span>
                            <span className="capitalize">{licenseDetails.territory}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Royalty:</span>
                            <span>{licenseDetails.royaltyPercentage}% of revenue</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {licenseDetails.additionalTerms && (
                      <div>
                        <h4 className="font-medium">Additional Terms</h4>
                        <p className="mt-2 text-sm text-muted-foreground">{licenseDetails.additionalTerms}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={licenseDetails.termsAccepted}
                  onCheckedChange={(checked) => handleSwitchChange("termsAccepted", checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="terms" className="text-sm font-normal leading-snug">
                    I confirm that these terms are legally binding and will be enforced on-chain
                  </Label>
                </div>
              </div>

              {isCreating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Creating license...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 w-full" />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setActiveTab("terms")} disabled={isCreating}>
                Back to Terms
              </Button>
              <Button type="submit" className="gap-2" disabled={isCreating || !licenseDetails.termsAccepted}>
                {isCreating ? (
                  <>
                    <Rocket className="h-4 w-4 animate-spin" />
                    <span>Creating License...</span>
                  </>
                ) : (
                  <>
                    <Coins className="h-4 w-4" />
                    <span>Create License</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}

interface StepIndicatorProps {
  step: string
  label: string
  status: "complete" | "incomplete"
  active: boolean
  onClick: () => void
  disabled?: boolean
}

function StepIndicator({ step, label, status, active, onClick, disabled = false }: StepIndicatorProps) {
  return (
    <button type="button" className="flex flex-col items-center gap-2" onClick={onClick} disabled={disabled}>
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium",
          active
            ? "border-primary bg-primary text-primary-foreground"
            : status === "complete"
              ? "border-primary bg-primary/10 text-primary"
              : "border-muted-foreground/30 bg-background text-muted-foreground",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        {status === "complete" && !active ? <Check className="h-4 w-4" /> : step}
      </div>
      <span
        className={cn(
          "text-sm font-medium",
          active ? "text-foreground" : "text-muted-foreground",
          disabled && "opacity-50",
        )}
      >
        {label}
      </span>
    </button>
  )
}
