'use client'

import { useState, useMemo } from 'react'
import { Calculator, ChevronDown, ArrowRight, TrendingUp, Clock, Users } from 'lucide-react'

interface Agency {
    name: string
    minProjectSize: string
    hourlyRate: string
    rank: number
}

interface CostCalculatorProps {
    agencies: Agency[]
    serviceName: string
    cityName: string
}

function parseHourlyRate(rate: string): { min: number; max: number } | null {
    // Match patterns like "$25 - $49 / hr", "$50-$99/hr", "$25 - 49", "< $25 / hr", "$100 - $149 / hr"
    const rangeMatch = rate.match(/\$?\s*(\d+)\s*[-–]\s*\$?\s*(\d+)/i)
    if (rangeMatch) {
        return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) }
    }

    // Match "< $25 / hr"
    const lessThan = rate.match(/<\s*\$?\s*(\d+)/i)
    if (lessThan) {
        return { min: Math.round(parseInt(lessThan[1]) * 0.6), max: parseInt(lessThan[1]) }
    }

    // Match "$200+ / hr"
    const moreThan = rate.match(/\$?\s*(\d+)\s*\+/i)
    if (moreThan) {
        const base = parseInt(moreThan[1])
        return { min: base, max: Math.round(base * 1.5) }
    }

    // Single number like "$50 / hr"
    const single = rate.match(/\$?\s*(\d+)/i)
    if (single) {
        const val = parseInt(single[1])
        return { min: val, max: val }
    }

    return null
}

function parseMinProject(str: string): number | null {
    const match = str.match(/\$?\s*([\d,]+)/i)
    if (match) {
        return parseInt(match[1].replace(/,/g, ''))
    }
    return null
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function CostCalculator({ agencies, serviceName, cityName }: CostCalculatorProps) {
    const [selectedIdx, setSelectedIdx] = useState(0)
    const [hours, setHours] = useState(200)
    const [teamSize, setTeamSize] = useState(2)
    const [isOpen, setIsOpen] = useState(false)

    // Filter agencies that have parseable rates
    const validAgencies = useMemo(() => {
        return agencies.filter(a => {
            const rate = parseHourlyRate(a.hourlyRate)
            return rate !== null
        })
    }, [agencies])

    const selected = validAgencies[selectedIdx] || validAgencies[0]
    if (!selected) return null

    const rate = parseHourlyRate(selected.hourlyRate)
    const minProject = parseMinProject(selected.minProjectSize)

    const lowEstimate = rate ? hours * rate.min * teamSize : 0
    const highEstimate = rate ? hours * rate.max * teamSize : 0
    const avgEstimate = Math.round((lowEstimate + highEstimate) / 2)

    const belowMinimum = minProject ? avgEstimate < minProject : false

    return (
        <section className="py-20 bg-bg-secondary border-t border-b border-border-light">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-peach/10 text-accent-peach-text text-sm font-bold mb-4">
                        <Calculator className="w-4 h-4" />
                        Interactive Cost Estimator
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary mb-3">
                        Estimate Your {serviceName} Project Cost
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Select any agency from our {cityName} rankings above to instantly calculate estimated project costs based on their published rates.
                    </p>
                </div>

                <div className="bg-bg-primary rounded-3xl border border-border-light overflow-hidden shadow-sm">
                    {/* Agency Selector */}
                    <div className="p-6 sm:p-8 border-b border-border-light">
                        <label className="block text-sm font-bold text-text-muted mb-3">Select Agency</label>
                        <div className="relative">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-full flex items-center justify-between px-5 py-4 bg-bg-secondary rounded-2xl border border-border-light hover:border-accent-peach/40 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent-peach/20 text-accent-peach-text text-sm font-bold flex items-center justify-center">
                                        #{selected.rank}
                                    </span>
                                    <span className="font-bold text-text-primary">{selected.name}</span>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-bg-primary rounded-2xl border border-border-light shadow-xl z-50 max-h-64 overflow-y-auto">
                                    {validAgencies.map((agency, idx) => (
                                        <button
                                            key={agency.name}
                                            onClick={() => {
                                                setSelectedIdx(idx)
                                                setIsOpen(false)
                                            }}
                                            className={`w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-bg-secondary transition-colors ${idx === selectedIdx ? 'bg-accent-peach/5 text-accent-peach-text' : ''
                                                } ${idx === 0 ? 'rounded-t-2xl' : ''} ${idx === validAgencies.length - 1 ? 'rounded-b-2xl' : ''}`}
                                        >
                                            <span className="w-7 h-7 rounded-full bg-accent-peach/20 text-accent-peach-text text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                #{agency.rank}
                                            </span>
                                            <span className="font-medium text-sm">{agency.name}</span>
                                            <span className="ml-auto text-xs text-text-muted">{agency.hourlyRate}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Agency Rates */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="px-4 py-3 rounded-xl bg-bg-secondary">
                                <p className="text-xs text-text-muted mb-1">Hourly Rate</p>
                                <p className="font-bold text-text-primary">{selected.hourlyRate}</p>
                            </div>
                            <div className="px-4 py-3 rounded-xl bg-bg-secondary">
                                <p className="text-xs text-text-muted mb-1">Min. Project</p>
                                <p className="font-bold text-text-primary">{selected.minProjectSize}</p>
                            </div>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="p-6 sm:p-8 border-b border-border-light">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-text-muted mb-3">
                                    <Clock className="w-4 h-4" />
                                    Estimated Hours
                                </label>
                                <input
                                    type="range"
                                    min={50}
                                    max={2000}
                                    step={50}
                                    value={hours}
                                    onChange={(e) => setHours(parseInt(e.target.value))}
                                    className="w-full h-2 rounded-full appearance-none cursor-pointer mb-2"
                                    style={{
                                        background: `linear-gradient(to right, #f4793a 0%, #f4793a ${((hours - 50) / 1950) * 100}%, #e5e7eb ${((hours - 50) / 1950) * 100}%, #e5e7eb 100%)`
                                    }}
                                />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-text-muted">50 hrs</span>
                                    <span className="text-lg font-bold text-accent-peach-text">{hours} hours</span>
                                    <span className="text-xs text-text-muted">2,000 hrs</span>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-text-muted mb-3">
                                    <Users className="w-4 h-4" />
                                    Team Size
                                </label>
                                <input
                                    type="range"
                                    min={1}
                                    max={10}
                                    step={1}
                                    value={teamSize}
                                    onChange={(e) => setTeamSize(parseInt(e.target.value))}
                                    className="w-full h-2 rounded-full appearance-none cursor-pointer mb-2"
                                    style={{
                                        background: `linear-gradient(to right, #f4793a 0%, #f4793a ${((teamSize - 1) / 9) * 100}%, #e5e7eb ${((teamSize - 1) / 9) * 100}%, #e5e7eb 100%)`
                                    }}
                                />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-text-muted">1 dev</span>
                                    <span className="text-lg font-bold text-accent-peach-text">{teamSize} {teamSize === 1 ? 'developer' : 'developers'}</span>
                                    <span className="text-xs text-text-muted">10 devs</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="p-6 sm:p-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-accent-peach-text" />
                            <h3 className="font-bold text-lg text-text-primary">Estimated Cost with {selected.name}</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div className="text-center py-5 px-4 rounded-2xl bg-green-50 border border-green-200">
                                <p className="text-xs font-bold uppercase text-green-600 mb-1">Low Estimate</p>
                                <p className="text-2xl font-bold text-green-700">{formatCurrency(lowEstimate)}</p>
                                <p className="text-xs text-green-600 mt-1">{hours}hrs × {rate ? `$${rate.min}` : '-'} × {teamSize}</p>
                            </div>
                            <div className="text-center py-5 px-4 rounded-2xl bg-accent-peach/10 border border-accent-peach/30 ring-2 ring-accent-peach/20">
                                <p className="text-xs font-bold uppercase text-accent-peach-text mb-1">Average</p>
                                <p className="text-2xl font-bold text-accent-peach-text">{formatCurrency(avgEstimate)}</p>
                                <p className="text-xs text-accent-peach-text mt-1">Mid-range estimate</p>
                            </div>
                            <div className="text-center py-5 px-4 rounded-2xl bg-red-50 border border-red-200">
                                <p className="text-xs font-bold uppercase text-red-600 mb-1">High Estimate</p>
                                <p className="text-2xl font-bold text-red-700">{formatCurrency(highEstimate)}</p>
                                <p className="text-xs text-red-600 mt-1">{hours}hrs × {rate ? `$${rate.max}` : '-'} × {teamSize}</p>
                            </div>
                        </div>

                        {belowMinimum && minProject && (
                            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 mb-4">
                                <p className="text-sm text-yellow-800">
                                    ⚠️ <strong>Note:</strong> Your estimated cost ({formatCurrency(avgEstimate)}) is below {selected.name}&apos;s minimum project size of <strong>{selected.minProjectSize}</strong>. The actual cost will start at the minimum.
                                </p>
                            </div>
                        )}

                        <p className="text-xs text-text-muted text-center">
                            * Estimates based on published rates. Actual costs may vary based on project complexity and requirements.
                            <a href="/methodology" className="text-accent-peach-text hover:underline ml-1">Learn about our methodology</a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
