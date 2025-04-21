import { Badge as UIBadge } from "@/components/ui/badge"

interface TaskBadgeProps {
  type: string
}

export function TaskBadge({ type }: TaskBadgeProps) {
  let color = "bg-primary/10 text-primary hover:bg-primary/20"

  switch (type) {
    case "social":
      color = "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      break
    case "community":
      color = "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      break
    case "transaction":
      color = "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      break
    case "referral":
      color = "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
      break
    case "quiz":
      color = "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20"
      break
  }

  return (
    <UIBadge variant="outline" className={`${color} border-0`}>
      {type}
    </UIBadge>
  )
}

