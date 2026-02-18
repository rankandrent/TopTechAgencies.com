import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { H1, H2, P } from '@/components/ui/Typography'
import { CITIES, SERVICES } from '@/lib/constants'
import { SemanticSchema } from '@/components/seo/SemanticSchema'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'

interface Props {
    params: Promise<{
        'service-slug': string
    }>
}

export async function generateStaticParams() {
    return SERVICES.map(service => ({
        'service-slug': service.slug
    }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { 'service-slug': serviceSlug } = await params
    const service = SERVICES.find(s => s.slug === serviceSlug)

    if (!service) return { title: 'Service Not Found' }

    return {
        title: `Top ${service.name} Companies | TopTechAgencies.com`,
        description: `Find the best ${service.name} companies across 51 US cities. Compare trusted agencies, view portfolios, and read client reviews.`,
        alternates: {
            canonical: `/services/${serviceSlug}`,
        },
        openGraph: {
            title: `Top ${service.name} Companies`,
            description: `Find the best ${service.name} companies across 51 US cities.`,
            type: 'website',
        }
    }
}

export default async function ServiceHubPage({ params }: Props) {
    const { 'service-slug': serviceSlug } = await params
    const service = SERVICES.find(s => s.slug === serviceSlug)

    if (!service) {
        return <div>Service not found</div>
    }

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <SemanticSchema type="BreadcrumbList" data={[
                { name: 'Home', url: '/' },
                { name: 'Services', url: '/services' },
                { name: service.name }
            ]} />
            <main className="flex-grow">
                {/* Hub Header */}
                <section className="bg-bg-secondary pt-32 pb-20 border-b border-border-light">
                    <Container>
                        <div className="max-w-3xl">
                            <H1 className="mb-6">{service.name}</H1>
                            <P className="text-xl text-text-secondary mb-8">
                                We provide world-class {service.name.toLowerCase()} tailored to the unique needs of scaling startups.
                                Explore our local service areas below to find expert design partners in your city.
                            </P>
                        </div>
                    </Container>
                </section>

                {/* Cities Grid */}
                <section className="py-24 bg-bg-primary">
                    <Container>
                        <div className="flex items-center gap-3 mb-12">
                            <MapPin className="text-accent-peach-text" />
                            <H2 className="border-none m-0">Browse by City</H2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {CITIES.map((city) => (
                                <Link
                                    key={city.slug}
                                    href={`/services/${serviceSlug}/${city.slug}`}
                                    className="group p-8 bg-bg-secondary border border-border-light rounded-3xl hover:border-accent-peach transition-all"
                                >
                                    <span className="text-text-muted text-sm font-bold uppercase tracking-wider mb-2 block">{city.state}</span>
                                    <h3 className="text-2xl font-bold mb-4 group-hover:text-accent-peach-text transition-colors">{city.name}</h3>
                                    <div className="flex items-center text-sm font-bold text-text-primary">
                                        View Top Companies <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* Why this service? */}
                <section className="py-40 bg-bg-secondary">
                    <Container>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <H2 className="border-none mb-8">Elevate Your Product with Professional {service.name}</H2>
                                <P className="text-lg text-text-secondary leading-relaxed mb-6">
                                    In today&apos;s competitive digital landscape, {service.name.toLowerCase()} is more than just aesthetics.
                                    It&apos;s about creating a seamless bridge between your technology and your users.
                                </P>
                                <P className="text-lg text-text-secondary leading-relaxed">
                                    Our pragmatic approach ensures that every pixel serves a purpose, driving higher engagement,
                                    better retention, and improved ROI for your business, no matter where you are located.
                                </P>
                            </div>
                            <div className="bg-bg-primary p-12 rounded-[40px] border border-border-light">
                                <h4 className="text-2xl font-bold mb-6">Service Benefits</h4>
                                <ul className="space-y-4">
                                    {[
                                        'User-Centric Methodology',
                                        'Scalable Design Frameworks',
                                        'Conversion-Focused UI',
                                        'Seamless Product Integration'
                                    ].map(benefit => (
                                        <li key={benefit} className="flex items-center gap-4 text-lg font-medium">
                                            <div className="w-2 h-2 rounded-full bg-accent-peach" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Container>
                </section>
            </main>
            <Footer />
        </div>
    )
}
