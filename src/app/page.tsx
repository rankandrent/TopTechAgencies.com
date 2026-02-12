import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { LogoCarousel } from "@/components/home/LogoCarousel";
import { ProblemSolution } from "@/components/home/ProblemSolution";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { BlogPreview } from "@/components/home/BlogPreview";

import { Metadata } from 'next'
import { SemanticSchema } from '@/components/seo/SemanticSchema'

export const metadata: Metadata = {
  title: 'Find Top Software Companies & Agencies | TopTechAgencies.com',
  description: 'The most trusted directory for finding software development, AI, and design partners. Compare 31,000+ vetted agencies across the USA.',
  alternates: {
    canonical: "https://toptechagencies.com",
  },
  openGraph: {
    title: 'Find Top Software Companies & Agencies | TopTechAgencies.com',
    description: 'The most trusted directory for finding software development, AI, and design partners.',
  }
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <SemanticSchema type="Organization" data={{
        name: 'TopTechAgencies.com',
        url: 'https://toptechagencies.com',
        logo: 'https://toptechagencies.com/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-571-554-6682',
          contactType: 'customer service',
          areaServed: 'US',
          availableLanguage: 'en'
        },
        sameAs: [
          'https://www.linkedin.com/company/tkxel',
          'https://twitter.com/tkxel',
          'https://www.facebook.com/tkxel'
        ]
      }} />
      <SemanticSchema type="WebSite" data={{
        name: 'TopTechAgencies.com',
        url: 'https://toptechagencies.com'
      }} />
      <main className="flex-grow">
        <Hero />
        <LogoCarousel />
        <ProblemSolution />
        <ServicesGrid />
        <BlogPreview />
      </main>
      <Footer />
    </div>
  );
}
