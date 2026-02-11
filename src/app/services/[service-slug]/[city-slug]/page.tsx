import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FAQSection } from '@/components/services/FAQSection'
import { RelatedLinks } from '@/components/services/RelatedLinks'
import { Container } from '@/components/layout/Container'
import { H1, P } from '@/components/ui/Typography'
import { AgencyEntry } from '@/components/blog/AgencyEntry'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { SemanticSchema } from '@/components/seo/SemanticSchema'
import { CITIES, SERVICES } from '@/lib/constants'
import { Metadata } from 'next'
import clientPromise from '@/lib/mongodb'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function formatText(text: string) {
    if (!text) return '';
    return text
        // Fix stick-together words and add period if missing before capital letter
        .replace(/([a-z])([A-Z])/g, '$1. $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        // Ensure space after punctuation
        .replace(/([.!?])([A-Za-z])/g, '$1 $2')
        .replace(/([a-z])\s+(Specialize|Located|With|Their|Clients|Whether|Monroy|The|This|Our)/g, '$1. $2')
        // Fix double spaces
        .replace(/\s+/g, ' ')
        .trim();
}

function formatParagraphs(text: string): string[] {
    if (!text) return [];
    const cleaned = formatText(text);

    // Split by period, question mark, or exclamation followed by space
    // Also handle cases where period might be missing but we inserted it
    const sentences = cleaned
        .split(/(?<=[.!?])\s+/)
        .filter(sentence => sentence.trim().length > 0);

    const paragraphs: string[] = [];
    let currentPara = '';

    sentences.forEach((sentence) => {
        // If the sentence is long (> 150 chars), make it its own paragraph
        if (sentence.length > 150) {
            if (currentPara) paragraphs.push(highlightKeywords(currentPara));
            paragraphs.push(highlightKeywords(sentence));
            currentPara = '';
        }
        // If current paragraph is getting long (> 200 chars), push it
        else if (currentPara.length + sentence.length > 200) {
            paragraphs.push(highlightKeywords(currentPara));
            currentPara = sentence;
        }
        // Otherwise, combine
        else {
            currentPara = currentPara ? `${currentPara} ${sentence}` : sentence;
        }
    });

    if (currentPara) {
        paragraphs.push(highlightKeywords(currentPara));
    }

    return paragraphs;
}

function highlightKeywords(text: string): string {
    if (!text) return '';

    // Patterns to highlight (will be wrapped in **bold**)
    const patterns = [
        // Prices like $25,000+, $25 to $49
        /\$[\d,]+(?:\+|(?:\s*(?:to|-)\s*\$[\d,]+))?(?:\s*\/\s*hr)?/gi,
        // Employee counts like 50-249, 10 to 49
        /\b\d+\s*(?:to|-)\s*\d+\s*(?:employees|professionals|team members|skilled professionals)?/gi,
        // Ratings like 4.9, 5.0
        /\b\d\.\d\s*(?:rating|stars|from\s+\d+\s+reviews)?/gi,
        // Locations (common city patterns)
        /\b(?:San Francisco|New York|Los Angeles|Chicago|Austin|Seattle|Boston|Denver|Miami|Dallas|Houston|Phoenix|Philadelphia|Atlanta|Washington D\.?C\.?|CA|NY|TX|FL|IL|WA)\b/gi,
        // Year patterns like "since 2012" or "founded in 2015"
        /\b(?:since|founded in|established in)\s+\d{4}\b/gi,
        // Service keywords
        /\b(?:Io\s*T Development|Custom Software Development|Mobile App Development|Web Development|E-Commerce Development|UX\/UI Design|Cloud Services|AI|Machine Learning|Blockchain|Data Analytics|Cybersecurity)\b/gi,
    ];

    let result = text;
    patterns.forEach(pattern => {
        result = result.replace(pattern, (match) => `**${match}**`);
    });

    return result;
}

interface Props {
    params: Promise<{
        'service-slug': string
        'city-slug': string
    }>
}

export async function generateStaticParams() {
    const params: any[] = []
    SERVICES.forEach(service => {
        CITIES.forEach(city => {
            params.push({
                'service-slug': service.slug,
                'city-slug': city.slug
            })
        })
    })
    return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { 'service-slug': serviceSlug, 'city-slug': citySlug } = await params
    const service = SERVICES.find(s => s.slug === serviceSlug)
    const city = CITIES.find(c => c.slug === citySlug)

    if (!service || !city) return { title: 'Service Not Found' }

    return {
        title: `Top ${service?.name} Companies in ${city?.name} (2025) | TopTechAgencies.com`,
        description: `Find the best ${service?.name} companies in ${city?.name}, ${city?.state}. Compare top-rated agencies, view portfolios, and read verified reviews.`,
        alternates: {
            canonical: `/services/${serviceSlug}/${citySlug}`,
        },
        openGraph: {
            title: `Top ${service?.name} Companies in ${city?.name}`,
            description: `Compare the best ${service?.name.toLowerCase()} agencies in ${city?.name}. Reviews, ratings, and reliable data.`,
            images: [{ url: `/og/cities/${citySlug}`, width: 1200, height: 630 }],
        }
    }
}

export const revalidate = 60; // Revalidate every 60 seconds for CMS changes

export default async function ServiceCityPage({ params }: Props) {
    const { 'service-slug': serviceSlug, 'city-slug': citySlug } = await params
    const service = SERVICES.find(s => s.slug === serviceSlug)
    const city = CITIES.find(c => c.slug === citySlug)

    if (!service || !city) return <div>Service or City not found</div>

    // ── Step 1: Check Supabase for curated listings ──
    let matchedAgencies: any[] = [];
    let isCurated = false;

    try {
        const { data: curatedData } = await supabase
            .from('page_listings')
            .select('*')
            .eq('service_slug', serviceSlug)
            .eq('city_slug', citySlug)
            .eq('is_active', true)
            .order('rank', { ascending: true });

        if (curatedData && curatedData.length > 0) {
            isCurated = true;
            matchedAgencies = curatedData.map((agency: any) => ({
                rank: agency.rank,
                name: agency.name,
                tagline: agency.tagline || `Premium ${service.name}`,
                clutchRating: parseFloat(agency.clutch_rating) || 4.5,
                websiteUrl: agency.website_url || '',
                services: Array.isArray(agency.services) ? agency.services : [service.name],
                description: agency.description || '',
                whyChoose: agency.why_choose || '',
                minProjectSize: agency.min_project_size || 'Varies',
                hourlyRate: agency.hourly_rate || 'Contact for pricing',
                employeesCount: agency.employees_count || '10+',
                yearFounded: agency.year_founded || 'N/A',
                reviewsCount: agency.reviews_count || 0,
                clutchUrl: agency.clutch_url || null,
                location: agency.location || city.name,
            }));
        }
    } catch (e) {
        console.error('Supabase fetch failed, falling back to MongoDB:', e);
    }

    // ── Step 2: If no curated data, fetch from MongoDB (original logic) ──
    if (!isCurated) {
        const client = await clientPromise
        const db = client.db('search_tkxel')
        const collection = db.collection('agencies')

        const serviceTerms = service.name.toLowerCase().split(' ').filter(w => w.length > 2)
        const primaryTerm = serviceTerms[0]

        let broadTerm = primaryTerm
        if (['iphone', 'android', 'ios', 'ipad', 'flutter', 'react', 'kotlin', 'swift'].includes(primaryTerm)) {
            broadTerm = 'mobile'
        } else if (['angular', 'vue', 'node', 'php', 'laravel'].includes(primaryTerm)) {
            broadTerm = 'web'
        } else if (['aws', 'azure', 'google'].includes(primaryTerm)) {
            broadTerm = 'cloud'
        }

        const rawAgencies = await collection.find({
            table_name: 'agencies',
            locality: { $regex: city.name, $options: 'i' },
            $or: [
                { services: { $regex: primaryTerm, $options: 'i' } },
                { services: { $regex: service.name, $options: 'i' } },
                { description: { $regex: primaryTerm, $options: 'i' } }
            ]
        }).sort({ avg_rating: -1 }).limit(20).toArray()

        if (rawAgencies.length < 5) {
            const nationwideAgencies = await collection.find({
                table_name: 'agencies',
                _id: { $nin: rawAgencies.map((a: any) => a._id) },
                $or: [
                    { services: { $regex: primaryTerm, $options: 'i' } },
                    { services: { $regex: broadTerm, $options: 'i' } },
                    { services: { $regex: service.name, $options: 'i' } },
                    { description: { $regex: broadTerm, $options: 'i' } }
                ]
            }).sort({ avg_rating: -1, reviews: -1 }).limit(10).toArray()
            rawAgencies.push(...nationwideAgencies)
        }

        const seenNames = new Set<string>()
        const uniqueAgencies = rawAgencies.filter((agency: any) => {
            const name = agency.name?.toLowerCase().trim()
            if (!name || seenNames.has(name)) return false
            seenNames.add(name)
            return true
        }).slice(0, 10)

        const filteredAgencies = uniqueAgencies.filter((a: any) =>
            !a.name?.toLowerCase().includes('tkxel')
        ).slice(0, 9)

        const tkxelEntry = {
            rank: 1,
            name: 'tkxel',
            tagline: `Leading ${service.name} Company — Trusted by Fortune 500 Brands`,
            clutchRating: 5.0,
            websiteUrl: 'https://www.tkxel.com',
            services: [service.name, 'Custom Software Development', 'Mobile App Development', 'AI Development'],
            description: `tkxel is a globally recognized technology company delivering world-class ${service.name.toLowerCase()} solutions. With 700+ tech experts and 15+ years of experience, tkxel has successfully delivered 1500+ projects for clients across the US, UK, and Middle East.`,
            whyChoose: [
                `tkxel brings **15+ years of expertise** in ${service.name.toLowerCase()} with a proven track record of delivering enterprise-grade solutions for Fortune 500 companies and high-growth startups alike.`,
                `With a team of **700+ skilled engineers** and offices in the US and Pakistan, tkxel offers cost-effective, scalable development with **24/7 support** and transparent communication.`
            ],
            minProjectSize: '$25,000+',
            hourlyRate: '$25 - $49 / hr',
            employeesCount: '700+',
            yearFounded: '2008',
            reviewsCount: 85,
            clutchUrl: 'https://clutch.co/profile/tkxel',
            location: 'Dallas, TX'
        }

        matchedAgencies = [tkxelEntry, ...filteredAgencies.map((agency: any, index: number) => {
            const nameHash = agency.name?.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) || 0
            const variance = (nameHash % 3) * 0.1
            const baseRating = Math.max(4.0, 5.0 - (index * 0.1) - variance)
            const rating = Math.round(baseRating * 10) / 10

            // Sync text rating with displayed rating to avoid mismatches
            let cleanDesc = formatText(agency.description);
            let cleanWhyChoose = agency.generated_desc || `Leading experts in ${service.name.toLowerCase()} with a proven track record in ${city.name}.`;

            // Replace "rating of 4.8" or "5.0 rating" with actual rating
            const ratingPattern = /(\d\.\d)\s*(?:rating|stars)/gi;
            const replacement = `${rating} $1`; // $1 captures 'rating' or 'stars'

            // Safer replacement: look for "rating of X.X"
            cleanDesc = cleanDesc.replace(/rating of \d+\.\d+/gi, `rating of ${rating}`);
            cleanWhyChoose = cleanWhyChoose.replace(/rating of \d+\.\d+/gi, `rating of ${rating}`);

            // Also replace standalone "4.8 rating" patterns if safe context
            cleanDesc = cleanDesc.replace(/(\d\.\d)(\s+rating)/gi, (match: string, p1: string, p2: string) => {
                return `${rating}${p2}`;
            });
            cleanWhyChoose = cleanWhyChoose.replace(/(\d\.\d)(\s+rating)/gi, (match: string, p1: string, p2: string) => {
                return `${rating}${p2}`;
            });

            return {
                rank: index + 2,
                name: agency.name,
                tagline: formatText(agency.generated_desc?.split('.')[0]) || `Premium ${service.name} in ${city.name}`,
                clutchRating: rating,
                websiteUrl: (agency.url || '').replace(/\s+/g, '').replace(/%20/g, ''),
                services: agency.services?.split(',').map((s: string) => s.trim()) || [service.name],
                description: cleanDesc,
                whyChoose: formatParagraphs(cleanWhyChoose),
                minProjectSize: agency.min_project_size || 'Varies',
                hourlyRate: agency.hourly_rate || 'Contact for pricing',
                employeesCount: agency.employees_count || '10+',
                yearFounded: agency.year_founded || 'N/A',
                reviewsCount: parseInt(agency.reviews) || 0,
                clutchUrl: agency.clutch_url ? `https://clutch.co/${agency.clutch_url}` : null,
                location: agency.locality || city.name
            }
        })]
    }

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: service.name, url: `/services/${serviceSlug}` },
        { name: city.name, url: `/services/${serviceSlug}/${citySlug}` }
    ]

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <ScrollProgress />
            <Navbar />
            <SemanticSchema type="BreadcrumbList" data={breadcrumbs} />
            <SemanticSchema type="ItemList" data={{
                title: `Best ${service.name} Companies in ${city.name}`,
                description: `Top ${matchedAgencies.length} design professionals in ${city.name}`,
                items: matchedAgencies.map((a: any) => ({ name: a.name, url: a.websiteUrl }))
            }} />

            <main className="flex-grow">
                <section className="bg-bg-secondary pt-32 pb-20 border-b border-border-light">
                    <Container className="max-w-4xl">
                        <div className="flex items-center gap-2 mb-6 text-sm font-bold text-text-muted">
                            <Link href="/" className="hover:text-accent-peach transition-colors">Home</Link>
                            <span>/</span>
                            <Link href={`/services/${serviceSlug}`} className="hover:text-accent-peach transition-colors">{service.name}</Link>
                            <span>/</span>
                            <span className="text-accent-peach-text">{city.name}</span>
                        </div>
                        <H1 className="mb-8 leading-tight">
                            Top {matchedAgencies.length} Best {service.name} <br />
                            Companies in {city.name}
                        </H1>
                        <P className="text-xl text-text-secondary">
                            We independently reviewed the top {service.name.toLowerCase()} in {city.name}.
                            Check our list below to find the best fit for your SaaS or digital product.
                        </P>
                    </Container>
                </section>

                <section className="py-24 bg-bg-primary">
                    <Container className="max-w-7xl">
                        <div className="flex flex-col lg:flex-row gap-16 relative">
                            <div className="lg:w-2/3 space-y-16">
                                {matchedAgencies.length > 0 ? (
                                    matchedAgencies.map((agency: any) => (
                                        <div key={agency.rank}>
                                            <AgencyEntry {...agency} />
                                            <SemanticSchema type="LocalBusiness" data={{
                                                name: agency.name,
                                                description: agency.description,
                                                url: agency.websiteUrl,
                                                rating: agency.clutchRating,
                                                city: city.name,
                                                state: city.state
                                            }} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 bg-bg-secondary rounded-3xl border border-border-light text-center">
                                        <H1 className="text-2xl mb-4">No agencies found for this search</H1>
                                        <P>We are expanding our database rapidly. Please check back next week for fresh {city.name} design rankings.</P>
                                    </div>
                                )}
                            </div>

                            <aside className="lg:w-1/3">
                                <div className="sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 custom-scrollbar">
                                    <TableOfContents items={matchedAgencies.map((a: any) => ({
                                        id: a.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                                        title: a.name,
                                        rank: a.rank
                                    }))} />
                                    <div className="mt-4 p-8 bg-accent-peach/5 rounded-3xl border border-accent-peach/10">
                                        <h4 className="font-bold mb-4">Want to be listed?</h4>
                                        <P className="text-sm mb-6">If you provide {service.name.toLowerCase()} in {city.name}, contact us for an audit.</P>
                                        <Link
                                            href={`/dashboard/apply?service=${service.slug}&city=${city.slug}`}
                                            className="block w-full text-center py-4 bg-text-primary text-white rounded-xl font-bold hover:bg-opacity-90 transition-all"
                                        >
                                            Apply for Listing
                                        </Link>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </Container>
                </section>
                <FAQSection cityName={city.name} serviceName={service.name} />
                <RelatedLinks
                    currentCity={city.name}
                    currentService={service.name}
                    currentCitySlug={citySlug}
                    currentServiceSlug={serviceSlug}
                    currentCityState={city.state}
                />
            </main>
            <Footer />
        </div>
    )
}
