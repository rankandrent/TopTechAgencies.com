import React from 'react'
import { cn } from '@/lib/utils'

interface TagBadgeProps {
    children: React.ReactNode
    className?: string
    color?: 'peach' | 'gray'
}

export function TagBadge({ children, className, color = 'peach' }: TagBadgeProps) {
    const styles = {
        peach: 'bg-accent-peach text-accent-peach-text',
        gray: 'bg-gray-100 text-gray-600',
    }

    return (
        <span className={cn(
            'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase',
            styles[color],
            className
        )}>
            {children}
        </span>
    )
}
