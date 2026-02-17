"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, MessageSquare, Settings, LogOut, FileText, List, Users } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [newCount, setNewCount] = useState<number>(0);
    const [pendingApps, setPendingApps] = useState<number>(0);

    // Fetch new submission count and pending applications count
    useEffect(() => {
        async function fetchCounts() {
            try {
                // New submissions count
                const { count: subCount, error: subError } = await supabase
                    .from('contact_submissions')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'new');

                if (!subError && subCount !== null) {
                    setNewCount(subCount);
                }

                // Pending applications count
                const { count: appCount, error: appError } = await supabase
                    .from('agency_applications')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'pending');

                if (!appError && appCount !== null) {
                    setPendingApps(appCount);
                }
            } catch (err) {
                console.error('Failed to fetch counts:', err);
            }
        }

        fetchCounts();

        // Refresh counts every 30 seconds
        const interval = setInterval(fetchCounts, 30000);
        return () => clearInterval(interval);
    }, [pathname]);

    // Don't show sidebar on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const handleSignOut = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/applications', label: 'Applications', icon: Users, badge: pendingApps, badgeColor: 'bg-orange-500' },
        { href: '/admin/submissions', label: 'Submissions', icon: MessageSquare, badge: newCount, badgeColor: 'bg-blue-500' },
        { href: '/admin/articles', label: 'Articles', icon: FileText },
        { href: '/admin/listings', label: 'Listings Manager', icon: List },
        { href: '/admin/blog', label: 'Rankings Manager', icon: FileText },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-5 border-b border-gray-100">
                    <Link href="/admin/dashboard" className="flex items-center justify-center">
                        <Image
                            src="/logo.svg"
                            alt="TopTechAgencies"
                            width={150}
                            height={40}
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'text-gray-900 bg-gray-50'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-gray-700' : 'text-gray-400'}`} />
                                <span className="flex-1">{item.label}</span>
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className={`min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full ${item.badgeColor || 'bg-blue-500'} text-white text-xs font-bold animate-pulse`}>
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
