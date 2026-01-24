import type { Metadata } from "next";
import "./globals.css";
import { StarknetProvider } from "@/components/starknet-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import AnimatedBackground from "@/components/animated-bg";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "IP Creator",
  description: "Programmable IP for the Integrity Web. Powered on Starknet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="vivid-gradient-bg min-h-screen text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StarknetProvider>
            <AnimatedBackground />
            <Header />
            {children}
            <Toaster />
            <Footer />
          </StarknetProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
