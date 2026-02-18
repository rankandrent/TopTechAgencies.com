import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/scripts/', '/_next/', '/admin/', '/login', '/auth/', '/dashboard/'],
            },
        ],
        sitemap: [
            'https://toptechagencies.com/sitemap.xml',
            'https://toptechagencies.com/agency.xml',
            'https://toptechagencies.com/company.xml',
        ],
    }
}
