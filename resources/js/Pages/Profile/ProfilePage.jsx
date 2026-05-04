import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
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

export default function ProfilePage({ user }) {
    const { flash } = usePage().props;
    const [toast, setToast] = useState({ show: false, type: 'info', message: '' });
    const infoForm = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        facebook_profile_link: user?.facebook_profile_link ?? '',
    });
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const profilePictureForm = useForm({
        profile_picture: null,
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const isSeller = useMemo(() => (user?.roles ?? []).includes('seller'), [user?.roles]);
    const backHref = isSeller ? '/seller/dashboard' : '/buyer/favorites';

    const isPremium = useMemo(() => {
        if (!user?.subscription) return false;
        const subscription = user.subscription;
        const plan = subscription.plan;
        if (!plan) return false;
        // Premium if they have an active paid yearly subscription (365-133224 days)
        // Lifetime plans (133225+ days) get lifetime badges instead
        // Exclude free plans (price = 0) from premium status
        const isPaidPlan = plan.price > 0;
        const isYearlyPlan = plan.duration_days >= 365 && plan.duration_days < 133225;
        return subscription.status === 'active' && isPaidPlan && isYearlyPlan;
    }, [user?.subscription]);

    const isLifetime = useMemo(() => {
        if (!user?.subscription) return false;
        const subscription = user.subscription;
        const plan = subscription.plan;
        if (!plan) return false;
        // Lifetime if they have an active lifetime subscription (133225 days or 0 days with non-zero price)
        // Exclude free plans (price = 0) from lifetime status
        const isActualLifetime = plan.duration_days >= 133225 || (plan.duration_days === 0 && plan.price > 0);
        return subscription.status === 'active' && isActualLifetime;
    }, [user?.subscription]);

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            profilePictureForm.setData('profile_picture', file);
        }
    };

    const handleProfilePictureSubmit = (e) => {
        e.preventDefault();
        profilePictureForm.post('/profile/picture', {
            onSuccess: () => {
                setPreviewImage(null);
                profilePictureForm.reset();
                setToast({ show: true, type: 'success', message: 'Profile picture updated successfully' });
                router.reload();
            },
            onError: () => {
                const firstError = Object.values(profilePictureForm.errors)[0] || 'Unable to update profile picture.';
                setToast({ show: true, type: 'error', message: firstError });
            },
        });
    };

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
                setToast({ show: true, type: 'success', message: 'Success' });
            },
            onError: () => {
                const firstError = Object.values(passwordForm.errors)[0] || 'Unable to update password.';
                setToast({ show: true, type: 'error', message: firstError });
            },
        });
    };

    return (
        <MainLayout showBackToDashboard={true}>
            <Head title="Profile" />
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
            <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="mb-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 shadow-lg">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
                        <div className="relative">
                            <img
                                src={previewImage || (user?.profile_picture ? `/storage/${user.profile_picture}` : '/storage/Hari/haribon-smile.png')}
                                alt="Profile"
                                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg sm:h-32 sm:w-32"
                                onError={(e) => {
                                    e.target.src = '/storage/Hari/haribon-smile.png';
                                }}
                            />
                            <label htmlFor="profile-picture-upload" className="absolute bottom-0 right-0 h-8 w-8 cursor-pointer rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-md hover:bg-emerald-50 transition-colors">
                                <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </label>
                            <input
                                id="profile-picture-upload"
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                onChange={handleProfilePictureChange}
                                className="hidden"
                            />
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-white sm:text-3xl">{user?.name ?? 'User'}</h1>
                            <p className="mt-1 text-emerald-100">{user?.email ?? ''}</p>
                            {previewImage && (
                                <form onSubmit={handleProfilePictureSubmit} className="mt-2">
                                    <button
                                        type="submit"
                                        disabled={profilePictureForm.processing}
                                        className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 transition-colors"
                                    >
                                        {profilePictureForm.processing ? 'Uploading...' : 'Save Picture'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreviewImage(null);
                                            profilePictureForm.reset();
                                        }}
                                        className="ml-2 inline-flex items-center rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/30 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}
                            <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                                {isSeller && (
                                    <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                        <svg className="mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Seller
                                    </span>
                                )}
                                {isPremium && (
                                    <span className="inline-flex items-center rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-900 backdrop-blur-sm">
                                        <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        Premium Subs
                                    </span>
                                )}
                                {isLifetime && (
                                    <span className="inline-flex items-center rounded-full bg-purple-400 px-3 py-1 text-xs font-semibold text-purple-900 backdrop-blur-sm">
                                        <svg className="mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                        Dev Supporter
                                    </span>
                                )}
                                {isLifetime && (
                                    <span className="inline-flex items-center rounded-full bg-rose-400 px-3 py-1 text-xs font-semibold text-rose-900 backdrop-blur-sm">
                                        <svg className="mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        Saviour
                                    </span>
                                )}
                                {isLifetime && (
                                    <span className="inline-flex items-center rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-emerald-900 backdrop-blur-sm">
                                        <svg className="mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                        Loyal Seller
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
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
                            <div>
                                <label htmlFor="facebook_profile_link" className="mb-1 block text-sm font-medium text-slate-700">
                                    Facebook Profile Link
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </div>
                                    <input
                                        id="facebook_profile_link"
                                        type="url"
                                        placeholder="https://facebook.com/yourprofile"
                                        value={infoForm.data.facebook_profile_link}
                                        onChange={(e) => infoForm.setData('facebook_profile_link', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                    />
                                </div>
                                {infoForm.errors.facebook_profile_link ? <p className="mt-1 text-xs text-rose-600">{infoForm.errors.facebook_profile_link}</p> : null}
                                <p className="mt-1 text-xs text-slate-500">Optional: Add your Facebook profile URL</p>
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
                                <div className="relative">
                                    <input
                                        id="current_password"
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 pr-11 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 hover:text-emerald-700"
                                        aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                                    >
                                        <EyeIcon open={showCurrentPassword} />
                                    </button>
                                </div>
                                {passwordForm.errors.current_password ? (
                                    <p className="mt-1 text-xs text-rose-600">{passwordForm.errors.current_password}</p>
                                ) : null}
                            </div>
                            <div>
                                <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 pr-11 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 hover:text-emerald-700"
                                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                                    >
                                        <EyeIcon open={showNewPassword} />
                                    </button>
                                </div>
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
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 pr-11 text-sm outline-none ring-emerald-200 focus:border-emerald-500 focus:ring"
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
