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

    // Verify the Privy access token and extract user_id
    const { user_id } = await privy.utils().auth().verifyAccessToken(token);

    // Look for an existing Starknet wallet owned by this user
    let starknetWallet = null;
    for await (const w of privy.wallets().list({
      user_id,
      chain_type: "starknet",
    })) {
      starknetWallet = w;
      break;
    }

    // Create one if not found
    if (!starknetWallet) {
      starknetWallet = await privy.wallets().create({
        chain_type: "starknet",
        owner: { user_id },
      });
    }

    return NextResponse.json({
      wallet: {
        id: starknetWallet.id,
        publicKey: (starknetWallet as { public_key?: string }).public_key ?? "",
      },
    });
  } catch (err) {
    console.error("[/api/wallet/starknet]", err);
    return NextResponse.json(
      { error: "Failed to get or create Starknet wallet" },
      { status: 500 }
    );
  }
}
