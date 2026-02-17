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

    return [...staticPages, ...servicePages, ...serviceCityPages, ...blogPages]
}
