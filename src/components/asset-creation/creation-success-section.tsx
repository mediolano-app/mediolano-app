"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface CreationSuccessSectionProps {
  selectedTemplate: {
    name: string
  }
  isSubmitting: boolean
  canSubmit: boolean
  onSubmit: () => void
}

export function CreationSuccessSection({
  selectedTemplate,
  isSubmitting,
  canSubmit,
  onSubmit,
}: CreationSuccessSectionProps) {
  return (
    <div className="flex justify-end pt-6">
      <Button onClick={onSubmit} disabled={!canSubmit || isSubmitting} size="lg" className="px-8">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Creating {selectedTemplate.name}...
          </>
        ) : (
          `Create ${selectedTemplate.name} Asset`
        )}
      </Button>
    </div>
  )
}
