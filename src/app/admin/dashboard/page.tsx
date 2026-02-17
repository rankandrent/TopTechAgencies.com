"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, TrendingUp, Users, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Initialize Supabase client OUTSIDE component to avoid re-creation on every render
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function DashboardPage() {
    const [stats, setStats] = useState({ total: 0, newCount: 0, contactedCount: 0, closedCount: 0 });
    const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Fetch total count
                const { count: totalCount, error: countError } = await supabase
                    .from('contact_submissions')
                    .select('*', { count: 'exact', head: true });

                if (countError) console.error('Count error:', countError);

                // Fetch new submissions count
                const { count: newCount } = await supabase
                    .from('contact_submissions')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'new');

                // Fetch contacted count
                const { count: contactedCount } = await supabase
                    .from('contact_submissions')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'contacted');

                // Fetch closed count
                const { count: closedCount } = await supabase
                    .from('contact_submissions')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'closed');

                // Fetch recent submissions
                const { data: submissions, error: fetchError } = await supabase
                    .from('contact_submissions')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (fetchError) console.error('Fetch error:', fetchError);

                setStats({
                    total: totalCount || 0,
                    newCount: newCount || 0,
                    contactedCount: contactedCount || 0,
                    closedCount: closedCount || 0,
                });
                setRecentSubmissions(submissions || []);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
                        <MessageCircle className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-blue-700">🔵 New Leads</h3>
                        {stats.newCount > 0 && (
                            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                        )}
                    </div>
                    <p className="text-3xl font-extrabold text-blue-700">{stats.newCount}</p>
                    <p className="text-xs text-blue-500 mt-1">Awaiting response</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">🟢 Contacted</h3>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.contactedCount}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">⚫ Closed</h3>
                        <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.closedCount}</p>
                </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Recent Inquiries</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Agency</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Page</th>
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4">Source</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentSubmissions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{sub.agency_name}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{sub.name}</div>
                                        <div className="text-gray-500 text-xs">{sub.email}</div>
                                        {sub.company && <div className="text-gray-400 text-xs">{sub.company}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {sub.page_url ? (
                                            <a
                                                href={sub.page_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-xs max-w-[200px] block truncate"
                                                title={sub.page_url}
                                            >
                                                {new URL(sub.page_url).pathname}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 max-w-[250px]">
                                        <p className="truncate" title={sub.message}>{sub.message}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 capitalize whitespace-nowrap">{sub.source || '-'}</td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                        {formatDistanceToNow(new Date(sub.created_at), { addSuffix: true })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={sub.status}
                                            onChange={async (e) => {
                                                const newStatus = e.target.value;
                                                // Optimistic UI update
                                                setRecentSubmissions(prev =>
                                                    prev.map(s => s.id === sub.id ? { ...s, status: newStatus } : s)
                                                );
                                                try {
                                                    const res = await fetch('/api/contact/status', {
                                                        method: 'PATCH',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ id: sub.id, status: newStatus }),
                                                    });
                                                    if (!res.ok) throw new Error('Failed');
                                                } catch {
                                                    // Revert on error
                                                    setRecentSubmissions(prev =>
                                                        prev.map(s => s.id === sub.id ? { ...s, status: sub.status } : s)
                                                    );
                                                }
                                            }}
                                            className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer appearance-none focus:ring-2 focus:ring-offset-1 ${sub.status === 'new' ? 'bg-blue-100 text-blue-800 focus:ring-blue-300' :
                                                sub.status === 'contacted' ? 'bg-green-100 text-green-800 focus:ring-green-300' :
                                                    'bg-gray-100 text-gray-800 focus:ring-gray-300'
                                                }`}
                                        >
                                            <option value="new">🔵 New</option>
                                            <option value="contacted">🟢 Contacted</option>
                                            <option value="closed">⚫ Closed</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {recentSubmissions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No submissions yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
