"use client"

import { Button } from '@/components/ui/Button'
import { LeadFormModal } from '@/components/ui/LeadFormModal'
import { ExternalLink, Send } from 'lucide-react'

interface AgencyActionsProps {
    agencyName: string
    websiteUrl: string | null
}

export function AgencyHeroActions({ agencyName, websiteUrl }: AgencyActionsProps) {
    return (
        <div className="flex flex-wrap gap-4 pt-2">
            {websiteUrl && (
                <Button
                    variant="primary"
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                >
                    Visit Website <ExternalLink className="w-4 h-4" />
                </Button>
            )}

            <LeadFormModal
                agencyName={agencyName}
                trigger={
                    <Button variant="outline" className="border-border-light">
                        Get a Quote
                    </Button>
                }
            />
        </div>
    )
}

export function AgencySidebarCTA({ agencyName }: { agencyName: string }) {
    return (
        <div className="pt-6">
            <LeadFormModal
                agencyName={agencyName}
                trigger={
                    <span className="inline-flex items-center justify-center rounded-full font-medium transition-colors bg-text-primary text-bg-primary hover:bg-text-secondary w-full py-4 text-lg cursor-pointer">
                        <Send className="w-5 h-5 mr-3" /> Connect with Agency
                    </span>
                }
            />
            <p className="text-center text-xs text-text-muted mt-4">
                Average response time: &lt; 24 hours
            </p>
        </div>
    )
}

export function AgencyCTASection({ agencyName, websiteUrl }: AgencyActionsProps) {
    return (
        <section className="pt-8 border-t border-border-light">
            <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-peach rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 text-center">
                    <span className="inline-block mb-4 text-4xl">✨</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                        Ready to Start Your Project with {agencyName}?
                    </h2>
                    <p className="text-gray-300 max-w-xl mx-auto mb-6">
                        Get a free consultation and project estimate. Our team will connect you directly with {agencyName} to discuss your requirements.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <LeadFormModal
                            agencyName={agencyName}
                            trigger={
                                <span className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent-peach text-accent-peach-text font-bold rounded-full hover:bg-accent-peach/90 transition-colors text-lg cursor-pointer">
                                    <Send className="w-5 h-5" /> Request Introduction
                                </span>
                            }
                        />
                        {websiteUrl && (
                            <a
                                href={websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
                            >
                                Visit Website <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
