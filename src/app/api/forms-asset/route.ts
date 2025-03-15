import { NextRequest, NextResponse } from "next/server";
import { pinataClient } from "@/utils/pinataClient";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();

    const requiredFields = [
      "title",
      "description",
      "assetType",
      "mediaUrl",
      "tags",
      "license",
      "isLimited",
      "totalSupply",
      "collection",
      "ipVersion",
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
    const description = data.get("description") as string;
    const assetType = data.get("assetType") as string;
    const mediaUrl = data.get("mediaUrl") as string;
    const tagsString = data.get("tags") as string;
    const tags = tagsString.split(",").map((tag) => tag.trim()).filter(Boolean);
    const license = data.get("license") as string;
    const isLimited = data.get("isLimited") === "1";
    const totalSupply = parseInt(data.get("totalSupply") as string, 10);
    const collection = data.get("collection") as string;
    const ipVersion = data.get("ipVersion") as string;

    let fileIpfsHash: string | undefined = undefined;
    if (data.has("uploadFile")) {
      const file = data.get("uploadFile") as File;
      if (file && file.size > 0) {
        const fileUploadResponse = await pinataClient.upload.file(file);
        fileIpfsHash = fileUploadResponse.IpfsHash;
      }
    }

    const assetObject: Record<string, unknown> = {
      title,
      description,
      assetType,
      mediaUrl,
      tags,
      license,
      isLimited,
      totalSupply,
      collection,
      ipVersion,
    };

    if (fileIpfsHash) {
      assetObject.fileIpfsHash = fileIpfsHash;
    }

    const uploadData = await pinataClient.upload.json(assetObject);
    return NextResponse.json({ uploadData }, { status: 200 });
  } catch (error) {
    console.error("Error in asset registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}