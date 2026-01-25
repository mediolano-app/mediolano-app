import type { Metadata } from "next";
import "./globals.css";
import { StarknetProvider } from "@/components/starknet-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import AnimatedBackground from "@/components/animated-bg";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ip.mediolano.app'),
  title: {
    default: 'IP Creator | Programmable IP for the Integrity Web',
    template: '%s | IP Creator',
  },
  description: 'Create, manage, and protect your intellectual property on Starknet. IP Creator enables programmable IP assets with provenance tracking, licensing, and ownership verification.',
  keywords: [
    'IP',
    'intellectual property',
    'NFT',
    'Starknet',
    'blockchain',
    'digital assets',
    'provenance',
    'licensing',
    'creator economy',
    'web3',
  ],
  authors: [{ name: 'Mediolano' }],
  creator: 'Mediolano',
  publisher: 'Mediolano',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'IP Creator',
    title: 'IP Creator | Programmable IP for the Integrity Web',
    description: 'Create, manage, and protect your intellectual property on Starknet. Programmable IP assets with provenance tracking and ownership verification.',
    images: [
      {
        url: '/mediolano-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'IP Creator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IP Creator | Programmable IP for the Integrity Web',
    description: 'Create, manage, and protect your intellectual property on Starknet.',
    images: ['/mediolano-logo-dark.png'],
    creator: '@medloanoapp',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="vivid-gradient-bg min-h-screen text-foreground antialiased">
        <div className="bg-background/75">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <StarknetProvider>
              <Header />
              {children}
              <Toaster />
              <Footer />
            </StarknetProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
