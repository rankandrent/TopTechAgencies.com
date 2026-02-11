import { Container } from '@/components/layout/Container'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { H1, H2, P } from '@/components/ui/Typography'
import { SemanticSchema } from '@/components/seo/SemanticSchema'
import { Metadata } from 'next'
import { CheckCircle, Search, BarChart, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Our Ranking Methodology | How We Review Companies',
    description: 'Understand the data-driven process behind our transparent agency rankings and reviews.',
}

export default function MethodologyPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <SemanticSchema type="BreadcrumbList" data={[
                { name: 'Home', url: '/' },
                { name: 'Methodology', url: '/methodology' }
            ]} />

            <main className="flex-grow">
                <section className="pt-32 pb-20 bg-bg-secondary border-b border-border-light">
                    <Container className="max-w-4xl text-center">
                        <P className="text-sm font-bold uppercase tracking-widest text-accent-peach-text mb-4">Transparency First</P>
                        <H1 className="mb-6">How We Rank Companies</H1>
                        <P className="text-xl text-text-secondary">
                            Our ranking system is built on objectivity, data, and continuous validation.
                            We don't accept payment for higher rankings.
                        </P>
                    </Container>
                </section>

                <section className="py-24 bg-bg-primary">
                    <Container className="max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            <div>
                                <div className="w-12 h-12 rounded-full bg-accent-peach/20 flex items-center justify-center text-accent-peach-text mb-6">
                                    <Search className="w-6 h-6" />
                                </div>
                                <H2 className="text-2xl mb-4">1. Data Collection</H2>
                                <P className="text-text-secondary">
                                    We aggregate data from multiple credible sources, including:
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li>Verified client reviews on platforms like Clutch and G2</li>
                                        <li>Company portfolios and case studies</li>
                                        <li>Employee satisfaction scores (Glassdoor, LinkedIn)</li>
                                        <li>Market presence and awards</li>
                                    </ul>
                                </P>
                            </div>

                            <div>
                                <div className="w-12 h-12 rounded-full bg-accent-peach/20 flex items-center justify-center text-accent-peach-text mb-6">
                                    <BarChart className="w-6 h-6" />
                                </div>
                                <H2 className="text-2xl mb-4">2. The Scoring Algorithm</H2>
                                <P className="text-text-secondary">
                                    Our proprietary algorithm weighs factors to determine a "TK Score" (Technical Knowledge Score):
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li><strong>Expertise (40%):</strong> Depth of technical skills in specific niches</li>
                                        <li><strong>Reputation (30%):</strong> Client feedback and industry recognition</li>
                                        <li><strong>Experience (20%):</strong> Years in business and project scale</li>
                                        <li><strong>Presence (10%):</strong> Team size and location capability</li>
                                    </ul>
                                </P>
                            </div>

                            <div>
                                <div className="w-12 h-12 rounded-full bg-accent-peach/20 flex items-center justify-center text-accent-peach-text mb-6">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <H2 className="text-2xl mb-4">3. Verification & Safety</H2>
                                <P className="text-text-secondary">
                                    Before listing, we manually verify key details:
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li>Legitimate business registration</li>
                                        <li>Active website and contact channels</li>
                                        <li>No history of fraudulent activities</li>
                                    </ul>
                                </P>
                            </div>

                            <div>
                                <div className="w-12 h-12 rounded-full bg-accent-peach/20 flex items-center justify-center text-accent-peach-text mb-6">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <H2 className="text-2xl mb-4">4. Continuous Monitoring</H2>
                                <P className="text-text-secondary">
                                    Rankings aren't static. We re-evaluate companies quarterly.
                                    A drop in client satisfaction or service quality will be reflected in real-time updates to our lists.
                                </P>
                            </div>
                        </div>

                        <div className="mt-20 p-8 bg-white rounded-3xl border border-border-light text-center">
                            <H2 className="text-2xl mb-4 border-none">Want to challenge a ranking?</H2>
                            <P className="mb-6">
                                If you believe your company data is outdated or incorrect, let us know.
                                We value accuracy above all else.
                            </P>
                            <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-text-primary hover:bg-opacity-90">
                                Contact Verification Team
                            </a>
                        </div>
                    </Container>
                </section>
            </main>
            <Footer />
        </div>
    )
}
