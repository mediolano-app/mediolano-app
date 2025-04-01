import { TwitterApi } from 'twitter-api-v2'
import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get('address');
    // console.log("GOod here")

    if (!address) {
        return NextResponse.json(
            {error: 'Missing wallet address'},
            { status: 400 }
        )
    }

    try {
        // console.log("tRYING ... CONNECT/ROUTE.TS")

        const userClient = new TwitterApi({
            appKey: 'cHPUBUBZsQS4c9IcrELUQdohx',
            appSecret: '1DmuRzs9nKEhRKehWCeNSRtgduJfBPBAnbbkBX9KZN8iIrjU7C',
        })

        // console.log("App credentials declared")
    
        // console.log("If this comes out, this is where it failed")
        const {
            url, oauth_token, oauth_token_secret
        } = await userClient.generateAuthLink('https://ip.mediolano.app')
        // console.log("After failure point")
        // console.log(url)
        // console.log(oauth_token)
        // console.log(oauth_token_secret)
    
        // console.log("App credentials worked")
        // console.log('generate auth link worked')

        const authData = {
            oauth_token, oauth_token_secret, timestamp: Date.now(), address
        }
    
        const storageObject = {
            tokenSecret: oauth_token_secret, address
        }
        // console.log("The code got here")
        // await kv.set(`auth:${oauth_token}`, storageObject, { ex: 3600 })
        // console.log("Redis storage operation successful")
        const currentUser = await userClient.currentUser();
        // console.log(currentUser)

        return NextResponse.json({ authUrl: url, data: currentUser })
    } catch (err) {
        // console.log("The catch block took this")
        console.error("An error occured: ", err)
        return NextResponse.json(
            { error: "Failed to Instantiate X connection" },
            { status: 500 }
        )
    }
}