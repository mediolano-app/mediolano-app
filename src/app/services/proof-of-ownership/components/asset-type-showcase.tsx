import { ImageIcon, Music, Video, FileText, Code, Brain, Building, Palette, Layers } from "lucide-react"

const assetTypes = [
  {
    name: "Artwork",
    icon: Palette,
    description: "Secure proof of ownership for digital and traditional art",
  },
  {
    name: "Music",
    icon: Music,
    description: "Protect your songs, compositions, and sound recordings",
  },
  {
    name: "Videos",
    icon: Video,
    description: "Establish ownership of films, animations, and video content",
  },
  {
    name: "Literature",
    icon: FileText,
    description: "Verify authorship of books, articles, and written works",
  },
  {
    name: "AI Models",
    icon: Brain,
    description: "Protect your machine learning models and algorithms",
  },
  {
    name: "Software",
    icon: Code,
    description: "Prove ownership of applications, code, and digital tools",
  },
  {
    name: "NFTs",
    icon: Layers,
    description: "Add additional ownership proof to your digital collectibles",
  },
  {
    name: "RWA",
    icon: Building,
    description: "Verify ownership of tokenized real-world assets",
  },
]

export default function AssetTypeShowcase() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {assetTypes.map((type) => (
        <div
          key={type.name}
          className="flex flex-col items-center p-6 bg-background rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
        >
          {type.name === "Artwork" ? (
            <ImageIcon className="h-12 w-12 mb-4 text-primary" />
          ) : (
            <type.icon className="h-12 w-12 mb-4 text-primary" />
          )}
          <h3 className="text-lg font-medium mb-1">{type.name}</h3>
          <p className="text-sm text-center text-muted-foreground">{type.description}</p>
        </div>
      ))}
    </div>
  )
}
