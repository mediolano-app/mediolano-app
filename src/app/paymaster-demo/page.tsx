/**
 * AVNU Paymaster Demo Page
 * Showcases the complete Paymaster integration with Mediolano
 */

"use client";

import React from "react";
import { PaymasterDemo } from "@/components/paymaster/PaymasterDemo";

export default function PaymasterDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AVNU Paymaster Integration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience frictionless transactions on Starknet with gas fee abstraction. 
            Mint NFTs, trade on the marketplace, and interact with smart contracts without holding ETH or STRK.
          </p>
        </div>

        {/* Demo Component */}
        <PaymasterDemo />

        {/* Footer Information */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Powered by{" "}
            <a 
              href="https://www.avnu.fi/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              AVNU Paymaster
            </a>
            {" "}and{" "}
            <a 
              href="https://www.starknet.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Starknet
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
