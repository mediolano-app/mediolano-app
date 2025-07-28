import { pinata } from "@/services/config/server.config";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = await pinata.upload.public.createSignedURL({
      expires: 30, // The only required param
    });
    return NextResponse.json({ url: url }, { status: 200 });
  } catch (error) {
    console.error("Pinata API Error:", error);
    return NextResponse.json(
      { 
        text: "Error creating signed URL", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
