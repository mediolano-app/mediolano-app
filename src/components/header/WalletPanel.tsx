'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Wallet, LogOut, Copy, ExternalLink, ArrowUpRight, ArrowDownLeft, Plus, ShieldCheck, LucideLogOut } from 'lucide-react'
import { useConnect, useDisconnect, useAccount } from '@starknet-react/core';
import Link from 'next/link'

const mockTokens = [
  { symbol: 'ETH', name: 'Ethereum', profile: '1.5', value: '$3,250.00', icon: '₿' },
  { symbol: 'STRK', name: 'Stark', profile: '1000', value: '$500.00', icon: '⚡' },
  { symbol: 'USDC', name: 'USD Coin', profile: '500', value: '$500.00', icon: '$' },
]

const mockActivities = [
  { id: 1, type: 'send', amount: '0.5 ETH', to: '0x1234...5678', date: '2023-05-01' },
  { id: 2, type: 'receive', amount: '1000 STRK', from: '0x8765...4321', date: '2023-04-28' },
  { id: 3, type: 'send', amount: '100 USDC', to: '0x2468...1357', date: '2023-04-25' },
]

const WalletPanel: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false)
  //const [address, setAddress] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  const connectWallet = () => {
    setTimeout(() => {
      setIsConnected(true)
    }, 1000)
  }

  const  createtWallet = () => {
    setIsConnected(false)
  }


  const disconnectWallet = () => {
    setIsConnected(false)
  }

  return (
    <div className="">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="hover:bg-blue-500">
            <Wallet className="mr-2 h-4 w-4" /> {isConnected ? '0x...' : '0x...'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-black backdrop-blur ">
          <DialogHeader>
            <DialogTitle>{isConnected ? 'Your Account' : 'Connect to Mediolano'}</DialogTitle>
            <DialogDescription>
              {isConnected ? 'Manage your intellectual property with blockchain' : 'Connect your wallet and start your Web3 journey'}
            </DialogDescription>
          </DialogHeader>
          {isConnected ? (
            <Tabs defaultValue="account" className="w-full">
              
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                
              </TabsList>
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Assets</CardTitle>
                    <CardDescription>Current profile of your tokens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      {mockTokens.map((token, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <Avatar className="h-9 w-9 mr-2">
                              <AvatarImage src={`/tokens/${token.symbol.toLowerCase()}.png`} alt={token.name} />
                              <AvatarFallback>{token.icon}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{token.symbol}</p>
                              <p className="text-sm text-gray-500">{token.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{token.profile}</p>
                            <p className="text-sm text-gray-500">{token.value}</p>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="activities">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Your latest transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      {mockActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            {activity.type === 'send' ? (
                              <ArrowUpRight className="mr-2 h-4 w-4 text-red-500" />
                            ) : (
                              <ArrowDownLeft className="mr-2 h-4 w-4 text-green-500" />
                            )}
                            <div>
                              <p className="font-medium">{activity.amount}</p>
                              <p className="text-sm text-gray-500">{activity.date}</p>
                            </div>
                          </div>
                          <span className="text-sm">{activity.type === 'send' ? `To: ${activity.to}` : `From: ${activity.from}`}</span>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Manage your wallet settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Address:</span>
                      <code className="rounded bg-gray-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        {address}
                      </code>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => address}>
                        <Copy className="mr-2 h-4 w-4" /> Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" /> View on Explorer
                      </Button>
                    </div>
                    <div className="pt-4">
                      <Button variant="destructive" className="w-full" onClick={disconnectWallet}>
                        <LogOut className="mr-2 h-4 w-4" /> Disconnect Wallet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center gap-6 py-6">
              <div className="text-center">
              
                <img src='/mediolano.webp' className='mx-auto mb-6' alt='Mediolano' width={"128"} height={"128"}/>

                <h3 className="text-lg font-semibold mb-2">Safe, Secure & Self Custody</h3>
                <p className="text-sm text-gray-600">Your assets are protected by industry-leading security technology .</p>
              </div>
              <div className="grid w-full gap-4">
                {/*
                <Button onClick={connectWallet} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  <Wallet className="mr-2 h-4 w-4" /> Connect with Starknet
                </Button>*/}

                {!address ? (
                  <div className="flex flex-wrap justify-center gap-2">
                    {connectors.map((connector) => (
                      <button
                        key={connector.id}
                        onClick={() => connect({ connector })}
                        className="rounded shadow py-2 px-4 hover:bg-blue/20"
                      >
                        Connect {connector.id}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="text-sm px-4 rounded">
                      
                      <button
                      onClick={() => disconnect()}
                      className="py-2 px-2 flex items-center justify-center"
                    >
                      {address.slice(0, 6)}...{address.slice(-4)} &nbsp; <LucideLogOut className='h-4 w-4'/>
                    </button>
                    </div>
                    
                  </div>
                )}


                <Button onClick={createtWallet} variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Create New Wallet
                </Button>


              </div>
              <p className="text-sm text-center text-gray-600">
                By connecting, you agree to our <Link href="#" className="underline text-blue-500">Terms of Service</Link> and <Link href="#" className="underline text-blue-500">Privacy Policy</Link>.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default WalletPanel;