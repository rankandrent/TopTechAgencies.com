
import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { H2 } from '@/components/ui/Typography'
import { CITIES, SERVICES } from '@/lib/constants'

interface RelatedLinksProps {
    currentCity: string
    currentService: string
    currentServiceSlug: string
    currentCitySlug: string
    currentCityState: string
}

export function RelatedLinks({
    currentCity,
    currentService,
    currentServiceSlug,
    currentCitySlug,
    currentCityState
}: RelatedLinksProps) {

    // 1. Find other cities in the same state (or nearby)
    const nearbyCities = CITIES.filter(c =>
        c.state === currentCityState && c.slug !== currentCitySlug
    ).slice(0, 8);

    // If not enough cities in state, fill with popular ones
    if (nearbyCities.length < 5) {
        const otherPopular = CITIES.filter(c =>
            c.state !== currentCityState && c.slug !== currentCitySlug && !nearbyCities.includes(c)
        ).slice(0, 8 - nearbyCities.length);
        nearbyCities.push(...otherPopular);
    }

    // 2. Find other services
    const otherServices = SERVICES.filter(s => s.slug !== currentServiceSlug);
    // Shuffle or rotate services to ensure variety across pages? 
    // For now, let's take a slice to keep it clean, maybe random slice based on city name length to be deterministic but varied
    const startIdx = (currentCity.length * 3) % Math.max(1, otherServices.length - 10);
    const relatedServices = otherServices.slice(startIdx, startIdx + 10);

    return (
        <section className="py-20 bg-bg-primary border-t border-border-light">
            <Container>
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Column 1: Same Service in Nearby Cities */}
                    <div>
                        <H2 className="text-2xl mb-8 border-none">
                            {currentService} in Other Cities
                        </H2>
                        <ul className="space-y-3">
                            {nearbyCities.map(city => (
                                <li key={city.slug}>
                                    <Link
                                        href={`/services/${currentServiceSlug}/${city.slug}`}
                                        className="text-text-secondary hover:text-cta-primary transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-peach group-hover:bg-cta-primary transition-colors"></span>
                                        {currentService} in {city.name}, {city.state}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Other Services in Same City */}
                    <div>
                        <H2 className="text-2xl mb-8 border-none">
                            More Services in {currentCity}
                        </H2>
                        <ul className="space-y-3">
                            {relatedServices.map(service => (
                                <li key={service.slug}>
                                    <Link
                                        href={`/services/${service.slug}/${currentCitySlug}`}
                                        className="text-text-secondary hover:text-cta-primary transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-peach group-hover:bg-cta-primary transition-colors"></span>
                                        {service.name} in {currentCity}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Container>
        </section>
    )
}
