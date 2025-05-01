"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Rocket } from "lucide-react"
import { getUserLicenses } from "@/app/licensing/lib/mock-asset-data"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export function TransferForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isTransferring, setIsTransferring] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [licenses, setLicenses] = useState<any[]>([])

  // Simulate loading
  useState(() => {
    const timer = setTimeout(() => {
      setLicenses(getUserLicenses())
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsTransferring(true)

    // Simulate blockchain transaction with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          toast({
            title: "License transferred successfully",
            description: "Your license has been transferred to the recipient address",
          })
          router.push("/")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-[200px] rounded-md bg-muted"></div>
          <div className="h-4 w-[300px] rounded-md bg-muted"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <div className="h-5 w-[100px] rounded-md bg-muted"></div>
            <div className="h-10 w-full rounded-md bg-muted"></div>
          </div>

          <div className="flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-muted"></div>
          </div>

          <div className="grid gap-2">
            <div className="h-5 w-[150px] rounded-md bg-muted"></div>
            <div className="h-10 w-full rounded-md bg-muted"></div>
            <div className="h-4 w-3/4 rounded-md bg-muted"></div>
          </div>

          <div className="grid gap-2">
            <div className="h-5 w-[180px] rounded-md bg-muted"></div>
            <div className="h-10 w-full rounded-md bg-muted"></div>
          </div>

          <div className="flex items-start space-x-2 pt-4">
            <div className="h-4 w-4 rounded bg-muted"></div>
            <div className="h-4 w-full rounded-md bg-muted"></div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="ml-auto h-9 w-[150px] rounded-md bg-muted"></div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle>Transfer License</CardTitle>
          <CardDescription>Transfer one of your licenses to another address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="license">Select License</Label>
            <Select required>
              <SelectTrigger id="license">
                <SelectValue placeholder="Select a license to transfer" />
              </SelectTrigger>
              <SelectContent>
                {licenses.map((license) => (
                  <SelectItem key={license.id} value={license.id}>
                    {license.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipient-address">Recipient Address</Label>
            <Input id="recipient-address" placeholder="Enter recipient's address" required />
            <p className="text-xs text-muted-foreground">The address that will receive this license</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="memo">Transfer Memo (Optional)</Label>
            <Input id="memo" placeholder="Add a note to this transfer" />
          </div>

          <div className="flex items-start space-x-2 pt-4">
            <Checkbox id="terms" required />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="terms" className="text-sm font-normal leading-snug">
                I confirm that I own this license and am authorized to transfer it
              </Label>
            </div>
          </div>

          {isTransferring && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing transfer...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto gap-2" disabled={isTransferring}>
            {isTransferring ? (
              <>
                <Rocket className="h-4 w-4 animate-spin" />
                <span>Processing Transfer...</span>
              </>
            ) : (
              <span>Transfer License</span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
