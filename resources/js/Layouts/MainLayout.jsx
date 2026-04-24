import React from 'react';
import { Link } from '@inertiajs/react';

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-emerald-100 bg-white/95 backdrop-blur">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/" className="text-xl font-bold tracking-tight text-emerald-700">
                        Haribon
                    </Link>
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
                </div>
            </header>

            <main>{children}</main>

            <footer className="border-t border-emerald-100 bg-white">
                <div className="mx-auto w-full max-w-7xl px-4 py-6 text-sm text-slate-600 sm:px-6 lg:px-8">
                    Haribon Real Estate Marketplace
                </div>
            </footer>
        </div>
    );
}
