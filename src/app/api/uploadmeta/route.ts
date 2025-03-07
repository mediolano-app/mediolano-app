// app/api/upload-metadata/route.ts
import { NextResponse } from "next/server";
import { uploadMetadataToPinata } from "@/utils/pinataClient";


export async function POST(request: Request) {
    console.log("API Route /api/upload-metadata hit");
    try {
      const metadata = await request.json();
      console.log("Received metadata:", metadata);
      const ipfsUri = await uploadMetadataToPinata(metadata);
      console.log("Pinata response:", ipfsUri);
      return NextResponse.json({ ipfsUri });
    } catch (error) {
      console.error("Error in /api/upload-metadata:", error);
      return NextResponse.error();
    }
  }
