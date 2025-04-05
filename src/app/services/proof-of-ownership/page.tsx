"use client";

import type { NextPage } from "next";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ArrowDownRight, Filter, ChevronLeft, ChevronRight } from 'lucide-react'



const transfersIP: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();
  

  return (
    <>
     
     
     <div className="py-10 mb-20 px-4 sm:px-6 lg:px-8">

     <h1 className="text-2xl font-bold mb-8">Proof of Ownership</h1>
     <h3>Under develpment</h3>

      


    </div>  
    </>
  );
};

export default transfersIP;
