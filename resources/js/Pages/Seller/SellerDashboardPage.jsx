import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import Toast from '../../Components/UI/Toast';

export default function SellerDashboardPage() {
    const { props } = usePage();
    const user = props.auth?.user;
    const stats = props.stats || { total_properties: 0, active_listings: 0, seller_rating: 0, total_reviews: 0 };
    const recentProperties = props.recent_properties || [];
    const monthlyData = props.monthly_data || [];
    const subscription = props.subscription || { plan_name: 'Free', current_listings: 0, max_listings: 1 };
    const [toast, setToast] = useState({
        show: false,
        type: 'success',
        message: '',
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    useEffect(() => {
        console.log('SellerDashboardPage loaded');
        if (props.flash?.loginSuccess) {
            setToast({
                show: true,
                type: 'success',
                message: `Login Success, Hello ${props.flash.loginSuccess}`,
            });
        }
    }, [props.flash]);

    return (
        <DashboardLayout title="Seller Dashboard">
            <Head title="Seller Dashboard" />
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Seller Dashboard</h1>
                    <p className="mt-1 text-slate-600">Welcome back, {user?.name || 'Seller'}</p>
                </div>
                {subscription.current_listings >= subscription.max_listings ? (
                    <button
                        disabled
                        className="inline-flex items-center justify-center rounded-xl bg-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed"
                    >
                        Limit Reached
                    </button>
                ) : (
                    <Link
                        href="/seller/properties/create"
                        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        Add Property
                    </Link>
                )}
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-600">Total Properties</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total_properties}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-600">Active Listings</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{stats.active_listings}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-600">Inactive Listings</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total_properties - stats.active_listings}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-600">Seller Rating</p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-2xl font-bold text-slate-900">{stats.seller_rating}</span>
                        <span className="text-amber-400 text-lg">
                            {'★'.repeat(Math.round(stats.seller_rating))}
                            {'☆'.repeat(5 - Math.round(stats.seller_rating))}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{stats.total_reviews} reviews</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-600">Recent Activity</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{recentProperties.length}</p>
                </div>
            </div>

            {/* Property Creation Chart */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Property Creation (Last 6 Months)</h2>
                <div className="mt-4 flex items-end gap-2 sm:gap-4">
                    {monthlyData.map((data, index) => {
                        const maxCount = Math.max(...monthlyData.map(d => d.count), 1);
                        const height = data.count > 0 ? (data.count / maxCount) * 100 : 5;
                        return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div className="w-full bg-slate-100 rounded-t-lg relative" style={{ height: '150px' }}>
                                    <div
                                        className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg transition-all duration-300"
                                        style={{ height: `${height}%` }}
                                    >
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-900">
                                            {data.count}
                                        </span>
                                    </div>
                                </div>
                                <span className="mt-2 text-xs font-medium text-slate-600">{data.month}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recent Properties & Subscription */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Recent Properties</h2>
                        <Link href="/seller/properties" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentProperties.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                                <svg className="mb-2 h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <p className="text-sm">No properties yet</p>
                                <Link href="/seller/properties/create" className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-700">
                                    Create your first property
                                </Link>
                            </div>
                        ) : (
                            recentProperties.map((property) => (
                                <Link
                                    key={property.id}
                                    href={`/seller/properties/${property.id}/edit`}
                                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                                >
                                    <div className="flex items-center gap-3">
                                        {property.images && property.images.length > 0 ? (
                                            <img
                                                src={`/storage/${property.images[0].image_path}`}
                                                alt={property.title}
                                                className="h-12 w-12 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded bg-slate-200 flex items-center justify-center">
                                                <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{property.title}</p>
                                            <p className="text-xs text-slate-600">{formatPrice(property.price_total)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                property.is_active
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}
                                        >
                                            {property.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        <p className="mt-1 text-xs text-slate-600">
                                            {new Date(property.created_at).toLocaleDateString('en-PH', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Subscription Status</h2>
                    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-900">Current Plan</p>
                                <p className="mt-1 text-2xl font-bold text-emerald-700">{subscription.plan_name}</p>
                            </div>
                            <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                                Active
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-emerald-800">
                                <span className="font-semibold">{subscription.current_listings}/{subscription.max_listings}</span> posts used
                            </p>
                            <div className="mt-2 h-2 rounded-full bg-emerald-200">
                                <div 
                                    className="h-2 rounded-full bg-emerald-600 transition-all duration-300"
                                    style={{ width: `${(subscription.current_listings / subscription.max_listings) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <Link
                        href="/seller/subscription"
                        className="mt-4 block w-full rounded-xl border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        Upgrade Plan
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
