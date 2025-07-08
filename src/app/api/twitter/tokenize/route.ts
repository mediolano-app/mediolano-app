import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

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
      walletAddress,
      contractAddress
    } = data

    // Validate required fields for blockchain minting
    if (!walletAddress) {
      return NextResponse.json({ 
        error: "Wallet address required for NFT minting",
        message: "Please connect your Starknet wallet to tokenize posts"
      }, { status: 400 })
    }

    if (!contractAddress) {
      return NextResponse.json({ 
        error: "Contract address not configured",
        message: "MIP Collection contract address is missing"
      }, { status: 500 })
    }

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

    // Generate a preview image for the post
    let processedImageUrl = "https://via.placeholder.com/600x400/1DA1F2/FFFFFF?text=X+Post+NFT"
    
    if (mediaUrls.length > 0) {
      processedImageUrl = mediaUrls[0]
    }

    const tokenMetadata = {
      name: `X Post by @${authorUsername}`,
      description: `Original X post: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}" - Tokenized from X (formerly Twitter) on ${new Date().toLocaleDateString()}`,
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
        external_url: `https://x.com/${authorUsername}/status/${postId}`,
        tokenizedAt: new Date().toISOString()
      }
    }

    console.log("📤 Step 1: Uploading metadata to IPFS...")
    
    // Upload metadata to IPFS first
    const pinataJWT = process.env.PINATA_JWT
    let ipfsData
    
    try {
      if (pinataJWT && pinataJWT.length > 0) {
        console.log("🌐 Uploading to IPFS via Pinata...")
        const { pinataClient } = await import("@/utils/pinataClient")
        
        const result = await pinataClient.upload.json(tokenMetadata, {
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
        
        ipfsData = {
          hash: result.IpfsHash,
          url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
          pinataUrl: `https://app.pinata.cloud/pinmanager?search=${result.IpfsHash}`,
          size: result.PinSize,
          timestamp: result.Timestamp
        }
        
        console.log("✅ IPFS upload successful:", {
          hash: ipfsData.hash,
          size: ipfsData.size,
          url: ipfsData.url
        })
      } else {
        throw new Error("PINATA_JWT not configured")
      }
    } catch (ipfsError) {
      console.error("❌ IPFS upload failed:", ipfsError)
      return NextResponse.json({ 
        error: "IPFS upload failed",
        message: "Failed to upload metadata to IPFS",
        details: ipfsError instanceof Error ? ipfsError.message : "Unknown IPFS error"
      }, { status: 500 })
    }

    console.log("⛓️ Step 2: Minting NFT on Starknet...")
    
    // Return IPFS data and let the frontend handle the minting
    return NextResponse.json({ 
      success: true,
      message: "Metadata uploaded to IPFS successfully",
      ipfsData: {
        hash: ipfsData.hash,
        url: ipfsData.url,
        pinataUrl: ipfsData.pinataUrl
      },
      metadata: tokenMetadata,
      mintingInfo: {
        contractAddress,
        recipientAddress: walletAddress,
        instructions: "Frontend should now mint the NFT using the Starknet wallet"
      }
    }, { status: 200 })

  } catch (error) {
    console.error("❌ Error in Twitter post tokenization:", error)
    return NextResponse.json({ 
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      details: "Check server logs for more information"
    }, { status: 500 })
  }
}