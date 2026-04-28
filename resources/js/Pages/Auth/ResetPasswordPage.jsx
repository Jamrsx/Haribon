import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import Toast from '../../Components/UI/Toast';

function EyeIcon({ open }) {
    if (open) {
        return (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 102.8 2.8" />
                <path d="M9.9 5.2A10.9 10.9 0 0112 5c5.2 0 9.3 3.6 10.5 7-1 2.7-3.8 5.5-7.5 6.6" />
                <path d="M6.2 6.2C3.8 7.6 2.2 9.8 1.5 12c.8 2.3 2.5 4.7 5.1 6.2" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1.5 12C2.7 8.6 6.8 5 12 5s9.3 3.6 10.5 7c-1.2 3.4-5.3 7-10.5 7S2.7 15.4 1.5 12z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export default function ResetPasswordPage({ token, email }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            setToast({ show: true, type: 'success', message: 'Password reset successfully! Redirecting to login...' });
        }
    }, [recentlySuccessful]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <AuthLayout title="Set new password" subtitle="Create a strong password for your account.">
            <Head title="Reset Password" />
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        disabled
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 pr-11 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                            placeholder="Enter new password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 hover:text-emerald-700"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            <EyeIcon open={showPassword} />
                        </button>
                    </div>
                    {errors.password ? <p className="mt-1 text-xs text-rose-600">{errors.password}</p> : null}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="mb-1 block text-sm font-medium text-slate-700">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 pr-11 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                            placeholder="Confirm new password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 hover:text-emerald-700"
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                            <EyeIcon open={showConfirmPassword} />
                        </button>
                    </div>
                    {errors.password_confirmation ? <p className="mt-1 text-xs text-rose-600">{errors.password_confirmation}</p> : null}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {processing ? 'Resetting...' : 'Reset Password'}
                </button>

                <p className="text-center text-sm text-slate-600">
                    <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
                        Back to login
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
