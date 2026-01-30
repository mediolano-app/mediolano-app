"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, User, Tag } from "lucide-react"
import type { AssetFormState } from "@/hooks/use-asset-form"

interface AssetDetailsProps {
    formState: AssetFormState
    updateFormField: (field: string, value: any) => void
}

export function AssetDetails({
    formState,
    updateFormField,
}: AssetDetailsProps) {

    const addTag = (tag: string) => {
        const trimmed = tag.trim()
        if (trimmed && !formState.tags.includes(trimmed)) {
            updateFormField("tags", [...formState.tags, trimmed])
        }
    }

    const removeTag = (tagToRemove: string) => {
        updateFormField(
            "tags",
            formState.tags.filter((tag: string) => tag !== tagToRemove)
        )
    }

    const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            const input = e.target as HTMLInputElement
            addTag(input.value)
            input.value = ""
        }
    }

    return (
        <Card className="border shadow-sm">
            <CardContent className="space-y-6">

                {/* Creator */}
                <div className="space-y-2 mt-4">
                    <Label htmlFor="creator" className="text-base font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Creator
                    </Label>
                    <Input
                        id="creator"
                        placeholder="Creator name or address"
                        value={formState.creator}
                        onChange={(e) => updateFormField("creator", e.target.value)}
                        className="h-12"
                    />
                    <p className="text-xs text-muted-foreground">
                        Defaults to your wallet address.
                    </p>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                    <Label className="text-base font-medium flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        Tags
                    </Label>
                    <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 rounded-md bg-muted/10 border border-muted-foreground/10">
                        {formState.tags.length === 0 && (
                            <span className="text-sm text-muted-foreground p-1">No tags added</span>
                        )}
                        {formState.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                                {tag}
                                <X
                                    className="h-3 w-3 cursor-pointer hover:text-red-500 transition-colors"
                                    onClick={() => removeTag(tag)}
                                />
                            </Badge>
                        ))}
                    </div>
                    <Input
                        placeholder="Type tag and press Enter"
                        onKeyDown={handleTagKeyPress}
                        className="h-12"
                    />
                </div>
            </CardContent>
        </Card>
    )
}
