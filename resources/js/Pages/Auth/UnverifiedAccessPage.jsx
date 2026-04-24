import React, { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';

export default function UnverifiedAccessPage() {
    const { flash } = usePage().props;
    const message = flash?.error || 'Forbidden Access';
    const [secondsLeft, setSecondsLeft] = useState(5);

    useEffect(() => {
        console.log('UnverifiedAccessPage loaded');

        const intervalId = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        const timeoutId = setTimeout(() => {
            router.visit('/');
        }, 5000);

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <>
            <Head title="Forbidden Access" />
            <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 px-4">
                <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M9 9l6 6M15 9l-6 6" />
                        </svg>
                    </div>

                    <h1 className="mt-5 text-center text-2xl font-bold tracking-tight text-slate-900">{message}</h1>
                    <p className="mx-auto mt-3 max-w-md text-center text-sm text-slate-600">
                        You are not authorized to open this page. You will be redirected to the home page automatically.
                    </p>

                    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                        <p className="text-sm font-medium text-slate-700">
                            Redirecting in <span className="font-bold text-emerald-700">{secondsLeft}</span>{' '}
                            {secondsLeft === 1 ? 'second' : 'seconds'}
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
