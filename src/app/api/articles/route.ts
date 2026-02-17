import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const search = searchParams.get('search')

        const where: any = {}
        if (status) where.status = status
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ]
        }

        const articles = await prisma.article.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
        })

        return NextResponse.json({ success: true, data: articles })
    } catch (error) {
        console.error('Failed to fetch articles:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch articles' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, slug, content, excerpt, metaTitle, metaDescription, featuredImage, author, status, tags } = body

        // Validate required fields
        if (!title || !slug) {
            return NextResponse.json(
                { success: false, error: 'Title and Slug are required' },
                { status: 400 }
            )
        }

        // Check if slug exists
        const existing = await prisma.article.findUnique({ where: { slug } })
        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Slug already exists' },
                { status: 400 }
            )
        }

        const article = await prisma.article.create({
            data: {
                title,
                slug,
                content: content || '',
                excerpt: excerpt || '',
                metaTitle: metaTitle || title,
                metaDescription: metaDescription || excerpt,
                featuredImage,
                author: author || 'Top Tech Agencies Team',
                status: status || 'DRAFT',
                publishedAt: status === 'PUBLISHED' ? new Date() : null,
                tags: tags || [],
            },
        })

        return NextResponse.json({ success: true, data: article })
    } catch (error) {
        console.error('Failed to create article:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create article' },
            { status: 500 }
        )
    }
}
