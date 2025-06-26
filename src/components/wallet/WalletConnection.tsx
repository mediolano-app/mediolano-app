"use client"

import { useStarknetWallet } from "@/hooks/useStarknetWallet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import Image from "next/image"

export default function WalletConnection() {
  const { 
    address, 
    isConnected, 
    status, 
    connect, 
    disconnect, 
    connectors 
  } = useStarknetWallet()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleDisconnect = () => {
    disconnect()
  }

  if (isConnected && address) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span>Wallet Connected</span>
          </CardTitle>
          <CardDescription className="text-green-700">
            Ready to mint NFTs on Starknet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Address:</span>
              <Badge variant="outline" className="font-mono">
                {formatAddress(address)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Network:</span>
              <Badge variant="secondary">Starknet Sepolia</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`https://sepolia.starkscan.co/contract/${address}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View on Explorer
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="w-5 h-5" />
          <span>Connect Starknet Wallet</span>
        </CardTitle>
        <CardDescription>
          Connect your wallet to mint Twitter posts as NFTs on Starknet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {status === "disconnected" && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to connect a Starknet wallet to mint NFTs. Install Argent X or Braavos wallet extension.
              </AlertDescription>
            </Alert>
          )}

          {connectors.length > 0 ? (
            <div className="space-y-2">
              {connectors.map((connector) => {
                const iconSrc = typeof connector.icon === 'string' 
                  ? connector.icon 
                  : connector.icon.dark || connector.icon.light || ''

                return (
                  <Button
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    disabled={status === "connecting"}
                    className="w-full"
                    variant="outline"
                  >
                    {iconSrc && (
                      <Image 
                        src={iconSrc} 
                        alt={connector.name}
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                    )}
                    Connect {connector.name}
                  </Button>
                )
              })}
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No Starknet wallets detected. Please install Argent X or Braavos wallet extension.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>💡 <strong>New to Starknet?</strong></p>
            <p>Install a wallet extension:</p>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open('https://www.argent.xyz/argent-x/', '_blank')}
                className="text-xs h-6"
              >
                Argent X
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open('https://braavos.app/', '_blank')}
                className="text-xs h-6"
              >
                Braavos
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}