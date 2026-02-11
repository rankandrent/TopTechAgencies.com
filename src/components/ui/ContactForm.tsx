"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Send, Loader2 } from 'lucide-react'

interface ContactFormProps {
    agencyName: string
    onSuccess?: () => void
}

export function ContactForm({ agencyName, onSuccess }: ContactFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    // Expanded form state
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        message: '',
        source: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agencyName,
                    pageUrl: window.location.href,
                    ...formData
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit')
            }

            setIsSuccess(true)
            if (onSuccess) {
                setTimeout(onSuccess, 3000)
            }
        } catch (error) {
            console.error('Submission error:', error)
            alert('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="text-center py-12">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 text-white shadow-xl">
                    <Send className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                    We&apos;ve notified <strong>{agencyName}</strong>. You should hear back from them shortly.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900">Get in touch</h3>
                <p className="text-gray-500">
                    Send a direct message to <strong>{agencyName}</strong> regarding your project.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold text-gray-900">
                        Full name
                    </label>
                    <input
                        id="name"
                        required
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border-0 bg-gray-50 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-gray-900 transition-all placeholder:text-gray-400"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-semibold text-gray-900">
                        Your company
                    </label>
                    <input
                        id="company"
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border-0 bg-gray-50 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-gray-900 transition-all placeholder:text-gray-400"
                        placeholder="Your company"
                        value={formData.company}
                        onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-900">
                    E-mail
                </label>
                <input
                    id="email"
                    required
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border-0 bg-gray-50 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-gray-900 transition-all placeholder:text-gray-400"
                    placeholder="Your e-mail"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-gray-900">
                    How can we help you?
                </label>
                <textarea
                    id="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border-0 bg-gray-50 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-gray-900 transition-all resize-none placeholder:text-gray-400"
                    placeholder="Tell us about your product..."
                    value={formData.message}
                    onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="source" className="text-sm font-semibold text-gray-900">
                    How did you hear about us?
                </label>
                <div className="relative">
                    <select
                        id="source"
                        className="w-full px-4 py-3 rounded-lg border-0 bg-gray-50 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-gray-900 transition-all text-gray-900 appearance-none"
                        value={formData.source}
                        onChange={e => setFormData(prev => ({ ...prev, source: e.target.value }))}
                    >
                        <option value="" disabled>-</option>
                        <option value="google">Google Search</option>
                        <option value="social">Social Media</option>
                        <option value="referral">Referral</option>
                        <option value="other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-4 text-base bg-gray-900 text-white hover:bg-gray-800 shadow-none hover:shadow-lg transition-all rounded-lg"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Proceed with request →"
                    )}
                </Button>
                <p className="text-xs text-gray-400 mt-4 text-center">
                    By clicking on the button, you consent to the processing of personal data and agree to the site&apos;s Privacy Policy.
                </p>
            </div>
        </form>
    )
}
