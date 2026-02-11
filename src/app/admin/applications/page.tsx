"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, TrendingUp, Users, CheckCircle, XCircle, Search, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Initialize Supabase client
const supabase = createClient();

export default function ApplicationsPage() {
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Fetch applications
            const { data, error } = await supabase
                .from('agency_applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const apps = data || [];
            setApplications(apps);

            // Calculate stats
            setStats({
                total: apps.length,
                pending: apps.filter(a => a.status === 'pending').length,
                approved: apps.filter(a => a.status === 'approved').length
            });

        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            // Optimistic update
            setApplications(prev => prev.map(app =>
                app.id === id ? { ...app, status: newStatus } : app
            ));

            const { error } = await supabase
                .from('agency_applications')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            // Re-fetch to sync stats
            fetchData();
        } catch (err) {
            console.error('Update failed:', err);
            // Revert on error
            fetchData();
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch =
            app.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.contact_email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

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
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Agency Applications</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
                        <Users className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Approved Agencies</h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Details</th>
                                <th className="px-6 py-4">Submitted</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredApplications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{app.company_name}</div>
                                        <a
                                            href={app.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline text-xs flex items-center gap-1 mt-1"
                                        >
                                            Visit Website <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900">{app.contact_name}</div>
                                        <div className="text-gray-500 text-xs">{app.contact_email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="capitalize font-medium text-gray-700">{app.service_slug}</div>
                                        <div className="text-gray-500 text-xs capitalize">{app.city_slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-gray-600 max-w-[200px]">
                                            <p className="truncate" title={app.details?.description}>{app.details?.description || '-'}</p>
                                            <div className="mt-1 flex gap-2">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px]">{app.details?.employees || '?'} Empl.</span>
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px]">Est. {app.details?.founded || '?'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                        {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {app.status !== 'approved' && (
                                                <button
                                                    onClick={() => updateStatus(app.id, 'approved')}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Approve"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            {app.status !== 'rejected' && (
                                                <button
                                                    onClick={() => updateStatus(app.id, 'rejected')}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredApplications.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No applications found matching your criteria.
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
