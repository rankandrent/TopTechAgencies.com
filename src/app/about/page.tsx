import { Container } from '@/components/layout/Container'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { H1, H2, P } from '@/components/ui/Typography'
import { SemanticSchema } from '@/components/seo/SemanticSchema'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Us | Transforming Tech Discovery',
    description: 'Learn about TopTechAgencies.com, our mission to connect businesses with top-tier technology partners, and the experts behind our data-driven ranking methodology.',
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: 'About Us | Transforming Tech Discovery',
        description: 'Our mission to connect businesses with top-tier technology partners.',
    }
}

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <SemanticSchema type="BreadcrumbList" data={[
                { name: 'Home', url: '/' },
                { name: 'About', url: '/about' }
            ]} />

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

                {/* Content */}
                <section className="py-24 bg-bg-primary">
                    <Container className="max-w-3xl">
                        <div className="prose prose-lg max-w-none">
                            <H2>Who We Are</H2>
                            <P>
                                At TopTechAgencies.com, we believe that finding the right software development partner shouldn't be a guessing game.
                                Founded by industry veterans with deep roots in software engineering, we recognized a need for a directory that
                                goes beyond sponsored listings and glossy marketing.
                            </P>
                            <P>
                                Our platform aggregates data from thousands of agencies across the United States, analyzing them based on
                                verifiable metrics like project history, client reviews, and area of expertise.
                            </P>

                            <H2 className="mt-12">Our Philosophy</H2>
                            <P>
                                Transparency and relevance are at our core. We don't just list companies; we curate lists tailored to specific
                                needs—whether that's local expertise in a specific city or niche technical skills like AI development or
                                Cloud Consulting.
                            </P>

                            <H2 className="mt-12">Part of the tkxel Family</H2>
                            <P>
                                We are proud to be an initiative of tkxel, a global technology consultancy. Our parent company's 15+ years
                                of experience in the industry informs our understanding of what makes a great tech partner.
                            </P>
                        </div>
                    </Container>
                </section>
            </main>
            <Footer />
        </div>
    )
}
