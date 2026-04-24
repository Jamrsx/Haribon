import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function SubscriptionOverviewPage() {
    return (
        <DashboardLayout title="Subscription Overview">
            <h1 className="text-2xl font-bold text-slate-900">Subscription Overview</h1>
            <p className="mt-2 text-slate-600">Plan status, expiry, and billing summary will be shown here.</p>
        </DashboardLayout>
    );
}
