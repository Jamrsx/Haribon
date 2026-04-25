import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const sellerNavItems = [
    {
        href: '/seller/dashboard',
        label: 'Dashboard',
        icon: (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="8" height="8" rx="1" />
                <rect x="13" y="3" width="8" height="5" rx="1" />
                <rect x="13" y="10" width="8" height="11" rx="1" />
                <rect x="3" y="13" width="8" height="8" rx="1" />
            </svg>
        ),
    },
    {
        href: '/seller/properties',
        label: 'My Properties',
        icon: (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18" />
                <path d="M5 21V8l7-5 7 5v13" />
                <path d="M9 21v-6h6v6" />
            </svg>
        ),
    },
    {
        href: '/seller/properties/create',
        label: 'Create Property',
        icon: (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
            </svg>
        ),
    },
    {
        href: '/seller/subscription',
        label: 'Subscription Overview',
        icon: (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 10h18" />
            </svg>
        ),
    },
    {
        href: '/seller/subscription/plans',
        label: 'Subscription Plans',
        icon: (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l2.6 5.3L20 8l-4 3.9.9 5.6-4.9-2.6-4.9 2.6.9-5.6L4 8l5.4-.7z" />
            </svg>
        ),
    },
    {
        href: '/seller/subscription/success',
        label: 'Subscription Success',
        icon: (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12l3 3 5-5" />
            </svg>
        ),
    },
];

export default function Sidebar({ collapsed, onToggle }) {
    const page = usePage();
    const currentUrl = page.url ?? '';
    const auth = page.props?.auth;
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const user = auth?.user;
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
    const currentPath = currentUrl.split('?')[0] || '';
    const activeItem = sellerNavItems
        .filter((item) => currentPath === item.href || currentPath.startsWith(`${item.href}/`))
        .sort((a, b) => b.href.length - a.href.length)[0];
    const activeHref = activeItem?.href ?? '';

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 border-r border-slate-700 bg-slate-900 transition-all duration-200 ${
                collapsed ? 'w-20' : 'w-64'
            }`}
        >
            <div className="flex h-full flex-col">
                <div className={`flex h-16 items-center border-b border-slate-700 ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
                    {!collapsed ? (
                        <div>
                            <p className="text-sm font-semibold text-white">Seller Panel</p>
                            <p className="text-xs text-slate-300">Haribon Marketplace</p>
                        </div>
                    ) : null}
                    <button
                        type="button"
                        onClick={onToggle}
                        className="rounded-md border border-slate-600 p-1.5 text-slate-200 hover:bg-slate-800 hover:text-white"
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        title={collapsed ? 'Expand' : 'Collapse'}
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                            {collapsed ? <path d="M9 6l6 6-6 6" /> : <path d="M15 6l-6 6 6 6" />}
                        </svg>
                    </button>
                </div>

                <nav className="space-y-1 px-2 py-4">
                    {sellerNavItems.map((item) => {
                        const isActive = activeHref === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                    isActive
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                                }`}
                                title={item.label}
                            >
                                <span className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                                    {item.icon}
                                    {!collapsed ? <span>{item.label}</span> : null}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="relative mt-auto border-t border-slate-700 p-3">
                    {showAccountMenu ? (
                        <div
                            className={`mb-2 rounded-lg border border-slate-700 bg-slate-800 p-1.5 ${
                                collapsed ? 'absolute bottom-16 left-20 w-48' : ''
                            }`}
                        >
                            <Link
                                href="/profile"
                                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
                            >
                                Profile Overview
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-rose-300 hover:bg-slate-700"
                            >
                                Logout
                            </Link>
                        </div>
                    ) : null}

                    <button
                        type="button"
                        onClick={() => setShowAccountMenu((prev) => !prev)}
                        className="flex min-h-12 w-full items-center rounded-lg border border-slate-700 bg-slate-800 p-2 text-left hover:bg-slate-700"
                    >
                        <img
                            src="/storage/Hari/haribon-smile.png"
                            alt="Profile"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        {!collapsed ? (
                            <span className="ml-2 min-w-0 leading-tight">
                                <span className="block truncate text-sm font-medium text-white">{user?.name ?? 'Profile'}</span>
                                <span className="block truncate text-xs text-slate-300">Account</span>
                            </span>
                        ) : null}
                    </button>
                </div>
            </div>
        </aside>
    );
}
