"use client"
import {
  useState
} from "react"

import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  cn
} from "@/lib/utils"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Check,
  ChevronsUpDown
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Textarea
} from "@/components/ui/textarea"
import {
  Input
} from "@/components/ui/input"

import { Toaster } from "@/components/ui/toaster";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

import { useAccount, useNetwork, useContract, useSendTransaction } from '@starknet-react/core'

const formSchema = z.object({
  IPID: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  collection: z.string(),
  type: z.string(),
  mediaUrl: z.string(),
  externalUrl: z.string(),
  licenseType: z.string(),
  licenseDetails: z.string(),
  licenseDuration: z.string(),
  licenseTerritory: z.string(),
  version: z.string(),
  commercialUse: z.boolean(),
  modifications: z.boolean(),
  attribution: z.boolean(),
  registrationDate: z.string(),
  
});

export default function IPLicensingForm() {

  const { toast } = useToast()
  const { address } = useAccount();







  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      console.log("OK");
     
      toast({
        title: "Licensing started",
        description: "Finalize your intellectual property registration by approving the asset creation on the Starknet blockchain..",
        action: (
          <ToastAction altText="OK">OK</ToastAction>
        ),
      });

    } catch (error) {
     
      toast({
        title: "Error",
        description: "Registration failed. Please contact our support team at mediolanoapp@gmail.com",
        action: (
          <ToastAction altText="OK">OK</ToastAction>
        ),
      });


    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
        <div className="">
          
          
          

          <FormField
            control={form.control}
            name="IPID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IP ID</FormLabel>
                <FormControl>
                  <Input placeholder="IP ID" {...field} />
                </FormControl>
                <FormDescription>Enter the unique identifier for your intellectual property.</FormDescription>
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
                    placeholder="Description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Set the licensing description.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />





          <Button className="mt-5" type="submit">License Your IP</Button>

        </div>

      </form>
    </Form>
  )
}