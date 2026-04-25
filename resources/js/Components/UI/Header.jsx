import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Header() {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/storage/Hari/logo.png"
                            alt="Haribon"
                            className="h-8 w-auto flex-shrink-0 sm:h-10"
                        />
                    </Link>
                </div>

                <nav className="hidden items-center gap-4 sm:flex sm:gap-6">
                    <Link href="/" className="text-xs font-medium text-slate-600 hover:text-emerald-600 sm:text-sm">
                        Home
                    </Link>
                    {auth?.user ? (
                        <>
                            <Link href="/seller/properties" className="text-xs font-medium text-slate-600 hover:text-emerald-600 sm:text-sm">
                                My Properties
                            </Link>
                            <Link href="/seller/properties/create" className="rounded-lg bg-emerald-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 sm:px-3 sm:text-sm">
                                List Property
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-xs font-medium text-slate-600 hover:text-emerald-600 sm:text-sm">
                                Sign In
                            </Link>
                            <Link href="/register" className="rounded-lg bg-emerald-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 sm:px-3 sm:text-sm">
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>

                <div className="flex items-center gap-2">
                    {auth?.user && (
                        <div className="hidden items-center gap-2 sm:flex sm:gap-3">
                            <div className="text-right">
                                <p className="text-[10px] font-medium text-slate-900 sm:text-xs">{auth.user.name}</p>
                                <p className="text-[9px] text-slate-500 sm:text-[10px]">{auth.user.email}</p>
                            </div>
                            <div className="h-7 w-7 flex-shrink-0 rounded-full bg-emerald-100 flex items-center justify-center sm:h-8 sm:w-8">
                                <span className="text-[10px] font-semibold text-emerald-700 sm:text-xs">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="sm:hidden p-1 rounded text-slate-600 hover:bg-slate-100"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
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
