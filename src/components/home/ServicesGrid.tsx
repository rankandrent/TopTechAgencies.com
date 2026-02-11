import { Container } from '@/components/layout/Container'
import { H2, P } from '@/components/ui/Typography'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SERVICES } from '@/lib/constants'

export function ServicesGrid() {
    // Show first 8 services on homepage for clean look
    const displayedServices = SERVICES.slice(0, 8)

    return (
        <section id="services" className="py-40 bg-bg-primary">
            <Container>
                <div className="max-w-3xl mb-16">
                    <H2 className="mb-6">Our Design Expertise</H2>
                    <P className="text-xl text-text-secondary">
                        We help startups and established brands build world-class digital products through
                        specialized design services tailored to their growth stage.
                    </P>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayedServices.map((service) => (
                        <Link
                            key={service.slug}
                            href={`/services/${service.slug}`}
                            className="group p-8 bg-bg-secondary border border-border-light rounded-3xl hover:border-accent-peach transition-all duration-300 flex flex-col justify-between min-h-[280px]"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-accent-peach/20 flex items-center justify-center mb-6 text-accent-peach-text group-hover:bg-accent-peach group-hover:text-white transition-colors">
                                    <ArrowUpRight className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 leading-tight">{service.name}</h3>
                                <P className="text-sm line-clamp-3">
                                    Strategic {service.name} solutions designed to enhance user engagement and drive conversion for your business.
                                </P>
                            </div>
                            <div className="mt-8 flex items-center text-sm font-bold text-text-primary">
                                View Cities <ArrowUpRight className="ml-2 w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/services" className="inline-flex items-center text-lg font-bold hover:text-accent-peach transition-colors">
                        View all services <ArrowUpRight className="ml-2" />
                    </Link>
                </div>
            </Container>
        </section>
    )
}
