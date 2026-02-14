import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/db'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { H1, H2, H3, P } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import {
    Star,
    Send,
    DollarSign,
    Clock,
    Users,
    Calendar,
    MessageSquare,
    MapPin,
    Globe,
    ExternalLink,
    ShieldCheck,
    Award,
    Zap
} from 'lucide-react'
import Script from 'next/script'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const agency = await prisma.agency.findUnique({
        where: { slug }
    })

    if (!agency) return { title: 'Agency Not Found' }

    const title = `${agency.name} - Agency Profile | Top Tech Agencies`
    const description = agency.description.slice(0, 160)

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://toptechagencies.com/agency/${slug}`,
        }
    }
}

export async function generateStaticParams() {
    const agencies = await prisma.agency.findMany({
        select: { slug: true }
    })
    return agencies.map((agency) => ({
        slug: agency.slug,
    }))
}

export default async function AgencyPage({ params }: PageProps) {
    const { slug } = await params
    const agency = await prisma.agency.findUnique({
        where: { slug },
        include: {
            blogPosts: {
                include: {
                    blogPost: true
                }
            }
        }
    })

    if (!agency) notFound()

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: agency.name,
        description: agency.description,
        url: `https://toptechagencies.com/agency/${agency.slug}`,
        logo: agency.logoUrl,
        sameAs: [agency.clutchUrl, agency.websiteUrl].filter(Boolean),
        address: {
            '@type': 'PostalAddress',
            addressLocality: agency.city,
            addressRegion: agency.state,
            addressCountry: agency.country
        },
        aggregateRating: agency.clutchRating ? {
            '@type': 'AggregateRating',
            ratingValue: agency.clutchRating,
            reviewCount: agency.reviewCount || 0,
            bestRating: 5,
            worstRating: 1
        } : undefined
    }

    const getFaviconUrl = (url: string) => {
        try {
            const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch {
            return null;
        }
    };

    const faviconUrl = agency.websiteUrl ? getFaviconUrl(agency.websiteUrl) : null;

    return (
        <div className="min-h-screen bg-bg-primary">
            <Script
                id="agency-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="pt-24 pb-20">
                <Container>
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-text-muted mb-8 overflow-x-auto whitespace-nowrap pb-2">
                        <a href="/" className="hover:text-accent-peach transition-colors">Home</a>
                        <span>/</span>
                        <a href="/services" className="hover:text-accent-peach transition-colors">Agencies</a>
                        <span>/</span>
                        <span className="text-text-primary font-medium">{agency.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Hero Section */}
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white border border-border-light p-4 flex-shrink-0 shadow-sm">
                                    {faviconUrl ? (
                                        <img
                                            src={faviconUrl}
                                            alt={`${agency.name} logo`}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-accent-peach/10 flex items-center justify-center text-accent-peach font-bold text-3xl rounded-xl">
                                            {agency.name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-grow space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <H1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{agency.name}</H1>
                                        {agency.clutchRating && (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-bold border border-yellow-200">
                                                <Star className="h-4 w-4 fill-current" />
                                                <span>{agency.clutchRating.toFixed(1)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <P className="text-xl text-text-secondary leading-relaxed max-w-2xl">
                                        {agency.tagline || `${agency.name} is a leading agency based in ${agency.city}${agency.state ? `, ${agency.state}` : ''}.`}
                                    </P>

                                    <div className="flex flex-wrap gap-4 pt-2">
                                        {agency.websiteUrl && (
                                            <Button variant="primary" asChild>
                                                <a href={agency.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                    Visit Website <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}
                                        <Button variant="outline" className="border-border-light">
                                            Get a Quote
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <section className="space-y-6 pt-8 border-t border-border-light">
                                <H2 className="text-3xl font-bold flex items-center gap-3">
                                    <ShieldCheck className="w-8 h-8 text-accent-peach" />
                                    About {agency.name}
                                </H2>
                                <div className="prose prose-lg max-w-none text-text-primary">
                                    <P>{agency.description}</P>
                                    {agency.longDescription && (
                                        <div className="mt-6 whitespace-pre-wrap">
                                            {agency.longDescription}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Services & Expertise */}
                            <section className="space-y-6 pt-8 border-t border-border-light">
                                <H2 className="text-3xl font-bold flex items-center gap-3">
                                    <Zap className="w-8 h-8 text-accent-peach" />
                                    Services & Expertise
                                </H2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-6 rounded-2xl bg-bg-secondary border border-border-light">
                                        <H3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                            <Award className="w-5 h-5 text-accent-peach" />
                                            Core Services
                                        </H3>
                                        <div className="flex flex-wrap gap-2">
                                            {agency.services.map(service => (
                                                <span key={service} className="px-3 py-1.5 bg-white border border-border-light rounded-lg text-sm font-medium text-text-primary">
                                                    {service}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {agency.industries && agency.industries.length > 0 && (
                                        <div className="p-6 rounded-2xl bg-bg-secondary border border-border-light">
                                            <H3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                <Users className="w-5 h-5 text-accent-peach" />
                                                Industries Served
                                            </H3>
                                            <div className="flex flex-wrap gap-2">
                                                {agency.industries.map(industry => (
                                                    <span key={industry} className="px-3 py-1.5 bg-white border border-border-light rounded-lg text-sm font-medium text-text-primary">
                                                        {industry}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Notable Clients */}
                            {agency.notableClients && agency.notableClients.length > 0 && (
                                <section className="space-y-6 pt-8 border-t border-border-light">
                                    <H2 className="text-3xl font-bold">Notable Clients</H2>
                                    <div className="flex flex-wrap gap-4">
                                        {agency.notableClients.map(client => (
                                            <div key={client} className="px-6 py-3 bg-bg-secondary border border-border-light rounded-xl font-semibold text-text-secondary">
                                                {client}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar / Stats */}
                        <div className="space-y-8">
                            <div className="p-8 rounded-3xl bg-bg-secondary border border-border-light shadow-sm sticky top-32">
                                <H3 className="text-xl font-bold mb-6">Company Summary</H3>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center text-accent-peach">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <P className="text-xs uppercase tracking-wider font-bold text-text-muted mb-0">Location</P>
                                            <P className="font-semibold">{agency.city}{agency.state ? `, ${agency.state}` : ''}, {agency.country}</P>
                                        </div>
                                    </div>

                                    {agency.founded && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center text-accent-peach">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <P className="text-xs uppercase tracking-wider font-bold text-text-muted mb-0">Founded</P>
                                                <P className="font-semibold">{agency.founded}</P>
                                            </div>
                                        </div>
                                    )}

                                    {agency.teamSize && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center text-accent-peach">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <P className="text-xs uppercase tracking-wider font-bold text-text-muted mb-0">Team Size</P>
                                                <P className="font-semibold">{agency.teamSize} Employees</P>
                                            </div>
                                        </div>
                                    )}

                                    {agency.avgHourlyRate && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center text-accent-peach">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <P className="text-xs uppercase tracking-wider font-bold text-text-muted mb-0">Hourly Rate</P>
                                                <P className="font-semibold">{agency.avgHourlyRate}</P>
                                            </div>
                                        </div>
                                    )}

                                    {agency.minProjectSize && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center text-accent-peach">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <P className="text-xs uppercase tracking-wider font-bold text-text-muted mb-0">Min. Project</P>
                                                <P className="font-semibold">{agency.minProjectSize}</P>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-6">
                                        <a
                                            href={`mailto:hello@toptechagencies.com?subject=Inquiry about ${agency.name}`}
                                            className="inline-flex items-center justify-center rounded-full font-medium transition-colors bg-text-primary text-bg-primary hover:bg-text-secondary w-full py-4 text-lg"
                                        >
                                            <Send className="w-5 h-5 mr-3" /> Connect with Agency
                                        </a>
                                        <P className="text-center text-xs text-text-muted mt-4">
                                            Average response time: &lt; 24 hours
                                        </P>
                                    </div>
                                </div>

                                {agency.clutchUrl && (
                                    <div className="mt-8 pt-8 border-t border-border-light">
                                        <a
                                            href={agency.clutchUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between text-sm font-semibold text-text-secondary hover:text-accent-peach transition-colors"
                                        >
                                            View on Clutch
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </main>

            <Footer />
        </div>
    )
}
