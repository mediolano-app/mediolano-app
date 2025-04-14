"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Upload, Info, Shield, CheckCircle2, Clock, Globe, LinkIcon, FileCheck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  assetType: z.string({
    required_error: "Please select an asset type.",
  }),
  file: z.any(),
  creatorName: z.string().min(2, {
    message: "Creator name must be at least 2 characters.",
  }),
  creatorEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  additionalInfo: z.string().optional(),
  ownershipDeclaration: z.boolean().refine((val) => val === true, {
    message: "You must declare that you are the rightful owner.",
  }),
})

export default function CreatePage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [progress, setProgress] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      assetType: "",
      creatorName: "",
      creatorEmail: "",
      additionalInfo: "",
      ownershipDeclaration: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    console.log(values)

    // Simulate blockchain registration process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSubmitting(false)
          setIsComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  if (isComplete) {
    return (
      <div className="container py-10 max-w-3xl mx-auto">
        <Card className="border-green-500 dark:border-green-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Ownership Verified!</CardTitle>
            <CardDescription>
              Your asset has been successfully registered with blockchain proof of ownership
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-green-800 dark:text-green-400 font-medium">
                Proof of ownership is now protected in 181 countries
              </p>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4 text-center">Ownership Certificate</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Asset ID</p>
                  <p className="font-mono text-sm">0x7f9e8d7c6b5a4321</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Hash</p>
                  <p className="font-mono text-sm truncate">0x1a2b3c4d5e6f7890</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registration Date</p>
                  <p className="text-sm">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Protection Period</p>
                  <p className="text-sm">70 years</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Blockchain Verification</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your ownership has been permanently recorded on the Starknet blockchain and settled on Ethereum for
                  maximum security and legal protection.
                </p>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>What happens next?</AlertTitle>
              <AlertDescription>
                Your asset is now protected with blockchain proof of ownership. You can download your certificate,
                verify your ownership anytime, or share proof with others.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="flex-1">
                <FileCheck className="mr-2 h-4 w-4" /> Download Certificate
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/dashboard">View in Dashboard</Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <Button variant="link" asChild>
              <Link href="/verify">Verify this ownership claim</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create Proof of Ownership</h1>
          <p className="text-muted-foreground">
            Secure your intellectual property with blockchain-verified proof of ownership
          </p>
        </div>

        {/* Ownership Protection Banner */}
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-1">Global Ownership Protection</h2>
                <p className="text-sm text-muted-foreground">
                  Your intellectual property will be protected in 181 countries under The Berne Convention with
                  immutable blockchain verification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="standard" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard">Standard Protection</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Protection</TabsTrigger>
          </TabsList>
          <TabsContent value="standard">
            <Card>
              <CardHeader>
                <CardTitle>Create Proof of Ownership</CardTitle>
                <CardDescription>Register your asset with blockchain verification for legal protection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Registration Progress</p>
                    <p className="text-sm text-muted-foreground">Step {step} of 3</p>
                  </div>
                  <Progress value={(step / 3) * 100} className="h-2" />
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {step === 1 && (
                      <>
                        <div className="bg-muted/50 p-4 rounded-lg mb-6">
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-primary" /> Asset Information
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Provide details about the intellectual property you want to protect with blockchain proof of
                            ownership.
                          </p>
                        </div>

                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Asset Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter the title of your asset" {...field} />
                              </FormControl>
                              <FormDescription>
                                This will be the official title on your ownership certificate.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your asset in detail"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Provide a detailed description to help identify your asset in ownership disputes.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="assetType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Asset Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select asset type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="artwork">Artwork</SelectItem>
                                  <SelectItem value="music">Music</SelectItem>
                                  <SelectItem value="video">Video</SelectItem>
                                  <SelectItem value="literature">Literature</SelectItem>
                                  <SelectItem value="software">Software</SelectItem>
                                  <SelectItem value="ai-model">AI Model</SelectItem>
                                  <SelectItem value="nft">NFT</SelectItem>
                                  <SelectItem value="rwa">Real World Asset</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>Select the category that best describes your asset.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end">
                          <Button type="button" onClick={nextStep}>
                            Next Step <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <div className="bg-muted/50 p-4 rounded-lg mb-6">
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <Upload className="h-4 w-4 text-primary" /> Asset Upload & Creator Information
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Upload your asset and provide creator details for your ownership certificate.
                          </p>
                        </div>

                        <FormField
                          control={form.control}
                          name="file"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Upload Asset</FormLabel>
                              <FormControl>
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                                  <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                                  <p className="text-sm font-medium mb-1">Drag and drop your file here</p>
                                  <p className="text-xs text-muted-foreground mb-4">
                                    Your file will be securely hashed for blockchain verification
                                  </p>
                                  <Input
                                    type="file"
                                    className="hidden"
                                    id="file-upload"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      field.onChange(file)
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById("file-upload")?.click()}
                                  >
                                    Select File
                                  </Button>
                                </div>
                              </FormControl>
                              <FormDescription>
                                Your file will be securely hashed and referenced in the blockchain record. The original
                                file remains private.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="creatorName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Creator Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter creator's full name" {...field} />
                                </FormControl>
                                <FormDescription>Name to appear on the ownership certificate.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="creatorEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Creator Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter creator's email" type="email" {...field} />
                                </FormControl>
                                <FormDescription>For ownership verification communications.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevStep}>
                            Previous Step
                          </Button>
                          <Button type="button" onClick={nextStep}>
                            Next Step <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <div className="bg-muted/50 p-4 rounded-lg mb-6">
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" /> Ownership Declaration
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Confirm ownership details before creating your blockchain proof of ownership.
                          </p>
                        </div>

                        <FormField
                          control={form.control}
                          name="additionalInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Information (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Add any additional details about your asset ownership"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Include any other relevant information about your ownership claim.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <h3 className="font-medium">Ownership Protection Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3 border rounded-lg flex flex-col items-center text-center">
                              <Globe className="h-5 w-5 mb-2 text-primary" />
                              <h4 className="text-sm font-medium">181 Countries</h4>
                              <p className="text-xs text-muted-foreground">Global Protection</p>
                            </div>
                            <div className="p-3 border rounded-lg flex flex-col items-center text-center">
                              <Clock className="h-5 w-5 mb-2 text-primary" />
                              <h4 className="text-sm font-medium">70 Years</h4>
                              <p className="text-xs text-muted-foreground">Protection Period</p>
                            </div>
                            <div className="p-3 border rounded-lg flex flex-col items-center text-center">
                              <LinkIcon className="h-5 w-5 mb-2 text-primary" />
                              <h4 className="text-sm font-medium">Blockchain Verified</h4>
                              <p className="text-xs text-muted-foreground">Immutable Record</p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <FormField
                          control={form.control}
                          name="ownershipDeclaration"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 mt-1"
                                  checked={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Ownership Declaration</FormLabel>
                                <FormDescription>
                                  I declare that I am the rightful owner or authorized representative of this
                                  intellectual property. I understand that making a false claim may have legal
                                  consequences.
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>Before You Submit</AlertTitle>
                          <AlertDescription>
                            By creating this proof of ownership, your asset will be protected under The Berne Convention
                            in 181 countries. A unique hash of your asset will be permanently recorded on the blockchain
                            as evidence of your ownership.
                          </AlertDescription>
                        </Alert>

                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevStep}>
                            Previous Step
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <span className="mr-2">Creating Proof of Ownership</span>
                                <span>{progress}%</span>
                              </>
                            ) : (
                              "Create Proof of Ownership"
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Ownership Protection</CardTitle>
                <CardDescription>Enhanced options for complex intellectual property assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert className="bg-primary/5 border-primary/20">
                    <Shield className="h-4 w-4 text-primary" />
                    <AlertTitle>Premium Protection Features</AlertTitle>
                    <AlertDescription>
                      Advanced protection includes multi-chain verification, legal documentation preparation, and
                      enhanced ownership certificates with additional verification methods.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <Badge className="mb-2 w-fit">Coming Soon</Badge>
                        <CardTitle className="text-base">Multi-Chain Verification</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Record your ownership across multiple blockchains for enhanced security and redundancy.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <Badge className="mb-2 w-fit">Coming Soon</Badge>
                        <CardTitle className="text-base">Legal Documentation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Generate jurisdiction-specific legal documents to supplement your blockchain proof.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <Badge className="mb-2 w-fit">Coming Soon</Badge>
                        <CardTitle className="text-base">Enhanced Certificates</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Premium certificates with additional verification methods and security features.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <Badge className="mb-2 w-fit">Coming Soon</Badge>
                        <CardTitle className="text-base">API Integration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Integrate ownership verification directly into your applications and platforms.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button disabled>Advanced Protection Coming Soon</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-bold">How Proof of Ownership Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-muted/30 p-6 rounded-lg border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="font-bold text-primary">1</span>
              </div>
              <h3 className="font-medium mb-2">Create</h3>
              <p className="text-sm text-muted-foreground">
                Upload your asset and provide details. We create a secure hash of your work without storing the original
                file.
              </p>
            </div>
            <div className="bg-muted/30 p-6 rounded-lg border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="font-bold text-primary">2</span>
              </div>
              <h3 className="font-medium mb-2">Verify</h3>
              <p className="text-sm text-muted-foreground">
                Your ownership claim is recorded on the Starknet blockchain and settled on Ethereum for maximum
                security.
              </p>
            </div>
            <div className="bg-muted/30 p-6 rounded-lg border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="font-bold text-primary">3</span>
              </div>
              <h3 className="font-medium mb-2">Protect</h3>
              <p className="text-sm text-muted-foreground">
                Receive your ownership certificate with blockchain verification details and global legal protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
