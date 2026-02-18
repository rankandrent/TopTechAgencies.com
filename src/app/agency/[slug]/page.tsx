import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import clientPromise from '@/lib/mongodb'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { H1, H2, H3, P } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { AgencyHeroActions, AgencySidebarCTA, AgencyCTASection } from '@/components/agency/AgencyActions'
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
    Zap,
    TrendingUp,
    Target,
    ChevronDown,
    Building2,
    HelpCircle,
    Lightbulb,
    ArrowRight,
    CheckCircle2,
    Sparkles,
} from 'lucide-react'
import Script from 'next/script'

interface PageProps {
    params: Promise<{ slug: string }>
}

function slugify(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

function formatText(text: string): string {
    if (!text) return ''
    return text
        .replace(/([a-z])([A-Z])/g, '$1. $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        .replace(/([.!?])([A-Za-z])/g, '$1 $2')
        .replace(/\s+/g, ' ')
        .trim()
}

function formatParagraphs(text: string): string[] {
    if (!text) return []
    const cleaned = formatText(text)
    const sentences = cleaned
        .split(/(?<=[.!?])\s+/)
        .filter(s => s.trim().length > 0)

    const paragraphs: string[] = []
    let current = ''

    sentences.forEach(sentence => {
        if (sentence.length > 150) {
            if (current) paragraphs.push(current)
            paragraphs.push(sentence)
            current = ''
        } else if (current.length + sentence.length > 200) {
            paragraphs.push(current)
            current = sentence
        } else {
            current = current ? `${current} ${sentence}` : sentence
        }
    })
    if (current) paragraphs.push(current)
    return paragraphs
}

function highlightKeyData(text: string): string {
    if (!text) return ''
    const patterns = [
        /\$[\d,]+(?:\+|(?:\s*(?:to|-)\s*\$[\d,]+))?(?:\s*\/\s*hr)?/gi,
        /\b\d+\s*(?:to|-)\s*\d+\s*(?:employees|professionals|team members)?/gi,
        /\b\d\.\d\s*(?:rating|stars|from\s+\d+\s+reviews)?/gi,
        /\b(?:since|founded in|established in)\s+\d{4}\b/gi,
    ]
    let result = text
    patterns.forEach(pattern => {
        result = result.replace(pattern, match => `**${match}**`)
    })
    return result
}

async function getAgencyBySlug(slug: string) {
    try {
        const client = await clientPromise
        const db = client.db('search_tkxel')
        const collection = db.collection('agencies')

        // Build a regex from the slug to match the agency name directly in MongoDB
        // e.g. slug "acme-corp" → regex that matches "Acme Corp" (case-insensitive)
        const namePattern = slug.replace(/-/g, '[^a-z0-9]*')
        const agencies = await collection.find({
            table_name: 'agencies',
            name: { $regex: new RegExp(`^${namePattern}$`, 'i') }
        }).limit(5).toArray()

        // If regex match found multiple, find the exact slug match
        if (agencies.length === 1) return agencies[0]
        if (agencies.length > 1) {
            return agencies.find(a => slugify(a.name || '') === slug) || agencies[0]
        }

        // Fallback: broader search if exact regex didn't match
        const words = slug.split('-').filter(w => w.length > 1)
        if (words.length > 0) {
            const fallbackPattern = words.map(w => `(?=.*${w})`).join('')
            const fallbackResults = await collection.find({
                table_name: 'agencies',
                name: { $regex: new RegExp(fallbackPattern, 'i') }
            }).limit(20).toArray()

            return fallbackResults.find(a => slugify(a.name || '') === slug) || null
        }

        return null
    } catch (error) {
        console.error('Error in getAgencyBySlug:', error)
        return null
    }
}

async function getSimilarAgencies(currentName: string, services: string, locality: string, limit: number = 4) {
    try {
        const client = await clientPromise
        const db = client.db('search_tkxel')
        const collection = db.collection('agencies')

        const serviceTerms = services?.split(',').slice(0, 2).map((s: string) => s.trim()) || []
        const orConditions = serviceTerms.map((term: string) => ({
            services: { $regex: term, $options: 'i' }
        }))

        const results = await collection.find({
            table_name: 'agencies',
            name: { $ne: currentName },
            ...(orConditions.length > 0 ? { $or: orConditions } : {}),
        }).sort({ avg_rating: -1 }).limit(limit + 2).toArray()

        // Deduplicate and limit
        const seen = new Set<string>()
        return results.filter((a: any) => {
            const n = a.name?.toLowerCase().trim()
            if (!n || seen.has(n)) return false
            seen.add(n)
            return true
        }).slice(0, limit)
    } catch (error) {
        console.error('Error in getSimilarAgencies:', error)
        return []
    }
}

function generateFAQs(agency: any, services: string[], location: string, rating: number, reviewCount: number) {
    const year = new Date().getFullYear()
    const faqs: { question: string; answer: string }[] = []

    faqs.push({
        question: `What services does ${agency.name} offer?`,
        answer: services.length > 0
            ? `${agency.name} specializes in ${services.join(', ')}. They provide end-to-end solutions tailored to each client's unique business requirements.`
            : `${agency.name} offers a range of technology and digital services. Contact them directly for a detailed overview of their current service offerings.`
    })

    faqs.push({
        question: `Where is ${agency.name} located?`,
        answer: `${agency.name} is based in ${location}. They serve clients both locally and internationally, providing remote and on-site collaboration options.`
    })

    if (rating > 0) {
        faqs.push({
            question: `What is ${agency.name}'s rating on Clutch?`,
            answer: `${agency.name} holds a ${rating}/5 rating on Clutch${reviewCount > 0 ? ` based on ${reviewCount} verified client reviews` : ''}. This reflects their commitment to quality delivery and client satisfaction.`
        })
    }

    if (agency.hourly_rate && agency.hourly_rate !== 'Contact for pricing') {
        faqs.push({
            question: `What is ${agency.name}'s hourly rate?`,
            answer: `${agency.name}'s hourly rate ranges ${agency.hourly_rate}. Actual pricing may vary depending on project scope, complexity, and engagement model.`
        })
    }

    if (agency.min_project_size && agency.min_project_size !== 'Varies') {
        faqs.push({
            question: `What is the minimum project size for ${agency.name}?`,
            answer: `${agency.name} typically accepts projects starting at ${agency.min_project_size}. They work with startups, SMBs, and enterprise clients across various budget ranges.`
        })
    }

    if (agency.employees_count) {
        faqs.push({
            question: `How large is ${agency.name}'s team?`,
            answer: `${agency.name} has a team of ${agency.employees_count} professionals. This enables them to handle multiple projects simultaneously while maintaining quality standards.`
        })
    }

    faqs.push({
        question: `Is ${agency.name} a good fit for my project in ${year}?`,
        answer: `${agency.name} is well-suited for businesses looking for expertise in ${services.slice(0, 2).join(' and ') || 'technology solutions'}. They have a proven track record in ${location} and are known for their client-focused approach. We recommend reaching out for a consultation to discuss your specific requirements.`
    })

    return faqs
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const agency = await getAgencyBySlug(slug)

    if (!agency) return { title: 'Agency Not Found' }

    const location = agency.locality || 'USA'
    const services = agency.services?.split(',').map((s: string) => s.trim()).slice(0, 5) || []
    const rating = parseFloat(agency.avg_rating) || 0
    const reviewCount = parseInt(agency.reviews) || 0

    // Title: max 60 chars, no duplication
    const title = `${agency.name} Review ${new Date().getFullYear()} | Ratings, Services & Pricing`

    // Description: max 155 chars, compelling with CTA
    const ratingText = rating > 0 ? `Rated ${rating}/5` : 'Top-rated'
    const reviewText = reviewCount > 0 ? ` from ${reviewCount} reviews` : ''
    const serviceSnippet = services.length > 0 ? services.slice(0, 2).join(' & ') : 'tech services'
    const rawDesc = `${ratingText}${reviewText}. ${agency.name} offers ${serviceSnippet} in ${location}. Read our expert review, pricing & portfolio analysis.`
    const description = rawDesc.length > 155 ? rawDesc.slice(0, 152) + '...' : rawDesc

    // Keywords from services + location
    const keywords = [
        agency.name,
        `${agency.name} review`,
        `${agency.name} pricing`,
        ...services,
        `${serviceSnippet} agency ${location}`,
        `best agencies in ${location}`,
        'agency review',
        'clutch rating',
    ].join(', ')

    const canonicalUrl = `https://toptechagencies.com/agency/${slug}`

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large' as const,
            'max-video-preview': -1,
        },
        openGraph: {
            title: `${agency.name} — Expert Agency Review & Ratings`,
            description,
            type: 'website',
            url: canonicalUrl,
            siteName: 'TopTechAgencies.com',
            locale: 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${agency.name} — Agency Review & Ratings`,
            description,
        },
    }
}

export default async function AgencyPage({ params }: PageProps) {
    const { slug } = await params
    const agency = await getAgencyBySlug(slug)

    if (!agency) notFound()

    const services = agency.services?.split(',').map((s: string) => s.trim()) || []
    const rating = parseFloat(agency.avg_rating) || 0
    const reviewCount = parseInt(agency.reviews) || 0
    const location = agency.locality || 'USA'
    const canonicalUrl = `https://toptechagencies.com/agency/${slug}`
    const websiteUrl = agency.url ? (agency.url.startsWith('http') ? agency.url : `https://${agency.url}`) : null

    // Fetch similar agencies and generate FAQs
    const similarAgencies = await getSimilarAgencies(agency.name, agency.services || '', location)
    const faqs = generateFAQs(agency, services, location, rating, reviewCount)
    const yearsInBusiness = agency.year_founded && parseInt(agency.year_founded) > 1900 ? new Date().getFullYear() - parseInt(agency.year_founded) : null

    // Comprehensive Schema Markup
    const organizationSchema: any = {
        '@type': 'Organization',
        '@id': `${canonicalUrl}#organization`,
        name: agency.name,
        description: agency.description || `${agency.name} is a leading tech agency based in ${location}.`,
        url: websiteUrl || canonicalUrl,
        ...(websiteUrl ? {
            sameAs: [
                websiteUrl,
                agency.clutch_url ? `https://clutch.co/${agency.clutch_url}` : null,
            ].filter(Boolean)
        } : {}),
        address: {
            '@type': 'PostalAddress',
            addressLocality: location,
            addressCountry: 'US',
        },
        ...(agency.employees_count ? {
            numberOfEmployees: {
                '@type': 'QuantitativeValue',
                value: agency.employees_count,
            }
        } : {}),
        ...(agency.year_founded && parseInt(agency.year_founded) > 1900 ? {
            foundingDate: agency.year_founded,
        } : {}),
        ...(services.length > 0 ? {
            knowsAbout: services,
            hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: `${agency.name} Services`,
                itemListElement: services.map((service: string, i: number) => ({
                    '@type': 'Offer',
                    position: i + 1,
                    itemOffered: {
                        '@type': 'Service',
                        name: service,
                    },
                })),
            },
        } : {}),
        ...(rating > 0 ? {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: rating,
                reviewCount: reviewCount || 1,
                bestRating: 5,
                worstRating: 1,
            },
        } : {}),
        ...(agency.hourly_rate ? {
            priceRange: agency.hourly_rate,
        } : {}),
    }

    const breadcrumbSchema = {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://toptechagencies.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Agencies',
                item: 'https://toptechagencies.com/services',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: agency.name,
                item: canonicalUrl,
            },
        ],
    }

    const webpageSchema = {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: `${agency.name} Review ${new Date().getFullYear()} | Ratings, Services & Pricing`,
        description: agency.description?.slice(0, 155) || `Expert review of ${agency.name}`,
        isPartOf: { '@id': 'https://toptechagencies.com/#website' },
        breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
        about: { '@id': `${canonicalUrl}#organization` },
        datePublished: '2025-01-01T00:00:00+00:00',
        dateModified: new Date().toISOString(),
        inLanguage: 'en-US',
    }

    const faqSchema = {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            organizationSchema,
            breadcrumbSchema,
            webpageSchema,
            faqSchema,
        ],
    }

    const getFaviconUrl = (url: string) => {
        try {
            const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch {
            return null;
        }
    };

    const faviconUrl = agency.url ? getFaviconUrl(agency.url) : null;

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
                        <a href="/services" className="hover:text-accent-peach-text transition-colors">Agencies</a>
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
                                        {rating > 0 && (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-bold border border-yellow-200">
                                                <Star className="h-4 w-4 fill-current" />
                                                <span>{rating.toFixed(1)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <P className="text-xl text-text-secondary leading-relaxed max-w-2xl">
                                        {`${agency.name} is a leading agency based in ${location}.`}
                                    </P>

                                    <AgencyHeroActions agencyName={agency.name} websiteUrl={websiteUrl} />
                                </div>
                            </div>

                            {/* About Section */}
                            <section className="space-y-6 pt-8 border-t border-border-light">
                                <H2 className="text-3xl font-bold flex items-center gap-3">
                                    <ShieldCheck className="w-8 h-8 text-accent-peach" />
                                    About {agency.name}
                                </H2>
                                <div className="prose prose-lg max-w-none text-text-primary space-y-4">
                                    {formatParagraphs(agency.description || '').map((para, i) => (
                                        <p key={`desc-${i}`} className="text-lg leading-relaxed text-text-primary">
                                            {highlightKeyData(para).split(/(\*\*.*?\*\*)/g).map((part, j) => {
                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                    return <strong key={j} className="font-bold text-text-primary">{part.slice(2, -2)}</strong>
                                                }
                                                return <span key={j}>{part}</span>
                                            })}
                                        </p>
                                    ))}
                                </div>

                                {agency.generated_desc && (
                                    <div className="mt-8 p-6 rounded-2xl bg-accent-peach/5 border border-accent-peach/20">
                                        <h3 className="text-lg font-bold text-accent-peach-text mb-4 flex items-center gap-2">
                                            <Award className="w-5 h-5" />
                                            Why {agency.name} Stands Out
                                        </h3>
                                        <div className="space-y-3">
                                            {formatParagraphs(agency.generated_desc).map((para, i) => (
                                                <p key={`gen-${i}`} className="text-base leading-relaxed text-text-secondary">
                                                    {highlightKeyData(para).split(/(\*\*.*?\*\*)/g).map((part, j) => {
                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <strong key={j} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>
                                                        }
                                                        return <span key={j}>{part}</span>
                                                    })}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Services & Expertise */}
                            {services.length > 0 && (
                                <section className="space-y-6 pt-8 border-t border-border-light">
                                    <H2 className="text-3xl font-bold flex items-center gap-3">
                                        <Zap className="w-8 h-8 text-accent-peach" />
                                        Services & Expertise
                                    </H2>
                                    <div className="p-6 rounded-2xl bg-bg-secondary border border-border-light">
                                        <H3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                            <Award className="w-5 h-5 text-accent-peach" />
                                            Core Services
                                        </H3>
                                        <div className="flex flex-wrap gap-2">
                                            {services.map((service: string) => (
                                                <span key={service} className="px-3 py-1.5 bg-white border border-border-light rounded-lg text-sm font-medium text-text-primary">
                                                    {service}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Key Highlights */}
                            <section className="pt-8 border-t border-border-light">
                                <H2 className="text-3xl font-bold flex items-center gap-3 mb-6">
                                    <TrendingUp className="w-8 h-8 text-accent-peach" />
                                    Key Highlights
                                </H2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {rating > 0 && (
                                        <div className="p-5 rounded-2xl bg-yellow-50 border border-yellow-200 text-center">
                                            <div className="flex items-center justify-center gap-1 mb-2">
                                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                <span className="text-2xl font-extrabold text-yellow-700">{rating.toFixed(1)}</span>
                                            </div>
                                            <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider">Clutch Rating</p>
                                        </div>
                                    )}
                                    {reviewCount > 0 && (
                                        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                                            <span className="text-2xl font-extrabold text-blue-700">{reviewCount}+</span>
                                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-1">Client Reviews</p>
                                        </div>
                                    )}
                                    {yearsInBusiness && yearsInBusiness > 0 && (
                                        <div className="p-5 rounded-2xl bg-green-50 border border-green-200 text-center">
                                            <span className="text-2xl font-extrabold text-green-700">{yearsInBusiness}+</span>
                                            <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mt-1">Years in Business</p>
                                        </div>
                                    )}
                                    {services.length > 0 && (
                                        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                                            <span className="text-2xl font-extrabold text-purple-700">{services.length}</span>
                                            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mt-1">Core Services</p>
                                        </div>
                                    )}
                                    {agency.employees_count && (
                                        <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200 text-center">
                                            <span className="text-2xl font-extrabold text-orange-700">{agency.employees_count}</span>
                                            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mt-1">Team Members</p>
                                        </div>
                                    )}
                                    <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-center">
                                        <MapPin className="w-6 h-6 mx-auto text-teal-600 mb-1" />
                                        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">{location}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Ideal For Section */}
                            <section className="pt-8 border-t border-border-light">
                                <H2 className="text-3xl font-bold flex items-center gap-3 mb-6">
                                    <Target className="w-8 h-8 text-accent-peach" />
                                    Who Should Work With {agency.name}?
                                </H2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl bg-bg-secondary border border-border-light flex items-start gap-4">
                                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-text-primary mb-1">Startups & Scale-ups</h4>
                                            <p className="text-sm text-text-secondary">Looking for a reliable tech partner to build and scale their digital products from concept to launch.</p>
                                        </div>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-bg-secondary border border-border-light flex items-start gap-4">
                                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-text-primary mb-1">Enterprise Organizations</h4>
                                            <p className="text-sm text-text-secondary">Needing experienced teams for complex, large-scale digital transformation and modernization initiatives.</p>
                                        </div>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-bg-secondary border border-border-light flex items-start gap-4">
                                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-text-primary mb-1">Product Companies</h4>
                                            <p className="text-sm text-text-secondary">Seeking expert {services.slice(0, 2).join(' and ') || 'design and development'} talent to enhance their existing digital products.</p>
                                        </div>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-bg-secondary border border-border-light flex items-start gap-4">
                                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-text-primary mb-1">Businesses in {location}</h4>
                                            <p className="text-sm text-text-secondary">Preferring a local agency with deep understanding of the {location} market and tech ecosystem.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* FAQ Section */}
                            <section className="pt-8 border-t border-border-light">
                                <H2 className="text-3xl font-bold flex items-center gap-3 mb-6">
                                    <HelpCircle className="w-8 h-8 text-accent-peach" />
                                    Frequently Asked Questions
                                </H2>
                                <div className="space-y-3">
                                    {faqs.map((faq, i) => (
                                        <details key={i} className="group rounded-2xl bg-bg-secondary border border-border-light overflow-hidden">
                                            <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none hover:bg-white transition-colors">
                                                <span className="font-semibold text-text-primary pr-4">{faq.question}</span>
                                                <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0 transition-transform group-open:rotate-180" />
                                            </summary>
                                            <div className="px-5 pb-5 text-text-secondary leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </section>

                            {/* Similar Agencies */}
                            {similarAgencies.length > 0 && (
                                <section className="pt-8 border-t border-border-light">
                                    <H2 className="text-3xl font-bold flex items-center gap-3 mb-6">
                                        <Building2 className="w-8 h-8 text-accent-peach" />
                                        Similar Agencies You Might Like
                                    </H2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {similarAgencies.map((sim: any) => {
                                            const simSlug = slugify(sim.name || '')
                                            const simRating = parseFloat(sim.avg_rating) || 0
                                            const simServices = sim.services?.split(',').slice(0, 3).map((s: string) => s.trim()) || []
                                            const simFavicon = sim.url ? `https://www.google.com/s2/favicons?domain=${(() => { try { return new URL(sim.url.startsWith('http') ? sim.url : `https://${sim.url}`).hostname } catch { return '' } })()}&sz=64` : null
                                            return (
                                                <Link
                                                    key={simSlug}
                                                    href={`/agency/${simSlug}`}
                                                    className="p-5 rounded-2xl bg-bg-secondary border border-border-light hover:border-accent-peach/50 hover:shadow-md transition-all group flex items-start gap-4"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-white border border-border-light p-2 flex-shrink-0 flex items-center justify-center">
                                                        {simFavicon ? (
                                                            <img src={simFavicon} alt={sim.name} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <span className="font-bold text-accent-peach text-lg">{sim.name?.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <h4 className="font-bold text-text-primary group-hover:text-accent-peach-text transition-colors truncate">{sim.name}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {simRating > 0 && (
                                                                <span className="flex items-center gap-1 text-xs font-semibold text-yellow-600">
                                                                    <Star className="w-3 h-3 fill-current" /> {simRating.toFixed(1)}
                                                                </span>
                                                            )}
                                                            {sim.locality && (
                                                                <span className="text-xs text-text-muted">{sim.locality}</span>
                                                            )}
                                                        </div>
                                                        {simServices.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                {simServices.map((s: string) => (
                                                                    <span key={s} className="px-2 py-0.5 text-xs bg-white border border-border-light rounded text-text-muted">{s}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-accent-peach transition-colors flex-shrink-0 mt-1" />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            <AgencyCTASection agencyName={agency.name} websiteUrl={websiteUrl} />
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
                                            <P className="font-semibold">{location}</P>
                                        </div>
                                    </div>

                                    {agency.year_founded && agency.year_founded !== 'N/A' && parseInt(agency.year_founded) > 1900 && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center text-accent-peach">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <P className="text-xs uppercase tracking-wider font-bold text-text-muted mb-0">Founded</P>
                                                <P className="font-semibold">{agency.year_founded}</P>
                                            </div>
                                        </div>
                                    )}

                                    {agency.employees_count && agency.employees_count !== '10+' && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center text-accent-peach">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <P className="text-xs uppercase tracking-wider font-bold text-text-muted mb-0">Team Size</P>
                                                <P className="font-semibold">{agency.employees_count} Employees</P>
                                            </div>
                                        </div>
                                    )}

                                    {agency.hourly_rate && agency.hourly_rate !== 'Contact for pricing' && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center text-accent-peach">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <P className="text-xs uppercase tracking-wider font-bold text-text-muted mb-0">Hourly Rate</P>
                                                <P className="font-semibold">{agency.hourly_rate}</P>
                                            </div>
                                        </div>
                                    )}

                                    {agency.min_project_size && agency.min_project_size !== 'Varies' && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center text-accent-peach">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <P className="text-xs uppercase tracking-wider font-bold text-text-muted mb-0">Min. Project</P>
                                                <P className="font-semibold">{agency.min_project_size}</P>
                                            </div>
                                        </div>
                                    )}

                                    {reviewCount > 0 && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center text-accent-peach">
                                                <MessageSquare className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <P className="text-xs uppercase tracking-wider font-bold text-text-muted mb-0">Reviews</P>
                                                <P className="font-semibold">{reviewCount} Reviews</P>
                                            </div>
                                        </div>
                                    )}

                                    <AgencySidebarCTA agencyName={agency.name} />
                                </div>

                                {agency.clutch_url && (
                                    <div className="mt-8 pt-8 border-t border-border-light">
                                        <a
                                            href={`https://clutch.co/${agency.clutch_url}`}
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
