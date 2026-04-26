import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Link } from '@inertiajs/react';

export default function SubscriptionOverviewPage({ activeSubscription, paymentHistory }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <DashboardLayout title="Subscription Overview">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-900">Subscription Overview</h1>

                {activeSubscription ? (
                    <div className="mt-6 rounded-xl border border-emerald-200 bg-white p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        {activeSubscription.plan.name}
                                    </h2>
                                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        Active
                                    </span>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Price</p>
                                        <p className="mt-1 text-lg font-semibold text-slate-900">₱{activeSubscription.plan.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Property Listings</p>
                                        <p className="mt-1 text-lg font-semibold text-slate-900">
                                            {activeSubscription.plan.max_listing === 999 ? 'Unlimited' : activeSubscription.plan.max_listing}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Images per Listing</p>
                                        <p className="mt-1 text-lg font-semibold text-slate-900">
                                            {activeSubscription.plan.max_images === 999 ? 'Unlimited' : activeSubscription.plan.max_images}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Valid Until</p>
                                    <p className="mt-1 text-sm font-medium text-slate-700">
                                        {activeSubscription.plan.duration_days === 0 ? 'Forever' : formatDate(activeSubscription.ended_at)}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/seller/subscription/plans"
                                className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                            >
                                Upgrade Plan
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-slate-900">Free Plan</h2>
                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                        Active
                                    </span>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Price</p>
                                        <p className="mt-1 text-lg font-semibold text-slate-900">₱0.00</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Property Listings</p>
                                        <p className="mt-1 text-lg font-semibold text-slate-900">1</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Images per Listing</p>
                                        <p className="mt-1 text-lg font-semibold text-slate-900">5</p>
                                    </div>
                                </div>
                            </div>
                            <Link
                                href="/seller/subscription/plans"
                                className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                            >
                                Upgrade Now
                            </Link>
                        </div>
                    </div>
                )}

                {paymentHistory && paymentHistory.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-slate-900">Payment History</h2>
                        <div className="mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Plan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Method
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {paymentHistory.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                                {formatDate(payment.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                                {payment.subscription?.plan?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                                                ₱{payment.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 capitalize">
                                                {payment.provider}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    payment.status === 'paid' 
                                                        ? 'bg-emerald-100 text-emerald-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
