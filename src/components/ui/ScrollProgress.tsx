'use client'

import React, { useEffect, useState } from 'react'

export function ScrollProgress() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
            setProgress(scrollPercent)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-border-light">
            <div
                className="h-full bg-text-primary transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}
