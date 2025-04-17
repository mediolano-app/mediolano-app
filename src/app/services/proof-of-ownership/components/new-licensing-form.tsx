"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, PlusCircle, Info, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Asset } from "@/app/services/proof-of-ownership/lib/types"

const formSchema = z.object({
  licenseType: z.string({
    required_error: "Please select a license type",
  }),
  customName: z
    .string()
    .min(3, {
      message: "License name must be at least 3 characters",
    })
    .optional(),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a valid number",
  }),
  duration: z.object({
    value: z.number().min(1, {
      message: "Duration must be at least 1",
    }),
    unit: z.enum(["days", "months", "years"]),
  }),
  expiryDate: z.date().optional(),
  usageRights: z.array(z.string()).nonempty({
    message: "Select at least one usage right",
  }),
  territories: z.enum(["worldwide", "specific"], {
    required_error: "Please select territory coverage",
  }),
  specificTerritories: z.string().optional(),
  commercialUse: z.boolean().default(false),
  modifications: z.boolean().default(false),
  attribution: z.boolean().default(true),
  additionalTerms: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const usageRightItems = [
  { id: "display", label: "Display/Exhibit" },
  { id: "reproduce", label: "Reproduce" },
  { id: "distribute", label: "Distribute" },
  { id: "perform", label: "Perform/Play" },
  { id: "translate", label: "Translate" },
  { id: "derivative", label: "Create Derivative Works" },
]

interface NewLicensingFormProps {
  asset: Asset
}

export default function NewLicensingForm({ asset }: NewLicensingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      licenseType: "",
      price: "0",
      duration: { value: 1, unit: "years" },
      usageRights: [],
      territories: "worldwide",
      commercialUse: false,
      modifications: false,
      attribution: true,
      additionalTerms: "",
    },
  })

  function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    console.log(values)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-400">License Created Successfully</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-500">
          Your custom license has been created and is now available for users to request. You can manage all licenses in
          your dashboard.
        </AlertDescription>
        <div className="mt-4">
          <Button
            variant="outline"
            className="text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50"
            onClick={() => setIsSuccess(false)}
          >
            Create Another License
          </Button>
        </div>
      </Alert>
    )
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-primary" />
          Create New License
        </CardTitle>
        <CardDescription>
          Define custom licensing terms for this asset. Anyone can request to use your asset under these terms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="licenseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select license type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard License</SelectItem>
                          <SelectItem value="commercial">Commercial License</SelectItem>
                          <SelectItem value="educational">Educational License</SelectItem>
                          <SelectItem value="exclusive">Exclusive License</SelectItem>
                          <SelectItem value="custom">Custom License</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Select a predefined license type or create a custom one</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("licenseType") === "custom" && (
                  <FormField
                    control={form.control}
                    name="customName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom License Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Premium Enterprise License" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Price (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>Set to 0 for free licenses</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration.value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration.unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                            <SelectItem value="years">Years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiry Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : "Pick a date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Specific end date for the license</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="usageRights"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Usage Rights</FormLabel>
                        <FormDescription>Select what the licensee can do with the asset</FormDescription>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {usageRightItems.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="usageRights"
                            render={({ field }) => {
                              return (
                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item.id])
                                          : field.onChange(field.value?.filter((value) => value !== item.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{item.label}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="territories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Territories</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select territory coverage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="worldwide">Worldwide</SelectItem>
                          <SelectItem value="specific">Specific Territories</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("territories") === "specific" && (
                  <FormField
                    control={form.control}
                    name="specificTerritories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specify Territories</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., United States, European Union, Japan"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          List the specific countries or regions where this license applies
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="commercialUse"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Allow Commercial Use</FormLabel>
                          <FormDescription>Licensee can use the asset for commercial purposes</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="modifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Allow Modifications</FormLabel>
                          <FormDescription>Licensee can modify or create derivative works</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="attribution"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Require Attribution</FormLabel>
                          <FormDescription>Licensee must credit you as the original creator</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="additionalTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Terms (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional terms or conditions for this license"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">License Preview</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="preview">
                  <AccordionTrigger>View License Terms</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-medium">Asset Information</h4>
                        <p>Title: {asset.title}</p>
                        <p>Type: {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</p>
                        <p>Creator: {asset.owner.name}</p>
                      </div>

                      <div>
                        <h4 className="font-medium">License Details</h4>
                        <p>
                          Type:{" "}
                          {form.watch("licenseType") === "custom"
                            ? form.watch("customName") || "Custom License"
                            : `${form.watch("licenseType").charAt(0).toUpperCase() + form.watch("licenseType").slice(1)} License`}
                        </p>
                        <p>Price: ${form.watch("price") || "0"}</p>
                        <p>
                          Duration: {form.watch("duration.value")} {form.watch("duration.unit")}
                        </p>
                        {form.watch("expiryDate") && <p>Expires on: {format(form.watch("expiryDate"), "PPP")}</p>}
                      </div>

                      <div>
                        <h4 className="font-medium">Usage Rights</h4>
                        <ul className="list-disc pl-5">
                          {form.watch("usageRights").map((right) => (
                            <li key={right}>{usageRightItems.find((item) => item.id === right)?.label}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium">Conditions</h4>
                        <ul className="list-disc pl-5">
                          <li>
                            Territories:{" "}
                            {form.watch("territories") === "worldwide"
                              ? "Worldwide"
                              : `Limited to: ${form.watch("specificTerritories") || "specified territories"}`}
                          </li>
                          <li>Commercial use: {form.watch("commercialUse") ? "Allowed" : "Not allowed"}</li>
                          <li>Modifications: {form.watch("modifications") ? "Allowed" : "Not allowed"}</li>
                          <li>Attribution: {form.watch("attribution") ? "Required" : "Not required"}</li>
                        </ul>
                      </div>

                      {form.watch("additionalTerms") && (
                        <div>
                          <h4 className="font-medium">Additional Terms</h4>
                          <p>{form.watch("additionalTerms")}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Important Information</AlertTitle>
                <AlertDescription>
                  By creating this license, you're allowing others to request usage of your asset under these terms.
                  You'll receive notifications for each request and can approve or deny them individually.
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating License..." : "Create License"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
