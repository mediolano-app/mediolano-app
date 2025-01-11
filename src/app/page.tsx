'use client';

import Image from "next/image";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAccount, useBalance, useBlockNumber, useContract, useReadContract, useSendTransaction, useTransactionReceipt } from '@starknet-react/core';
import { BlockNumber, Contract, RpcProvider } from "starknet";
import { formatAmount, shortenAddress } from '@/lib/utils';
import StartPage2 from "@/components/StartPage2";


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 gap-16 sm:p-16">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <StartPage2 />
      </main>
    </div>
  );
}
