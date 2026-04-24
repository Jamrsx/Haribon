import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import Toast from '../../Components/UI/Toast';

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
                        Full Name
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
                        Email
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
                        Phone
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
                        Account Role
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
                        Password
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
                            <span className="text-[11px] font-semibold">{showPassword ? 'Hide' : 'Show'}</span>
                        </button>
                    </div>
                    {errors.password ? <p className="mt-1 text-xs text-rose-600">{errors.password}</p> : null}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="mb-1 block text-sm font-medium text-slate-700">
                        Confirm Password
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
                            <span className="text-[11px] font-semibold">{showConfirmPassword ? 'Hide' : 'Show'}</span>
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
