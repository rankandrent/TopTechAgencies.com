import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { SERVICES } from '@/lib/constants';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Fetch listings for a service+city (from Supabase if curated, else from MongoDB)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const serviceSlug = searchParams.get('service');
    const citySlug = searchParams.get('city');
    const cityName = searchParams.get('cityName') || '';
    const source = searchParams.get('source'); // 'supabase' or 'mongodb' or 'auto'

    if (!serviceSlug || !citySlug) {
        return NextResponse.json({ error: 'Missing service or city' }, { status: 400 });
    }

    // Check Supabase first for curated listings
    const { data: curatedData } = await supabase
        .from('page_listings')
        .select('*')
        .eq('service_slug', serviceSlug)
        .eq('city_slug', citySlug)
        .order('rank', { ascending: true });

    if (source === 'mongodb' || (!curatedData?.length && source !== 'supabase')) {
        // Fetch from MongoDB
        try {
            const service = SERVICES.find(s => s.slug === serviceSlug);
            if (!service) {
                return NextResponse.json({ data: [], source: 'mongodb' });
            }

            const client = await clientPromise;
            const db = client.db('search_tkxel');
            const collection = db.collection('agencies');

            const serviceTerms = service.name.toLowerCase().split(' ').filter(w => w.length > 2);
            const primaryTerm = serviceTerms[0];

            let broadTerm = primaryTerm;
            if (['iphone', 'android', 'ios', 'ipad', 'flutter', 'react', 'kotlin', 'swift'].includes(primaryTerm)) {
                broadTerm = 'mobile';
            } else if (['angular', 'vue', 'node', 'php', 'laravel'].includes(primaryTerm)) {
                broadTerm = 'web';
            } else if (['aws', 'azure', 'google'].includes(primaryTerm)) {
                broadTerm = 'cloud';
            }

            const rawAgencies = await collection.find({
                table_name: 'agencies',
                locality: { $regex: cityName || citySlug.replace(/-/g, ' '), $options: 'i' },
                $or: [
                    { services: { $regex: primaryTerm, $options: 'i' } },
                    { services: { $regex: service.name, $options: 'i' } },
                    { description: { $regex: primaryTerm, $options: 'i' } }
                ]
            }).sort({ avg_rating: -1 }).limit(20).toArray();

            if (rawAgencies.length < 5) {
                const nationwideAgencies = await collection.find({
                    table_name: 'agencies',
                    _id: { $nin: rawAgencies.map(a => a._id) },
                    $or: [
                        { services: { $regex: primaryTerm, $options: 'i' } },
                        { services: { $regex: broadTerm, $options: 'i' } },
                        { services: { $regex: service.name, $options: 'i' } },
                        { description: { $regex: broadTerm, $options: 'i' } }
                    ]
                }).sort({ avg_rating: -1, reviews: -1 }).limit(10).toArray();
                rawAgencies.push(...nationwideAgencies);
            }

            // Remove duplicate agencies by name
            const seenNames = new Set<string>();
            const uniqueAgencies = rawAgencies.filter(agency => {
                const name = agency.name?.toLowerCase().trim();
                if (!name || seenNames.has(name)) return false;
                seenNames.add(name);
                return true;
            });

            // Filter out 'tkxel' to avoid duplicates (since we insert it at #1)
            const filteredAgencies = uniqueAgencies.filter((a: any) =>
                !a.name?.toLowerCase().includes('tkxel')
            ).slice(0, 9);

            const tkxelEntry = {
                name: 'tkxel',
                tagline: `Leading ${service.name} Company — Trusted by Fortune 500 Brands`,
                clutch_rating: 5.0,
                website_url: 'https://www.tkxel.com',
                services: [service.name, 'Custom Software Development', 'Mobile App Development', 'AI Development'],
                description: `tkxel is a globally recognized technology company delivering world-class ${service.name.toLowerCase()} solutions. With 700+ tech experts and 15+ years of experience, tkxel has successfully delivered 1500+ projects for clients across the US, UK, and Middle East.`,
                why_choose: `tkxel brings **15+ years of expertise** in ${service.name.toLowerCase()} with a proven track record. With a team of **700+ skilled engineers**, tkxel offers cost-effective, scalable development with **24/7 support**.`,
                min_project_size: '$25,000+',
                hourly_rate: '$25 - $49 / hr',
                employees_count: '700+',
                year_founded: '2008',
                reviews_count: 85,
                clutch_url: 'https://clutch.co/profile/tkxel',
                location: 'Dallas, TX',
                is_manual: true
            };

            const finalAgencies = [tkxelEntry, ...filteredAgencies];

            const mapped = finalAgencies.map((agency: any, index: number) => {
                let rating = agency.clutch_rating;

                if (!agency.is_manual) {
                    // Match the frontend's deterministic rating calculation for DB agencies
                    // Note: index in filteredAgencies would be (index - 1)
                    // The formula in page.tsx uses the index from the filtered map.
                    // So for Rank 2 (index 1 here), the formula index is 0.
                    const formulaIndex = index - 1;
                    const nameHash = agency.name?.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) || 0;
                    const variance = (nameHash % 3) * 0.1;
                    const baseRating = Math.max(4.0, 5.0 - (formulaIndex * 0.1) - variance);
                    rating = Math.round(baseRating * 10) / 10;
                }

                // Sync text rating with displayed rating to avoid mismatches
                let cleanDesc = agency.description || '';
                let cleanWhyChoose = agency.why_choose || (agency.generated_desc || '');

                // Replace "rating of 4.8" or "5.0 rating" with actual rating
                if (!agency.is_manual) {
                    cleanDesc = cleanDesc.replace(/rating of \d+\.\d+/gi, `rating of ${rating}`);
                    cleanWhyChoose = cleanWhyChoose.replace(/rating of \d+\.\d+/gi, `rating of ${rating}`);
                    cleanDesc = cleanDesc.replace(/(\d\.\d)(\s+rating)/gi, (match: string, p1: string, p2: string) => `${rating}${p2}`);
                    cleanWhyChoose = cleanWhyChoose.replace(/(\d\.\d)(\s+rating)/gi, (match: string, p1: string, p2: string) => `${rating}${p2}`);
                }

                return {
                    rank: index + 1,
                    name: agency.name,
                    tagline: agency.tagline || agency.generated_desc?.split('.')[0] || `Premium ${service.name}`,
                    clutch_rating: rating,
                    website_url: (agency.website_url || agency.url || '').replace(/\s+/g, '').replace(/%20/g, ''),
                    services: agency.services?.length ? (Array.isArray(agency.services) ? agency.services : agency.services.split(',')) : [service.name],
                    description: cleanDesc,
                    why_choose: cleanWhyChoose,
                    min_project_size: agency.min_project_size || 'Varies',
                    hourly_rate: agency.hourly_rate || 'Contact for pricing',
                    employees_count: agency.employees_count || '10+',
                    year_founded: agency.year_founded || 'N/A',
                    reviews_count: agency.reviews_count || parseInt(agency.reviews) || 0,
                    clutch_url: agency.clutch_url ? (agency.clutch_url.startsWith('http') ? agency.clutch_url : `https://clutch.co/${agency.clutch_url}`) : '',
                    location: agency.location || agency.locality || cityName,
                    source: 'mongodb',
                };
            });

            return NextResponse.json({ data: mapped, source: 'mongodb' });
        } catch (err) {
            console.error('MongoDB error:', err);
            return NextResponse.json({ data: [], source: 'mongodb', error: 'MongoDB connection failed' });
        }
    }

    // Return curated data
    return NextResponse.json({ data: curatedData, source: 'supabase' });
}

// POST - Save a curated agency to a page
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { data, error } = await supabase
            .from('page_listings')
            .insert([body])
            .select();

        if (error) {
            // If unique constraint violation, update rank
            if (error.code === '23505') {
                return NextResponse.json({ error: 'An agency with this rank already exists on this page. Change the rank first.' }, { status: 409 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

// PATCH - Update a curated agency
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        updates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('page_listings')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

// DELETE - Remove a curated agency
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const { error } = await supabase
            .from('page_listings')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
