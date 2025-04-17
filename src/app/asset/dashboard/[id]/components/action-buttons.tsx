import { Button } from "@/components/ui/button"
import { PlusCircle, DollarSign, Zap, BarChart3, Share2, Download, Edit } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ActionButtons() {
  const buttons = [
    { icon: PlusCircle, label: "New Listing", tooltip: "Create a new marketplace listing" },
    { icon: DollarSign, label: "New Licensing", tooltip: "Create a new licensing agreement" },
    { icon: Zap, label: "Monetize Asset", tooltip: "Explore monetization options" },
    { icon: BarChart3, label: "Analytics", tooltip: "View detailed asset analytics" },
    { icon: Share2, label: "Share", tooltip: "Share this asset" },
    { icon: Download, label: "Download", tooltip: "Download asset files" },
    { icon: Edit, label: "Edit Metadata", tooltip: "Edit asset metadata" },
  ]

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
        {buttons.map((button, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button disabled className="w-full flex items-center justify-center gap-2 px-2 sm:px-4" variant="outline">
                <button.icon className="w-4 h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">{button.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{button.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

