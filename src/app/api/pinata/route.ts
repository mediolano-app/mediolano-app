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
    // Log specialized error information for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Pinata API ERROR:", {
      message: errorMessage,
      timestamp: new Date().toISOString()
    });

    let status = 500;
    let userMessage = "Error creating signed URL";

    if (errorMessage.includes("plan limits") || errorMessage.includes("403")) {
      status = 403;
      userMessage = "Pinata account limits surpassed. Please check your storage at pinata.cloud";
    }

    return NextResponse.json(
      {
        message: userMessage,
        error: errorMessage
      },
      { status: status }
    );
  }
}
