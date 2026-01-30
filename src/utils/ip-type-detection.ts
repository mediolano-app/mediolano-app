import type { AssetType, IPFSMetadata } from "@/utils/ipfs"
import { ALLOWED_IP_TYPES } from "@/lib/constants"
import { IPType } from "@/lib/types"

const normalize = (s: unknown): string => (typeof s === "string" ? s.toLowerCase() : "")


export function determineIPType(asset: AssetType, metadata?: IPFSMetadata | null): IPType {
  // Prefer asset.type if valid
  const allowed: IPType[] = ALLOWED_IP_TYPES
  if (asset?.type && allowed.includes(asset.type as IPType)) {
    return asset.type as IPType
  }

  // Try metadata-based detection if provided
  if (metadata) {
    const attrs = Array.isArray(metadata.attributes) ? metadata.attributes : []
    const attrType = attrs.find((a) => {
      const t = typeof a?.trait_type === 'string' ? a.trait_type.toLowerCase() : ''
      return t === 'type' || t === 'template'
    })
    if (attrType?.value && typeof attrType.value === 'string') {
      const v = attrType.value.toLowerCase()
      if (v === 'art' || v === 'artwork') return 'Art'
      if (v === 'photography' || v === 'photo') return 'Photography'
      if (v === 'audio' || v === 'music') return 'Audio'
      if (v === 'video' || v === 'film' || v === 'movie') return 'Video'
      if (v === 'software' || v === 'app' || v === 'application') return 'Software'
      if (v === 'document' || v === 'documents' || v === 'pdf') return 'Documents'
      if (v === 'publication' || v === 'book' || v === 'journal') return 'Publications'
      if (v === 'patent' || v === 'patents') return 'Patents'
      if (v === 'post' || v === 'blog' || v === 'article') return 'Posts'
      if (v === 'rwa' || v === 'real world asset' || v === 'real-world asset' || v === 'real estate') return 'RWA'
      if (v === 'nft' || v === 'token') return 'NFT'
    }

    if (metadata.type && typeof metadata.type === 'string') {
      const t = metadata.type.trim().toLowerCase()
      if (/(^|\b)(art|digital art|painting|illustration)($|\b)/.test(t)) return 'Art'
      if (/(^|\b)(photography|photo|camera)($|\b)/.test(t)) return 'Photography'
      if (/(^|\b)(audio|music|sound)($|\b)/.test(t)) return 'Audio'
      if (/(^|\b)(video|film|movie)($|\b)/.test(t)) return 'Video'
      if (/(^|\b)(software|code|app|application)($|\b)/.test(t)) return 'Software'
      if (/(^|\b)(document|documents|pdf)($|\b)/.test(t)) return 'Documents'
      if (/(^|\b)(publication|publications|book|journal)($|\b)/.test(t)) return 'Publications'
      if (/(^|\b)(patent|patents)($|\b)/.test(t)) return 'Patents'
      if (/(^|\b)(post|blog|article)($|\b)/.test(t)) return 'Posts'
      if (/(^|\b)(rwa|real world asset|real-world asset|real estate)($|\b)/.test(t)) return 'RWA'
      if (/(^|\b)(nft|token)($|\b)/.test(t)) return 'NFT'
    }

    if (metadata.medium === 'Digital Art' || metadata.medium === 'Physical Art' ||
      metadata.medium === 'Painting' || metadata.medium === 'Illustration') {
      return 'Art'
    }

    if (metadata.fileType) {
      if (metadata.fileType.startsWith('audio/')) return 'Audio'
      if (metadata.fileType.startsWith('video/')) return 'Video'
      if (metadata.fileType.includes('code') || metadata.fileType.includes('javascript')) return 'Software'
      if (metadata.fileType === 'application/pdf') return 'Documents'
    }

    if (metadata.duration || metadata.genre || metadata.bpm) return 'Audio'
    if (metadata.resolution || metadata.framerate) return 'Video'
    if (metadata.yearCreated && metadata.artistName) return 'Art'
    if (metadata.version && (metadata.external_url || metadata.repository)) return 'Software'
    if (metadata.patent_number || metadata.patent_date) return 'Patents'
    if (metadata.tokenId || metadata.tokenStandard || metadata.blockchain) return 'NFT'
  }

  // Fallback to asset-only heuristics
  // Check attributes first
  const attributes: Array<{ trait_type?: unknown; value?: unknown }> = Array.isArray(asset.attributes)
    ? asset.attributes
    : []
  const typeAttr = attributes.find((a) => {
    const t = normalize(a?.trait_type)
    return t === "type" || t === "template"
  })
  if (typeAttr?.value) {
    const v = normalize(typeAttr.value)
    if (v === "post" || v === "posts") return "Posts"
    if (v === "audio" || v === "music") return "Audio"
    if (v === "art" || v === "artwork") return "Art"
    if (v === 'photography' || v === 'photo') return 'Photography'
    if (v === "video" || v === "film") return "Video"
    if (v === "document" || v === "documents") return "Documents"
    if (v === "software" || v === "app") return "Software"
    if (v === "patent" || v === "patents") return "Patents"
    if (v === "publication" || v === "book") return "Publications"
    if (v === "rwa" || v === "real estate") return "RWA"
    if (v === "nft" || v === "token") return "NFT"
  }

  // Fallback to name hints
  const name = normalize(asset.name)
  if (name) {
    if (name.includes("audio") || name.includes("music") || name.includes("sound")) return "Audio"
    if (name.includes("art") || name.includes("painting") || name.includes("abstract") || name.includes("collection")) return "Art"
    if (name.includes("document") || name.includes("paper") || name.includes("contract")) return "Documents"
    if (name.includes("nft") || name.includes("token") || name.includes("crypto")) return "NFT"
    if (name.includes("video") || name.includes("film") || name.includes("movie")) return "Video"
    if (name.includes("patent") || name.includes("invention")) return "Patents"
    if (name.includes("post") || name.includes("article") || name.includes("blog")) return "Posts"
    if (name.includes("book") || name.includes("publication") || name.includes("journal")) return "Publications"
    if (name.includes("real") || name.includes("property") || name.includes("asset")) return "RWA"
    if (name.includes("software") || name.includes("app") || name.includes("code")) return "Software"
  }

  // final fallback
  return "Generic"
}

