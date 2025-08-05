import { NextRequest, NextResponse } from "next/server";
import { pinataClient } from "@/utils/pinataClient";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, fileName } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    let url: URL;
    try {
      url = new URL(imageUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Only allow HTTP/HTTPS URLs
    if (!['http:', 'https:'].includes(url.protocol)) {
      return NextResponse.json(
        { error: "Only HTTP/HTTPS URLs are allowed" },
        { status: 400 }
      );
    }

    // Fetch image from URL
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mediolano-Image-Uploader/1.0',
      },
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: 400 }
      );
    }

    // Validate content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: "URL does not point to a valid image" },
        { status: 400 }
      );
    }

    // Get image data
    const imageBuffer = await response.arrayBuffer();
    
    // Validate file size (max 10MB)
    if (imageBuffer.byteLength > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image file is too large (max 10MB)" },
        { status: 400 }
      );
    }

    // Create file object for Pinata
    const fileExtension = contentType.split('/')[1] || 'png';
    const finalFileName = fileName || `image-${Date.now()}.${fileExtension}`;
    
    const fileObject = new File([imageBuffer], finalFileName, { 
      type: contentType,
      lastModified: Date.now(),
    });

    // Upload to IPFS via Pinata
    const uploadResponse = await pinataClient.upload.file(fileObject, {
      pinataMetadata: { 
        name: finalFileName,
        keyvalues: {
          source: 'url-upload',
          originalUrl: imageUrl,
        }
      },
    } as any);

    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${uploadResponse.IpfsHash}`;

    return NextResponse.json({
      success: true,
      ipfsUrl,
      cid: uploadResponse.IpfsHash,
      fileName: finalFileName,
      originalUrl: imageUrl,
    });

  } catch (error) {
    console.error('Error uploading image from URL:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: "Request timeout - image took too long to fetch" },
          { status: 408 }
        );
      }
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { error: "Failed to fetch image from URL" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 