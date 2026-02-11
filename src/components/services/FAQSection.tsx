import React from 'react'
import { Container } from '@/components/layout/Container'
import { H2, P } from '@/components/ui/Typography'
import { SemanticSchema } from '@/components/seo/SemanticSchema'

// City-specific industry focus for Semantic SEO relevance
const CITY_INDUSTRIES: Record<string, string> = {
    'New York': 'FinTech, Media, and Enterprise',
    'San Francisco': 'SaaS, AI, and Startups',
    'Austin': 'Tech, E-commerce, and Digital Health',
    'Los Angeles': 'Entertainment, Media, and Consumer Tech',
    'Chicago': 'Finance, Logistics, and Manufacturing',
    'Boston': 'BioTech, EdTech, and Robotics',
    'Seattle': 'Cloud Computing, Retail, and Aerospace',
    'Washington': 'GovTech, Cybersecurity, and Non-profits',
    'Houston': 'Energy, Healthcare, and Aerospace',
    'Dallas': 'Telecommunications, Transport, and Banking',
    'Miami': 'Crypto, Hospitality, and International Trade',
    'Denver': 'Telecommunications, Aerospace, and Software',
    'Atlanta': 'FinTech, Logistics, and Media',
    'San Diego': 'BioTech, Defense, and Telecommunications',
}

export function FAQSection({ cityName, serviceName }: { cityName: string, serviceName: string }) {
    const industryFocus = CITY_INDUSTRIES[cityName] || 'diverse enterprise and startup';

    // Dynamic Programmatic FAQs based on Semantic SEO & E-E-A-T
    const faqs = [
        {
            q: `How much does ${serviceName} cost in ${cityName}?`,
            a: `The cost of ${serviceName} in ${cityName} varies based on project complexity and team expertise. On average, local agencies charge between $50 to $150+ per hour. For enterprise-grade ${serviceName}, fixed-price projects often start from $25,000, depending on the scope and technical requirements.`
        },
        {
            q: `Why should I hire a ${serviceName} company in ${cityName}?`,
            a: `Hiring a ${serviceName} partner in ${cityName} offers significant advantages, including time zone alignment, cultural fit, and the ability to have in-person collaboration. ${cityName}'s tech talent pool is specifically known for expertise in ${industryFocus} sectors.`
        },
        {
            q: `How long does a typical ${serviceName} project take?`,
            a: `A standard ${serviceName} project in ${cityName} typically takes 3 to 6 months. However, MVPs (Minimum Viable Products) can often be delivered in 4-8 weeks. Timeline factors include features, integrations, and whether you need custom UI/UX design alongside development.`
        },
        {
            q: `What specific expertise do ${cityName} ${serviceName} agencies have?`,
            a: `Agencies in ${cityName} often specialize in ${industryFocus}. They are well-versed in local market trends and compliance requirements, making them ideal partners for businesses looking to scale within these specific verticals.`
        },
        {
            q: `How do I choose the best ${serviceName} provider in ${cityName}?`,
            a: `To find the top ${serviceName} agency in ${cityName}, look for a strong portfolio of relevant case studies, verified client reviews on platforms like Clutch, and expertise in your specific industry. It is also crucial to verify their technical stack to ensure it aligns with your long-term scalability goals.`
        },
        {
            q: `Do ${cityName} agencies offer ongoing support for ${serviceName}?`,
            a: `Yes, most reputable ${serviceName} firms in ${cityName} provide post-launch support and maintenance packages. This ensures your software remains secure, up-to-date, and optimized for performance as your user base grows.`
        }
    ]

    const faqSchemaData = faqs.map(f => ({ question: f.q, answer: f.a }))

    return (
        <section className="py-24 bg-bg-secondary border-t border-border-light">
            <SemanticSchema type="FAQPage" data={faqSchemaData} />
            <Container className="max-w-4xl">
                <H2 className="text-center border-none mb-16">
                    Common Questions About {serviceName} in {cityName}
                </H2>
                <div className="grid gap-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="p-8 bg-bg-primary rounded-2xl border border-border-light hover:border-accent-peach/50 transition-colors shadow-sm">
                            <h3 className="font-bold text-lg mb-3 text-text-primary">{faq.q}</h3>
                            <P className="text-text-secondary leading-relaxed">{faq.a}</P>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
