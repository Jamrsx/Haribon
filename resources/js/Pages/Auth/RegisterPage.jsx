import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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

export default function RegisterPage() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'seller',
    });
    const [toast, setToast] = useState({
        show: false,
        type: 'info',
        message: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordMismatch = useMemo(() => {
        if (!data.password || !data.password_confirmation) {
            return false;
        }

        return data.password !== data.password_confirmation;
    }, [data.password, data.password_confirmation]);

    useEffect(() => {
        console.log('RegisterPage loaded');
    }, []);

    useEffect(() => {
        if (flash?.success) {
            setToast({
                show: true,
                type: 'success',
                message: flash.success,
            });
            console.log('Registration success flash message', flash.success);
        }
    }, [flash?.success]);

    useEffect(() => {
        const firstErrorMessage = Object.values(errors)[0];
        if (firstErrorMessage) {
            setToast({
                show: true,
                type: 'error',
                message: firstErrorMessage,
            });
            console.log('Registration validation error', firstErrorMessage);
        }
    }, [errors]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register submit payload', data);

        if (passwordMismatch) {
            setToast({
                show: true,
                type: 'warning',
                message: 'Password and confirm password do not match.',
            });
            return;
        }

        post('/register', {
            onError: () => {
                setToast({
                    show: true,
                    type: 'error',
                    message: 'Registration failed. Please check your inputs.',
                });
            },
        });
    };

    return (
        <AuthLayout title="Create your account" subtitle="Register as a seller or buyer to continue.">
            <Head title="Register" />
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                        <span className="inline-flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21a8 8 0 10-16 0" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Full Name
                        </span>
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                        required
                    />
                    {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name}</p> : null}
                </div>

                <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                        <span className="inline-flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <path d="M3 7l9 6 9-6" />
                            </svg>
                            Email
                        </span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                        required
                    />
                    {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email}</p> : null}
                </div>

                <div>
                    <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
                        <span className="inline-flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="7" y="2" width="10" height="20" rx="2" />
                                <circle cx="12" cy="18" r="1" />
                            </svg>
                            Phone
                        </span>
                    </label>
                    <input
                        id="phone"
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                        required
                    />
                    {errors.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone}</p> : null}
                </div>

                <div>
                    <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700">
                        <span className="inline-flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 3l8 4-8 4-8-4 8-4z" />
                                <path d="M4 12l8 4 8-4" />
                                <path d="M4 17l8 4 8-4" />
                            </svg>
                            Account Role
                        </span>
                    </label>
                    <select
                        id="role"
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                    >
                        <option value="seller">Seller</option>
                        <option value="buyer">Buyer</option>
                    </select>
                    {errors.role ? <p className="mt-1 text-xs text-rose-600">{errors.role}</p> : null}
                </div>

                <div>
                    <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                        <span className="inline-flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="4" y="11" width="16" height="10" rx="2" />
                                <path d="M8 11V8a4 4 0 118 0v3" />
                            </svg>
                            Password
                        </span>
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 pr-11 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
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
                        <span className="inline-flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 17v.01" />
                                <rect x="4" y="11" width="16" height="10" rx="2" />
                                <path d="M8 11V8a4 4 0 118 0v3" />
                            </svg>
                            Confirm Password
                        </span>
                    </label>
                    <div className="relative">
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 pr-11 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 hover:text-emerald-700"
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                            <EyeIcon open={showConfirmPassword} />
                        </button>
                    </div>
                    {passwordMismatch ? (
                        <p className="mt-1 text-xs text-amber-600">Password and confirm password do not match.</p>
                    ) : null}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {processing ? 'Creating account...' : 'Create Account'}
                </button>

                <p className="text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
                        Login
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
