import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { H1, P } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { SERVICES } from '@/lib/constants'
import { ArrowRight, Home, Search } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist. Browse our services or return to the homepage.',
    robots: {
        index: false,
        follow: false,
    },
}

export default function NotFound() {
    const popularServices = SERVICES.slice(0, 6)

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
                <section className="bg-bg-secondary pt-32 pb-20">
                    <Container className="max-w-3xl text-center">
                        <div className="mb-8">
                            <span className="text-8xl font-bold text-accent-peach/40">404</span>
                        </div>
                        <H1 className="mb-6">Page Not Found</H1>
                        <P className="text-xl text-text-secondary mb-10 max-w-xl mx-auto">
                            The page you&apos;re looking for doesn&apos;t exist or has been moved.
                            Try browsing our services or head back home.
                        </P>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/">
                                <Button variant="primary" size="lg">
                                    <Home className="mr-2 h-5 w-5" /> Go Home
                                </Button>
                            </Link>
                            <Link href="/services">
                                <Button variant="outline" size="lg">
                                    <Search className="mr-2 h-5 w-5" /> Browse Services
                                </Button>
                            </Link>
                        </div>
                    </Container>
                </section>

                {/* Popular Services for internal linking */}
                <section className="py-20 bg-bg-primary">
                    <Container className="max-w-4xl">
                        <h2 className="text-2xl font-bold mb-8 text-center">Popular Services</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {popularServices.map((service) => (
                                <Link
                                    key={service.slug}
                                    href={`/services/${service.slug}`}
                                    className="group p-6 bg-bg-secondary border border-border-light rounded-2xl hover:border-accent-peach transition-all"
                                >
                                    <h3 className="font-bold mb-2 group-hover:text-accent-peach-text transition-colors">
                                        {service.name}
                                    </h3>
                                    <div className="flex items-center text-sm text-text-muted font-medium">
                                        View Companies <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </Container>
                </section>
            </main>
            <Footer />
        </div>
    )
}
