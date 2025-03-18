import { NextRequest, NextResponse } from "next/server";
import { pinataClient } from "@/utils/pinataClient";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();

    const requiredFields = [
      "title",
      "artistName",
      "medium",
      "dimensions",
      "yearCreated",
      "description",
      "price",
      "mediaUrl",
      "externalUrl",
      
    ];

    for (const field of requiredFields) {
      if (!data.has(field)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const title = data.get("title") as string;
    const artistName = data.get("artistName") as string;
    const medium = data.get("medium") as string;
    const dimensions = data.get("dimensions") as string;
    const yearCreated = parseInt(data.get("yearCreated") as string, 10);
    const description = data.get("description") as string;
    const price = data.get("price") as string;
    const mediaUrl = data.get("mediaUrl") as string;
    const externalUrl = data.get("externalUrl") as string;

    let fileIpfsHash: string | undefined = undefined;
    if (data.has("uploadFile")) {
      const file = data.get("uploadFile") as File;
      if (file && file.size > 0) {
        const fileUploadResponse = await pinataClient.upload.file(file);
        fileIpfsHash = fileUploadResponse.IpfsHash;
      }
    }

    const imageUrl = fileIpfsHash
      ? `https://gateway.pinata.cloud/ipfs/${fileIpfsHash}`
      : "";

    const attributes = [
      { trait_type: "Artist Name", value: artistName },
      { trait_type: "Medium", value: medium },
      { trait_type: "Dimensions", value: dimensions },
      { trait_type: "Year Created", value: yearCreated.toString() },
      { trait_type: "Price", value: price },
    ];

    const formattedArt = {
      name: title,
      description,
      external_url: externalUrl,
      image: mediaUrl,
      attributes,
    };

    const uploadData = await pinataClient.upload.json(formattedArt);
    return NextResponse.json({ uploadData }, { status: 200 });
  } catch (error) {
    console.error("Error in art registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}