import React from 'react'
import { Star, MapPin, Users, Calendar, ExternalLink } from 'lucide-react'

interface AgencyVisualProps {
    name: string
    faviconUrl: string | null
    rating: number
    location: string
    services: string[]
    yearFounded: string
    employeesCount: string
    websiteUrl: string
    rank: number
}

export function AgencyVisual({
    name,
    faviconUrl,
    rating,
    location,
    services,
    yearFounded,
    employeesCount,
    websiteUrl,
    rank
}: AgencyVisualProps) {
    const displayServices = services.slice(0, 4)

    const gradients = [
        'from-slate-900 via-slate-800 to-slate-700',
        'from-gray-900 via-gray-800 to-gray-700',
        'from-zinc-900 via-zinc-800 to-zinc-700',
        'from-neutral-900 via-neutral-800 to-neutral-700',
        'from-stone-900 via-stone-800 to-stone-700',
    ]
    const gradient = gradients[(rank - 1) % gradients.length]

    const accents = [
        { bg: 'bg-amber-400', text: 'text-amber-400', border: 'border-amber-400/30' },
        { bg: 'bg-emerald-400', text: 'text-emerald-400', border: 'border-emerald-400/30' },
        { bg: 'bg-sky-400', text: 'text-sky-400', border: 'border-sky-400/30' },
        { bg: 'bg-violet-400', text: 'text-violet-400', border: 'border-violet-400/30' },
        { bg: 'bg-rose-400', text: 'text-rose-400', border: 'border-rose-400/30' },
        { bg: 'bg-orange-400', text: 'text-orange-400', border: 'border-orange-400/30' },
        { bg: 'bg-cyan-400', text: 'text-cyan-400', border: 'border-cyan-400/30' },
        { bg: 'bg-teal-400', text: 'text-teal-400', border: 'border-teal-400/30' },
        { bg: 'bg-indigo-400', text: 'text-indigo-400', border: 'border-indigo-400/30' },
        { bg: 'bg-pink-400', text: 'text-pink-400', border: 'border-pink-400/30' },
    ]
    const accent = accents[(rank - 1) % accents.length]

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 md:p-8 shadow-2xl`}>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.02] rounded-full translate-y-1/2 -translate-x-1/2" />



            <div className="relative flex flex-col md:flex-row items-start gap-6">
                {/* Left Content */}
                <div className="flex-grow space-y-4 md:pr-6">


                    {/* Rating & Location Row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                            <Star className={`h-4 w-4 ${accent.text} fill-current`} />
                            <span className="text-white text-sm font-bold">{rating.toFixed(1)}</span>
                        </div>
                        {location && location !== 'N/A' && (
                            <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{location}</span>
                            </div>
                        )}
                        {yearFounded && yearFounded !== 'N/A' && parseInt(yearFounded) > 1900 && (
                            <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Est. {yearFounded}</span>
                            </div>
                        )}
                        {employeesCount && employeesCount !== 'N/A' && employeesCount !== '10+' && (
                            <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                                <Users className="h-3.5 w-3.5" />
                                <span>{employeesCount}</span>
                            </div>
                        )}
                    </div>

                    {/* Services Tags */}
                    <div className="flex flex-wrap gap-2">
                        {displayServices.map((service, idx) => (
                            <span
                                key={idx}
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${accent.border} text-gray-200 bg-white/5`}
                            >
                                {service}
                            </span>
                        ))}
                    </div>

                    {/* Website Link */}
                    <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 text-xs ${accent.text} hover:underline font-medium`}
                    >
                        <ExternalLink className="h-3 w-3" />
                        {websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '').substring(0, 40)}
                    </a>
                </div>

                {/* Right Side - Favicon / Logo */}
                <div className="flex-shrink-0 flex items-center justify-center">
                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/10 backdrop-blur-sm border ${accent.border} flex items-center justify-center p-3`}>
                        {faviconUrl ? (
                            <img
                                src={faviconUrl}
                                alt={`${name} logo`}
                                width={64}
                                height={64}
                                className="w-full h-full object-contain rounded-lg"
                            />
                        ) : (
                            <span className={`text-3xl md:text-4xl font-black ${accent.text}`}>
                                {name.charAt(0)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${accent.bg} opacity-60`} />
        </div>
    )
}
