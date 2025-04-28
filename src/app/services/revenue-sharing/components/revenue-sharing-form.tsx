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
import { getUserAssets } from "@/app/services/revenue-sharing/lib/mock-data"
import { Loader2, Plus, Trash2 } from "lucide-react"

const formSchema = z.object({
  assetId: z.string({
    required_error: "Please select an asset.",
  }),
  totalShares: z
    .number()
    .min(1, {
      message: "Total shares must be at least 1.",
    })
    .max(1000, {
      message: "Total shares cannot exceed 1000.",
    }),
  creatorShare: z
    .number()
    .min(1, {
      message: "Creator share must be at least 1%.",
    })
    .max(100, {
      message: "Creator share cannot exceed 100%.",
    }),
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

export default function RevenueSharingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const assets = getUserAssets()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalShares: 100,
      creatorShare: 70,
      recipients: [{ address: "", percentage: 30 }],
    },
  })

  const creatorShare = form.watch("creatorShare")

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
      router.push("/revenue-sharing/success")
    }, 2000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormDescription>The total number of shares to create for this asset.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting Up...
            </>
          ) : (
            "Set Up Revenue Sharing"
          )}
        </Button>
      </form>
    </Form>
  )
}
