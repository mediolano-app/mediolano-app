'use client';

import Image from "next/image";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAccount, useBalance, useBlockNumber, useContract, useReadContract, useSendTransaction, useTransactionReceipt } from '@starknet-react/core';
import { BlockNumber, Contract, RpcProvider } from "starknet";
import { formatAmount, shortenAddress } from '@/lib/utils';
import StartPage from "@/components/StartPage";


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-4 gap-8 sm:p-8">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
        <StartPage />
      </main>
    </div>
  );
}
