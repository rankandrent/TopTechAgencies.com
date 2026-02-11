import { Container } from '@/components/layout/Container'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { H1, P } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { SemanticSchema } from '@/components/seo/SemanticSchema'
import { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Contact Us | TopTechAgencies.com',
    description: 'Get in touch with the TopTechAgencies.com team for partnerships, listing inquiries, or general questions.',
}

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <SemanticSchema type="BreadcrumbList" data={[
                { name: 'Home', url: '/' },
                { name: 'Contact', url: '/contact' }
            ]} />

            <main className="flex-grow">
                <section className="pt-32 pb-20 bg-bg-secondary border-b border-border-light">
                    <Container className="max-w-4xl text-center">
                        <P className="text-sm font-bold uppercase tracking-widest text-accent-peach-text mb-4">Get in Touch</P>
                        <H1 className="mb-6">We'd Love to Hear from You</H1>
                        <P className="text-xl text-text-secondary">
                            Whether you're an agency looking to get listed or a business seeking advice, our team is here to help.
                        </P>
                    </Container>
                </section>

                <section className="py-24 bg-bg-primary">
                    <Container className="max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Contact Info */}
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent-peach/20 flex items-center justify-center text-accent-peach-text flex-shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Email Us</h3>
                                        <P className="text-text-secondary mb-2">For general inquiries and support:</P>
                                        <a href="mailto:hello@tkxel.com" className="text-accent-peach-text font-bold hover:underline">hello@tkxel.com</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent-peach/20 flex items-center justify-center text-accent-peach-text flex-shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Call Us</h3>
                                        <P className="text-text-secondary mb-2">Mon-Fri from 9am to 6pm EST:</P>
                                        <a href="tel:+15715546682" className="text-accent-peach-text font-bold hover:underline">+1 (571) 554-6682</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent-peach/20 flex items-center justify-center text-accent-peach-text flex-shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Visit Us</h3>
                                        <P className="text-text-secondary">
                                            11951 Freedom Drive, 13th Floor<br />
                                            Reston, VA 20190<br />
                                            USA
                                        </P>
                                    </div>
                                </div>
                            </div>

                            {/* Simple Form (Placeholder for now) */}
                            <div className="bg-bg-secondary p-8 rounded-3xl border border-border-light">
                                <h3 className="font-bold text-2xl mb-6">Send a Message</h3>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-border-light focus:outline-none focus:border-accent-peach" placeholder="Your name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
                                        <input type="email" className="w-full px-4 py-3 rounded-xl border border-border-light focus:outline-none focus:border-accent-peach" placeholder="you@company.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">Message</label>
                                        <textarea className="w-full px-4 py-3 rounded-xl border border-border-light focus:outline-none focus:border-accent-peach h-32" placeholder="How can we help?" />
                                    </div>
                                    <Button className="w-full" variant="primary" size="lg">Send Message</Button>
                                </form>
                            </div>
                        </div>
                    </Container>
                </section>
            </main>
            <Footer />
        </div>
    )
}
