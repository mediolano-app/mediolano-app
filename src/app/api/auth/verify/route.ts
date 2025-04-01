import { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";

export default async function handler(
    req: NextApiRequest, res: NextApiResponse
){
    // const { address } = req.query;
    // const authStore = JSON.parse(fs.readFileSync('tmp/auth-store.json', 'utf8'));
    // const authData = authStore[oauth_token as string]

    try {
        const xClient = new TwitterApi({
            appKey: 'cHPUBUBZsQS4c9IcrELUQdohx',
            appSecret: '1DmuRzs9nKEhRKehWCeNSRtgduJfBPBAnbbkBX9KZN8iIrjU7C',
            accessToken,
            accessSecret
        });

        const user = await xClient.currentUser()
        const isVerified = user.verified;

        return {
            verified: isVerified
        }
    } catch (err) {
        console.error("Verification check failed", err)
    }
}