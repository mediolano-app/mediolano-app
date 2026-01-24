import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mediolano.app'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/portfolio', '/settings', '/account', '/transfer'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
