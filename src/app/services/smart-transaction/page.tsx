"use client";

import type { NextPage } from "next";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRightLeft, ShieldCheck, Banknote } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import SmartTransactionForm from "@/components/SmartTransactionForm";




const sellIP: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();
  

  return (
    <>
     
     
     <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
         

          <div>

<div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Smart Transaction Form</h1>
 
      
      <div className="grid  md:grid-cols-2 gap-8">
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 text-foreground">
          <CardHeader>
            <CardTitle>Transfer/Sell IP Form</CardTitle>
            <CardDescription>Create a smart transaction to securely sell and transfer intellectual property. After initiating the sales transaction, the Address indicated in the contract will be able to finalize the purchase and claim your digital asset.</CardDescription>
          </CardHeader>
          <CardContent>
           <SmartTransactionForm />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
            <CardHeader>
              <CardTitle>Why Use Blockchain for IP Transfers?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <ArrowRightLeft className="w-8 h-8 " />
                <div>
                  <h3 className="font-semibold">Seamless Transfers</h3>
                  <p>Quick and efficient ownership transfers with blockchain verification</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <ShieldCheck className="w-8 h-8 " />
                <div>
                  <h3 className="font-semibold">Secure Transactions</h3>
                  <p>Cryptographically secured transfers prevent fraud and disputes</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Banknote className="w-8 h-8 " />
                <div>
                  <h3 className="font-semibold">Transparent Pricing</h3>
                  <p>Clear and immutable record of sale prices and terms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
            <CardHeader>
              <CardTitle>Transfer/Sale Process</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                <li>Select the IP you want to transfer or sell</li>
                <li>Choose the transaction type and set terms</li>
                <li>Enter the recipient's blockchain wallet address</li>
                <li>Set the price (for sales) or transfer conditions</li>
                <li>Confirm the transaction with your digital signature</li>
                <li>Buyer makes payment and claims digital assets</li>
                <li>Blockchain records the transfer of ownership</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

          </div>


        

    </div>  
    </>
  );
};

export default sellIP;
