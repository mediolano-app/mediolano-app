"use client"

import { useXVerification, type VerificationState } from "../hooks/useXVerification"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Twitter, CheckCircle, AlertCircle, HelpCircle, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const StateDisplay = ({ state }: { state: VerificationState }) => {
  switch (state) {
    case "connecting":
      return (
        <Badge variant="secondary">
          <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Connecting
        </Badge>
      )
    case "connected":
      return (
        <Badge variant="secondary">
          <CheckCircle className="mr-1 h-3 w-3" /> Connected
        </Badge>
      )
    case "verifying":
      return (
        <Badge variant="secondary">
          <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Verifying
        </Badge>
      )
    case "verified":
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="mr-1 h-3 w-3" /> Verified
        </Badge>
      )
    case "error":
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" /> Error
        </Badge>
      )
    default:
      return (
        <Badge variant="outline">
          <AlertCircle className="mr-1 h-3 w-3" /> Unverified
        </Badge>
      )
  }
}

export default function XVerification() {
  const { state, username, error, connect, verify, reset } = useXVerification()

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          X Verification
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to Verify Your X Account</DialogTitle>
                <DialogDescription>
                  1. Click the "Connect X Account" button.
                  <br />
                  2. You'll be redirected to X to authorize the connection.
                  <br />
                  3. Once authorized, your account will be automatically verified.
                  <br />
                  4. If successful, you'll see a verified badge on your Mediolano.app profile.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>Connect your X account to verify your identity on Mediolano.app</CardDescription>
      </CardHeader>
      <CardContent>
        {state === "idle" && (
          <Button onClick={connect} className="w-full">
            <Twitter className="mr-2 h-4 w-4" />
            Connect X Account
          </Button>
        )}
        {(state === "connecting" || state === "verifying") && (
          <Button disabled className="w-full">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            {state === "connecting" ? "Connecting..." : "Verifying..."}
          </Button>
        )}
        {(state === "connected" || state === "verified") && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Connected to X</AlertTitle>
            <AlertDescription>Your account @{username} is connected.</AlertDescription>
          </Alert>
        )}
        {state === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <StateDisplay state={state} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Current verification status</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {state === "connected" && (
          <Button variant="outline" onClick={() => verify(username)}>
            Verify Now
          </Button>
        )}
        {(state === "verified" || state === "error") && (
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

