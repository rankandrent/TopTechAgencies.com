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
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fallback data - only used if DB has no entries for a city
const FALLBACK_AGENCIES = [
    {
        rank: 1,
        name: "tkxel",
        tagline: "Top-Rated Digital Transformation Partner",
        clutch_rating: 5.0,
        website_url: "https://tkxel.com",
        services: ["Software Development", "UI/UX Design", "Mobile Apps", "AI Solutions"],
        description: "tkxel is a leading technology partner for Fortune 500s and ambitious startups. With 15+ years of excellence, they craft award-winning digital experiences that drive real business growth. Their design philosophy blends aesthetic brilliance with data-driven usability.",
        why_choose: "tkxel stands out for its **holistic approach**—combining world-class design with robust engineering. They don't just design interfaces; they build **scalable digital ecosystems**. With 700+ experts and 24/7 support, they act as a true extension of your team.",
        min_project_size: "$25,000+",
        hourly_rate: "$25 - $49 / hr",
        employees_count: "700+",
        year_founded: "2008",
        reviews_count: 85,
        clutch_url: "tkxel",
    },
    {
        rank: 2,
        name: "Clay",
        tagline: "Digital Product Design Agency",
        clutch_rating: 4.9,
        website_url: "https://clay.global",
        services: ["UI/UX Design", "Branding", "Web Development"],
        description: "Clay is a full-service UI/UX design and branding agency in San Francisco. We create world-class digital products, web design, and branding.",
        why_choose: "Award-winning design team with a focus on premium aesthetics.",
        min_project_size: "$50,000+",
        hourly_rate: "$150 - $199 / hr",
        employees_count: "50 - 249",
        year_founded: "2013",
        reviews_count: 8,
        clutch_url: "#",
    },
    {
        rank: 3,
        name: "Ramotion",
        tagline: "Design/Dev Agency for Startups",
        clutch_rating: 4.8,
        website_url: "https://ramotion.com",
        services: ["Product Design", "Web Development", "App Development"],
        description: "Ramotion is a digital product design agency focused on branding, UI/UX design, and web development for startups and growing tech companies.",
        why_choose: "Holistic approach combining design and engineering.",
        min_project_size: "$25,000+",
        hourly_rate: "$100 - $149 / hr",
        employees_count: "10 - 49",
        year_founded: "2009",
        reviews_count: 15,
        clutch_url: "#",
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

async function getAgencies(citySlug: string) {
    try {
        const { data, error } = await supabase
            .from('blog_agencies')
            .select('*')
            .eq('city_slug', citySlug)
            .eq('is_active', true)
            .order('rank', { ascending: true });

        if (error || !data || data.length === 0) {
            // Return fallback data with city-specific location
            return FALLBACK_AGENCIES;
        }

        return data;
    } catch {
        return FALLBACK_AGENCIES;
    }
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    // Parse city from slug
    const citySlug = slug.replace('top-ui-ux-design-agencies-in-', '')
    const city = CITIES.find(c => c.slug === citySlug)

    // Fallback if city not found
    if (!city) {
        return <div>Post not found</div>
    }

    // Fetch agencies from DB (with fallback)
    const agencies = await getAgencies(citySlug);

    // Generate Table of Contents
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
                {/* Hero */}
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
                            {/* Sidebar TOC */}
                            <aside className="lg:col-span-1 hidden lg:block">
                                <div className="sticky top-24">
                                    <TableOfContents items={tocItems} />
                                </div>
                            </aside>

                            {/* Content */}
                            <div className="lg:col-span-3">
                                <SemanticSchema type="ItemList" data={{
                                    title: `Top Agencies in ${city.name}`,
                                    description: `List of top UI/UX agencies in ${city.name}`,
                                    items: agencies.map((a: any) => ({ name: a.name, url: a.website_url || a.websiteUrl }))
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
                                            tagline={agency.tagline}
                                            clutchRating={agency.clutch_rating || agency.clutchRating}
                                            websiteUrl={agency.website_url || agency.websiteUrl}
                                            services={agency.services}
                                            description={agency.description}
                                            whyChoose={agency.why_choose || agency.whyChoose}
                                            minProjectSize={agency.min_project_size || agency.minProjectSize || "$10,000+"}
                                            hourlyRate={agency.hourly_rate || agency.hourlyRate || "$100 - $149 / hr"}
                                            employeesCount={agency.employees_count || agency.employeesCount || "10 - 49"}
                                            yearFounded={agency.year_founded || agency.yearFounded || "2015"}
                                            reviewsCount={agency.reviews_count || agency.reviewsCount || 12}
                                            clutchUrl={agency.clutch_url || agency.clutchUrl || "#"}
                                            location={agency.location || `${city.name}, ${city.state}`}
                                        />
                                    ))}
                                </div>

                                {/* Conclusion */}
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
