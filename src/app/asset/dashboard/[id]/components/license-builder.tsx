"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getLicenseOptions } from "@/lib/mockAssetDashboard"

export function LicenseBuilder() {
  const [selectedRights, setSelectedRights] = useState<string[]>([])
  const [duration, setDuration] = useState("1")
  const [territory, setTerritory] = useState("worldwide")
  const [customClause, setCustomClause] = useState("")

  const licenseOptions = getLicenseOptions()

  const handleRightToggle = (right: string) => {
    setSelectedRights((prev) => (prev.includes(right) ? prev.filter((r) => r !== right) : [...prev, right]))
  }

  const handleCreateLicense = () => {
    console.log("Creating license with:", { selectedRights, duration, territory, customClause })
    // Here you would typically call a function to create the smart contract
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom License Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Rights</h3>
          {licenseOptions.rights.map((right) => (
            <div key={right} className="flex items-center space-x-2">
              <Checkbox
                id={right}
                checked={selectedRights.includes(right)}
                onCheckedChange={() => handleRightToggle(right)}
              />
              <Label htmlFor={right}>{right}</Label>
            </div>
          ))}
        </div>
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
        <div>
          <Label htmlFor="customClause">Custom Clause</Label>
          <Input
            id="customClause"
            value={customClause}
            onChange={(e) => setCustomClause(e.target.value)}
            placeholder="Enter any custom clauses or terms"
          />
        </div>
        <Button onClick={handleCreateLicense}>Create License Smart Contract</Button>
      </CardContent>
    </Card>
  )
}

