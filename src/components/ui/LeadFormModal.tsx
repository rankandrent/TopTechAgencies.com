"use client"

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { ContactForm } from '@/components/ui/ContactForm'

interface LeadFormModalProps {
    agencyName: string
    trigger: React.ReactNode
}

export function LeadFormModal({ agencyName, trigger }: LeadFormModalProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false)
        }
        if (isOpen) {
            window.addEventListener('keydown', handleEscape)
        }
        return () => window.removeEventListener('keydown', handleEscape)
    }, [isOpen])

    return (
        <>
            <span onClick={() => setIsOpen(true)} className="cursor-pointer">
                {trigger}
            </span>

            {isOpen && (
                <div className="fixed inset-0 z-[999]">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div
                            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>

                            {/* Form content */}
                            <div className="p-8 max-h-[85vh] overflow-y-auto">
                                <ContactForm
                                    agencyName={agencyName}
                                    onSuccess={() => {
                                        setTimeout(() => setIsOpen(false), 3000)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </>
    )
}
