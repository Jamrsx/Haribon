import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import Toast from '../../Components/UI/Toast';

export default function ForgotPasswordPage() {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        email: '',
    });
    const [toast, setToast] = useState({
        show: false,
        type: 'info',
        message: '',
    });

    useEffect(() => {
        const firstError = Object.values(errors)[0];
        if (firstError) {
            setToast({ show: true, type: 'error', message: firstError });
        }
    }, [errors]);

    useEffect(() => {
        if (recentlySuccessful) {
            setToast({ show: true, type: 'success', message: 'Password reset link sent! Please check your email.' });
        }
    }, [recentlySuccessful]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <AuthLayout title="Reset your password" subtitle="Enter your email address and we'll send you a link to reset your password.">
            <Head title="Forgot Password" />
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                        placeholder="Enter your email address"
                        required
                    />
                    {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email}</p> : null}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {processing ? 'Sending...' : 'Send Reset Link'}
                </button>

                <p className="text-center text-sm text-slate-600">
                    Remember your password?{' '}
                    <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
                        Back to login
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
