'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2, ArrowLeft, Mail, Lock, UserPlus, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setMessage('')

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/dashboard')
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                setMessage('Account created! Please check your email to verify.')
            }
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link href="/" className="inline-flex items-center text-sm text-text-secondary hover:text-text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="bg-bg-secondary border border-border-light rounded-2xl p-8 shadow-xl">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-text-primary mb-2">
                            {isLogin ? 'Welcome Back' : 'Get Listed Today'}
                        </h1>
                        <p className="text-text-secondary text-sm">
                            {isLogin
                                ? 'Sign in to manage your agency listing'
                                : 'Create an account to apply for a listing'}
                        </p>
                    </div>

                    <div className="flex bg-bg-primary p-1 rounded-lg mb-8 border border-border-light">
                        <button
                            type="button"
                            onClick={() => { setIsLogin(true); setError(''); setMessage(''); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin
                                    ? 'bg-white shadow-sm text-text-primary'
                                    : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsLogin(false); setError(''); setMessage(''); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin
                                    ? 'bg-white shadow-sm text-text-primary'
                                    : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {message && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm mb-6 border border-green-200">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6 border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-bg-primary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-peach/50 transition-all"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-bg-primary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-peach/50 transition-all"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-text-primary text-bg-primary font-bold rounded-xl hover:bg-text-secondary transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                isLogin ? (
                                    <>Sign In <LogIn className="w-4 h-4" /></>
                                ) : (
                                    <>Create Account <UserPlus className="w-4 h-4" /></>
                                )
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
