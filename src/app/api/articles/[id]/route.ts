import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

interface RouteParams {
    params: Promise<{
        id: string
    }>
}

export async function GET(
    request: Request,
    { params }: RouteParams
) {
    try {
        const { id } = await params
        const article = await prisma.article.findUnique({
            where: { id },
        })

        if (!article) {
            return NextResponse.json(
                { success: false, error: 'Article not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: article })
    } catch (error) {
        console.error('Failed to fetch article:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch article' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: Request,
    { params }: RouteParams
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { title, slug, content, excerpt, metaTitle, metaDescription, featuredImage, author, status, tags } = body

        // Log update attempt
        console.log(`Updating article ${id} with status: ${status}`);

        const updateData: any = {
            title,
            slug,
            content,
            excerpt,
            metaTitle,
            metaDescription,
            featuredImage,
            author,
            status,
            tags
        }

        if (status === 'PUBLISHED') {
            const currentArticle = await prisma.article.findUnique({
                where: { id },
                select: { publishedAt: true }
            })

            // Only set publishedAt if not already set
            if (!currentArticle?.publishedAt) {
                updateData.publishedAt = new Date()
            }
        } else if (status === 'DRAFT') {
            // Optional: Unpublish logic if needed, usually we keep publishedAt
        }

        const article = await prisma.article.update({
            where: { id },
            data: updateData,
        })

        console.log(`Article updated successfully: ${article.slug}`);

        return NextResponse.json({ success: true, data: article })
    } catch (error) {
        console.error('Failed to update article:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update article' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: RouteParams
) {
    try {
        const { id } = await params
        await prisma.article.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete article:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete article' },
            { status: 500 }
        )
    }
}
