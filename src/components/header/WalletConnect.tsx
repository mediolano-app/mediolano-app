"use client"

import * as React from 'react'
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, User, Gift, Settings, LogOut } from "lucide-react"

const WalletBar = dynamic(() => import('@/components/header/WalletBar'), { ssr: false })

export function WalletConnect() {
  const [isConnected, setIsConnected] = React.useState(false)

  const handleConnect = () => {
    // Implement actual wallet connection logic here
    setIsConnected(true)
  }

  const handleDisconnect = () => {
    // Implement actual wallet disconnection logic here
    setIsConnected(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Wallet className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isConnected ? "Account" : "Connect"}</DialogTitle>
          <DialogDescription>
            {isConnected
              ? "Your wallet is connected. You can now interact with the Mediolano dApp."
              : "Connect your wallet to interact with the Mediolano dApp."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isConnected ? (
            <div className="grid gap-4">
              <Button variant="outline" className="justify-start">
                <User className="mr-2 h-4 w-4" />
                My Account
              </Button>
              <Button variant="outline" className="justify-start">
                <Gift className="mr-2 h-4 w-4" />
                Rewards
              </Button>
              <Button variant="outline" className="justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="destructive" onClick={handleDisconnect} className="justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
          ) : (
            <>
            <WalletBar />
            <Button onClick={handleConnect}>Create Account (Demo)</Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

