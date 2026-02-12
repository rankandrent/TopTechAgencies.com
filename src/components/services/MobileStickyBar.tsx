"use client"

import { Button } from '@/components/ui/Button'
import { Send, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface MobileStickyBarProps {
    agency: {
        rank: number
        name: string
        rating: number
        logoUrl?: string | null
    } | null
    onConnect: () => void
}

export function MobileStickyBar({ agency, onConnect }: MobileStickyBarProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (agency) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }, [agency])

    if (!agency) return null

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] p-4 transition-transform duration-300 md:hidden pb-safe",
                isVisible ? "translate-y-0" : "translate-y-full"
            )}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                        #{agency.rank}
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 truncate text-sm leading-tight">
                            {agency.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
                            <Star className="w-3 h-3 fill-current" />
                            {agency.rating.toFixed(1)} Rating
                        </div>
                    </div>
                </div>
                <Button
                    onClick={onConnect}
                    size="sm"
                    className="flex-shrink-0 bg-cta-primary text-white shadow-lg shadow-cta-primary/20 whitespace-nowrap px-4"
                >
                    Connect <Send className="w-3 h-3 ml-1.5" />
                </Button>
            </div>
        </div>
    )
}
