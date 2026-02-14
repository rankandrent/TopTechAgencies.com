import { MetadataRoute } from 'next'
import { SERVICES, CITIES } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://toptechagencies.com'
    const now = new Date()

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/methodology`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]

    // Service hub pages: /services/[service-slug]
    const servicePages: MetadataRoute.Sitemap = SERVICES.map(service => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // Service + City pages: /services/[service-slug]/[city-slug]
    const serviceCityPages: MetadataRoute.Sitemap = SERVICES.flatMap(service =>
        CITIES.map(city => ({
            url: `${baseUrl}/services/${service.slug}/${city.slug}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))
    )

    // Blog pages
    const blogPages: MetadataRoute.Sitemap = CITIES.map(city => ({
        url: `${baseUrl}/blog/top-ui-ux-design-agencies-in-${city.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    // Individual Agency Pages
    // Note: We can fetch these from Prisma or constants. 
    // Since we want dynamic, we'll need to make this sitemap async in Next.js 13+
    // But sitemap() can return a Promise.

    return [...staticPages, ...servicePages, ...serviceCityPages, ...blogPages]
}

// To properly handle async sitemap with Prisma, we'd need to change the function signature
// but for now, the user specifically asked for company.xml which I already created.
// I will keep company.xml as the primary way for programmatic pages as requested.
