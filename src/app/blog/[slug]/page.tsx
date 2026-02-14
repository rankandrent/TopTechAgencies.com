import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { RelatedLinks } from '@/components/services/RelatedLinks'
import { Container } from '@/components/layout/Container'
import { H1, H2, P } from '@/components/ui/Typography'
import { AgencyEntry } from '@/components/blog/AgencyEntry'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { CITIES } from '@/lib/constants'
import { SemanticSchema } from '@/components/seo/SemanticSchema'
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import prisma from '@/lib/db'

// Fallback data - only used if DB has no entries for a city
const FALLBACK_AGENCIES = [
    {
        rank: 1,
        name: "tkxel",
        slug: "tkxel",
        tagline: "Top-Rated Digital Transformation Partner",
        clutchRating: 5.0,
        websiteUrl: "https://tkxel.com",
        services: ["Software Development", "UI/UX Design", "Mobile Apps", "AI Solutions"],
        description: "tkxel is a leading technology partner for Fortune 500s and ambitious startups. With 15+ years of excellence, they craft award-winning digital experiences that drive real business growth. Their design philosophy blends aesthetic brilliance with data-driven usability.",
        whyChoose: "tkxel stands out for its **holistic approach**—combining world-class design with robust engineering. They don't just design interfaces; they build **scalable digital ecosystems**. With 700+ experts and 24/7 support, they act as a true extension of your team.",
        minProjectSize: "$25,000+",
        hourlyRate: "$25 - $49 / hr",
        employeesCount: "700+",
        yearFounded: "2008",
        reviewsCount: 85,
        clutchUrl: "tkxel",
    }
]

export async function generateStaticParams() {
    return CITIES.map((city) => ({
        slug: `top-ui-ux-design-agencies-in-${city.slug}`,
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const citySlug = slug.replace('top-ui-ux-design-agencies-in-', '')
    const city = CITIES.find(c => c.slug === citySlug)

    if (!city) return { title: 'Blog Post Not Found' }

    return {
        title: `Top 10 UI/UX Design Agencies in ${city.name} (2025) | Local Expert Review`,
        description: `Looking for the best design partner? We've reviewed the top 10 UI/UX design agencies in ${city.name} to help you find the right fit for your project.`,
        alternates: {
            canonical: `/blog/${slug}`,
        },
        openGraph: {
            title: `Top 10 UI/UX Design Agencies in ${city.name}`,
            description: `In-depth review of the best design agencies in ${city.name}.`,
            type: 'article',
            publishedTime: '2025-02-10T00:00:00.000Z',
            authors: ['TopTechAgencies Editorial Team'],
            images: [{ url: `/og/blog/${slug}`, width: 1200, height: 630 }],
        }
    }
}

export const revalidate = 60;

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    // Parse city from slug
    const citySlug = slug.replace('top-ui-ux-design-agencies-in-', '')
    const city = CITIES.find(c => c.slug === citySlug)

    if (!city) {
        return <div>Post not found</div>
    }

    // Fetch agencies from DB (with fallback)
    const blogPost = await prisma.blogPost.findUnique({
        where: { slug },
        include: {
            agencies: {
                include: {
                    agency: true
                },
                orderBy: {
                    rank: 'asc'
                }
            }
        }
    })

    const agencies = blogPost ? blogPost.agencies.map(entry => ({
        rank: entry.rank,
        name: entry.agency.name,
        slug: entry.agency.slug,
        tagline: entry.agency.tagline,
        clutchRating: entry.agency.clutchRating,
        websiteUrl: entry.agency.websiteUrl,
        services: entry.agency.services,
        description: entry.overview || entry.agency.description,
        whyChoose: entry.whyChoose || entry.agency.longDescription,
        minProjectSize: entry.agency.minProjectSize,
        hourlyRate: entry.agency.avgHourlyRate,
        employeesCount: entry.agency.teamSize,
        yearFounded: entry.agency.founded,
        reviewsCount: entry.agency.reviewCount,
        clutchUrl: entry.agency.clutchUrl,
        location: `${entry.agency.city}, ${entry.agency.state || ''}`
    })) : FALLBACK_AGENCIES;

    const tocItems = agencies.map((agency: any) => ({
        id: agency.name.toLowerCase().replace(/\s+/g, '-'),
        title: agency.name,
        rank: agency.rank
    }))

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <SemanticSchema
                type="Article"
                data={{
                    headline: `Top 10 UI/UX Design Agencies in ${city.name}`,
                    image: `/og/blog/${slug}`,
                    datePublished: '2025-02-10T00:00:00.000Z',
                    dateModified: new Date().toISOString(),
                    authorName: 'TopTechAgencies Editorial Team'
                }}
            />
            <Navbar />

            <main className="flex-grow">
                <section className="pt-32 pb-20 bg-bg-secondary border-b border-border-light">
                    <Container className="max-w-4xl">
                        <SemanticSchema type="BreadcrumbList" data={[
                            { name: 'Home', url: '/' },
                            { name: 'Blog', url: '/blog' },
                            { name: slug, url: `/blog/${slug}` }
                        ]} />

                        <div className="mt-8">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Top 10 UI/UX Design Agencies in <span className="text-accent-peach-text">{city.name}, {city.state}</span>
                            </h1>
                            <div className="flex items-center gap-4 text-text-secondary">
                                <span>Updated Feb 2026</span>
                                <span>•</span>
                                <span>12 min read</span>
                            </div>
                        </div>
                    </Container>
                </section>

                <section className="py-20 bg-bg-primary">
                    <Container className="max-w-screen-xl">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                            <aside className="lg:col-span-1 hidden lg:block">
                                <div className="sticky top-24">
                                    <TableOfContents items={tocItems} />
                                </div>
                            </aside>

                            <div className="lg:col-span-3">
                                <SemanticSchema type="ItemList" data={{
                                    title: `Top Agencies in ${city.name}`,
                                    description: `List of top UI/UX agencies in ${city.name}`,
                                    items: agencies.map((a: any) => ({ name: a.name, url: a.websiteUrl }))
                                }} />

                                <div className="prose prose-lg max-w-none mb-16">
                                    <p>
                                        Finding the right design partner in {city.name} can be challenging.
                                        We&apos;ve analyzed dozens of agencies based on their portfolio quality,
                                        client reviews, and market presence to bring you this curated list.
                                    </p>
                                </div>

                                <div className="space-y-20">
                                    {agencies.map((agency: any, index: number) => (
                                        <AgencyEntry
                                            key={agency.rank}
                                            rank={agency.rank}
                                            isProminent={index === 0}
                                            name={agency.name}
                                            slug={agency.slug}
                                            tagline={agency.tagline}
                                            clutchRating={agency.clutchRating}
                                            websiteUrl={agency.websiteUrl}
                                            services={agency.services}
                                            description={agency.description}
                                            whyChoose={agency.whyChoose}
                                            minProjectSize={agency.minProjectSize || "$10,000+"}
                                            hourlyRate={agency.hourlyRate || "$100 - $149 / hr"}
                                            employeesCount={agency.employeesCount || "10 - 49"}
                                            yearFounded={agency.yearFounded || "2015"}
                                            reviewsCount={agency.reviewsCount || 12}
                                            clutchUrl={agency.clutchUrl || "#"}
                                            location={agency.location}
                                        />
                                    ))}
                                </div>

                                <div className="mt-24 p-10 rounded-3xl bg-accent-peach/10 border border-accent-peach/30">
                                    <H2 className="border-none mb-6">Need help choosing?</H2>
                                    <P className="mb-8">
                                        If you&apos;re still unsure which agency is right for your project in {city.name},
                                        our team is happy to provide a free consultation to help you evaluate your options.
                                    </P>
                                    <Link href="/contact" passHref>
                                        <Button variant="primary" size="lg">Free Consultation</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                <RelatedLinks
                    currentCity={city.name}
                    currentService="UI/UX Design"
                    currentCitySlug={city.slug}
                    currentServiceSlug="ui-ux-design-services"
                    currentCityState={city.state}
                />
            </main>
            <Footer />
        </div>
    )
}
