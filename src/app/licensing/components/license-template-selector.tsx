"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { Check, FileText, Briefcase, Users } from "lucide-react"

interface LicenseTemplateProps {
  assetType: string
  onSelect: (templateId: string) => void
  selectedTemplate: string | null
}

export function LicenseTemplateSelector({ assetType, onSelect, selectedTemplate }: LicenseTemplateProps) {
  return (
    <div className="space-y-3">
      <Label>License Template</Label>
      <RadioGroup value={selectedTemplate || ""} onValueChange={onSelect} className="grid gap-4 md:grid-cols-3">
        <TemplateCard
          id="commercial"
          title="Commercial License"
          description="Full commercial rights with royalty payments"
          icon={<Briefcase className="h-5 w-5" />}
          selected={selectedTemplate === "commercial"}
        />

        <TemplateCard
          id="personal"
          title="Personal Use"
          description="Non-commercial personal use only"
          icon={<Users className="h-5 w-5" />}
          selected={selectedTemplate === "personal"}
        />

        <TemplateCard
          id="derivative"
          title="Derivative Works"
          description="Rights to create derivative works"
          icon={<FileText className="h-5 w-5" />}
          selected={selectedTemplate === "derivative"}
        />
      </RadioGroup>
    </div>
  )
}

interface TemplateCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  selected: boolean
}

function TemplateCard({ id, title, description, icon, selected }: TemplateCardProps) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        "cursor-pointer",
        "[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary/5"
      )}
    >
      <RadioGroupItem value={id} id={id} className="sr-only" />
      <Card className={cn(
        "transition-all hover:border-primary/50 hover:bg-muted/50",
        selected && "border-primary bg-primary/5"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-md border bg-background p-1.5">
                {icon}
              </div>
              <div>
                <h4 className="font-medium">{title}</h4>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
            {selected && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Label>
  );
}
