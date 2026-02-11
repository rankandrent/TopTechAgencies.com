import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PATCH(request: Request) {
    try {
        const { id, status } = await request.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        if (!['new', 'contacted', 'closed'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const { error } = await supabase
            .from('contact_submissions')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Update error:', error);
            return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
