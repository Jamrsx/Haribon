import React from 'react';
import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <>
            <Head title="Home" />
            <main className="min-h-screen bg-slate-50 px-6 py-10">
                <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                    <h1 className="text-2xl font-semibold text-slate-900">Inertia + Tailwind is ready</h1>
                    <p className="mt-3 text-slate-600">
                        Your Laravel app is now rendering this page through Inertia React with Tailwind CSS styling.
                    </p>
                </div>
            </main>
        </>
    );
}
