import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Fetch agencies for a city
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const citySlug = searchParams.get('city');

    let query = supabase
        .from('blog_agencies')
        .select('*')
        .order('rank', { ascending: true });

    if (citySlug) {
        query = query.eq('city_slug', citySlug);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}

// POST - Add a new agency
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { data, error } = await supabase
            .from('blog_agencies')
            .insert([body])
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

// PATCH - Update an agency
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        updates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('blog_agencies')
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

// DELETE - Remove an agency
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const { error } = await supabase
            .from('blog_agencies')
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
