import { NextApiRequest, NextApiResponse } from 'next';
import { TwitterApi } from 'twitter-api-v2'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userClient = new TwitterApi({
        appKey: 'cHPUBUBZsQS4c9IcrELUQdohx',
        appSecret: '1DmuRzs9nKEhRKehWCeNSRtgduJfBPBAnbbkBX9KZN8iIrjU7C',
    })

    const {
        url, oauth_token, oauth_token_secret
    } = await userClient.generateAuthLink(process.env.X_CALLBACK_URL)

    // req.session.set('X_auth', { oauth_token, oauth_token_secret })

    res.redirect(url)
}