import Redis from 'ioredis'

export const redis = new Redis();

export async function storeSession(
    oauthToken: string, data: { tokenSecret: string, address: string }
){
    await redis.set(
        `auth:${oauthToken}`,
        JSON.stringify(data),
        'EX', 3600
    )
}
