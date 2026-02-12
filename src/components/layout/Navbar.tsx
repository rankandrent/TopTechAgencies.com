import Link from 'next/link'
import Image from 'next/image'
import { Container } from './Container'
import { Button } from '@/components/ui/Button'
// import { MobileMenu } from './MobileMenu' // TODO: Implement MobileMenu

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full bg-bg-primary/80 backdrop-blur-md border-b border-border-light">
            <Container className="flex h-20 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/logo.svg"
                        alt="TopTechAgencies"
                        width={180}
                        height={40}
                        className="h-10 w-auto"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/services" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                        Services
                    </Link>
                    <Link href="/case-studies" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                        Case Studies
                    </Link>
                    <Link href="/blog" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                        Blog
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                        About
                    </Link>
                </nav>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/contact">
                        <Button variant="primary" size="sm">Get Started</Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <Button variant="ghost" size="sm">Menu</Button>
                </div>
            </Container>
        </header>
    )
}
