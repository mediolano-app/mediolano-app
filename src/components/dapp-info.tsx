'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from "@/components/ui/drawer"
import { HelpCircle, Moon, Sun, X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"

export default function DappInfo() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mockup data for app information
  const appInfo = {
    name: "Mediolano",
    version: "0.2.0 Mainnet",
    description: "Mediolano is a decentralized application for creators and organizations to protect and make money from their intellectual property, powered on Starknet.",
    features: [
      "Open-Source",
      "Zero Fees",
      "Fast & Secure",
      "Self Custody",
      "Programmable IP",
      "ZK-Proofs"
    ]
  }

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-4 z-10">

      {/*      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow transition-colors hover:bg-card hover:text-primary-foreground"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        <span className="sr-only">Toggle theme</span>
      </Button>
        */}

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="rounded-full shadow bg-blue-700 transition-transform hover:scale-110"
          >
            <HelpCircle className="h-6 w-6" />
            <span className="sr-only">Dapp Info</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-4xl">
            <DrawerHeader>
              <DrawerTitle className="text-2xl font-bold">
                {appInfo.name}
                <Badge variant="secondary" className="mt-2">Dapp Preview</Badge>

              </DrawerTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <p className="text-muted-foreground"><strong>Version:</strong> {appInfo.version}</p>
              <p className="mt-4">{appInfo.description}</p>
              <div className="mt-2">
                <span className="text-sm">Features:</span>

                {appInfo.features.map((feature, index) => (
                  <Badge className='p-2 m-2' key={index} variant="outline">{feature}</Badge>

                ))}

              </div>
            </div>
            <DrawerFooter>
              {/*<Button className="w-full" onClick={() => setIsOpen(false)}>Close</Button>*/}
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}