import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function MainLayout({ children, showBackToDashboard = false }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const isSeller = (user?.roles ?? []).includes('seller');
    const backHref = isSeller ? '/seller/dashboard' : '/buyer/favorites';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-emerald-100 bg-white/95 backdrop-blur">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/" className="text-xl font-bold tracking-tight text-emerald-700">
                        Haribon
                    </Link>
                    {user ? (
                        showBackToDashboard ? (
                            <Link
                                href={backHref}
                                className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                            >
                                Back to Dashboard
                            </Link>
                        ) : (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowProfileMenu((prev) => !prev)}
                                    className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                                >
                                    Profile
                                </button>
                                {showProfileMenu ? (
                                    <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                                        <Link
                                            href="/profile"
                                            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setShowLogoutModal(true)}
                                            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-700 hover:bg-rose-50"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        )
                    ) : (
                        <nav className="flex items-center gap-3">
                            <Link
                                href="/properties"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                            >
                                Browse
                            </Link>
                            <Link
                                href="/login"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                List Property
                            </Link>
                        </nav>
                    )}
                </div>
            </header>

            <main>{children}</main>

            {showLogoutModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
                        <h3 className="mb-2 text-lg font-semibold text-slate-900">Confirm Logout</h3>
                        <p className="mb-6 text-sm text-slate-600">Are you sure you want to log out of your account?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(false)}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
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

            <footer className="border-t border-emerald-100 bg-white">
                <div className="mx-auto w-full max-w-7xl px-4 py-6 text-sm text-slate-600 sm:px-6 lg:px-8">
                    Haribon Real Estate Marketplace
                </div>
            </footer>
        </div>
    );
}
