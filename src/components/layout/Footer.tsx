import Link from 'next/link'
import Image from 'next/image'
import { Container } from './Container'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-bg-primary pt-16 pb-10 mt-auto">
            <Container>
                {/* ── Row 1: Brand + 3 Link Columns ── */}
                <div className="grid grid-cols-2 md:grid-cols-[1fr_163px_163px_163px] gap-x-12 gap-y-10">

                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1 space-y-6">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/logo.svg"
                                alt="TopTechAgencies"
                                width={180}
                                height={40}
                                className="h-10 w-auto"
                            />
                        </Link>

                        <div className="space-y-1 text-sm text-text-secondary leading-relaxed">
                            <p>Find & compare the best</p>
                            <p>IT service companies near you.</p>
                        </div>

                        <div className="space-y-1 text-sm text-text-secondary leading-relaxed">
                            <p className="font-medium text-text-primary">TopTechAgencies LLC</p>
                            <p>131 Continental Dr</p>
                            <p>Suite 305</p>
                            <p>Newark, DE 19713 US</p>
                        </div>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h4 className="text-sm text-text-muted mb-6">Services</h4>
                        <ul className="space-y-4">
                            <li><Link href="/services/software-development" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Software Development</Link></li>
                            <li><Link href="/services/web-development" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Web Development</Link></li>
                            <li><Link href="/services/ai-development" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">AI Development</Link></li>
                        </ul>
                    </div>

                    {/* Approach Column */}
                    <div>
                        <h4 className="text-sm text-text-muted mb-6">Approach</h4>
                        <ul className="space-y-4">
                            <li><Link href="/services/ui-ux-design-services" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">UI/UX Design Services</Link></li>
                            <li><Link href="/services/web-design" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Web Design</Link></li>
                            <li><Link href="/services/iphone-app-development" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">iPhone App Development</Link></li>
                            <li><Link href="/services/android-app-development" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Android App Development</Link></li>
                            <li><Link href="/services/cloud-consulting" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Cloud Consulting</Link></li>
                            <li><Link href="/services/blockchain-development" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Blockchain Development</Link></li>
                            <li><Link href="/services/big-data-analytics" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Big Data Analytics</Link></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-sm text-text-muted mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="/case-studies" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Case Studies</Link></li>
                            <li><Link href="/services" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">All Services</Link></li>
                            <li><Link href="/about" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">About</Link></li>
                            <li><Link href="/blog" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Blog</Link></li>
                            <li><Link href="/contact" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Contact us</Link></li>
                        </ul>
                    </div>
                </div>

                {/* ── Row 2: Niches + Comparison + Stories ── */}
                <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr] gap-x-12 gap-y-10 mt-14">

                    {/* More Services / Niches */}
                    <div>
                        <h4 className="text-sm text-text-muted italic mb-6">More Services</h4>
                        <ul className="space-y-4">
                            <li><Link href="/services/internet-of-things-iot" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">IoT Solutions</Link></li>
                            <li><Link href="/services/staff-augmentation-services" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Staff Augmentation</Link></li>
                            <li><Link href="/services/managed-service-providers" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Managed Services</Link></li>
                            <li><Link href="/services/it-services" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">IT Services</Link></li>
                            <li><Link href="/services/software-testing" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Software Testing</Link></li>
                            <li><Link href="/services/vr-augmented-reality" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">VR & Augmented Reality</Link></li>
                            <li><Link href="/services/cybersecurity-services" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Cybersecurity</Link></li>
                            <li><Link href="/services/wordpress-development" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">WordPress Development</Link></li>
                            <li><Link href="/services/shopify-development" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Shopify Development</Link></li>
                        </ul>
                    </div>

                    {/* Popular Cities */}
                    <div>
                        <h4 className="text-sm text-text-muted italic mb-6">Popular Cities</h4>
                        <ul className="space-y-4">
                            <li><Link href="/services/software-development/new-york" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">New York</Link></li>
                            <li><Link href="/services/software-development/los-angeles" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Los Angeles</Link></li>
                            <li><Link href="/services/software-development/chicago" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Chicago</Link></li>
                            <li><Link href="/services/software-development/san-francisco" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">San Francisco</Link></li>
                            <li><Link href="/services/software-development/austin" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Austin</Link></li>
                            <li><Link href="/services/software-development/seattle" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">Seattle</Link></li>
                        </ul>
                    </div>

                    {/* Stories / Resources */}
                    <div>
                        <h4 className="text-sm text-text-muted italic mb-6">Stories</h4>
                        <ul className="space-y-4">
                            <li><Link href="/blog" className="text-sm text-text-primary hover:bg-border-light rounded-full transition-colors px-3 py-1 -mx-3 -my-1 inline-block">How to choose a UI/UX Agency</Link></li>
                        </ul>
                    </div>
                </div>

                {/* ── Bottom Bar ── */}
                <div className="mt-16 pt-8 border-t border-border-light flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
                    <div className="flex flex-col md:flex-row items-center gap-2">
                        <p>© {currentYear} TopTechAgencies. All rights reserved.</p>
                        <span className="hidden md:inline">•</span>
                        <p>
                            Powered by{' '}
                            <Link
                                href="https://tkxel.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:text-text-primary transition-colors"
                            >
                                tkxel.com
                            </Link>
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-text-secondary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-text-secondary transition-colors">Terms of Service</Link>
                        <Link href="/sitemap.xml" className="hover:text-text-secondary transition-colors">Sitemap</Link>
                    </div>
                </div>
            </Container>
        </footer>
    )
}
