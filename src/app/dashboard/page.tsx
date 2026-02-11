import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, LayoutTemplate, MapPin } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: applications } = await supabase
        .from('agency_applications')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">My Agency Listings</h1>
                    <p className="text-text-secondary text-sm mt-1">Manage your applications and check their status.</p>
                </div>
                <Link href="/dashboard/apply" className="px-6 py-3 bg-text-primary text-bg-primary rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-text-primary/10">
                    <Plus className="w-5 h-5" /> Submit New Listing
                </Link>
            </div>

            {applications && applications.length > 0 ? (
                <div className="bg-bg-primary border border-border-light rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-bg-secondary border-b border-border-light">
                                <tr>
                                    <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-wider text-text-muted">Company Details</th>
                                    <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-wider text-text-muted">Target Market</th>
                                    <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-wider text-text-muted">Status</th>
                                    <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-wider text-text-muted">Submitted On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light">
                                {applications.map((app: any) => (
                                    <tr key={app.id} className="hover:bg-bg-secondary/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                                                    {app.company_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-text-primary">{app.company_name}</p>
                                                    <a href={app.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-text-secondary hover:text-accent-peach transition-colors truncate max-w-[150px] block">
                                                        {app.website_url}
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                                                    <LayoutTemplate className="w-4 h-4 text-text-muted" />
                                                    {app.service_slug}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                    <MapPin className="w-4 h-4 text-text-muted" />
                                                    {app.city_slug}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${app.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                    'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full mr-2 ${app.status === 'approved' ? 'bg-green-500' :
                                                    app.status === 'rejected' ? 'bg-red-500' :
                                                        'bg-yellow-500'
                                                    }`} />
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-text-secondary text-sm">
                                            {new Date(app.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-24 bg-bg-primary border border-border-light rounded-2xl border-dashed">
                    <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted border border-border-light">
                        <Plus className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-3">No listings found</h3>
                    <p className="text-text-secondary mb-8 max-w-sm mx-auto leading-relaxed">
                        Get your agency in front of thousands of potential clients. Submit your first application today.
                    </p>
                    <Link href="/dashboard/apply" className="px-8 py-4 bg-accent-peach text-accent-peach-text rounded-xl font-bold inline-flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-accent-peach/20">
                        <Plus className="w-5 h-5" /> Submit First Listing
                    </Link>
                </div>
            )}
        </div>
    )
}
