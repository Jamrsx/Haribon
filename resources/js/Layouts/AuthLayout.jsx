import React from 'react';
import { Link } from '@inertiajs/react';

export default function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-md">
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/" className="text-lg font-bold text-emerald-700">
                        Haribon
                    </Link>
                    <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-emerald-700">
                        Back to Home
                    </Link>
                </div>

                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
                    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                    {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
                    <div className="mt-6">{children}</div>
                </section>
            </div>
        </div>
    );
}
