'use client';

import Image from "next/image";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAccount, useBalance, useBlockNumber, useContract, useReadContract, useSendTransaction, useTransactionReceipt } from '@starknet-react/core';
import { BlockNumber, Contract, RpcProvider } from "starknet";
import { formatAmount, shortenAddress } from '@/lib/utils';
import StartPage from "@/components/StartPage";
import StartHero from "@/components/StartHero";
import StartFeatureSection from "@/components/start/feature-section";
import StartBenefitsSection from "@/components/start/benefits-section";
import StartServicesSection from "@/components/start/services-section";


export default function Home() {
  return (
    <div className="grid">
      <main className="flex flex-col row-start-2">
        <StartHero />
        <StartServicesSection />
        <StartBenefitsSection />
        <StartFeatureSection />
        
      </main>
    </div>
  );
}
