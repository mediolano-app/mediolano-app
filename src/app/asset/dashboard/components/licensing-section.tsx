"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getLicensingOptions, getLicenseOptions } from "@/lib/mockAssetDashboard"

export function LicensingSection() {
  const [selectedRights, setSelectedRights] = useState<string[]>([])
  const [duration, setDuration] = useState("1")
  const [territory, setTerritory] = useState("worldwide")
  const [customClause, setCustomClause] = useState("")

  const predefinedOptions = getLicensingOptions()
  const licenseOptions = getLicenseOptions()

  const handleRightToggle = (right: string) => {
    setSelectedRights((prev) => (prev.includes(right) ? prev.filter((r) => r !== right) : [...prev, right]))
  }

  const handleCreateLicense = () => {
    console.log("Creating license with:", { selectedRights, duration, territory, customClause })
    // Here you would typically call a function to create the smart contract
  }

  return (
    <Card className="bg-background/80 mb-40">
      <CardHeader>
        <CardTitle>Licensing Options</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="predefined" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="predefined">Pre-defined Options</TabsTrigger>
            <TabsTrigger value="custom">Custom License</TabsTrigger>
          </TabsList>
          <TabsContent value="predefined">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {predefinedOptions.map((option, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{option.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm">{option.description}</p>
                    <ul className="list-disc list-inside mb-4 text-sm">
                      {option.rights.map((right, i) => (
                        <li key={i}>{right}</li>
                      ))}
                    </ul>
                    <p className="font-bold mb-4">Price: {option.price} ETH</p>
                    <Button className="w-full">Select</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="custom">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Select Rights</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {licenseOptions.rights.map((right) => (
                    <div key={right} className="flex items-center space-x-2">
                      <Checkbox
                        id={right}
                        checked={selectedRights.includes(right)}
                        onCheckedChange={() => handleRightToggle(right)}
                      />
                      <Label htmlFor={right} className="text-sm">
                        {right}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {licenseOptions.durations.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d} year(s)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="territory">Territory</Label>
                  <Select value={territory} onValueChange={setTerritory}>
                    <SelectTrigger id="territory">
                      <SelectValue placeholder="Select territory" />
                    </SelectTrigger>
                    <SelectContent>
                      {licenseOptions.territories.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="customClause">Custom Clause</Label>
                <Input
                  id="customClause"
                  value={customClause}
                  onChange={(e) => setCustomClause(e.target.value)}
                  placeholder="Enter any custom clauses or terms"
                />
              </div>
              <Button onClick={handleCreateLicense}>Create Custom License</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

