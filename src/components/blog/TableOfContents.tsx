'use client'

import React, { useEffect, useState } from 'react'

interface TOCItem {
    id: string
    title: string
    rank: number
}

interface TableOfContentsProps {
    items: TOCItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('')

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            {
                rootMargin: '-20% 0px -70% 0px', // Trigger when element is in top 30% of viewport
                threshold: 0
            }
        )

        // Observe all agency sections
        items.forEach((item) => {
            const element = document.getElementById(item.id)
            if (element) {
                observer.observe(element)
            }
        })

        return () => observer.disconnect()
    }, [items])

    return (
        <nav className="p-6 rounded-2xl bg-bg-secondary border border-border-light hidden lg:block">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-text-muted">Table of Contents</h4>
            <ul className="space-y-3">
                {items.map((item) => {
                    const isActive = activeId === item.id
                    return (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                className={`text-sm font-medium transition-all duration-200 flex items-center gap-3 ${isActive
                                    ? 'text-text-primary font-bold'
                                    : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isActive
                                    ? 'bg-text-primary text-white'
                                    : 'bg-bg-primary border border-border-light text-text-muted'
                                    }`}>
                                    {item.rank}
                                </span>
                                <span className={isActive ? 'border-b-2 border-text-primary pb-0.5' : ''}>
                                    {item.title}
                                </span>
                            </a>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
