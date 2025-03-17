"use client";

import { Suspense } from "react";
import NFTPortfolio from "../../components/nft-portfolio";
import { Skeleton } from "@/components/ui/skeleton";
// import { useAccount } from "@starknet-react/core";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { ConnectWallet } from "@/components/ConnectWallet";

export default function PortfolioPage() {
  // const { account } = useAccount();

  // if (!account) {
  //   return (
  //     <div className="container mx-auto px-4 py-8 mt-10 mb-20 flex flex-col items-center justify-center min-h-[60vh]">
  //       <Card className="w-full max-w-md">
  //         <CardHeader>
  //           <CardTitle className="text-center">Connect Your Wallet</CardTitle>
  //           <CardDescription className="text-center">
  //             Please connect your wallet to view your portfolio
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent className="flex justify-center pb-6">
  //           <ConnectWallet />
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">IP Portfolio</h1>
        <p className="text-muted-foreground">Manage and showcase your digital assets in one place</p>
      </div>
      <Suspense fallback={<PortfolioSkeleton />}>
        <NFTPortfolio />
      </Suspense>
    </div>
  );
}

function PortfolioSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Skeleton className="h-10 w-full sm:w-[250px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
      </div>
    </div>
  );
}

