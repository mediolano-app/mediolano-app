"use client";
import { InjectedConnector, useAccount, useConnect } from '@starknet-react/core'
import { Button } from "@/components/ui/button";
import { Wallet, ExternalLink } from "lucide-react";
import { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ConnectWallet() {
  const { account } = useAccount();
  const { connect, connectors } = useConnect();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setError(null);
      const connector = connectors.at(0);

      if (!connector) {
        setError("No wallet detected. Please install Argent X or Braavos.");
        return;
      }

      await connect({ connector });
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    }
  };

  const truncateAddr = (s: string) => {
    return s.substring(0, 4) + '..' + s.substring(s.length - 3, s.length)
  }

  if (account) {
    return (
      <Button variant="outline" className="gap-2">
        <Wallet className="h-4 w-4" />
        {truncateAddr(account.address)}
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <Button
        onClick={handleConnect}
        className="gap-2"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>

      {error && (
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertDescription className="flex flex-col gap-2">
              {error}
              {error.includes("install") && (
                <div className="flex gap-4 mt-2">
                  <a
                    href="https://www.argent.xyz/argent-x/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm underline"
                  >
                    Install Argent X <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href="https://braavos.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm underline"
                  >
                    Install Braavos <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}