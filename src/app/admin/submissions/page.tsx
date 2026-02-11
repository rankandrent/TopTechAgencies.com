"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, Search, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('contact_submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) console.error('Fetch error:', error);
            setSubmissions(data || []);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        setSubmissions(prev =>
            prev.map(s => s.id === id ? { ...s, status: newStatus } : s)
        );
        try {
            const res = await fetch('/api/contact/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });
            if (!res.ok) throw new Error('Failed');
        } catch {
            fetchSubmissions(); // Revert by refetching
        }
    };

    const exportCSV = () => {
        const headers = ['Date', 'Name', 'Email', 'Company', 'Agency', 'Source', 'Page', 'Message', 'Status'];
        const rows = filtered.map(s => [
            new Date(s.created_at).toLocaleDateString(),
            s.name, s.email, s.company || '', s.agency_name,
            s.source || '', s.page_url || '', s.message, s.status
        ]);
        const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const filtered = submissions.filter(s => {
        const matchesSearch = search === '' ||
            s.name?.toLowerCase().includes(search.toLowerCase()) ||
            s.email?.toLowerCase().includes(search.toLowerCase()) ||
            s.agency_name?.toLowerCase().includes(search.toLowerCase()) ||
            s.company?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">All Submissions</h1>
                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, agency..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                    <option value="all">All Status</option>
                    <option value="new">🔵 New</option>
                    <option value="contacted">🟢 Contacted</option>
                    <option value="closed">⚫ Closed</option>
                </select>
                <span className="text-sm text-gray-500">{filtered.length} results</span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
                            {filtered.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{sub.agency_name}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{sub.name}</div>
                                        <div className="text-gray-500 text-xs">{sub.email}</div>
                                        {sub.company && <div className="text-gray-400 text-xs">{sub.company}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {sub.page_url ? (
                                            <a href={sub.page_url} target="_blank" rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-xs max-w-[200px] block truncate" title={sub.page_url}>
                                                {(() => { try { return new URL(sub.page_url).pathname; } catch { return sub.page_url; } })()}
                                            </a>
                                        ) : <span className="text-gray-400">-</span>}
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
                                            onChange={(e) => updateStatus(sub.id, e.target.value)}
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
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        {search || statusFilter !== 'all' ? 'No matching submissions found.' : 'No submissions yet.'}
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
