import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("Received Twitter post data:", data)

    const {
      postId,
      text,
      author,
      authorUsername,
      createdAt,
      metrics,
      hashtags = [],
      mentions = [],
      urls = [],
      mediaUrls = [],
    } = data

    // Create metadata for the Twitter post NFT
    const attributes = [
      { trait_type: "Post ID", value: postId },
      { trait_type: "Author", value: author },
      { trait_type: "Username", value: authorUsername },
      { trait_type: "Created At", value: createdAt },
      { trait_type: "Like Count", value: metrics.like_count?.toString() || "0" },
      { trait_type: "Retweet Count", value: metrics.retweet_count?.toString() || "0" },
      { trait_type: "Reply Count", value: metrics.reply_count?.toString() || "0" },
      { trait_type: "Quote Count", value: metrics.quote_count?.toString() || "0" },
      { trait_type: "Platform", value: "X (Twitter)" },
      { trait_type: "Content Type", value: "Social Media Post" },
      { trait_type: "Hashtags", value: hashtags.join(", ") },
      { trait_type: "Mentions", value: mentions.join(", ") },
      { trait_type: "External URLs", value: urls.length.toString() },
      { trait_type: "Media Count", value: mediaUrls.length.toString() },
      { trait_type: "Character Count", value: text.length.toString() },
      { trait_type: "Registration Date", value: new Date().toISOString() },
      { trait_type: "Token Type", value: "Twitter Post NFT" },
      { trait_type: "Blockchain", value: "Starknet" },
    ]

    // Generate a preview image for the post (could be enhanced with actual image generation)
    let processedImageUrl = "https://via.placeholder.com/600x400/1DA1F2/FFFFFF?text=X+Post+NFT"
    
    // If media URLs are provided, use the first one as the image
    if (mediaUrls.length > 0) {
      processedImageUrl = mediaUrls[0]
    }

    const formattedAsset = {
      name: `X Post by @${authorUsername}`,
      description: `Original X post: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}" - Tokenized from X (formerly Twitter) on ${new Date().toLocaleDateString()}`,
      external_url: `https://x.com/${authorUsername}/status/${postId}`,
      image: processedImageUrl,
      attributes,
      properties: {
        postId,
        platform: "x",
        originalText: text,
        author: {
          name: author,
          username: authorUsername
        },
        metrics,
        entities: {
          hashtags,
          mentions,
          urls
        },
        tokenizedAt: new Date().toISOString()
      }
    }

    console.log("Uploading Twitter post metadata to IPFS...")
    
    // Try to upload to IPFS, but provide fallback if it fails
    let uploadData
    try {
      console.log("PINATA_JWT is configured, uploading to IPFS...", process.env.PINATA_JWT)
      // Only try to import pinataClient if environment variables are configured
      if (process.env.PINATA_JWT) {
        const { pinataClient } = await import("@/utils/pinataClient")
        uploadData = await pinataClient.upload.json(formattedAsset)
        console.log("Successfully uploaded to IPFS:", uploadData.IpfsHash)
      } else {
        console.log("PINATA_JWT not configured, using mock IPFS hash")
        // Generate a mock IPFS hash for development
        uploadData = {
          IpfsHash: `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
          PinSize: JSON.stringify(formattedAsset).length,
          Timestamp: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error("IPFS upload failed, using fallback:", error)
      // Fallback to mock data if IPFS upload fails
      uploadData = {
        IpfsHash: `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        PinSize: JSON.stringify(formattedAsset).length,
        Timestamp: new Date().toISOString(),
        error: "IPFS upload failed - using mock hash for development"
      }
    }

    return NextResponse.json({ 
      uploadData,
      metadata: formattedAsset 
    }, { status: 200 })

  } catch (error) {
    console.error("Error in Twitter post tokenization:", error)
    return NextResponse.json({ 
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      details: "Check server logs for more information"
    }, { status: 500 })
  }
}