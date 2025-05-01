import {
  FileAudio2,
  FileImage,
  FileText,
  FileVideo,
  Hexagon,
  BookOpen,
  Newspaper,
  Building2,
  FileCode2,
  Briefcase,
  File,
} from "lucide-react"
import { cn } from "@/lib/utils"

type AssetType =
  | "Audio"
  | "Art"
  | "Documents"
  | "NFT"
  | "Video"
  | "Patents"
  | "Posts"
  | "Publications"
  | "RWA"
  | "Software"
  | "Custom"

interface AssetTypeIconProps {
  type: AssetType
  className?: string
}

export function AssetTypeIcon({ type, className }: AssetTypeIconProps) {
  const iconProps = {
    className: cn("h-4 w-4", className),
  }

  switch (type) {
    case "Audio":
      return <FileAudio2 {...iconProps} />
    case "Art":
      return <FileImage {...iconProps} />
    case "Documents":
      return <FileText {...iconProps} />
    case "NFT":
      return <Hexagon {...iconProps} />
    case "Video":
      return <FileVideo {...iconProps} />
    case "Patents":
      return <Briefcase {...iconProps} />
    case "Posts":
      return <BookOpen {...iconProps} />
    case "Publications":
      return <Newspaper {...iconProps} />
    case "RWA":
      return <Building2 {...iconProps} />
    case "Software":
      return <FileCode2 {...iconProps} />
    case "Custom":
    default:
      return <File {...iconProps} />
  }
}
