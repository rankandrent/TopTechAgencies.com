'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin, Briefcase, Search } from 'lucide-react'
import { H2, P } from '@/components/ui/Typography'
import { Container } from '@/components/layout/Container'

interface Service {
    name: string
    slug: string
}

interface City {
    name: string
    slug: string
}

interface ServicesSearchProps {
    services: Service[]
    cities: City[]
}

export function ServicesSearch({ services, cities }: ServicesSearchProps) {
    const [searchQuery, setSearchQuery] = useState('')

    // Get top 3 cities for preview
    const topCities = cities.slice(0, 3)

    // Filter services based on search query
    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <section className="py-24">
            <Container className="max-w-[1400px]">
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-16 relative px-4">
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search for a service... (e.g., 'App Development')"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 rounded-xl border border-border-light shadow-sm focus:ring-2 focus:ring-accent-peach focus:border-accent-peach text-base transition-all"
                        />
                    </div>
                    <div className="mt-4 text-center text-sm text-text-secondary">
                        Showing {filteredServices.length} result{filteredServices.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Services Grid */}
                {filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredServices.map((service, index) => (
                            <article
                                key={service.slug}
                                className="group bg-white rounded-2xl border border-border-light p-6 hover:shadow-xl hover:border-accent-peach/30 transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-accent-peach/10 flex items-center justify-center">
                                        <Briefcase className="h-6 w-6 text-accent-peach-text" />
                                    </div>
                                    <span className="text-xs font-medium text-text-muted bg-bg-secondary px-2 py-1 rounded">
                                        #{services.findIndex(s => s.slug === service.slug) + 1}
                                    </span>
                                </div>

                                <Link href={`/services/${service.slug}`}>
                                    <H2 className="text-xl font-bold mb-3 group-hover:text-accent-peach-text transition-colors">
                                        {service.name}
                                    </H2>
                                </Link>

                                <P className="text-sm text-text-secondary mb-4">
                                    Find top {service.name.toLowerCase()} companies in major cities across the US.
                                </P>

                                {/* Scrollable Cities List */}
                                <div className="space-y-3 mb-6 bg-bg-secondary/50 rounded-xl p-3 border border-border-light">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                                            Available in {cities.length}+ Cities
                                        </p>
                                        <span className="text-[10px] text-text-muted bg-white px-2 py-0.5 rounded-full border border-border-light">
                                            Scroll for more
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                        {cities.map(city => (
                                            <Link
                                                key={city.slug}
                                                href={`/services/${service.slug}/${city.slug}`}
                                                className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white hover:bg-accent-peach/20 hover:text-accent-peach-text px-2 py-1.5 rounded-lg border border-border-light transition-colors whitespace-nowrap"
                                            >
                                                <MapPin className="h-3 w-3 text-text-muted" />
                                                {city.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <Link
                                    href={`/services/${service.slug}`}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent-peach-text hover:gap-3 transition-all"
                                >
                                    View All Cities <ArrowRight className="h-4 w-4" />
                                </Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-bg-secondary rounded-3xl border border-border-light">
                        <div className="w-16 h-16 rounded-full bg-border-light flex items-center justify-center mx-auto mb-6">
                            <Search className="h-8 w-8 text-text-muted" />
                        </div>
                        <H2 className="text-2xl mb-2">No services found</H2>
                        <P className="text-text-secondary">
                            Try searching for something else like "Development" or "Design"
                        </P>
                    </div>
                )}
            </Container>
        </section>
    )
}
