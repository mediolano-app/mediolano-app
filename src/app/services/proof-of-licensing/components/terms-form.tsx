"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Terms {
  duration: string
  territory: string
  rights: string
  royalties: string
  termination: string
}

interface TermsFormProps {
  terms: Terms
  onChange: (terms: Terms) => void
}

export function TermsForm({ terms, onChange }: TermsFormProps) {
  const updateTerms = (field: keyof Terms, value: string) => {
    onChange({
      ...terms,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">License Terms & Conditions</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Define the specific terms and conditions of your licensing agreement
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="duration">License Duration</Label>
          <Select value={terms.duration} onValueChange={(value) => updateTerms("duration", value)}>
            <SelectTrigger id="duration">
              <SelectValue placeholder="Select license duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1_year">1 Year</SelectItem>
              <SelectItem value="2_years">2 Years</SelectItem>
              <SelectItem value="3_years">3 Years</SelectItem>
              <SelectItem value="5_years">5 Years</SelectItem>
              <SelectItem value="10_years">10 Years</SelectItem>
              <SelectItem value="perpetual">Perpetual</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="territory">Territory</Label>
          <Select value={terms.territory} onValueChange={(value) => updateTerms("territory", value)}>
            <SelectTrigger id="territory">
              <SelectValue placeholder="Select territory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="worldwide">Worldwide</SelectItem>
              <SelectItem value="north_america">North America</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rights">Licensed Rights</Label>
          <Textarea
            id="rights"
            placeholder="Describe the specific rights being licensed"
            value={terms.rights}
            onChange={(e) => updateTerms("rights", e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="royalties">Royalties & Payments</Label>
          <Textarea
            id="royalties"
            placeholder="Describe the royalty structure and payment terms"
            value={terms.royalties}
            onChange={(e) => updateTerms("royalties", e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="termination">Termination Conditions</Label>
          <Textarea
            id="termination"
            placeholder="Describe the conditions under which this agreement may be terminated"
            value={terms.termination}
            onChange={(e) => updateTerms("termination", e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}

