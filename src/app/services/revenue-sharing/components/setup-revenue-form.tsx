"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { getUserAssets } from "@/app/services/revenue-sharing/lib/mock-data"
import { Loader2, Plus, Trash2, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

const formSchema = z.object({
  assetId: z.string({
    required_error: "Please select an asset.",
  }),
  totalShares: z
    .number()
    .min(1, {
      message: "Total shares must be at least 1.",
    })
    .max(10000, {
      message: "Total shares cannot exceed 10,000.",
    }),
  creatorShare: z
    .number()
    .min(1, {
      message: "Creator share must be at least 1%.",
    })
    .max(100, {
      message: "Creator share cannot exceed 100%.",
    }),
  claimPeriod: z.string(),
  autoDistribute: z.boolean().default(false),
  distributionFrequency: z.string().optional(),
  minimumDistributionAmount: z.number().optional(),
  recipients: z
    .array(
      z.object({
        address: z.string().min(1, {
          message: "Wallet address is required.",
        }),
        percentage: z
          .number()
          .min(1, {
            message: "Percentage must be at least 1%.",
          })
          .max(99, {
            message: "Percentage cannot exceed 99%.",
          }),
      }),
    )
    .optional(),
})

export default function SetupRevenueForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()
  const assets = getUserAssets()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalShares: 100,
      creatorShare: 70,
      claimPeriod: "30days",
      autoDistribute: false,
      distributionFrequency: "monthly",
      minimumDistributionAmount: 0.1,
      recipients: [{ address: "", percentage: 30 }],
    },
  })

  const creatorShare = form.watch("creatorShare")
  const autoDistribute = form.watch("autoDistribute")
  const recipients = form.watch("recipients") || []

  const addRecipient = () => {
    const currentRecipients = form.getValues("recipients") || []
    form.setValue("recipients", [...currentRecipients, { address: "", percentage: 0 }])
  }

  const removeRecipient = (index: number) => {
    const currentRecipients = form.getValues("recipients") || []
    form.setValue(
      "recipients",
      currentRecipients.filter((_, i) => i !== index),
    )
  }

  const totalRecipientPercentage = recipients.reduce((sum, recipient) => sum + recipient.percentage, 0)
  const isPercentageValid = totalRecipientPercentage + creatorShare === 100

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      console.log(values)
      setIsSubmitting(false)
      router.push("/revenue-sharing/management")
    }, 2000)
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <div className="text-sm font-medium">Step {currentStep} of 3</div>
            <div className="text-sm text-gray-500">
              {currentStep === 1 ? "Asset Selection" : currentStep === 2 ? "Revenue Distribution" : "Claim Settings"}
            </div>
          </div>
          <Progress value={(currentStep / 3) * 100} className="h-2" />
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select IP Asset</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an IP asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          {asset.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the IP asset you want to configure revenue sharing for.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalShares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Shares</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number.parseInt(e.target.value))} />
                  </FormControl>
                  <FormDescription>
                    The total number of shares to create for this asset. This determines the granularity of ownership.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>What are shares?</AlertTitle>
              <AlertDescription>
                Shares represent ownership in your IP asset. The more shares someone owns, the larger their percentage
                of revenue they'll receive. For example, if there are 100 total shares and someone owns 10 shares,
                they'll receive 10% of the revenue.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="creatorShare"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creator Share: {field.value}%</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <FormDescription>The percentage of revenue you'll retain as the creator.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Revenue Recipients</h3>
                <Button type="button" variant="outline" size="sm" onClick={addRecipient} className="flex items-center">
                  <Plus className="h-4 w-4 mr-1" /> Add Recipient
                </Button>
              </div>

              {recipients.map((_, index) => (
                <div key={index} className="flex items-end gap-4">
                  <FormField
                    control={form.control}
                    name={`recipients.${index}.address`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Wallet Address</FormLabel>
                        <FormControl>
                          <Input placeholder="0x..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`recipients.${index}.percentage`}
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <FormLabel>Share %</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRecipient(index)}
                    className="mb-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between">
                  <span>Creator Share:</span>
                  <span className="font-medium">{creatorShare}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Other Recipients:</span>
                  <span className="font-medium">{totalRecipientPercentage}%</span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: `${creatorShare}%` }}></div>
                </div>

                {!isPercentageValid && (
                  <div className="mt-4 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Total percentage must equal 100%. Current total: {creatorShare + totalRecipientPercentage}%
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="claimPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Claim Period</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select claim period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="7days">7 Days</SelectItem>
                      <SelectItem value="14days">14 Days</SelectItem>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="90days">90 Days</SelectItem>
                      <SelectItem value="unlimited">No Expiration</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The period during which fractional owners can claim their revenue before it expires.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-6" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Distribution Settings</h3>

              <FormField
                control={form.control}
                name="autoDistribute"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Auto-Distribution</FormLabel>
                      <FormDescription>
                        Automatically distribute revenue to fractional owners on a schedule
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {autoDistribute && (
                <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                  <FormField
                    control={form.control}
                    name="distributionFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distribution Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>How often revenue should be distributed.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minimumDistributionAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Distribution Amount (ETH)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Minimum amount of revenue required to trigger a distribution.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Even with auto-distribution enabled, recipients will still need to manually claim their share of the
                revenue. Auto-distribution only handles the allocation of funds to the smart contract.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {currentStep > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <Button type="button" onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700">
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting || !isPercentageValid}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Up...
                </>
              ) : (
                "Set Up Revenue Sharing"
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
