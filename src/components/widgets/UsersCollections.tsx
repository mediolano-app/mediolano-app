"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { useSmartContract } from "@/hooks/useSmartContract";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { SharePopup } from "@/components/share-popup";

interface UserIP {
  id: string;
  name: string;
  // Add more fields as returned by your contract
}

export function UserCollectionsSection() {
  const { account, address } = useAccount();
  const contract = useSmartContract();
  const [userIPs, setUserIPs] = useState<UserIP[]>([]);

  useEffect(() => {
    const fetchUserIPs = async () => {
      if (!account || !contract || !address) return;
      try {
        const result = await contract.call("getUserIPs", [address]);
        // Assuming result.ip_ids is an array of IP IDs
        const ips = result.ip_ids.map((id: any, index: number) => ({
          id: id.toString(),
          name: `IP #${index + 1}`, // Placeholder; fetch actual names if available
        }));
        setUserIPs(ips);
      } catch (error) {
        console.error("Error fetching user IPs:", error);
      }
    };
    fetchUserIPs();
  }, [account, contract, address]);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center mb-12">Your Programmable IPs</h2>
        {account ? (
          userIPs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userIPs.map((ip) => (
                <Card key={ip.id} className="overflow-hidden transition-all duration-300 hover:shadow bg-background/80">
                  <div className="relative">
                    <Image
                      src="/background.jpg" // Replace with actual IP media URL if available
                      alt={ip.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <SharePopup
                        title={`Check out my Programmable IP: ${ip.name}`}
                        url={`/ip/${ip.id}`}
                      />
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">{ip.name}</CardTitle>
                      <Badge variant="secondary">ID: {ip.id.slice(0, 6)}</Badge>
                    </div>
                    <CardDescription>Owned by {address?.slice(0, 6)}...{address?.slice(-4)}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <Link href={`/ip/${ip.id}`}>
                      <Button variant="outline">View IP</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center">No Programmable IPs found. Create one to get started!</p>
          )
        ) : (
          <p className="text-center">Please connect your wallet to view your collections.</p>
        )}
        <div className="text-center mt-12">
          <Link href="/create">
            <Button size="lg">
              Create New IP
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}