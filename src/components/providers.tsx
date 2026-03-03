"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { StarkZapWalletProvider } from "@/contexts/starkzap-wallet-context";
import { ThemeProvider } from "@/components/theme-provider";
import { StarknetProvider } from "@/components/starknet-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "google", "twitter"],
        appearance: { theme: "dark" },
      }}
    >
      <StarkZapWalletProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StarknetProvider>{children}</StarknetProvider>
        </ThemeProvider>
      </StarkZapWalletProvider>
    </PrivyProvider>
  );
}
