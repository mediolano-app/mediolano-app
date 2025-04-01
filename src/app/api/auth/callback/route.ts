import { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";
import * as fs from 'fs'
import path from "path";
import { NextResponse } from "next/server";

export async function GET(
    req: Request
){
    console.log("This started")
    const { searchParams } = new URL(req.url)
    const oauth_token = searchParams.get('oauth_token');
    const oauth_verifier = searchParams.get('oauth_verifier');
    
    const authStorePath = path.join(process.cwd(), 'tmp/auth-store.json')
    const authStore = JSON.parse(fs.readFileSync(authStorePath, 'utf8'));
    const authData = authStore[oauth_token as string]

    if (!oauth_token || !oauth_verifier || authData) {
        return NextResponse.redirect(new URL('/profile?error=invalid_tokens', req.url))
    }

    
    try {
        
        const userClient = new TwitterApi({
            appKey: 'cHPUBUBZsQS4c9IcrELUQdohx',
            appSecret: '1DmuRzs9nKEhRKehWCeNSRtgduJfBPBAnbbkBX9KZN8iIrjU7C',
            accessToken: oauth_token as string,
            accessSecret: authData?.oauth_token_secret
        });

        // persistent access credentials
        const { accessToken, accessSecret } = await userClient.login(oauth_verifier as string)

        const xClient = new TwitterApi({
            appKey: 'cHPUBUBZsQS4c9IcrELUQdohx',
            appSecret: '1DmuRzs9nKEhRKehWCeNSRtgduJfBPBAnbbkBX9KZN8iIrjU7C',
            accessToken,
            accessSecret
        });

        const { name } = await xClient.currentUser();

        return NextResponse.redirect(new URL('/profile?connected=true', req.url))

    } catch (err) {
        return NextResponse.redirect(new URL('/profile?error=auth_failed', req.url))
    }

}