"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Music,
    Palette,
    Video,
    FileText,
    Code,
    Hexagon,
    Layers,
} from "lucide-react"

interface TemplateSummary {
    id: string
    name: string
}

interface TemplateSelectorProps {
    templates: TemplateSummary[]
    selectedTemplateId?: string
    onTemplateChange: (templateId: string) => void
}

const getIconForTemplate = (templateId: string) => {
    const icons: Record<string, any> = {
        audio: Music,
        art: Palette,
        video: Video,
        documents: FileText,
        software: Code,
        nft: Hexagon,
        general: FileText,
    }
    return icons[templateId] || Layers
}

export function TemplateSelector({ templates, selectedTemplateId, onTemplateChange }: TemplateSelectorProps) {
    return (
        <Card className="border shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Asset Type
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Select the type of asset you are creating to enable specific metadata fields.
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label className="text-base font-medium">Type</Label>
                    <Select
                        value={selectedTemplateId}
                        onValueChange={onTemplateChange}
                    >
                        <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent>
                            {templates.map((template) => {
                                const Icon = getIconForTemplate(template.id)
                                return (
                                    <SelectItem key={template.id} value={template.id}>
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4" />
                                            <span>{template.name}</span>
                                        </div>
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}
