import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    const agencies = await prisma.agency.findMany({
        select: {
            slug: true,
            updatedAt: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    })

    const baseUrl = 'https://toptechagencies.com/agency'

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${agencies
            .map((agency) => {
                return `
            <url>
              <loc>${baseUrl}/${agency.slug}</loc>
              <lastmod>${agency.updatedAt.toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.8</priority>
            </url>
          `
            })
            .join('')}
    </urlset>
  `

    return new NextResponse(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        },
    })
}
