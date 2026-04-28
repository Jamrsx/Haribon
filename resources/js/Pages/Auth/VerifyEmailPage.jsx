import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import Toast from '../../Components/UI/Toast';

export default function VerifyEmailPage() {
    const { props } = usePage();
    const [toast, setToast] = useState({
        show: false,
        type: 'success',
        message: '',
    });

    const { data, setData, post, processing } = useForm({
        email: '',
    });

    const handleResend = (e) => {
        e.preventDefault();
        post('/email/resend', {
            onSuccess: () => {
                setToast({
                    show: true,
                    type: 'success',
                    message: 'New verification email sent. Please check your inbox.',
                });
            },
        });
    };

    return (
        <AuthLayout>
            <Head title="Verify Email - Haribon" />
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />

            <div className="mx-auto w-full max-w-md">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                        <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Check Your Email</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        We've sent a verification email to your registered email address.
                    </p>
                </div>

                <div className="mt-8 rounded-lg bg-blue-50 border border-blue-200 p-6">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">Next Steps:</h3>
                    <ol className="text-sm text-blue-800 space-y-2">
                        <li>1. Open your email inbox</li>
                        <li>2. Find the email from "Haribon Real Estate"</li>
                        <li>3. Click the "Verify Email Address" button in the email</li>
                        <li>4. You'll be automatically redirected to complete verification</li>
                    </ol>
                </div>

                <div className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                            Didn't receive the email? Enter your email to resend:
                        </label>
                        <div className="mt-2 flex gap-2">
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="your@email.com"
                            />
                            <button
                                onClick={handleResend}
                                disabled={processing || !data.email}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Sending...' : 'Resend'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                    >
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
