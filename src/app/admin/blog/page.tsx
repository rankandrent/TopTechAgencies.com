"use client";

import { useEffect, useState, useCallback } from 'react';
import { CITIES } from '@/lib/constants';
import {
    Loader2, Plus, Trash2, Save, ChevronDown, GripVertical,
    ExternalLink, Eye, X, Search
} from 'lucide-react';

interface Agency {
    id?: string;
    city_slug: string;
    rank: number;
    name: string;
    tagline: string;
    clutch_rating: number;
    website_url: string;
    services: string[];
    description: string;
    why_choose: string;
    min_project_size: string;
    hourly_rate: string;
    employees_count: string;
    year_founded: string;
    reviews_count: number;
    clutch_url: string;
    location: string;
    is_active: boolean;
}

const EMPTY_AGENCY: Omit<Agency, 'id'> = {
    city_slug: '',
    rank: 1,
    name: '',
    tagline: '',
    clutch_rating: 4.5,
    website_url: '',
    services: [],
    description: '',
    why_choose: '',
    min_project_size: '$10,000+',
    hourly_rate: '$100 - $149 / hr',
    employees_count: '10 - 49',
    year_founded: '2020',
    reviews_count: 0,
    clutch_url: '',
    location: '',
    is_active: true,
};

export default function BlogManagerPage() {
    const [selectedCity, setSelectedCity] = useState('');
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [searchCity, setSearchCity] = useState('');
    const [servicesInput, setServicesInput] = useState('');

    const fetchAgencies = useCallback(async (city: string) => {
        if (!city) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/blog-agencies?city=${city}`);
            const json = await res.json();
            setAgencies(json.data || []);
        } catch {
            console.error('Failed to fetch');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedCity) fetchAgencies(selectedCity);
    }, [selectedCity, fetchAgencies]);

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleSave = async () => {
        if (!editingAgency) return;
        setSaving(true);

        const agencyData = {
            ...editingAgency,
            city_slug: selectedCity,
            services: typeof editingAgency.services === 'string'
                ? (editingAgency.services as unknown as string).split(',').map(s => s.trim())
                : editingAgency.services,
        };

        try {
            if (editingAgency.id) {
                // Update
                const res = await fetch('/api/blog-agencies', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(agencyData),
                });
                if (!res.ok) throw new Error('Failed to update');
                showMessage('Agency updated successfully!', 'success');
            } else {
                // Create
                const { id, ...newAgency } = agencyData;
                const res = await fetch('/api/blog-agencies', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newAgency),
                });
                if (!res.ok) throw new Error('Failed to create');
                showMessage('Agency added successfully!', 'success');
            }

            setShowForm(false);
            setEditingAgency(null);
            fetchAgencies(selectedCity);
        } catch {
            showMessage('Something went wrong!', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove "${name}"?`)) return;

        try {
            const res = await fetch(`/api/blog-agencies?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed');
            showMessage(`"${name}" removed successfully`, 'success');
            fetchAgencies(selectedCity);
        } catch {
            showMessage('Failed to delete', 'error');
        }
    };

    const openAddForm = () => {
        const nextRank = agencies.length > 0
            ? Math.max(...agencies.map(a => a.rank)) + 1
            : 1;
        setEditingAgency({
            ...EMPTY_AGENCY,
            city_slug: selectedCity,
            rank: nextRank,
            location: `${CITIES.find(c => c.slug === selectedCity)?.name || ''}, ${CITIES.find(c => c.slug === selectedCity)?.state || ''}`,
        } as Agency);
        setServicesInput('');
        setShowForm(true);
    };

    const openEditForm = (agency: Agency) => {
        setEditingAgency({ ...agency });
        setServicesInput(Array.isArray(agency.services) ? agency.services.join(', ') : '');
        setShowForm(true);
    };

    const filteredCities = CITIES.filter(c =>
        c.name.toLowerCase().includes(searchCity.toLowerCase()) ||
        c.state.toLowerCase().includes(searchCity.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Blog Manager</h1>
                    <p className="text-gray-500 mt-1">Manage agencies listed on blog posts for each city</p>
                </div>
                {selectedCity && (
                    <div className="flex gap-3">
                        <a
                            href={`/blog/top-ui-ux-design-agencies-in-${selectedCity}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            <Eye className="w-4 h-4" /> Preview Blog
                        </a>
                        <button
                            onClick={openAddForm}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Agency
                        </button>
                    </div>
                )}
            </div>

            {/* Message Toast */}
            {message.text && (
                <div className={`px-4 py-3 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                        'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* City Selector */}
            {!selectedCity ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Select a City</h2>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search cities..."
                            value={searchCity}
                            onChange={(e) => setSearchCity(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto">
                        {filteredCities.map(city => (
                            <button
                                key={city.slug}
                                onClick={() => setSelectedCity(city.slug)}
                                className="text-left p-4 rounded-xl border border-gray-100 hover:border-gray-900 hover:bg-gray-50 transition-all group"
                            >
                                <div className="font-semibold text-gray-900 group-hover:text-gray-900">{city.name}</div>
                                <div className="text-xs text-gray-500">{city.state}</div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {/* Selected City Header */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setSelectedCity(''); setAgencies([]); }}
                            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            ← All Cities
                        </button>
                        <span className="text-gray-300">/</span>
                        <span className="text-sm font-semibold text-gray-900">
                            {CITIES.find(c => c.slug === selectedCity)?.name}, {CITIES.find(c => c.slug === selectedCity)?.state}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            {agencies.length} {agencies.length === 1 ? 'agency' : 'agencies'}
                        </span>
                    </div>

                    {/* Agencies List */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : agencies.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <Plus className="w-12 h-12 mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No agencies yet</h3>
                            <p className="text-gray-500 mb-6">Add agencies to this city&apos;s blog post</p>
                            <button
                                onClick={openAddForm}
                                className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                Add First Agency
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4 w-16">#</th>
                                        <th className="px-6 py-4">Agency</th>
                                        <th className="px-6 py-4">Rating</th>
                                        <th className="px-6 py-4">Services</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 w-32">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {agencies.map((agency) => (
                                        <tr key={agency.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold">
                                                    {agency.rank}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{agency.name}</div>
                                                <div className="text-xs text-gray-500">{agency.tagline}</div>
                                                {agency.website_url && (
                                                    <a href={agency.website_url} target="_blank" rel="noopener noreferrer"
                                                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                                        {agency.website_url} <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="flex items-center gap-1 text-yellow-600 font-medium">
                                                    ★ {agency.clutch_rating}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {(Array.isArray(agency.services) ? agency.services : []).slice(0, 3).map(s => (
                                                        <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${agency.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {agency.is_active ? 'Active' : 'Hidden'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openEditForm(agency)}
                                                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(agency.id!, agency.name)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Add/Edit Modal */}
            {showForm && editingAgency && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-10 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4 mb-10">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingAgency.id ? 'Edit Agency' : 'Add New Agency'}
                            </h2>
                            <button onClick={() => { setShowForm(false); setEditingAgency(null); }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Rank Position</label>
                                    <input type="number" min="1" value={editingAgency.rank}
                                        onChange={e => setEditingAgency({ ...editingAgency, rank: parseInt(e.target.value) || 1 })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Clutch Rating</label>
                                    <input type="number" step="0.1" min="1" max="5" value={editingAgency.clutch_rating}
                                        onChange={e => setEditingAgency({ ...editingAgency, clutch_rating: parseFloat(e.target.value) || 4.5 })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Agency Name *</label>
                                <input type="text" value={editingAgency.name}
                                    onChange={e => setEditingAgency({ ...editingAgency, name: e.target.value })}
                                    placeholder="e.g. Eleken" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Tagline</label>
                                <input type="text" value={editingAgency.tagline}
                                    onChange={e => setEditingAgency({ ...editingAgency, tagline: e.target.value })}
                                    placeholder="e.g. UI/UX design for SaaS" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Website URL</label>
                                <input type="url" value={editingAgency.website_url}
                                    onChange={e => setEditingAgency({ ...editingAgency, website_url: e.target.value })}
                                    placeholder="https://example.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Services (comma-separated)</label>
                                <input type="text" value={servicesInput}
                                    onChange={e => {
                                        setServicesInput(e.target.value);
                                        setEditingAgency({ ...editingAgency, services: e.target.value.split(',').map(s => s.trim()).filter(Boolean) });
                                    }}
                                    placeholder="UI/UX Design, Web Design, SaaS Design" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Description *</label>
                                <textarea rows={3} value={editingAgency.description}
                                    onChange={e => setEditingAgency({ ...editingAgency, description: e.target.value })}
                                    placeholder="A brief description of the agency..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Why Choose This Agency?</label>
                                <textarea rows={2} value={editingAgency.why_choose}
                                    onChange={e => setEditingAgency({ ...editingAgency, why_choose: e.target.value })}
                                    placeholder="What makes this agency stand out..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Min Project Size</label>
                                    <input type="text" value={editingAgency.min_project_size}
                                        onChange={e => setEditingAgency({ ...editingAgency, min_project_size: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Hourly Rate</label>
                                    <input type="text" value={editingAgency.hourly_rate}
                                        onChange={e => setEditingAgency({ ...editingAgency, hourly_rate: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Employees</label>
                                    <input type="text" value={editingAgency.employees_count}
                                        onChange={e => setEditingAgency({ ...editingAgency, employees_count: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Year Founded</label>
                                    <input type="text" value={editingAgency.year_founded}
                                        onChange={e => setEditingAgency({ ...editingAgency, year_founded: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Reviews Count</label>
                                    <input type="number" min="0" value={editingAgency.reviews_count}
                                        onChange={e => setEditingAgency({ ...editingAgency, reviews_count: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Clutch URL</label>
                                    <input type="url" value={editingAgency.clutch_url}
                                        onChange={e => setEditingAgency({ ...editingAgency, clutch_url: e.target.value })}
                                        placeholder="https://clutch.co/profile/..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Location</label>
                                    <input type="text" value={editingAgency.location}
                                        onChange={e => setEditingAgency({ ...editingAgency, location: e.target.value })}
                                        placeholder="New York, NY" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="is_active" checked={editingAgency.is_active}
                                    onChange={e => setEditingAgency({ ...editingAgency, is_active: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300" />
                                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                    Active (visible on blog post)
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                            <button onClick={() => { setShowForm(false); setEditingAgency(null); }}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving || !editingAgency.name}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {editingAgency.id ? 'Update' : 'Add'} Agency
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
