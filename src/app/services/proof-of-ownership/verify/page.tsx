"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Search, Shield, CheckCircle2, X, ExternalLink, Copy, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const verifyFormSchema = z.object({
  assetId: z.string().min(1, {
    message: "Asset ID is required",
  }),
})

const hashFormSchema = z.object({
  transactionHash: z.string().min(1, {
    message: "Transaction hash is required",
  }),
})

const certificateFormSchema = z.object({
  certificateId: z.string().min(1, {
    message: "Certificate ID is required",
  }),
})

export default function VerifyPage() {
  const [verificationResult, setVerificationResult] = useState<"success" | "error" | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const assetForm = useForm<z.infer<typeof verifyFormSchema>>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: {
      assetId: "",
    },
  })

  const hashForm = useForm<z.infer<typeof hashFormSchema>>({
    resolver: zodResolver(hashFormSchema),
    defaultValues: {
      transactionHash: "",
    },
  })

  const certificateForm = useForm<z.infer<typeof certificateFormSchema>>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      certificateId: "",
    },
  })

  function onSubmitAssetId(values: z.infer<typeof verifyFormSchema>) {
    setIsVerifying(true)
    console.log(values)

    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false)
      setVerificationResult("success")
    }, 1500)
  }

  function onSubmitHash(values: z.infer<typeof hashFormSchema>) {
    setIsVerifying(true)
    console.log(values)

    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false)
      setVerificationResult("success")
    }, 1500)
  }

  function onSubmitCertificate(values: z.infer<typeof certificateFormSchema>) {
    setIsVerifying(true)
    console.log(values)

    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false)
      setVerificationResult("success")
    }, 1500)
  }

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Verify Proof of Ownership</h1>
          <p className="text-muted-foreground">
            Confirm the authenticity of intellectual property ownership claims on the blockchain
          </p>
        </div>

        <Tabs defaultValue="assetId" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assetId">By Asset ID</TabsTrigger>
            <TabsTrigger value="hash">By Transaction Hash</TabsTrigger>
            <TabsTrigger value="certificate">By Certificate ID</TabsTrigger>
          </TabsList>

          <TabsContent value="assetId">
            <Card>
              <CardHeader>
                <CardTitle>Verify by Asset ID</CardTitle>
                <CardDescription>Enter the Asset ID to verify its ownership information</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...assetForm}>
                  <form onSubmit={assetForm.handleSubmit(onSubmitAssetId)} className="space-y-4">
                    <FormField
                      control={assetForm.control}
                      name="assetId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asset ID</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter Asset ID (e.g., asset1)" className="pl-8" {...field} />
                              </div>
                              <Button type="submit" disabled={isVerifying}>
                                {isVerifying ? "Verifying..." : "Verify"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            The Asset ID can be found on the asset's page or ownership certificate
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hash">
            <Card>
              <CardHeader>
                <CardTitle>Verify by Transaction Hash</CardTitle>
                <CardDescription>Enter the blockchain transaction hash to verify ownership</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...hashForm}>
                  <form onSubmit={hashForm.handleSubmit(onSubmitHash)} className="space-y-4">
                    <FormField
                      control={hashForm.control}
                      name="transactionHash"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction Hash</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Enter transaction hash (0x...)"
                                  className="pl-8 font-mono"
                                  {...field}
                                />
                              </div>
                              <Button type="submit" disabled={isVerifying}>
                                {isVerifying ? "Verifying..." : "Verify"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            The transaction hash is the unique identifier of the blockchain transaction
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificate">
            <Card>
              <CardHeader>
                <CardTitle>Verify by Certificate ID</CardTitle>
                <CardDescription>Enter the Certificate ID to verify its authenticity</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...certificateForm}>
                  <form onSubmit={certificateForm.handleSubmit(onSubmitCertificate)} className="space-y-4">
                    <FormField
                      control={certificateForm.control}
                      name="certificateId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificate ID</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter Certificate ID" className="pl-8" {...field} />
                              </div>
                              <Button type="submit" disabled={isVerifying}>
                                {isVerifying ? "Verifying..." : "Verify"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            The Certificate ID can be found on the ownership certificate
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {verificationResult === "success" && (
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="bg-green-50 dark:bg-green-950/30 border-b border-green-100 dark:border-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-green-800 dark:text-green-400">Verification Successful</CardTitle>
              </div>
              <CardDescription className="text-green-700 dark:text-green-500">
                This asset has a valid proof of ownership record on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-100 dark:border-green-900">
                  <Shield className="h-10 w-10 text-green-600 dark:text-green-400" />
                  <div>
                    <h3 className="font-medium text-green-800 dark:text-green-400">Verified Ownership</h3>
                    <p className="text-sm text-green-700 dark:text-green-500">
                      This intellectual property is protected under The Berne Convention in 181 countries
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Asset Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Asset Title</p>
                      <p className="font-medium">Digital Mona Lisa</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Asset Type</p>
                      <p className="font-medium">Artwork</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Registration Date</p>
                      <p className="font-medium">2023-10-20</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Owner</p>
                      <p className="font-medium">John Creator</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Blockchain Verification</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-muted-foreground">Transaction Hash</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="p-2 bg-muted rounded font-mono text-xs break-all">
                        0x7f9e8d7c6b5a4321fedcba9876543210abcdef0123456789
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-muted-foreground">Block Number</p>
                        <span className="text-xs text-muted-foreground">Starknet</span>
                      </div>
                      <div className="p-2 bg-muted rounded font-mono text-xs">12345678</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-6">
              <Button className="sm:flex-1" asChild>
                <a href="/assets/asset1">View Asset Details</a>
              </Button>
              <Button variant="outline" className="sm:flex-1">
                <ExternalLink className="mr-2 h-4 w-4" /> View on Blockchain Explorer
              </Button>
            </CardFooter>
          </Card>
        )}

        {verificationResult === "error" && (
          <Alert variant="destructive">
            <X className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>
              We couldn't verify this asset. Please check the ID or hash and try again.
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold">About Proof of Ownership Verification</h2>
          <p className="text-muted-foreground">
            Our blockchain verification system provides indisputable proof of intellectual property ownership. When you
            verify an asset, we check its records against our secure blockchain database to confirm authenticity.
          </p>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Verification Information</AlertTitle>
            <AlertDescription>
              Successful verification confirms that the asset was registered on our platform and its ownership
              information is stored on the blockchain. This can be used as evidence in legal proceedings or licensing
              negotiations.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Legal Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Verification results are recognized in 181 countries under The Berne Convention
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Immutable Records</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Blockchain records cannot be altered, providing tamper-proof verification
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Instant Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get immediate confirmation of ownership status with our real-time verification
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
