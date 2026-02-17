import React from 'react'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'

// Note: Need to install class-variance-authority for full implementation, 
// using simple prop logic for now to avoid extra installs unless needed.
// Actually, I'll install cva as it's standard.

// Wait, I didn't install cva yet. I'll stick to simple logic or install it next.
// I'll use simple logic for now.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    href?: string
    target?: string
    rel?: string
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', href, ...props }, ref) => {
        const variants = {
            primary: 'bg-text-primary text-bg-primary hover:bg-text-secondary transition-colors',
            secondary: 'bg-accent-peach text-accent-peach-text hover:bg-opacity-90',
            outline: 'border border-text-primary text-text-primary hover:bg-text-primary hover:text-bg-primary',
            ghost: 'text-text-primary hover:bg-black/5',
        }

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
        }

        const classes = cn(
            'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-text-primary/20 disabled:pointer-events-none disabled:opacity-50',
            variants[variant],
            sizes[size],
            className
        )

        if (href) {
            return (
                <a
                    href={href}
                    className={classes}
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                />
            )
        }

        return (
            <button
                ref={ref as React.Ref<HTMLButtonElement>}
                className={classes}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

