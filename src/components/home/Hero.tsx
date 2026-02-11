import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { H1, P } from '@/components/ui/Typography'

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-32">
            <Container className="relative z-10 flex flex-col items-center text-center">
                {/* Social Proof (Top) */}
                <div className="mb-8 flex items-center gap-2 rounded-full border border-border-circle px-4 py-1.5 bg-white/50 backdrop-blur-sm">
                    <div className="flex -space-x-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className="text-yellow-500 text-sm">★</span>
                        ))}
                    </div>
                    <span className="text-sm font-medium text-text-secondary">4.9/5 on Clutch</span>
                </div>

                <H1 className="mb-6 max-w-4xl tracking-tight">
                    Connect with trusted companies <br className="hidden sm:block" /> for your next project.
                </H1>

                <P className="mb-10 max-w-2xl text-lg text-text-secondary md:text-xl">
                    Find the perfect partner to bring your ideas to life. From software development to design and marketing, we connect you with vetted agencies that deliver results.
                </P>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link href="/contact">
                        <Button variant="primary" size="lg">Book a Call</Button>
                    </Link>
                    <Link href="/case-studies">
                        <Button variant="outline" size="lg">Check Portfolio</Button>
                    </Link>
                </div>

                {/* Abstract shapes or illustration could go here as background */}
            </Container>
        </section>
    )
}
