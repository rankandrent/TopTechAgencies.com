import { Container } from '@/components/layout/Container'
import { H2, H3, P } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowRight, Layers, Users, Zap } from 'lucide-react'

export function ProblemSolution() {
    const problems = [
        {
            icon: Layers,
            title: "Complex product, confusing design?",
            description: "Your product is powerful but users get lost. We simplify complex workflows into intuitive interfaces.",
            cta: "Redesign Your Product",
            href: "/services/product-redesign"
        },
        {
            icon: Users,
            title: "Can't find reliable designers?",
            description: "Hiring is slow and risky. We provide a dedicated design team that integrates with your workflow instantly.",
            cta: "Extend Your Team",
            href: "/contact"
        },
        {
            icon: Zap,
            title: "Need an MVP fast?",
            description: "Stop validating ideas with code. We design clickable prototypes to test with users in weeks, not months.",
            cta: "Design MVP",
            href: "/services/mvp-design"
        }
    ]

    return (
        <section className="py-40 bg-bg-secondary">
            <Container>
                <div className="mb-16 text-center">
                    <H2 className="border-none mb-4">Solve your product design challenges</H2>
                    <P className="max-w-2xl mx-auto">
                        Whether you're struggling with adoption, scaling your team, or launching a new product, we have a solution.
                    </P>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {problems.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-start p-8 rounded-2xl bg-bg-primary border border-border-light hover:shadow-lg transition-shadow">
                            <div className="mb-6 p-3 rounded-lg bg-accent-peach/20 text-accent-peach-text">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <H3 className="mb-3 text-xl">{item.title}</H3>
                            <P className="mb-8 text-sm flex-grow">{item.description}</P>
                            <Link href={item.href} className="mt-auto">
                                <Button variant="ghost" className="p-0 hover:bg-transparent hover:text-accent-peach-text group">
                                    {item.cta} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
