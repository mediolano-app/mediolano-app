"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getLicenseOptions } from "@/app/services/proof-of-ownership/lib/mock-data"

interface LicenseOptionsProps {
  assetId: string
}

export default function LicenseOptions({ assetId }: LicenseOptionsProps) {
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null)
  const licenseOptions = getLicenseOptions(assetId)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {licenseOptions.map((license) => (
          <Card
            key={license.id}
            className={`cursor-pointer transition-all ${selectedLicense === license.id ? "border-primary" : ""}`}
            onClick={() => setSelectedLicense(license.id)}
          >
            <CardHeader>
              <CardTitle>{license.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{license.description}</p>
              <div className="space-y-2">
                {license.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <p className="text-sm">{feature}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-between items-center">
                <p className="font-medium">{license.price}</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{license.name}</DialogTitle>
                      <DialogDescription>Detailed information about this license</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p>{license.fullDescription}</p>
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">License Terms</h4>
                        <ul className="space-y-2 text-sm">
                          {license.terms.map((term, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5" />
                              <span>{term}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button>Request License</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedLicense && (
        <div className="mt-6 p-4 border rounded-lg bg-muted/50">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">License Request</h3>
              <p className="text-sm text-muted-foreground">
                You've selected {licenseOptions.find((l) => l.id === selectedLicense)?.name}. Click the button below to
                proceed with your license request.
              </p>
              <Button className="mt-4">Request Selected License</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
