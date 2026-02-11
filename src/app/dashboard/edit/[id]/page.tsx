'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { SERVICES, CITIES } from '@/lib/constants'

export default function EditApplicationPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')
    const [application, setApplication] = useState<any>(null)
    const router = useRouter()
    const { id } = useParams()
    const supabase = createClient()

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) {
                    router.push('/login')
                    return
                }

                const { data, error } = await supabase
                    .from('agency_applications')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setApplication(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        if (id) fetchApplication()
    }, [id, router, supabase])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaving(true)
        setError('')

        const formData = new FormData(e.currentTarget)

        try {
            const { error: updateError } = await supabase
                .from('agency_applications')
                .update({
                    company_name: formData.get('company_name'),
                    website_url: formData.get('website_url'),
                    contact_name: formData.get('contact_name'),
                    contact_email: formData.get('contact_email'),
                    service_slug: formData.get('service_slug'),
                    city_slug: formData.get('city_slug'),
                    details: {
                        description: formData.get('description'),
                        phone: formData.get('phone'),
                        founded: formData.get('founded'),
                        employees: formData.get('employees'),
                    },
                    status: 'pending', // Re-submit for review on update
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            if (updateError) throw updateError

            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-text-muted" />
            </div>
        )
    }

    if (!application) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold">Application not found</h2>
                <Link href="/dashboard" className="text-accent-peach mt-4 block">Back to Dashboard</Link>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="mb-8">
                <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-accent-peach transition-colors mb-6 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-text-primary mb-3">Edit Application</h1>
                <p className="text-text-secondary text-lg">Update your agency details. Changes will be reviewed by our team.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 mb-6">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-bg-primary border border-border-light rounded-2xl shadow-sm overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* Section 1: Company Info */}
                    <div>
                        <h3 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-light">Company Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Company Name *</label>
                                <input name="company_name" defaultValue={application.company_name} required className="w-full px-4 py-3 rounded-lg border border-border-light bg-bg-secondary focus:ring-2 focus:ring-accent-peach focus:border-accent-peach outline-none transition-all" />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Website URL *</label>
                                <input name="website_url" type="url" defaultValue={application.website_url} required className="w-full px-4 py-3 rounded-lg border border-border-light bg-bg-secondary focus:ring-2 focus:ring-accent-peach focus:border-accent-peach outline-none transition-all" />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Year Founded</label>
                                <input name="founded" type="number" defaultValue={application.details?.founded} min="1900" max={new Date().getFullYear()} className="w-full px-4 py-3 rounded-lg border border-border-light bg-bg-secondary focus:ring-2 focus:ring-accent-peach focus:border-accent-peach outline-none transition-all" />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Employee Count</label>
                                <select name="employees" defaultValue={application.details?.employees} className="w-full px-4 py-3 rounded-lg border border-border-light bg-bg-secondary focus:ring-2 focus:ring-accent-peach focus:border-accent-peach outline-none transition-all">
                                    <option value="2-9">2 - 9</option>
                                    <option value="10-49">10 - 49</option>
                                    <option value="50-249">50 - 249</option>
                                    <option value="250+">250+</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-light">Contact Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Contact Person Name *</label>
                                <input name="contact_name" defaultValue={application.contact_name} required className="w-full px-4 py-3 rounded-lg border border-border-light bg-bg-secondary focus:ring-2 focus:ring-accent-peach focus:border-accent-peach outline-none transition-all" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Business Email *</label>
                                <input name="contact_email" type="email" defaultValue={application.contact_email} required className="w-full px-4 py-3 rounded-lg border border-border-light bg-bg-secondary focus:ring-2 focus:ring-accent-peach focus:border-accent-peach outline-none transition-all" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
                                <input name="phone" type="tel" defaultValue={application.details?.phone} className="w-full px-4 py-3 rounded-lg border border-border-light bg-bg-secondary focus:ring-2 focus:ring-accent-peach focus:border-accent-peach outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Classification */}
                    <div>
                        <h3 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-light">Listing Category</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Primary Service *</label>
                                <select
                                    name="service_slug"
                                    required
                                    defaultValue={application.service_slug}
                                    className="w-full px-4 py-3 rounded-lg border border-border-light bg-bg-secondary focus:ring-2 focus:ring-accent-peach focus:border-accent-peach outline-none transition-all"
                                >
                                    <option value="">Select a service...</option>
                                    {SERVICES.map(s => (
                                        <option key={s.slug} value={s.slug}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Primary City *</label>
                                <select
                                    name="city_slug"
                                    required
                                    defaultValue={application.city_slug}
                                    className="w-full px-4 py-3 rounded-lg border border-border-light bg-bg-secondary focus:ring-2 focus:ring-accent-peach focus:border-accent-peach outline-none transition-all"
                                >
                                    <option value="">Select a city...</option>
                                    {CITIES.map(c => (
                                        <option key={c.slug} value={c.slug}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Short Description</label>
                                <textarea name="description" defaultValue={application.details?.description} rows={4} className="w-full px-4 py-3 rounded-lg border border-border-light bg-bg-secondary focus:ring-2 focus:ring-accent-peach focus:border-accent-peach outline-none transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-bg-secondary border-t border-border-light flex items-center justify-end gap-4">
                    <Link href="/dashboard" className="px-6 py-3 font-medium text-text-secondary hover:text-text-primary transition-colors">Cancel</Link>
                    <button type="submit" disabled={isSaving} className="px-8 py-3 bg-text-primary text-bg-primary font-bold rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center gap-2">
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        Update Application
                    </button>
                </div>
            </form>
        </div>
    )
}
