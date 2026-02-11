import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { H1, H2, P } from '@/components/ui/Typography'
import { SemanticSchema } from '@/components/seo/SemanticSchema'
import { SERVICES, CITIES } from '@/lib/constants'
import { Metadata } from 'next'
import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { ServicesSearch } from '@/components/services/ServicesSearch'

export const metadata: Metadata = {
    title: 'All Services | Find Top Software Companies by Service Type',
    description: 'Browse all IT and software development services. Find top-rated companies for web development, mobile apps, AI, cloud consulting, UI/UX design, and more across major cities.',
    openGraph: {
        title: 'All Services | Find Top Software Companies',
        description: 'Browse all IT and software development services. Find top-rated companies for web development, mobile apps, AI, and more.',
    }
}

export default function ServicesPage() {
    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/services' }
    ]

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <SemanticSchema type="BreadcrumbList" data={breadcrumbs} />
            <SemanticSchema type="ItemList" data={{
                title: 'All IT & Software Development Services',
                description: 'Complete list of software development services',
                items: SERVICES.map(s => ({ name: s.name, url: `/services/${s.slug}` }))
            }} />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-bg-secondary py-20 md:py-28">
                    <Container>
                        <div className="max-w-4xl mx-auto text-center">
                            <p className="text-xs uppercase tracking-widest text-accent-peach-text font-semibold mb-4">
                                Browse by Service
                            </p>
                            <H1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
                                All Services
                            </H1>
                            <P className="text-xl text-text-secondary max-w-2xl mx-auto">
                                Find top-rated companies across {SERVICES.length} different service categories.
                                Each service includes company listings in {CITIES.length}+ major cities.
                            </P>
                        </div>
                    </Container>
                </section>

                {/* Stats Bar */}
                <section className="bg-text-primary text-white py-8">
                    <Container>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                            <div className="text-center">
                                <div className="text-3xl font-bold">{SERVICES.length}</div>
                                <div className="text-sm text-white/70">Service Categories</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">{CITIES.length}+</div>
                                <div className="text-sm text-white/70">Cities Covered</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">31K+</div>
                                <div className="text-sm text-white/70">Companies Listed</div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* Services Search and Grid */}
                <ServicesSearch services={SERVICES} cities={CITIES} />

                {/* CTA Section */}
                <section className="bg-bg-secondary py-20">
                    <Container>
                        <div className="max-w-3xl mx-auto text-center">
                            <H2 className="text-3xl md:text-4xl mb-6">
                                Can't Find What You're Looking For?
                            </H2>
                            <P className="text-lg text-text-secondary mb-8">
                                We're constantly adding new service categories and cities.
                                Contact us if you'd like to see a specific service or location added.
                            </P>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-text-primary text-white rounded-xl font-bold hover:bg-opacity-90 transition-all"
                            >
                                <Building2 className="h-5 w-5" />
                                Back to Home
                            </Link>
                        </div>
                    </Container>
                </section>
            </main>

            <Footer />
        </div>
    )
}
