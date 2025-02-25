import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/lib/data"

interface CheckboxMultiSelectProps {
  options: Category[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function CheckboxMultiSelect({ options, selected, onChange }: CheckboxMultiSelectProps) {
  const handleCheckboxChange = (categoryId: string) => {
    if (selected.includes(categoryId)) {
      onChange(selected.filter((id) => id !== categoryId))
    } else {
      onChange([...selected, categoryId])
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {options.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <Checkbox
              id={category.id}
              checked={selected.includes(category.id)}
              onCheckedChange={() => handleCheckboxChange(category.id)}
            />
            <Label
              htmlFor={category.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {category.name}
            </Label>
          </div>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected.map((categoryId) => {
            const category = options.find((c) => c.id === categoryId)
            return category ? (
              <Badge key={category.id} variant="secondary" className="text-xs py-1 px-2">
                {category.name}
              </Badge>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}

