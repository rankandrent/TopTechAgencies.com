import { Container } from '@/components/layout/Container'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { H1, H2, P } from '@/components/ui/Typography'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Service | TopTechAgencies.com',
    description: 'Terms and conditions for using TopTechAgencies.com.',
}

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
                <section className="pt-32 pb-12 bg-bg-secondary border-b border-border-light">
                    <Container className="max-w-3xl">
                        <H1 className="mb-4">Terms of Service</H1>
                        <P className="text-text-secondary">Last Updated: February 13, 2026</P>
                    </Container>
                </section>

                <section className="py-20 bg-bg-primary">
                    <Container className="max-w-3xl">
                        <div className="prose prose-lg max-w-none">
                            <P>
                                Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the TopTechAgencies.com website (the "Service") operated by TopTechAgencies LLC ("us", "we", or "our").
                            </P>

                            <H2>1. Accounts</H2>
                            <P>
                                When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                            </P>

                            <H2>2. Intellectual Property</H2>
                            <P>
                                The Service and its original content, features and functionality are and will remain the exclusive property of tkxel and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                            </P>

                            <H2>3. Links To Other Web Sites</H2>
                            <P>
                                Our Service may contain links to third-party web sites or services that are not owned or controlled by tkxel.
                                tkxel has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that tkxel shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
                            </P>

                            <H2>4. Termination</H2>
                            <P>
                                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                            </P>

                            <H2>5. Changes</H2>
                            <P>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                            </P>

                            <H2>6. Contact Us</H2>
                            <P>
                                If you have any questions about these Terms, please contact us at: <a href="mailto:hello@tkxel.com" className="text-accent-peach-text hover:underline">hello@tkxel.com</a>.
                            </P>
                        </div>
                    </Container>
                </section>
            </main>
            <Footer />
        </div>
    )
}
