"use client"

import { useState, useRef, useEffect } from 'react'
import { AgencyEntry } from '@/components/blog/AgencyEntry'
import { MobileStickyBar } from './MobileStickyBar'
import { Modal } from '@/components/ui/Modal'
import { ContactForm } from '@/components/ui/ContactForm'
import { SemanticSchema } from '@/components/seo/SemanticSchema'

export function AgencyList({ agencies, city }: { agencies: any[], city: string }) {
    const [activeAgency, setActiveAgency] = useState<any>(null)
    const [selectedAgency, setSelectedAgency] = useState<any>(null)
    const [isContactModalOpen, setIsContactModalOpen] = useState(false)

    // Intersection Observer to track active agency
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const agencyId = entry.target.getAttribute('data-agency-rank')
                        const agency = agencies.find(a => a.rank === Number(agencyId))
                        if (agency) {
                            setActiveAgency(agency)
                        }
                    }
                })
            },
            {
                threshold: 0.5, // 50% visibility
                rootMargin: '-10% 0px -40% 0px' // Focus on the middle/top of screen
            }
        )

        const agencyElements = document.querySelectorAll('.agency-card')
        agencyElements.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [agencies])

    const handleConnect = (agency: any) => {
        setSelectedAgency(agency)
        setIsContactModalOpen(true)
    }

    return (
        <div className="space-y-16">
            {agencies.map((agency) => (
                <div
                    key={agency.rank}
                    className="agency-card"
                    data-agency-rank={agency.rank}
                >
                    <AgencyEntry
                        {...agency}
                        onConnect={() => handleConnect(agency)}
                    />
                    <SemanticSchema type="LocalBusiness" data={{
                        name: agency.name,
                        description: agency.description,
                        url: agency.websiteUrl,
                        rating: agency.clutchRating,
                        city: city, // utilizing city prop
                        state: agency.location?.split(',')[1]?.trim() || '' // Best effort extraction or pass state prop
                    }} />
                </div>
            ))}

            {/* Mobile Sticky Bar */}
            {activeAgency && (
                <div className="md:hidden">
                    <MobileStickyBar
                        agency={{
                            rank: activeAgency.rank,
                            name: activeAgency.name,
                            rating: activeAgency.clutchRating,
                            logoUrl: null // Add logic if needed
                        }}
                        onConnect={() => handleConnect(activeAgency)}
                    />
                </div>
            )}

            {/* Global Contact Modal */}
            <Modal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                title={selectedAgency ? `Connect with ${selectedAgency.name}` : 'Connect with Agency'}
            >
                <ContactForm
                    agencyName={selectedAgency?.name || ''}
                    onSuccess={() => setTimeout(() => setIsContactModalOpen(false), 2000)}
                />
            </Modal>
        </div>
    )
}
