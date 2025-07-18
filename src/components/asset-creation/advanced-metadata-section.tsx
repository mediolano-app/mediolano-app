"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdvancedMetadataSectionProps {
  formState: any
  updateFormField: (field: string, value: any) => void
}

export function AdvancedMetadataSection({ formState, updateFormField }: AdvancedMetadataSectionProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="creator">Creator/Author</Label>
            <Input
              id="creator"
              value={formState.creator}
              onChange={(e) => updateFormField("creator", e.target.value)}
              placeholder="Your name or organization"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="creation-date">Creation Date</Label>
            <Input
              id="creation-date"
              type="date"
              value={formState.creationDate}
              onChange={(e) => updateFormField("creationDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formState.location}
              onChange={(e) => updateFormField("location", e.target.value)}
              placeholder="Where was this created?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formState.category} onValueChange={(value) => updateFormField("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="art-design">Art & Design</SelectItem>
                <SelectItem value="music-audio">Music & Audio</SelectItem>
                <SelectItem value="video-film">Video & Film</SelectItem>
                <SelectItem value="writing-literature">Writing & Literature</SelectItem>
                <SelectItem value="software-code">Software & Code</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={formState.keywords}
              onChange={(e) => updateFormField("keywords", e.target.value)}
              placeholder="Comma-separated keywords"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="additional-notes">Additional Notes</Label>
          <Textarea
            id="additional-notes"
            value={formState.additionalNotes}
            onChange={(e) => updateFormField("additionalNotes", e.target.value)}
            placeholder="Any additional information about your asset..."
            rows={3}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  )
}
