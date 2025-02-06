import type { Asset } from "@/types/asset"

const collections = ["CryptoPunks", "Bored Ape Yacht Club", "Azuki", "Doodles", "Art Blocks"]

export const mockAssets: Asset[] = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  name: `NFT #${i + 1}`,
  imageUrl: `/background.jpg`,
  isVisible: Math.random() > 0.5,
  category: ["Art", "Collectibles", "Gaming", "Music"][Math.floor(Math.random() * 4)],
  collection: collections[Math.floor(Math.random() * collections.length)],
  tokenId: Math.floor(Math.random() * 10000).toString(),
  openseaUrl: `https://opensea.io/assets/ethereum/0x123.../${i + 1}`,
}))

