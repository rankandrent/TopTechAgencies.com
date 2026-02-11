import { Container } from '@/components/layout/Container'
import { H2, H3, P } from '@/components/ui/Typography'
import { TagBadge } from '@/components/ui/TagBadge'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function BlogPreview() {
    const posts = [
        {
            title: "Top 10 UI/UX Design Agencies in New York (2025)",
            excerpt: "A curated list of the best design partners for your next project in the Big Apple.",
            city: "New York",
            slug: "top-ui-ux-design-agencies-in-new-york",
            date: "Oct 12, 2024"
        },
        {
            title: "Top 10 UI/UX Design Agencies in San Francisco",
            excerpt: "Finding the right product design agency in the tech capital of the world.",
            city: "San Francisco",
            slug: "top-ui-ux-design-agencies-in-san-francisco",
            date: "Nov 05, 2024"
        },
        {
            title: "Top 10 UI/UX Design Agencies in Austin",
            excerpt: "What look for when hiring local design talent in Texas.",
            city: "Austin",
            slug: "top-ui-ux-design-agencies-in-austin",
            date: "Sep 28, 2024"
        }
    ]

    return (
        <section className="py-40 bg-bg-secondary border-t border-border-light">
            <Container>
                <div className="flex items-end justify-between mb-12">
                    <H2 className="border-none mb-0">Latest from the Blog</H2>
                    <Link href="/blog" className="hidden md:flex items-center text-text-primary font-medium hover:text-accent-peach-text transition-colors">
                        View all posts <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col h-full">
                            <div className="mb-4 aspect-[4/3] w-full rounded-2xl bg-gray-100 overflow-hidden relative">
                                {/* Placeholder for image */}
                                <div className="absolute inset-0 bg-accent-peach/20 group-hover:bg-accent-peach/30 transition-colors" />
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <TagBadge color="peach">Article</TagBadge>
                                <span className="text-xs text-text-muted uppercase tracking-wider">{post.date}</span>
                            </div>
                            <H3 className="mb-2 text-xl group-hover:text-accent-peach-text transition-colors">{post.title}</H3>
                            <P className="text-sm line-clamp-3">{post.excerpt}</P>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 md:hidden text-center">
                    <Link href="/blog" className="inline-flex items-center text-text-primary font-medium">
                        View all posts <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </Container>
        </section>
    )
}
