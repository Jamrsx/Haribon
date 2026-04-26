import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Header() {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8 sm:py-5">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/storage/Hari/logo.png"
                            alt="Haribon"
                            className="h-10 w-auto flex-shrink-0 sm:h-12"
                        />
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <nav className="hidden items-center gap-6 sm:flex sm:gap-8">
                        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-emerald-600">
                            Home
                        </Link>
                        {auth?.user ? (
                            <>
                                <Link href="/seller/properties" className="text-sm font-medium text-slate-600 hover:text-emerald-600">
                                    My Properties
                                </Link>
                                <Link href="/seller/properties/create" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                                    List Property
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-emerald-600">
                                    Sign In
                                </Link>
                                <Link href="/register" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>

                    {auth?.user && (
                        <div className="hidden items-center gap-3 sm:flex">
                            <div className="text-right">
                                <p className="text-xs font-medium text-slate-900">{auth.user.name}</p>
                                <p className="text-[10px] text-slate-500">{auth.user.email}</p>
                            </div>
                            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-emerald-100 flex items-center justify-center">
                                <span className="text-xs font-semibold text-emerald-700">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="sm:hidden p-2 rounded text-slate-600 hover:bg-slate-100"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-3">
                    <nav className="flex flex-col gap-3">
                        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-emerald-600">
                            Home
                        </Link>
                        {auth?.user ? (
                            <>
                                <Link href="/seller/properties" className="text-sm font-medium text-slate-600 hover:text-emerald-600">
                                    My Properties
                                </Link>
                                <Link href="/seller/properties/create" className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
                                    List Property
                                </Link>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                    <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <span className="text-[10px] font-semibold text-emerald-700">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-900">{auth.user.name}</p>
                                        <p className="text-[10px] text-slate-500">{auth.user.email}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-emerald-600">
                                    Sign In
                                </Link>
                                <Link href="/register" className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
