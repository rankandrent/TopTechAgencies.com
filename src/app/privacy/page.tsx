import { Container } from '@/components/layout/Container'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { H1, H2, P } from '@/components/ui/Typography'
import { SemanticSchema } from '@/components/seo/SemanticSchema'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy | TopTechAgencies.com',
    description: 'Our commitment to protecting your privacy and personal data.',
    alternates: {
        canonical: 'https://toptechagencies.com/privacy',
    },
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <SemanticSchema type="BreadcrumbList" data={[
                { name: 'Home', url: '/' },
                { name: 'Privacy Policy', url: '/privacy' }
            ]} />
            <main className="flex-grow">
                <section className="pt-32 pb-12 bg-bg-secondary border-b border-border-light">
                    <Container className="max-w-3xl">
                        <H1 className="mb-4">Privacy Policy</H1>
                        <P className="text-text-secondary">Last Updated: February 13, 2026</P>
                    </Container>
                </section>

                <section className="py-20 bg-bg-primary">
                    <Container className="max-w-3xl">
                        <div className="prose prose-lg max-w-none">
                            <P>
                                At TopTechAgencies.com, we respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you as to how we look after your personal data when you visit our website
                                and tell you about your privacy rights and how the law protects you.
                            </P>

                            <H2>1. Information We Collect</H2>
                            <P>
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                                    <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                                    <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                                </ul>
                            </P>

                            <H2>2. How We Use Your Personal Data</H2>
                            <P>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                    <li>Where we need to comply with a legal or regulatory obligation.</li>
                                </ul>
                            </P>

                            <H2>3. Data Security</H2>
                            <P>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </P>

                            <H2>4. Contact Details</H2>
                            <P>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:hello@tkxel.com" className="text-accent-peach-text hover:underline">hello@tkxel.com</a>.
                            </P>
                        </div>
                    </Container>
                </section>
            </main>
            <Footer />
        </div>
    )
}
