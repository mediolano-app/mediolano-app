"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export function LicensePreview() {
  const [licenseTerms, setLicenseTerms] = useState<string[]>([])
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    // In a real application, you would fetch this data from your licensing component
    setLicenseTerms([
      "Licensee is granted a non-exclusive, non-transferable license to use the Asset.",
      "The license is valid for the duration specified in the agreement.",
      "The Asset may not be sublicensed, sold, or redistributed without explicit permission.",
      "Licensee agrees to provide attribution to the Creator as specified in the agreement.",
      "Any modifications to the Asset must be approved by the Creator.",
    ])
  }, [])

  const handleAgree = () => {
    setAgreed(!agreed)
  }

  const handleProceed = () => {
    if (agreed) {
      console.log("Proceeding with license agreement")
      // Here you would typically initiate the smart contract interaction
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>License Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-md max-h-60 overflow-y-auto">
            <h3 className="font-semibold mb-2">License Terms:</h3>
            <ul className="list-disc list-inside space-y-2">
              {licenseTerms.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={agreed} onCheckedChange={handleAgree} />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the license terms and conditions
            </label>
          </div>
          <Button onClick={handleProceed} disabled={!agreed}>
            Proceed with License Agreement
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

