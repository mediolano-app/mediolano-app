"use client"

import { useState, useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, Search } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

//import { TransactionHistory } from "@/components/TransactionHistory"
import { Pagination } from "./pagination"

// Expanded mock data for registered IP
const registeredIP = [
  { id: "1", name: "Digital Artwork #1", type: "Image", description: "A stunning digital painting of a futuristic cityscape", creator: "Jane Doe", creationDate: "2023-01-15" },
  { id: "2", name: "Music Composition: Summer Breeze", type: "Audio", description: "An uplifting electronic music track with summer vibes", creator: "John Smith", creationDate: "2023-03-22" },
  { id: "3", name: "E-book: The Future of AI", type: "Document", description: "A comprehensive guide on artificial intelligence and its impact on society", creator: "Dr. Alex Johnson", creationDate: "2023-05-10" },
  { id: "4", name: "Software Algorithm: FastSort", type: "Code", description: "An optimized sorting algorithm for large datasets", creator: "Tech Innovations Inc.", creationDate: "2023-07-05" },
  { id: "5", name: "3D Model: Futuristic Car", type: "3D", description: "A detailed 3D model of a concept car from the year 2050", creator: "Maya Masters", creationDate: "2023-02-18" },
  { id: "6", name: "Podcast Series: Tech Talks", type: "Audio", description: "A 10-episode podcast series discussing emerging technologies", creator: "Sarah Tech", creationDate: "2023-04-30" },
  { id: "7", name: "Digital Painting: Cosmic Dreams", type: "Image", description: "An ethereal digital painting depicting a dreamscape in space", creator: "Astro Artist", creationDate: "2023-06-12" },
  { id: "8", name: "Research Paper: Quantum Computing", type: "Document", description: "A groundbreaking research paper on advancements in quantum computing", creator: "Dr. Quantum", creationDate: "2023-08-20" },
  { id: "9", name: "Mobile App: Fitness Tracker", type: "Code", description: "A comprehensive fitness tracking app with AI-powered insights", creator: "Health Tech Ltd.", creationDate: "2023-09-05" },
  { id: "10", name: "Virtual Reality Experience: Ocean Explorer", type: "3D", description: "An immersive VR experience allowing users to explore the depths of the ocean", creator: "VR Voyages", creationDate: "2023-10-15" },
  { id: "11", name: "Digital Comic: Cyberpunk Chronicles", type: "Image", description: "A series of digital comics set in a dystopian cyberpunk future", creator: "Neon Narratives", creationDate: "2023-11-01" },
  { id: "12", name: "AI Language Model: LinguaGenius", type: "Code", description: "An advanced AI model capable of natural language processing and generation", creator: "AI Innovations Corp.", creationDate: "2023-12-10" },
  { id: "13", name: "Digital Sculpture: Fractals in Motion", type: "3D", description: "A mesmerizing 3D sculpture showcasing the beauty of fractal geometry", creator: "Fractal Fantasies", creationDate: "2024-01-05" },
  { id: "14", name: "Blockchain Smart Contract: DecentralizedExchange", type: "Code", description: "A secure and efficient smart contract for decentralized cryptocurrency exchanges", creator: "Crypto Coders", creationDate: "2024-02-20" },
  { id: "15", name: "Augmented Reality Art Gallery", type: "3D", description: "An AR application that turns any space into a virtual art gallery", creator: "ARtistic Visions", creationDate: "2024-03-15" },
]

const formSchema = z.object({
  selectedIP: z.string({
    required_error: "Please select an IP to transact.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a valid number greater than 0.",
  }),
  buyerAddress: z.string().min(1, "Buyer address is required"),
  transactionType: z.enum(["transfer", "sale"]),
  additionalTerms: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
})

type FormData = z.infer<typeof formSchema>

const steps = ["Select IP", "Transaction Info", "Review & Submit"]

export default function SmartTransactionForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<"success" | "error" | null>(null)
  const [submittedData, setSubmittedData] = useState<FormData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredIP, setFilteredIP] = useState(registeredIP)

  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredIP.length / itemsPerPage)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedIP: "",
      price: "",
      buyerAddress: "",
      transactionType: "transfer",
      additionalTerms: "",
      agreeToTerms: false,
    },
  })

  useEffect(() => {
    const filtered = registeredIP.filter(ip =>
      ip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ip.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ip.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredIP(filtered)
    setCurrentPage(1)
  }, [searchQuery])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true)
    console.log(JSON.stringify(data, null, 2))

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setSubmissionStatus("success")
    setSubmittedData(data)
    setDrawerOpen(true)
  }

  const handleNext = async () => {
    const fields = steps[currentStep] === "Select IP"
      ? ["selectedIP"]
      : ["price", "buyerAddress", "transactionType", "additionalTerms"]

    const isStepValid = await form.trigger(fields as any)
    if (isStepValid) setCurrentStep(prev => prev + 1)
  }

  const handlePrevious = () => setCurrentStep(prev => prev - 1)

  const paginatedIP = filteredIP.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                
              />
            </div>
            <FormField
              control={form.control}
              name="selectedIP"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select Intellectual Property</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {paginatedIP.map((ip) => (
                        <FormItem key={ip.id} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={ip.id} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <Card className="w-full">
                              <CardContent className="p-4">
                                <h3 className="font-semibold">{ip.name}</h3>
                                <p className="text-sm text-muted-foreground">{ip.type}</p>
                                <p className="text-sm mt-2">{ip.description.substring(0, 100)}...</p>
                              </CardContent>
                            </Card>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Choose the intellectual property you want to transact.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )
      case 1:
        const selectedIP = registeredIP.find(ip => ip.id === form.getValues("selectedIP"))
        return (
          <>
            {selectedIP && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Selected IP Details</h3>
                  <p><strong>Name:</strong> {selectedIP.name}</p>
                  <p><strong>Type:</strong> {selectedIP.type}</p>
                  <p><strong>Description:</strong> {selectedIP.description}</p>
                  <p><strong>Creator:</strong> {selectedIP.creator}</p>
                  <p><strong>Creation Date:</strong> {selectedIP.creationDate}</p>
                </CardContent>
              </Card>
            )}
            <FormField
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="transfer">Transfer Ownership</SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose whether this is a transfer of ownership or a sale.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (ETH)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormDescription>
                    Set the price in ETH for the transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buyerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buyer Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter buyer's address or ENS domain" {...field} />
                  </FormControl>
                  <FormDescription>
                    The Ethereum address or ENS domain of the buyer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Terms</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional terms or conditions"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Specify any additional terms or conditions for this transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      case 2:
        const reviewSelectedIP = registeredIP.find(ip => ip.id === form.getValues("selectedIP"))
        return (
          <>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Transaction Summary</h3>
                <div className="space-y-2">
                  <p><strong>Selected IP:</strong> {reviewSelectedIP?.name || "Not selected"}</p>
                  <p><strong>IP Type:</strong> {reviewSelectedIP?.type || "N/A"}</p>
                  <p><strong>Transaction Type:</strong> {form.getValues("transactionType")}</p>
                  <p><strong>Price:</strong> {form.getValues("price")} ETH</p>
                  <p><strong>Buyer Address:</strong> {form.getValues("buyerAddress")}</p>
                  <p><strong>Additional Terms:</strong> {form.getValues("additionalTerms") || "None"}</p>
                </div>
              </CardContent>
            </Card>
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-6">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Agree to terms and conditions
                    </FormLabel>
                    <FormDescription>
                      By checking this box, you agree to our Terms of Service and Privacy Policy.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
     
      <div className="mb-8">
        <Progress value={(currentStep + 1) * 33.33} className="w-full" />
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <span key={step} className={`text-sm ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
              {step}
            </span>
          ))}
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {renderFormStep()}
          <div className="flex justify-between">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={handleNext} className="ml-auto">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="ml-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Submit Transaction"
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>

      {isSubmitting && (
        <div className="mt-8 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {submissionStatus === "success" ? (
                <div className="flex items-center text-green-500">
                  <CheckCircle2 className="mr-2" />
                  (Preview) Transaction Submitted Successfully
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <AlertCircle className="mr-2" />
                  Error Submitting Transaction
                </div>
              )}
            </DrawerTitle>
            <DrawerDescription>
              {submissionStatus === "success"
                ? "Your smart transaction has been submitted."
                : "There was an error submitting your transaction. Please try again."}
            </DrawerDescription>
          </DrawerHeader>
          {submittedData && (
            <div className="p-4 border-t border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-2">Submitted Data:</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          )}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/*<TransactionHistory />*/}
    </div>
  )
}

