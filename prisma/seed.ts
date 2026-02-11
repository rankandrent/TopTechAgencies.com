import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const CITIES = [
    { name: 'New York', slug: 'new-york', state: 'New York', stateCode: 'NY', population: 8467513, techScene: 'A global hub for finance, media, and tech innovation, home to Silicon Alley.' },
    { name: 'Los Angeles', slug: 'los-angeles', state: 'California', stateCode: 'CA', population: 3849297, techScene: 'A creative powerhouse merging entertainment with technology and startups.' },
    { name: 'Chicago', slug: 'chicago', state: 'Illinois', stateCode: 'IL', population: 2696555, techScene: 'A central tech hub with strong roots in fintech, logistics, and healthcare.' },
    { name: 'Houston', slug: 'houston', state: 'Texas', stateCode: 'TX', population: 2288250, techScene: 'A leader in energy technology, aerospace, and medical innovation.' },
    { name: 'Phoenix', slug: 'phoenix', state: 'Arizona', stateCode: 'AZ', population: 1624569, techScene: 'A rapidly growing tech scene, dubbed the Silicon Desert.' },
    // Add more cities as needed
]

const AGENCIES = [
    {
        name: 'Eleken',
        slug: 'eleken',
        description: 'We help SaaS companies design intuitive products that users love.',
        tagline: 'Best for SaaS Product Design',
        site: 'https://eleken.co',
        services: ['UI/UX Design', 'SaaS Design', 'Product Redesign'],
        rating: 5.0
    },
    {
        name: 'Clay',
        slug: 'clay',
        description: 'A UI/UX design agency that builds world-class digital products.',
        tagline: 'Best for Branding & Digital Product',
        site: 'https://clay.global',
        services: ['UI/UX Design', 'Branding', 'Web Design'],
        rating: 4.9
    },
    {
        name: 'Ramotion',
        slug: 'ramotion',
        description: 'A design agency for growing startups and established brands.',
        tagline: 'Best for Marketing Websites',
        site: 'https://ramotion.com',
        services: ['Web Design', 'Mobile App Design', 'Branding'],
        rating: 4.8
    }
]

async function main() {
    console.log('Start seeding ...')

    // Seed Cities
    for (const city of CITIES) {
        const c = await prisma.city.upsert({
            where: { slug: city.slug },
            update: {},
            create: {
                name: city.name,
                slug: city.slug,
                state: city.state,
                stateCode: city.stateCode,
                population: city.population,
                techScene: city.techScene,
                industries: ['Tech', 'Finance', 'Healthcare'],
                landmarks: ['Downtown', 'Tech Park']
            },
        })
        console.log(`Created city with id: ${c.id}`)
    }

    // Seed Agencies (Mock Data)
    for (const agency of AGENCIES) {
        const a = await prisma.agency.upsert({
            where: { slug: agency.slug },
            update: {},
            create: {
                name: agency.name,
                slug: agency.slug,
                description: agency.description,
                tagline: agency.tagline,
                websiteUrl: agency.site,
                clutchRating: agency.rating,
                reviewCount: 10 + Math.floor(Math.random() * 50),
                minProjectSize: '$10,000+',
                avgHourlyRate: '$50 - $99 / hr',
                teamSize: '10 - 49',
                founded: '2015',
                city: 'San Francisco', // Default for mock
                country: 'US',
                services: agency.services,
                industries: ['SaaS', 'Fintech'],
                notableClients: ['Google', 'Slack'],
                specialties: ['User Interface', 'User Experience']
            }
        })
        console.log(`Created agency with id: ${a.id}`)
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
