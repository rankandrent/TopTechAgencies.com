import React from 'react'
import { Container } from '@/components/layout/Container'
import { H1, P } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { TagBadge } from '@/components/ui/TagBadge'

interface ServiceHeroProps {
    serviceName: string
    cityName: string
    description: string
}

export function ServiceHero({ serviceName, cityName, description }: ServiceHeroProps) {
    return (
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-bg-secondary">
            {/* Background patterns */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-peach/5 -skew-x-12 translate-x-1/4 pointer-events-none" />

            <Container className="relative z-10">
                <div className="max-w-3xl">
                    <TagBadge className="mb-6">Expert {serviceName} in {cityName}</TagBadge>
                    <H1 className="mb-8 leading-tight">
                        Top-Tier {serviceName} <br />
                        Services in {cityName}
                    </H1>
                    <P className="text-xl text-text-secondary mb-10 max-w-2xl">
                        {description}
                    </P>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg">Get a Free Audit</Button>
                        <Button variant="outline" size="lg">View Case Studies</Button>
                    </div>
                </div>
            </Container>
        </section>
    )
}
