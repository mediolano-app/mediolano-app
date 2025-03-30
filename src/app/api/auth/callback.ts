import { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";

export default async function handler(
    req: NextApiRequest, res: NextApiResponse
){
    const { oauth_token, oauth_verifier } = req.query;
    const session = req.session.get('X_auth')

    if (!oauth_token || !oauth_verifier || !session?.oauth_token_secret) {
        return res.status(400).json({ error: 'Invalid Tokens' })
    }

    const userClient = new TwitterApi({
        appKey: 'cHPUBUBZsQS4c9IcrELUQdohx',
        appSecret: '1DmuRzs9nKEhRKehWCeNSRtgduJfBPBAnbbkBX9KZN8iIrjU7C',
        accessToken: oauth_token as string,
        accessSecret: session?.oauth_token_secret
    });

    try {
        // persistent access credentials
        const { accessToken, accessSecret } = await userClient.login(oauth_verifier as string)

        const xClient = new TwitterApi({
            appKey: 'cHPUBUBZsQS4c9IcrELUQdohx',
            appSecret: '1DmuRzs9nKEhRKehWCeNSRtgduJfBPBAnbbkBX9KZN8iIrjU7C',
            accessToken,
            accessSecret
        });

        const { default_profile } = await xClient.v1.verifyCredentials();

        console.log(default_profile)

    } catch (err) {

    }

}