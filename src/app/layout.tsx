// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mediolano",
  description: "Programmable IP for the Integrity Web",
  keywords: ["blockchain", "IP", "intellectual property", "starknet", "NFT"],
  authors: [{ name: "Mediolano Team" }],
  openGraph: {
    title: "Mediolano",
    description: "Programmable IP for the Integrity Web",
    type: "website",
    url: "https://mediolano.xyz",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
