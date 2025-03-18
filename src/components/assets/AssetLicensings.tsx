"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getAssetById } from "@/lib/mockupAssets"
import type { Licensing } from "@/lib/types"

export function AssetLicensings({ assetId }: { assetId: string }) {
  const asset = getAssetById(assetId)
  const [licensings, setLicensings] = useState<Licensing[]>(asset?.licensing || [])

  const addLicensing = (newLicensing: Licensing) => {
    setLicensings([...licensings, newLicensing])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Active Licensings</h3>
        <CreateLicensingDialog onLicensingCreated={addLicensing} />
      </div>

      {licensings.length === 0 ? (
        <p className="text-muted-foreground">No active licensings for this asset.</p>
      ) : (
        <div className="space-y-4">
          {licensings.map((license) => (
            <Card key={license.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <CardTitle>{license.type} License</CardTitle>
                    <CardDescription>Issued to {license.licensee}</CardDescription>
                  </div>
                  <Badge variant={license.type === "Exclusive" ? "destructive" : "default"}>{license.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Start Date</span>
                    <span>{new Date(license.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">End Date</span>
                    <span>{new Date(license.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-sm text-muted-foreground">Terms</span>
                    <p className="mt-1">{license.terms}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function CreateLicensingDialog({ onLicensingCreated }: { onLicensingCreated: (licensing: Licensing) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: "Personal",
    licensee: "",
    startDate: "",
    endDate: "",
    terms: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newLicensing: Licensing = {
      id: Date.now().toString(),
      ...formData,
    } as Licensing
    onLicensingCreated(newLicensing)
    setIsOpen(false)
    setFormData({
      type: "Personal",
      licensee: "",
      startDate: "",
      endDate: "",
      terms: "",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Licensing</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Licensing</DialogTitle>
          <DialogDescription>
            Create a new Programmable IP licensing for this asset. This will generate a new NFT representing the
            license.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">License Type</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2"
            >
              <option value="Personal">Personal</option>
              <option value="Commercial">Commercial</option>
              <option value="Exclusive">Exclusive</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensee">Licensee</Label>
            <Input id="licensee" name="licensee" value={formData.licensee} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="terms">Terms</Label>
            <Textarea id="terms" name="terms" value={formData.terms} onChange={handleInputChange} required />
          </div>
          <Button type="submit" className="w-full">
            Create Licensing NFT
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

