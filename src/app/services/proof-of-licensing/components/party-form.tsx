"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash, Plus } from "lucide-react"

interface Party {
  id: string
  name: string
  walletAddress: string
  role: string
  email: string
}

interface PartyFormProps {
  parties: Party[]
  onChange: (parties: Party[]) => void
}

export function PartyForm({ parties, onChange }: PartyFormProps) {
  const addParty = () => {
    const newParty: Party = {
      id: crypto.randomUUID(),
      name: "",
      walletAddress: "",
      role: "",
      email: "",
    }
    onChange([...parties, newParty])
  }

  const updateParty = (id: string, field: keyof Party, value: string) => {
    const updatedParties = parties.map((party) => (party.id === id ? { ...party, [field]: value } : party))
    onChange(updatedParties)
  }

  const removeParty = (id: string) => {
    onChange(parties.filter((party) => party.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Agreement Parties</h3>
        <Button type="button" onClick={addParty} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Party
        </Button>
      </div>

      {parties.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground mb-4">No parties added yet</p>
          <Button type="button" onClick={addParty} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Party
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {parties.map((party) => (
            <Card key={party.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{party.name || "New Party"}</CardTitle>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeParty(party.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${party.id}`}>Name</Label>
                    <Input
                      id={`name-${party.id}`}
                      value={party.name}
                      onChange={(e) => updateParty(party.id, "name", e.target.value)}
                      placeholder="Enter party name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`wallet-${party.id}`}>Wallet Address</Label>
                    <Input
                      id={`wallet-${party.id}`}
                      value={party.walletAddress}
                      onChange={(e) => updateParty(party.id, "walletAddress", e.target.value)}
                      placeholder="0x..."
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`role-${party.id}`}>Role</Label>
                    <Select value={party.role} onValueChange={(value) => updateParty(party.id, "role", value)}>
                      <SelectTrigger id={`role-${party.id}`}>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="licensor">Licensor</SelectItem>
                        <SelectItem value="licensee">Licensee</SelectItem>
                        <SelectItem value="witness">Witness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`email-${party.id}`}>Email (Optional)</Label>
                    <Input
                      id={`email-${party.id}`}
                      type="email"
                      value={party.email}
                      onChange={(e) => updateParty(party.id, "email", e.target.value)}
                      placeholder="email@example.com"
                    />
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

