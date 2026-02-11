import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, FileText, Settings, LogOut, Code } from 'lucide-react'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-bg-secondary flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-bg-primary border-r border-border-light flex-shrink-0">
                <div className="p-6 border-b border-border-light flex items-center justify-between md:block">
                    <Link href="/" className="text-xl font-bold tracking-tight text-text-primary block">
                        TopTechAgencies
                    </Link>
                    <button className="md:hidden">
                        {/* Mobile Menu Toggle (can implement later) */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </button>
                    <p className="text-xs text-text-secondary mt-2 hidden md:block">Agency Partner Portal</p>
                </div>

                <nav className="p-4 space-y-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-accent-peach/5 hover:text-accent-peach-text transition-all font-medium"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Overview
                    </Link>
                    <Link
                        href="/dashboard/apply"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-accent-peach/5 hover:text-accent-peach-text transition-all font-medium"
                    >
                        <FileText className="w-5 h-5" />
                        My Listings
                    </Link>
                    <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-accent-peach/5 hover:text-accent-peach-text transition-all font-medium"
                    >
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                </nav>

                <div className="p-4 mt-auto border-t border-border-light">
                    <div className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary rounded-xl bg-bg-secondary mb-2">
                        <div className="w-8 h-8 rounded-full bg-accent-peach text-accent-peach-text flex items-center justify-center font-bold">
                            {session.user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate font-medium text-text-primary">{session.user.email}</p>
                            <p className="text-xs text-text-muted">Agency Account</p>
                        </div>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
