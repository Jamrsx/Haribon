import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import Toast from '../../Components/UI/Toast';

export default function ProfilePage() {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const [toast, setToast] = useState({ show: false, type: 'info', message: '' });
    const infoForm = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
    });
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const isSeller = useMemo(() => (user?.roles ?? []).includes('seller'), [user?.roles]);
    const backHref = isSeller ? '/seller/dashboard' : '/buyer/favorites';

    useEffect(() => {
        console.log('ProfilePage loaded', user);
    }, [user]);

    useEffect(() => {
        if (flash?.success) {
            setToast({ show: true, type: 'success', message: flash.success });
        }
    }, [flash?.success]);

    const handleUpdateInfo = (e) => {
        e.preventDefault();
        console.log('Profile info update payload', infoForm.data);

        infoForm.patch('/profile', {
            onError: () => {
                const firstError = Object.values(infoForm.errors)[0] || 'Unable to update profile.';
                setToast({ show: true, type: 'error', message: firstError });
            },
        });
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        console.log('Profile password update submitted');

        passwordForm.patch('/profile/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
            onError: () => {
                const firstError = Object.values(passwordForm.errors)[0] || 'Unable to update password.';
                setToast({ show: true, type: 'error', message: firstError });
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Profile" />
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
            <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-5 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">Profile Overview</h1>
                    <Link
                        href={backHref}
                        className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                    <form onSubmit={handleUpdateInfo} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">Update Information</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={infoForm.data.name}
                                    onChange={(e) => infoForm.setData('name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                    required
                                />
                                {infoForm.errors.name ? <p className="mt-1 text-xs text-rose-600">{infoForm.errors.name}</p> : null}
                            </div>
                            <div>
                                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={infoForm.data.email}
                                    onChange={(e) => infoForm.setData('email', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                    required
                                />
                                {infoForm.errors.email ? <p className="mt-1 text-xs text-rose-600">{infoForm.errors.email}</p> : null}
                            </div>
                            <div>
                                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
                                    Phone
                                </label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={infoForm.data.phone}
                                    onChange={(e) => infoForm.setData('phone', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                    required
                                />
                                {infoForm.errors.phone ? <p className="mt-1 text-xs text-rose-600">{infoForm.errors.phone}</p> : null}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={infoForm.processing}
                            className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
                        >
                            {infoForm.processing ? 'Saving...' : 'Save Information'}
                        </button>
                    </form>

                    <form onSubmit={handleUpdatePassword} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">Update Password</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            For security, enter your old password before setting a new one.
                        </p>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="current_password" className="mb-1 block text-sm font-medium text-slate-700">
                                    Old Password
                                </label>
                                <input
                                    id="current_password"
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                    required
                                />
                                {passwordForm.errors.current_password ? (
                                    <p className="mt-1 text-xs text-rose-600">{passwordForm.errors.current_password}</p>
                                ) : null}
                            </div>
                            <div>
                                <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                                    New Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                    required
                                />
                                {passwordForm.errors.password ? (
                                    <p className="mt-1 text-xs text-rose-600">{passwordForm.errors.password}</p>
                                ) : null}
                            </div>
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    Confirm New Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
                        >
                            {passwordForm.processing ? 'Saving...' : 'Save Password'}
                        </button>
                    </form>
                </div>
                <div className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                    Logged in as <span className="font-semibold text-slate-800">{user?.email ?? '-'}</span>
                </div>
            </section>
        </MainLayout>
    );
}
