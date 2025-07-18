import { NextRequest, NextResponse } from "next/server";
import { pinataClient } from "@/utils/pinataClient";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Received asset data:", data);

    const {
      title,
      author,
      description,
      type, 
      template,
      collection,
      tags,
      mediaUrl,
      externalUrl,
      licenseType,
      licenseDetails,
      version,
      commercialUse,
      modifications,
      attribution,
      filesCount,
      transaction,
      registrationDate,
      licenseDuration,
      licenseTerritory,
    } = data;

    let tagsArray: string[] = [];
    if (typeof tags === "string") {
      tagsArray = tags.split(",").map((t: string) => t.trim()).filter(Boolean);
    } else if (Array.isArray(tags)) {
      tagsArray = tags;
    }


    let processedMediaUrl = mediaUrl;
    if (typeof mediaUrl === "string" && mediaUrl.startsWith("data:")) {
        const base64Marker = "base64,";
        const index = mediaUrl.indexOf(base64Marker);
        if (index !== -1) {
        const base64Data = mediaUrl.substring(index + base64Marker.length);
        const fileBuffer = Buffer.from(base64Data, "base64");

        // Create a Blob
        const blob = new Blob([fileBuffer], { type: "image/png" });
        // Upgrade the Blob to a File-like object by adding name and lastModified properties
        const fileObject = Object.assign(blob, {
            name: `${title}-media.png`,
            lastModified: Date.now(),
        });
        
        const fileUploadResponse = await pinataClient.upload.file(fileObject, {
            // Cast to any if needed for TypeScript
            pinataMetadata: { name: `${title}-media` },
        } as any);
        
        processedMediaUrl = `https://gateway.pinata.cloud/ipfs/${fileUploadResponse.IpfsHash}`;
        }
    }

    const attributes = [
      { trait_type: "Type", value: type },
      { trait_type: "Template", value: template },
      { trait_type: "Author", value: author },
      { trait_type: "Collection", value: collection },
      { trait_type: "License", value: licenseType },
      { trait_type: "License-Details", value: licenseDetails },
      { trait_type: "Version", value: version },
      { trait_type: "Commercial", value: commercialUse ? "Yes" : "No" },
      { trait_type: "Modifications", value: modifications },
      { trait_type: "Attribution", value: attribution },
      { trait_type: "Files", value: filesCount.toString() },
      { trait_type: "Tags", value: tagsArray.join(", ") },
      { trait_type: "Duration", value: licenseDuration || "N/A" },
      { trait_type: "Territory", value: licenseTerritory || "N/A" },
      { trait_type: "Registration", value: registrationDate },
    ];


    if (transaction) {
      // attributes.push({ trait_type: "Transaction Hash", value: transaction.hash });
      // attributes.push({ trait_type: "Block Number", value: transaction.blockNumber.toString() });
      attributes.push({ trait_type: "Network", value: transaction.network });
      attributes.push({ trait_type: "Address", value: transaction.contractAddress });
    }

    const formattedAsset = {
      name: title,
      description,
      external_url: externalUrl,
      image: processedMediaUrl,
      attributes,
    };

    const uploadData = await pinataClient.upload.json(formattedAsset);

    return NextResponse.json({ uploadData }, { status: 200 });
  } catch (error) {
    console.error("Error in asset registration:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}