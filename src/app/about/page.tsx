import { Container } from '@/components/layout/Container'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { H1, H2, P } from '@/components/ui/Typography'
import { Metadata } from 'next'
import { ShieldCheck, Users, BarChart, Globe, Award, BookOpen } from 'lucide-react'
import Script from 'next/script'

export const metadata: Metadata = {
    title: 'About Us | Our Mission, Team & Editorial Standards',
    description: 'Learn about TopTechAgencies.com — our expert editorial team, data-driven methodology, and commitment to helping businesses find the best technology partners.',
    alternates: {
        canonical: 'https://toptechagencies.com/about',
    },
    openGraph: {
        title: 'About TopTechAgencies.com | Our Mission & Expert Team',
        description: 'Meet the experts behind our agency reviews. Learn about our data-driven ranking methodology and editorial standards.',
        type: 'website',
    }
}

export default function AboutPage() {
    const aboutSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'AboutPage',
                '@id': 'https://toptechagencies.com/about#webpage',
                url: 'https://toptechagencies.com/about',
                name: 'About TopTechAgencies.com',
                description: 'Learn about our mission, expert team, and editorial standards.',
                isPartOf: { '@id': 'https://toptechagencies.com/#website' },
                breadcrumb: { '@id': 'https://toptechagencies.com/about#breadcrumb' },
                inLanguage: 'en-US',
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://toptechagencies.com/about#breadcrumb',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://toptechagencies.com' },
                    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://toptechagencies.com/about' },
                ],
            },
            {
                '@type': 'Organization',
                '@id': 'https://toptechagencies.com/#organization',
                name: 'TopTechAgencies.com',
                url: 'https://toptechagencies.com',
                logo: 'https://toptechagencies.com/logo.png',
                description: 'The most trusted directory for finding and comparing software development, AI, and design agencies across the USA.',
                foundingDate: '2024',
                numberOfEmployees: { '@type': 'QuantitativeValue', value: '15+' },
                knowsAbout: ['Software Development', 'Agency Reviews', 'UI/UX Design', 'AI Development', 'Cloud Consulting'],
                parentOrganization: {
                    '@type': 'Organization',
                    name: 'tkxel',
                    url: 'https://tkxel.com'
                },
                sameAs: [
                    'https://www.linkedin.com/company/toptechagencies',
                    'https://twitter.com/toptechagencies',
                ],
            },
        ],
    }

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <Script
                id="about-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
            />

            <main className="flex-grow">
                {/* Hero */}
                <section className="pt-32 pb-20 bg-bg-secondary border-b border-border-light">
                    <Container className="max-w-4xl text-center">
                        <P className="text-sm font-bold uppercase tracking-widest text-accent-peach-text mb-4">Our Mission</P>
                        <H1 className="mb-6">Empowering Smarter Tech Decisions</H1>
                        <P className="text-xl text-text-secondary">
                            We bridge the gap between visionary companies and world-class technology partners through clear, data-driven insights.
                        </P>
                    </Container>
                </section>

                {/* Trust Indicators */}
                <section className="py-16 bg-bg-primary border-b border-border-light">
                    <Container>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                                { value: '31,000+', label: 'Agencies Reviewed', icon: Globe },
                                { value: '51', label: 'US Cities Covered', icon: BarChart },
                                { value: '19', label: 'Service Categories', icon: BookOpen },
                                { value: '15+', label: 'Years Industry Experience', icon: Award },
                            ].map((stat) => (
                                <div key={stat.label} className="space-y-2">
                                    <stat.icon className="w-6 h-6 mx-auto text-accent-peach-text" />
                                    <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                                    <p className="text-sm text-text-secondary">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* Who We Are */}
                <section className="py-24 bg-bg-primary">
                    <Container className="max-w-3xl">
                        <div className="prose prose-lg max-w-none">
                            <H2>Who We Are</H2>
                            <P>
                                At TopTechAgencies.com, we believe that finding the right software development partner shouldn&apos;t be a guessing game.
                                Founded by industry veterans with deep roots in software engineering, we recognized a need for a directory that
                                goes beyond sponsored listings and glossy marketing.
                            </P>
                            <P>
                                Our platform aggregates data from thousands of agencies across the United States, analyzing them based on
                                verifiable metrics like project history, client reviews, and area of expertise.
                            </P>

                            <H2 className="mt-12">Our Philosophy</H2>
                            <P>
                                Transparency and relevance are at our core. We don&apos;t just list companies; we curate lists tailored to specific
                                needs—whether that&apos;s local expertise in a specific city or niche technical skills like AI development or
                                Cloud Consulting.
                            </P>

                            <H2 className="mt-12">Part of the tkxel Family</H2>
                            <P>
                                We are proud to be an initiative of tkxel, a global technology consultancy. Our parent company&apos;s 15+ years
                                of experience in the industry informs our understanding of what makes a great tech partner.
                            </P>
                        </div>
                    </Container>
                </section>

                {/* Editorial Team — E-E-A-T Expert Signals */}
                <section className="py-24 bg-bg-secondary border-t border-border-light">
                    <Container className="max-w-4xl">
                        <div className="text-center mb-16">
                            <P className="text-sm font-bold uppercase tracking-widest text-accent-peach-text mb-4">Meet Our Team</P>
                            <H2 className="border-none mb-4">Expert Editorial Board</H2>
                            <P className="text-lg text-text-secondary max-w-2xl mx-auto">
                                Our reviews and rankings are created by industry professionals with deep technical expertise and first-hand experience working with agencies.
                            </P>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: 'Muhammad Umar',
                                    role: 'Head of Research & SEO',
                                    experience: '9+ years in SEO & Programmatic SEO',
                                    expertise: 'Data-driven agency analysis, semantic search optimization, and scalable content systems.',
                                },
                                {
                                    name: 'Editorial Team',
                                    role: 'Technical Reviewers',
                                    experience: 'Combined 50+ years in software engineering',
                                    expertise: 'Hands-on expertise in software development, cloud architecture, AI/ML, and UI/UX design.',
                                },
                                {
                                    name: 'Data & Research',
                                    role: 'Data Analysis Team',
                                    experience: 'Processing 31,000+ agency profiles continuously',
                                    expertise: 'Clutch reviews, G2 ratings, LinkedIn data, portfolio analysis, and market positioning.',
                                },
                            ].map((member) => (
                                <div key={member.name} className="bg-bg-primary p-8 rounded-3xl border border-border-light">
                                    <div className="w-14 h-14 rounded-full bg-accent-peach/20 flex items-center justify-center text-accent-peach-text mb-4">
                                        <Users className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                                    <p className="text-sm text-accent-peach-text font-medium mb-3">{member.role}</p>
                                    <p className="text-sm text-text-muted mb-2">{member.experience}</p>
                                    <p className="text-sm text-text-secondary">{member.expertise}</p>
                                </div>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* Editorial Standards — E-E-A-T Trust Signal */}
                <section className="py-24 bg-bg-primary">
                    <Container className="max-w-4xl">
                        <div className="text-center mb-16">
                            <P className="text-sm font-bold uppercase tracking-widest text-accent-peach-text mb-4">Transparency</P>
                            <H2 className="border-none mb-4">Our Editorial Standards</H2>
                            <P className="text-lg text-text-secondary max-w-2xl mx-auto">
                                Every review and ranking on TopTechAgencies.com follows a rigorous editorial process to ensure accuracy and fairness.
                            </P>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: 'Independence & Objectivity',
                                    desc: 'We do not accept payment for higher rankings. Our methodology is transparent and data-driven. Listings are ranked based on verified metrics, not advertising spend.',
                                    icon: ShieldCheck,
                                },
                                {
                                    title: 'Verified Data Sources',
                                    desc: 'We cross-reference data from Clutch, G2, LinkedIn, Glassdoor, and company portfolios. Every data point is validated before publication.',
                                    icon: BarChart,
                                },
                                {
                                    title: 'Regular Updates',
                                    desc: 'Our database is continuously updated. Rankings are re-evaluated quarterly to reflect changes in service quality, client satisfaction, and market positioning.',
                                    icon: Globe,
                                },
                                {
                                    title: 'Expert Review Process',
                                    desc: 'Each agency profile is reviewed by our editorial team with hands-on industry experience. We verify business legitimacy, active operations, and service claims.',
                                    icon: Award,
                                },
                            ].map((standard) => (
                                <div key={standard.title} className="flex gap-5 p-6 bg-bg-secondary rounded-2xl border border-border-light">
                                    <div className="w-12 h-12 rounded-full bg-accent-peach/20 flex items-center justify-center text-accent-peach-text flex-shrink-0">
                                        <standard.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-2">{standard.title}</h3>
                                        <p className="text-sm text-text-secondary">{standard.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Container>
                </section>
            </main>
            <Footer />
        </div>
    )
}
