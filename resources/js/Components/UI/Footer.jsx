import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <span className="text-lg font-semibold text-slate-900">Haribon</span>
                        </div>
                        <p className="text-xs text-slate-600 mb-4">
                            Your trusted real estate marketplace in the Philippines. Find your dream property or list your property today.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-xs text-slate-600 hover:text-emerald-600">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/seller/properties" className="text-xs text-slate-600 hover:text-emerald-600">
                                    Browse Properties
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-xs text-slate-600 hover:text-emerald-600">
                                    Become a Seller
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-xs text-slate-600 hover:text-emerald-600">
                                    Sign In
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="text-xs text-slate-600 hover:text-emerald-600">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-xs text-slate-600 hover:text-emerald-600">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-xs text-slate-600 hover:text-emerald-600">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-xs text-slate-600 hover:text-emerald-600">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs text-slate-600">info@haribon.ph</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-xs text-slate-600">+63 912 345 6789</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-xs text-slate-600">Manila, Philippines</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-[10px] text-slate-500">
                            © {new Date().getFullYear()} Haribon. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="text-[10px] text-slate-600 hover:text-emerald-600">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-[10px] text-slate-600 hover:text-emerald-600">
                                Terms of Service
                            </Link>
                            <Link href="#" className="text-[10px] text-slate-600 hover:text-emerald-600">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
