import { Container } from '@/components/layout/Container'

export function LogoCarousel() {
    // Placeholder logos for now
    const logos = [
        { name: 'Acme Corp', color: 'bg-gray-300' },
        { name: 'Globex', color: 'bg-gray-400' },
        { name: 'Soylent', color: 'bg-gray-300' },
        { name: 'Initech', color: 'bg-gray-400' },
        { name: 'Umbrella', color: 'bg-gray-300' },
        { name: 'Stark', color: 'bg-gray-400' },
    ]

    return (
        <section className="py-20 border-y border-border-light bg-bg-secondary/50">
            <Container>
                <p className="text-center text-sm font-medium text-text-muted mb-8 uppercase tracking-wider">
                    Trusted by fast-growing companies
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                    {logos.map((logo) => (
                        <div key={logo.name} className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-full ${logo.color}`} />
                            <span className="text-lg font-bold text-text-secondary">{logo.name}</span>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
