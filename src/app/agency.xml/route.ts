import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic'
export const revalidate = 86400 // Revalidate every 24 hours

function slugify(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

export async function GET() {
    const client = await clientPromise
    const db = client.db('search_tkxel')
    const collection = db.collection('agencies')

    const agencies = await collection.find(
        { table_name: 'agencies' },
        { projection: { name: 1 } }
    ).toArray()

    const baseUrl = 'https://toptechagencies.com'
    const now = new Date().toISOString()

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${agencies
            .filter((a: any) => a.name && a.name.trim())
            .map((agency: any) => `  <url>
    <loc>${baseUrl}/agency/${slugify(agency.name)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
            .join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        },
    })
}
