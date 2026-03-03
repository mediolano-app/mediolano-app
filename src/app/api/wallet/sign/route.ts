import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/node";

const privy = new PrivyClient({
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  appSecret: process.env.PRIVY_APP_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer /, "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the access token before signing
    await privy.utils().auth().verifyAccessToken(token);

    const { walletId, hash } = (await req.json()) as {
      walletId: string;
      hash: string;
    };

    if (!walletId || !hash) {
      return NextResponse.json(
        { error: "Missing walletId or hash" },
        { status: 400 }
      );
    }

    const result = await privy.wallets().rawSign(walletId, {
      params: { hash },
    });

    return NextResponse.json({ signature: result.signature });
  } catch (err) {
    console.error("[/api/wallet/sign]", err);
    return NextResponse.json({ error: "Signing failed" }, { status: 500 });
  }
}
