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
    
    // Check if PINATA_JWT is properly configured
    const pinataJWT = process.env.PINATA_JWT
    console.log("PINATA_JWT configured:", !!pinataJWT)
    console.log("PINATA_JWT length:", pinataJWT?.length || 0)
    
    let uploadData
    try {
      if (pinataJWT && pinataJWT.length > 0) {
        console.log("Attempting IPFS upload via Pinata...")
        const { pinataClient } = await import("@/utils/pinataClient")
        
        // Upload the metadata to IPFS
        const result = await pinataClient.upload.json(formattedAsset, {
          metadata: { 
            name: `twitter-post-${postId}-metadata.json`,
            keyValues: {
              postId: postId,
              author: authorUsername,
              platform: "x",
              tokenizedAt: new Date().toISOString()
            }
          }
        })
        
        uploadData = {
          IpfsHash: result.IpfsHash,
          PinSize: result.PinSize,
          Timestamp: result.Timestamp,
          ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
          pinataUrl: `https://app.pinata.cloud/pinmanager?search=${result.IpfsHash}`
        }
        
        console.log("Successfully uploaded to IPFS:", {
          hash: uploadData.IpfsHash,
          size: uploadData.PinSize,
          url: uploadData.ipfsUrl
        })
      } else {
        console.log("PINATA_JWT not configured or empty, using mock IPFS hash")
        // Generate a mock IPFS hash for development
        const mockHash = `QmTEST${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
        uploadData = {
          IpfsHash: mockHash,
          PinSize: JSON.stringify(formattedAsset).length,
          Timestamp: new Date().toISOString(),
          ipfsUrl: `https://gateway.pinata.cloud/ipfs/${mockHash}`,
          pinataUrl: `https://app.pinata.cloud/pinmanager?search=${mockHash}`,
          warning: "Mock IPFS hash - PINATA_JWT not configured"
        }
      }
    } catch (error) {
      console.error("IPFS upload failed:", error)
      
      // Create detailed error information
      const errorDetails = error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : { message: "Unknown error" }
      
      console.log("Error details:", errorDetails)
      
      // Fallback to mock data if IPFS upload fails
      const fallbackHash = `QmERROR${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      uploadData = {
        IpfsHash: fallbackHash,
        PinSize: JSON.stringify(formattedAsset).length,
        Timestamp: new Date().toISOString(),
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${fallbackHash}`,
        pinataUrl: `https://app.pinata.cloud/pinmanager?search=${fallbackHash}`,
        error: "IPFS upload failed - using fallback hash",
        errorDetails
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