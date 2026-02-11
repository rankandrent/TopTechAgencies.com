import React from 'react'
import { Container } from '@/components/layout/Container'
import { H2, P } from '@/components/ui/Typography'
import { CheckCircle2 } from 'lucide-react'

interface WhySectionProps {
    serviceName: string
    cityName: string
}

export function WhySection({ serviceName, cityName }: WhySectionProps) {
    const benefits = [
        { title: 'Local Market Expertise', desc: `We understand the specific needs of businesses in ${cityName}.` },
        { title: 'SaaS-First Approach', desc: 'Our designs are optimized for customer acquisition and retention.' },
        { title: 'Data-Driven Results', desc: 'We use analytics to drive our design decisions and improve ROI.' },
        { title: 'Rapid Iteration', desc: 'Working in sync with your product team for fast deployments.' },
    ]

    return (
        <section className="py-40 bg-bg-primary">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <H2 className="border-none mb-6">Why Choose Our {serviceName} in {cityName}?</H2>
                        <P className="text-lg text-text-secondary mb-10">
                            We don't just create pretty pictures. We build functional digital products that solve real problems
                            for users and drive sustainable growth for SaaS companies in the {cityName} area.
                        </P>
                        <div className="space-y-4">
                            {benefits.slice(0, 2).map(b => (
                                <div key={b.title} className="flex gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-accent-peach-text shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-text-primary">{b.title}</h4>
                                        <P className="text-sm mt-1">{b.desc}</P>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {benefits.map(b => (
                            <div key={b.title} className="p-8 rounded-3xl bg-bg-secondary border border-border-light">
                                <CheckCircle2 className="w-8 h-8 text-accent-peach-text mb-4" />
                                <h4 className="font-bold text-lg mb-2">{b.title}</h4>
                                <P className="text-sm">{b.desc}</P>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}
