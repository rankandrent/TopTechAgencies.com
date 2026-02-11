"use client"

import React from 'react'
import { AgencyVisual } from '@/components/blog/AgencyVisual'
import { H2, H3, P } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { Star, Send, DollarSign, Clock, Users, Calendar, MessageSquare, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { ContactForm } from '@/components/ui/ContactForm'

interface AgencyEntryProps {
    rank: number
    name: string
    description: string
    whyChoose: string | string[]
    clutchRating: number
    tagline: string
    websiteUrl: string
    services: string[];
    // New stats fields
    minProjectSize?: string
    hourlyRate?: string
    employeesCount?: string
    yearFounded?: string
    reviewsCount?: number
    clutchUrl?: string | null
    location?: string
    isProminent?: boolean
}

export function AgencyEntry({
    rank,
    name,
    description,
    whyChoose,
    clutchRating,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tagline,
    websiteUrl,
    services,
    minProjectSize,
    hourlyRate,
    employeesCount,
    yearFounded,
    reviewsCount,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clutchUrl,
    location,
    isProminent = false
}: AgencyEntryProps) {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false)
    const id = name.toLowerCase().replace(/ /g, '-')

    // Get favicon URL from Google API
    const getFaviconUrl = (url: string) => {
        try {
            const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
            return null;
        }
    };

    const faviconUrl = websiteUrl ? getFaviconUrl(websiteUrl) : null;

    return (
        <div
            id={id}
            className={`py-20 pt-0 border-b border-border-light last:border-0 scroll-mt-32 relative ${isProminent ? 'bg-gradient-to-br from-accent-peach/5 to-transparent p-8 -mx-8 rounded-3xl border border-accent-peach/30 shadow-lg' : ''
                }`}
        >
            {isProminent && (
                <div className="absolute -top-4 left-8 bg-accent-peach text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md z-10 flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 fill-current" /> Top Pick
                </div>
            )}

            {/* Contact Modal */}
            <Modal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                title="Connect with Agency"
            >
                <ContactForm
                    agencyName={name}
                    onSuccess={() => setTimeout(() => setIsContactModalOpen(false), 2000)}
                />
            </Modal>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Rank Badge */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-text-primary text-bg-primary flex items-center justify-center text-xl font-bold">
                    {rank}
                </div>

                <div className="flex-grow space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Company Favicon */}
                            {faviconUrl && (
                                <img
                                    src={faviconUrl}
                                    alt={`${name} logo`}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 rounded-lg bg-bg-secondary border border-border-light p-1"
                                />
                            )}
                            <div>
                                <p className="text-xs uppercase tracking-widest text-accent-peach-text font-semibold mb-2">
                                    Featured Agency
                                </p>
                                <H2 className="text-2xl md:text-3xl">{name}</H2>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-bold">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="pt-0.5">{clutchRating.toFixed(1)}</span>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setIsContactModalOpen(true)}
                                className="bg-cta-primary text-cta-text hover:bg-cta-primary/90 border-transparent shadow-lg shadow-cta-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-base px-6 py-2.5"
                            >
                                Let&apos;s Connect <Send className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Agency Visual Card */}
                    <AgencyVisual
                        name={name}
                        faviconUrl={faviconUrl}
                        rating={clutchRating}
                        location={location || 'USA'}
                        services={services}
                        yearFounded={yearFounded || 'N/A'}
                        employeesCount={employeesCount || 'N/A'}
                        websiteUrl={websiteUrl}
                        rank={rank}
                    />

                    <P className="text-lg">{description}</P>

                    {/* Company Stats - Pill Style (like Core Services) */}
                    <div className="flex flex-wrap gap-3 pt-6">
                        {minProjectSize && minProjectSize !== 'Varies' && minProjectSize !== 'N/A' && (
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-bg-secondary rounded-full border border-border-light">
                                <DollarSign className="h-4 w-4 text-text-secondary" />
                                <span className="text-sm text-text-secondary">Min. Project:</span>
                                <span className="text-sm font-semibold text-text-primary">{minProjectSize}</span>
                            </div>
                        )}
                        {hourlyRate && hourlyRate !== 'Contact for pricing' && hourlyRate !== 'N/A' && (
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-bg-secondary rounded-full border border-border-light">
                                <Clock className="h-4 w-4 text-text-secondary" />
                                <span className="text-sm text-text-secondary">Hourly Rate:</span>
                                <span className="text-sm font-semibold text-text-primary">{hourlyRate}</span>
                            </div>
                        )}
                        {employeesCount && employeesCount !== '10+' && employeesCount !== 'N/A' && (
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-bg-secondary rounded-full border border-border-light">
                                <Users className="h-4 w-4 text-text-secondary" />
                                <span className="text-sm text-text-secondary">Team Size:</span>
                                <span className="text-sm font-semibold text-text-primary">{employeesCount}</span>
                            </div>
                        )}
                        {yearFounded && yearFounded !== 'N/A' && yearFounded !== '0000' && parseInt(yearFounded) > 1900 && (
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-bg-secondary rounded-full border border-border-light">
                                <Calendar className="h-4 w-4 text-text-secondary" />
                                <span className="text-sm text-text-secondary">Founded:</span>
                                <span className="text-sm font-semibold text-text-primary">{yearFounded}</span>
                            </div>
                        )}
                        {reviewsCount && reviewsCount > 0 && (
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-bg-secondary rounded-full border border-border-light">
                                <MessageSquare className="h-4 w-4 text-text-secondary" />
                                <span className="text-sm text-text-secondary">Reviews:</span>
                                <span className="text-sm font-semibold text-text-primary">{reviewsCount}</span>
                            </div>
                        )}
                        {location && location !== 'N/A' && (
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-bg-secondary rounded-full border border-border-light">
                                <MapPin className="h-4 w-4 text-text-secondary" />
                                <span className="text-sm text-text-secondary">Location:</span>
                                <span className="text-sm font-semibold text-text-primary">{location}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="p-6 rounded-2xl bg-accent-peach/20 border border-accent-peach/30">
                            <H3 className="font-bold text-sm uppercase tracking-wider mb-4 text-accent-peach-text">Why Choose {name}</H3>
                            <div className="space-y-4 text-base leading-relaxed text-text-primary">
                                {(Array.isArray(whyChoose) ? whyChoose : [whyChoose]).map((paragraph, pIndex) => (
                                    <p key={pIndex}>
                                        {String(paragraph || '').split(/(\*\*.*?\*\*)/g).map((part, index) => {
                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                return <strong key={index} className="font-bold text-text-primary">{part.slice(2, -2)}</strong>
                                            }
                                            return <span key={index}>{part}</span>
                                        })}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Core Services - Horizontal Tags */}
                        <div className="p-6 rounded-2xl bg-bg-secondary border border-border-light">
                            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-text-muted">Core Services</h4>
                            <div className="flex flex-wrap gap-2">
                                {services.map(s => (
                                    <span key={s} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-text-secondary">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
