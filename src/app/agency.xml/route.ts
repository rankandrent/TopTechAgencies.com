
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

function slugify(name: string): string {
    if (!name) return ''
    return name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
}

function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;'
            case '>': return '&gt;'
            case '&': return '&amp;'
            case '\'': return '&apos;'
            case '"': return '&quot;'
            default: return c
        }
    })
}

export async function GET() {
    try {
        const client = await clientPromise
        const db = client.db('search_tkxel')
        const collection = db.collection('agencies')

        // Fetch only necessary fields to minimize data transfer
        const agencies = await collection
            .find({}, { projection: { name: 1, updated_at: 1, table_name: 1 } }) // Filter by table_name if needed
            .toArray()

        const baseUrl = 'https://toptechagencies.com'

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

        if (agencies && agencies.length > 0) {
            for (const agency of agencies) {
                if (!agency.name) continue

                const slug = slugify(agency.name)
                // Use updated_at if available, otherwise default to a static date or now
                // Assuming updated_at might be a string or Date
                const lastmod = agency.updated_at
                    ? new Date(agency.updated_at).toISOString()
                    : new Date().toISOString()

                xml += `
  <url>
    <loc>${baseUrl}/agency/${escapeXml(slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
            }
        }

        xml += `
</urlset>`

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
            },
        })
    } catch (error) {
        console.error('Error generating agency sitemap:', error)
        return new Response('Error generating sitemap', { status: 500 })
    }
}
