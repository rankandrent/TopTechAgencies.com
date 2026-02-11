import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Initialize clients
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_EMAIL || 'admin@toptechagencies.com';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { agencyName, name, email, company, source, message, pageUrl } = body;

        // Basic validation
        if (!agencyName || !name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from('contact_submissions')
            .insert([
                {
                    agency_name: agencyName,
                    name,
                    email,
                    company: company || null,
                    source: source || null,
                    message,
                    page_url: pageUrl || null,
                    status: 'new'
                }
            ])
            .select();

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json(
                { error: 'Failed to save submission' },
                { status: 500 }
            );
        }

        // Send email notification (non-blocking — don't wait for it)
        sendEmailAlert({ agencyName, name, email, company, source, message, pageUrl }).catch(
            (err) => console.error('Email alert failed:', err)
        );

        return NextResponse.json(
            { success: true, message: 'Submission received', data },
            { status: 200 }
        );

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// Email alert function
async function sendEmailAlert({
    agencyName,
    name,
    email,
    company,
    source,
    message,
    pageUrl,
}: {
    agencyName: string;
    name: string;
    email: string;
    company?: string;
    source?: string;
    message: string;
    pageUrl?: string;
}) {
    try {
        await resend.emails.send({
            from: 'TopTechAgencies <alerts@toptechagencies.com>',
            to: ADMIN_NOTIFY_EMAIL,
            subject: `🔔 New Lead: ${name} wants to connect with ${agencyName}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 32px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">🔔 New Lead Received</h1>
                        <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">Someone wants to connect with <strong style="color: #60a5fa;">${agencyName}</strong></p>
                    </div>
                    
                    <!-- Body -->
                    <div style="padding: 32px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; font-weight: 600; width: 120px; vertical-align: top;">Name</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; font-weight: 600; vertical-align: top;">Email</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px;">
                                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                                </td>
                            </tr>
                            ${company ? `
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; font-weight: 600; vertical-align: top;">Company</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px;">${company}</td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; font-weight: 600; vertical-align: top;">Agency</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px; font-weight: 600;">${agencyName}</td>
                            </tr>
                            ${source ? `
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; font-weight: 600; vertical-align: top;">Source</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px; text-transform: capitalize;">${source}</td>
                            </tr>
                            ` : ''}
                            ${pageUrl ? `
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; font-weight: 600; vertical-align: top;">Page</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px;">
                                    <a href="${pageUrl}" style="color: #2563eb; text-decoration: none; word-break: break-all;">${pageUrl}</a>
                                </td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600; vertical-align: top;">Message</td>
                                <td style="padding: 12px 0; color: #1e293b; font-size: 14px; line-height: 1.6;">${message}</td>
                            </tr>
                        </table>
                        
                        <!-- CTA -->
                        <div style="margin-top: 24px; text-align: center;">
                            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://toptechagencies.com'}/admin/dashboard" 
                               style="display: inline-block; background: #1e293b; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                                View in Dashboard →
                            </a>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #94a3b8; font-size: 12px;">TopTechAgencies Lead Alert System</p>
                    </div>
                </div>
            `,
        });
        console.log('✅ Email alert sent successfully');
    } catch (err) {
        console.error('❌ Email send failed:', err);
    }
}
