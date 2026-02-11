import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@toptechagencies.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TopTech@2026';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Create a simple session token
        const token = Buffer.from(`${ADMIN_EMAIL}:${Date.now()}`).toString('base64');

        // Set HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
