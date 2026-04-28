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
];

export default function Sidebar({ collapsed, onToggle }) {
    const page = usePage();
    const currentUrl = page.url ?? '';
    const auth = page.props?.auth;
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const user = auth?.user;
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
    const currentPath = currentUrl.split('?')[0] || '';
    const activeItem = sellerNavItems
        .filter((item) => currentPath === item.href || currentPath.startsWith(`${item.href}/`))
        .sort((a, b) => b.href.length - a.href.length)[0];
    const activeHref = activeItem?.href ?? '';

    const isPremium = user?.subscription?.plan?.duration_days >= 365 && user?.subscription?.status === 'active';
    const isLifetime = user?.subscription?.plan?.duration_days >= 9999 && user?.subscription?.status === 'active';

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
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(true)}
                                className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-rose-300 hover:bg-slate-700"
                            >
                                Logout
                            </button>
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
                                <div className="flex items-center gap-2">
                                    <span className="block truncate text-sm font-medium text-white">{user?.name ?? 'Profile'}</span>
                                    {isPremium && (
                                        <div className="flex items-center gap-0.5 rounded-full bg-amber-500 px-1.5 py-0.5">
                                            <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                    )}
                                    {isLifetime && (
                                        <div className="flex items-center gap-0.5 rounded-full bg-emerald-400 px-1.5 py-0.5">
                                            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <span className="block truncate text-xs text-slate-300">Account</span>
                            </span>
                        ) : null}
                    </button>
                </div>

                {showLogoutModal ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-xl">
                            <h3 className="mb-2 text-lg font-semibold text-white">Confirm Logout</h3>
                            <p className="mb-6 text-sm text-slate-300">Are you sure you want to log out of your account?</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowLogoutModal(false)}
                                    className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                                >
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </aside>
    );
}
