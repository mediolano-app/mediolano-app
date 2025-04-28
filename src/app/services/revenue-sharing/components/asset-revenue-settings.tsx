"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAssetById } from "@/app/services/revenue-sharing/lib/mock-data"
import { Loader2, Plus, Trash2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

interface AssetRevenueSettingsProps {
  assetId: string
}

const formSchema = z.object({
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

export default function AssetRevenueSettings({ assetId }: AssetRevenueSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const asset = getAssetById(assetId)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creatorShare: 70,
      claimPeriod: "30days",
      autoDistribute: false,
      distributionFrequency: "monthly",
      minimumDistributionAmount: 0.1,
      recipients: [{ address: "", percentage: 30 }],
    },
  })

  if (!asset) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Asset not found</h3>
        <p className="mt-1 text-sm text-gray-500">The requested asset could not be found.</p>
      </div>
    )
  }

  const creatorShare = form.watch("creatorShare")
  const autoDistribute = form.watch("autoDistribute")

  const addRecipient = () => {
    const recipients = form.getValues("recipients") || []
    form.setValue("recipients", [...recipients, { address: "", percentage: 0 }])
  }

  const removeRecipient = (index: number) => {
    const recipients = form.getValues("recipients") || []
    form.setValue(
      "recipients",
      recipients.filter((_, i) => i !== index),
    )
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      console.log(values)
      setIsSubmitting(false)
      router.push(`/revenue-sharing/assets/${assetId}`)
    }, 2000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Changes to revenue sharing settings will only affect future revenue distributions. Existing claims and
            distributions will not be affected.
          </AlertDescription>
        </Alert>

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
                  <FormDescription>Automatically distribute revenue to fractional owners on a schedule</FormDescription>
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

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Revenue Recipients</h3>
            <Button type="button" variant="outline" size="sm" onClick={addRecipient} className="flex items-center">
              <Plus className="h-4 w-4 mr-1" /> Add Recipient
            </Button>
          </div>

          {form.getValues("recipients")?.map((_, index) => (
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

              <Button type="button" variant="ghost" size="icon" onClick={() => removeRecipient(index)} className="mb-2">
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
              <span className="font-medium">{100 - creatorShare}%</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600" style={{ width: `${creatorShare}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
