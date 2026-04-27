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
                            <img
                                src="/storage/Hari/logo.png"
                                alt="Haribon"
                                className="h-8 w-auto flex-shrink-0"
                            />

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
                                <span className="text-xs text-slate-600">nexiodevsph@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <a
                                        href="https://www.facebook.com/profile.php?id=61579438695370"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2"
                                    >
                                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                        </svg>
                                        <span className="text-xs text-blue-600">Facebook</span>
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-xs text-slate-600">Cagayan De Oro, Philippines</span>
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
