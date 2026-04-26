import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Link } from '@inertiajs/react';

export default function SubscriptionSuccessPage() {
    return (
        <DashboardLayout title="Subscription Success">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl border border-emerald-200 p-10 text-center shadow-sm">
                    <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Payment Successful!</h1>
                    <p className="mt-4 text-lg text-slate-600">
                        Your subscription has been activated successfully.
                    </p>
                    <div className="mt-6 bg-emerald-50 rounded-lg p-4">
                        <p className="text-sm text-emerald-800">
                            You can now enjoy premium features including unlimited property listings and images.
                        </p>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/seller/subscription"
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                        >
                            View Subscription
                        </Link>
                        <Link
                            href="/seller/dashboard"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
